import { NextResponse } from 'next/server';
import { getServerConfig } from '@/lib/server/config';
import { getClientIp, getProcessed, rateLimit, setProcessed } from '@/lib/server/rateLimit';
import { headObject, presignGet } from '@/lib/server/r2';
import { verifyToken } from '@/lib/server/token';
import { sendConfirmation, sendNotification, type QuoteEmailData } from '@/lib/server/email';
import { cleanText, formatBytes, isHttpUrl, isValidEmail } from '@/lib/server/validation';

export const dynamic = 'force-dynamic';

interface VerifiedPayload extends Record<string, unknown> {
  jobRef: string;
  key: string;
  size: number;
  filename: string;
  verified?: boolean;
  exp: number;
}

const RATES: Record<string, number> = { transcription: 0.55, captioning: 0.75 };
const YN = (v: unknown) => (v === true ? 'Yes' : 'No');

function newJobRef(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(4));
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('').toUpperCase();
  const d = new Date();
  const ymd = `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCDate()).padStart(2, '0')}`;
  return `AS-${ymd}-${hex}`;
}

export async function POST(req: Request) {
  const { config } = getServerConfig();
  if (!config) {
    return NextResponse.json(
      { error: 'Quote submission is not configured yet. Please email tim@accu-script.com.' },
      { status: 503 }
    );
  }
  if (!rateLimit(`quote:${getClientIp(req)}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many submissions. Please wait a few minutes and try again.' }, { status: 429 });
  }

  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  // Honeypot
  if (typeof b.hp_field === 'string' && b.hp_field.length > 0) {
    return NextResponse.json({ ok: true, jobRef: 'AS-OK' });
  }

  const name = cleanText(b.name, 120);
  const email = cleanText(b.email, 254);
  const phone = cleanText(b.phone, 40);
  const notes = cleanText(b.notes, 4000);
  const service = b.service === 'captioning' ? 'captioning' : b.service === 'transcription' ? 'transcription' : '';
  const minutes = typeof b.minutes === 'number' ? b.minutes : parseFloat(String(b.minutes));
  const fileLinkRaw = cleanText(b.fileLink, 500);

  if (name.length < 2) return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 });
  if (!isValidEmail(email)) return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  if (!service) return NextResponse.json({ error: 'Please choose a service.' }, { status: 400 });
  if (!Number.isFinite(minutes) || minutes <= 0 || minutes > 100000) {
    return NextResponse.json({ error: 'Please enter a valid duration.' }, { status: 400 });
  }
  if (fileLinkRaw && !isHttpUrl(fileLinkRaw)) {
    return NextResponse.json({ error: 'The file link must be a valid http(s) URL.' }, { status: 400 });
  }

  // Verify uploaded file (if any)
  let file: VerifiedPayload | null = null;
  if (b.verifiedToken) {
    file = await verifyToken<VerifiedPayload>(b.verifiedToken, config.tokenSecret);
    if (!file || file.verified !== true) {
      return NextResponse.json({ error: 'Your upload could not be verified. Please upload the file again.' }, { status: 400 });
    }
  }

  const jobRef = file?.jobRef ?? newJobRef();

  // Idempotency: same job reference submitted again returns the earlier result
  const prior = getProcessed<{ ok: boolean; jobRef: string }>(jobRef);
  if (prior) return NextResponse.json(prior);

  let downloadUrl: string | undefined;
  if (file) {
    try {
      const head = await headObject(config, file.key);
      if (!head.exists || head.size !== file.size) {
        return NextResponse.json({ error: 'We could not find your uploaded file. Please upload it again.' }, { status: 400 });
      }
      downloadUrl = await presignGet(config, file.key, 60 * 60 * 24 * 7);
    } catch {
      console.error('Quote: R2 verification failed');
      return NextResponse.json({ error: 'Could not verify your file. Please try again.' }, { status: 502 });
    }
  }

  const details: [string, string][] = [];
  if (service === 'transcription') {
    details.push(['Transcript type', b.transcriptType === 'legal' ? 'Legal' : 'General']);
    details.push(['Style', b.transcriptStyle === 'verbatim' ? 'Verbatim' : 'Clean Read']);
    details.push(['Timestamps', YN(b.timestamps)]);
  } else {
    details.push(['Caption type', b.captionFormat === 'sdh' ? 'SDH' : 'Non-SDH']);
  }
  details.push(['Speaker identification', YN(b.speakerID)]);
  details.push(['Rush service', YN(b.rushService)]);
  const fmt = cleanText(b.deliveryFormat, 8).toLowerCase();
  if (/^[a-z0-9]{2,5}$/.test(fmt)) details.push(['Delivery format', `.${fmt.toUpperCase()}`]);

  const data: QuoteEmailData = {
    jobRef,
    name,
    email,
    phone,
    notes,
    service: service === 'transcription' ? 'Transcription' : 'Captioning',
    minutes,
    estimate: minutes * RATES[service],
    details,
    fileName: file?.filename,
    fileSize: file ? formatBytes(file.size) : undefined,
    downloadUrl,
    fileLink: fileLinkRaw || undefined,
  };

  const notify = await sendNotification(config, data);
  if (!notify.ok) {
    return NextResponse.json(
      { error: 'We could not send your request right now. Nothing was lost — please try again, or email tim@accu-script.com.' },
      { status: 502 }
    );
  }

  const confirm = await sendConfirmation(config, data);
  const result = { ok: true, jobRef, confirmationSent: confirm.ok };
  setProcessed(jobRef, result);
  return NextResponse.json(result);
}
