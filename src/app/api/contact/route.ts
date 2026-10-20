import { NextResponse } from 'next/server';
import { getServerConfig } from '@/lib/server/config';
import { getClientIp, getProcessed, rateLimit, setProcessed } from '@/lib/server/rateLimit';
import { headObject, presignGet } from '@/lib/server/r2';
import { verifyToken } from '@/lib/server/token';
import { sendContactConfirmation, sendContactNotification, type ContactEmailData } from '@/lib/server/email';
import { cleanText, formatBytes, isValidEmail } from '@/lib/server/validation';

export const dynamic = 'force-dynamic';

interface VerifiedPayload extends Record<string, unknown> {
  jobRef: string;
  key: string;
  size: number;
  filename: string;
  verified?: boolean;
  exp: number;
}

const INQUIRY_TYPES = [
  'General Question',
  'Transcription Inquiry',
  'Captioning Inquiry',
  'Legal Transcription',
  'Insurance Transcription',
  'Education Transcription',
  'Business Transcription',
  'Research Transcription',
  'Pricing Question',
  'Turnaround / Rush Request',
  'File Format Question',
  'Other',
];

function newRef(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(4));
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('').toUpperCase();
  const d = new Date();
  const ymd = `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCDate()).padStart(2, '0')}`;
  return `CT-${ymd}-${hex}`;
}

export async function POST(req: Request) {
  const { config } = getServerConfig();
  if (!config) {
    return NextResponse.json(
      { error: 'The contact form is not configured yet. Please email tim@accu-script.com.' },
      { status: 503 }
    );
  }
  if (!rateLimit(`contact:${getClientIp(req)}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many messages. Please wait a few minutes and try again.' }, { status: 429 });
  }

  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  // Honeypot
  if (typeof b.hp_field === 'string' && b.hp_field.length > 0) {
    return NextResponse.json({ ok: true, ref: 'CT-OK' });
  }

  const name = cleanText(b.name, 120);
  const email = cleanText(b.email, 254);
  const inquiryType = cleanText(b.inquiryType, 60);
  const message = cleanText(b.message, 5000);

  if (name.length < 2) return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 });
  if (!isValidEmail(email)) return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  if (!INQUIRY_TYPES.includes(inquiryType)) {
    return NextResponse.json({ error: 'Please choose an inquiry type.' }, { status: 400 });
  }
  if (message.length < 5) return NextResponse.json({ error: 'Please enter a message.' }, { status: 400 });

  let file: VerifiedPayload | null = null;
  if (b.verifiedToken) {
    file = await verifyToken<VerifiedPayload>(b.verifiedToken, config.tokenSecret);
    if (!file || file.verified !== true || !String(file.key).startsWith('contact/')) {
      return NextResponse.json({ error: 'Your attachment could not be verified. Please attach it again.' }, { status: 400 });
    }
  }

  const ref = file?.jobRef ?? newRef();
  const prior = getProcessed<{ ok: boolean; ref: string }>(ref);
  if (prior) return NextResponse.json(prior);

  let downloadUrl: string | undefined;
  if (file) {
    try {
      const head = await headObject(config, file.key);
      if (!head.exists || head.size !== file.size) {
        return NextResponse.json({ error: 'We could not find your attachment. Please attach it again.' }, { status: 400 });
      }
      downloadUrl = await presignGet(config, file.key, 60 * 60 * 24 * 7);
    } catch {
      console.error('Contact: R2 verification failed');
      return NextResponse.json({ error: 'Could not verify your attachment. Please try again.' }, { status: 502 });
    }
  }

  const data: ContactEmailData = {
    ref,
    name,
    email,
    inquiryType,
    message,
    fileName: file?.filename,
    fileSize: file ? formatBytes(file.size) : undefined,
    downloadUrl,
  };

  const notify = await sendContactNotification(config, data);
  if (!notify.ok) {
    return NextResponse.json(
      { error: 'We could not send your message right now. Nothing was lost — please try again, or email tim@accu-script.com.' },
      { status: 502 }
    );
  }

  const confirm = await sendContactConfirmation(config, data);
  const result = { ok: true, ref, confirmationSent: confirm.ok };
  setProcessed(ref, result);
  return NextResponse.json(result);
}
