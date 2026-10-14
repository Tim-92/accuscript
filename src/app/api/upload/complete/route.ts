import { NextResponse } from 'next/server';
import { getServerConfig } from '@/lib/server/config';
import { getClientIp, rateLimit } from '@/lib/server/rateLimit';
import { abortMultipart, completeMultipart, headObject } from '@/lib/server/r2';
import { signToken, verifyToken } from '@/lib/server/token';

export const dynamic = 'force-dynamic';

interface UploadTokenPayload extends Record<string, unknown> {
  jobRef: string;
  key: string;
  size: number;
  filename: string;
  uploadId?: string;
  exp: number;
}

export async function POST(req: Request) {
  const { config } = getServerConfig();
  if (!config) {
    return NextResponse.json({ error: 'File upload is not configured yet.' }, { status: 503 });
  }
  if (!rateLimit(`complete:${getClientIp(req)}`, 30, 10 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many requests. Please wait and try again.' }, { status: 429 });
  }

  let body: { uploadToken?: unknown; parts?: unknown; abort?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const payload = await verifyToken<UploadTokenPayload>(body.uploadToken, config.tokenSecret);
  if (!payload) {
    return NextResponse.json({ error: 'Upload session expired. Please select your file again.' }, { status: 400 });
  }

  try {
    if (body.abort === true) {
      if (payload.uploadId) await abortMultipart(config, payload.key, payload.uploadId);
      return NextResponse.json({ ok: true });
    }

    if (payload.uploadId) {
      const parts = Array.isArray(body.parts) ? body.parts : [];
      const clean = parts
        .map((p) => ({
          partNumber: Number((p as { partNumber?: unknown }).partNumber),
          etag: String((p as { etag?: unknown }).etag ?? ''),
        }))
        .filter((p) => Number.isInteger(p.partNumber) && p.partNumber > 0 && /^"?[\w-]+"?$/.test(p.etag));
      if (clean.length === 0 || clean.length !== parts.length) {
        return NextResponse.json({ error: 'Upload parts were incomplete. Please retry.' }, { status: 400 });
      }
      await completeMultipart(config, payload.key, payload.uploadId, clean);
    }

    const head = await headObject(config, payload.key);
    if (!head.exists) {
      return NextResponse.json({ error: 'We could not confirm your upload. Please retry.' }, { status: 400 });
    }
    if (head.size !== payload.size) {
      return NextResponse.json({ error: 'Uploaded file size did not match. Please retry.' }, { status: 400 });
    }

    // Verified token that the quote endpoint will accept
    const verifiedToken = await signToken(
      { jobRef: payload.jobRef, key: payload.key, size: head.size, filename: payload.filename, verified: true, exp: Date.now() + 24 * 60 * 60 * 1000 },
      config.tokenSecret
    );
    return NextResponse.json({ ok: true, jobRef: payload.jobRef, verifiedToken });
  } catch {
    console.error('Upload complete failed');
    return NextResponse.json({ error: 'Could not finalize the upload. Please retry.' }, { status: 502 });
  }
}
