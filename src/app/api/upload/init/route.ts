import { NextResponse } from 'next/server';
import { getServerConfig } from '@/lib/server/config';
import { getClientIp, rateLimit } from '@/lib/server/rateLimit';
import {
  MAX_FILE_BYTES,
  PART_SIZE_BYTES,
  SINGLE_PUT_MAX_BYTES,
  getExtension,
  isAllowedExtension,
  mimeForExtension,
  sanitizeFilename,
} from '@/lib/server/validation';
import { createMultipart, presignPart, presignPut } from '@/lib/server/r2';
import { signToken } from '@/lib/server/token';

export const dynamic = 'force-dynamic';

function newJobRef(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(4));
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('').toUpperCase();
  const d = new Date();
  const ymd = `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCDate()).padStart(2, '0')}`;
  return `AS-${ymd}-${hex}`;
}

export async function POST(req: Request) {
  const { config, missing } = getServerConfig();
  if (!config) {
    console.error('Upload init: missing server configuration', missing.join(', '));
    return NextResponse.json({ error: 'File upload is not configured yet. Please email tim@accu-script.com.' }, { status: 503 });
  }

  if (!rateLimit(`init:${getClientIp(req)}`, 10, 10 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many upload attempts. Please wait a few minutes and try again.' }, { status: 429 });
  }

  let body: { filename?: unknown; size?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const filename = sanitizeFilename(typeof body.filename === 'string' ? body.filename : '');
  const size = typeof body.size === 'number' ? Math.floor(body.size) : NaN;
  const ext = getExtension(filename);

  if (!isAllowedExtension(ext)) {
    return NextResponse.json({ error: 'Unsupported file type. Please upload MP3, MP4, WAV, M4A, MOV, AVI, OGG, WebM, AAC or FLAC.' }, { status: 400 });
  }
  if (!Number.isFinite(size) || size <= 0) {
    return NextResponse.json({ error: 'Invalid file size.' }, { status: 400 });
  }
  if (size > MAX_FILE_BYTES) {
    return NextResponse.json({ error: 'File is too large. Maximum size is 1.5GB.' }, { status: 400 });
  }

  const jobRef = newJobRef();
  const key = `quotes/${jobRef}/${crypto.randomUUID()}.${ext}`;
  const contentType = mimeForExtension(ext);
  const exp = Date.now() + 24 * 60 * 60 * 1000;

  try {
    const uploadToken = await signToken({ jobRef, key, size, filename, exp }, config.tokenSecret);

    if (size <= SINGLE_PUT_MAX_BYTES) {
      const url = await presignPut(config, key, 3600);
      return NextResponse.json({ mode: 'single', jobRef, uploadToken, url, contentType });
    }

    const uploadId = await createMultipart(config, key, contentType);
    const partCount = Math.ceil(size / PART_SIZE_BYTES);
    const partUrls = await Promise.all(
      Array.from({ length: partCount }, (_, i) => presignPart(config, key, uploadId, i + 1, 6 * 3600))
    );
    const multipartToken = await signToken({ jobRef, key, size, filename, uploadId, exp }, config.tokenSecret);
    return NextResponse.json({
      mode: 'multipart',
      jobRef,
      uploadToken: multipartToken,
      partSize: PART_SIZE_BYTES,
      partUrls,
      contentType,
    });
  } catch {
    console.error('Upload init failed');
    return NextResponse.json({ error: 'Could not start the upload. Please try again.' }, { status: 502 });
  }
}
