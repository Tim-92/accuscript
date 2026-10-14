import 'server-only';
import { AwsClient } from 'aws4fetch';
import type { ServerConfig } from './config';

function client(cfg: ServerConfig): AwsClient {
  return new AwsClient({
    accessKeyId: cfg.r2AccessKeyId,
    secretAccessKey: cfg.r2SecretAccessKey,
    service: 's3',
    region: 'auto',
  });
}

function objectUrl(cfg: ServerConfig, key: string): string {
  const encodedKey = key.split('/').map(encodeURIComponent).join('/');
  return `https://${cfg.r2AccountId}.r2.cloudflarestorage.com/${cfg.r2BucketName}/${encodedKey}`;
}

async function presign(
  cfg: ServerConfig,
  method: 'GET' | 'PUT',
  key: string,
  expiresSec: number,
  query: Record<string, string> = {}
): Promise<string> {
  const url = new URL(objectUrl(cfg, key));
  for (const [k, v] of Object.entries(query)) url.searchParams.set(k, v);
  url.searchParams.set('X-Amz-Expires', String(expiresSec));
  const signed = await client(cfg).sign(new Request(url.toString(), { method }), {
    aws: { signQuery: true, allHeaders: false },
  });
  return signed.url;
}

export function presignPut(cfg: ServerConfig, key: string, expiresSec = 3600) {
  return presign(cfg, 'PUT', key, expiresSec);
}

export function presignGet(cfg: ServerConfig, key: string, expiresSec = 60 * 60 * 24 * 7) {
  return presign(cfg, 'GET', key, expiresSec);
}

export function presignPart(
  cfg: ServerConfig,
  key: string,
  uploadId: string,
  partNumber: number,
  expiresSec = 3600
) {
  return presign(cfg, 'PUT', key, expiresSec, { partNumber: String(partNumber), uploadId });
}

export async function createMultipart(cfg: ServerConfig, key: string, contentType: string): Promise<string> {
  const url = `${objectUrl(cfg, key)}?uploads`;
  const res = await client(cfg).fetch(url, { method: 'POST', headers: { 'content-type': contentType } });
  if (!res.ok) throw new Error(`R2 createMultipart failed (${res.status})`);
  const text = await res.text();
  const m = text.match(/<UploadId>([^<]+)<\/UploadId>/);
  if (!m) throw new Error('R2 createMultipart: no UploadId');
  return m[1];
}

export async function completeMultipart(
  cfg: ServerConfig,
  key: string,
  uploadId: string,
  parts: { partNumber: number; etag: string }[]
): Promise<void> {
  const sorted = [...parts].sort((a, b) => a.partNumber - b.partNumber);
  const body =
    '<CompleteMultipartUpload>' +
    sorted
      .map((p) => `<Part><PartNumber>${p.partNumber}</PartNumber><ETag>${p.etag}</ETag></Part>`)
      .join('') +
    '</CompleteMultipartUpload>';
  const url = `${objectUrl(cfg, key)}?uploadId=${encodeURIComponent(uploadId)}`;
  const res = await client(cfg).fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/xml' },
    body,
  });
  const text = await res.text();
  // R2 can return 200 with an <Error> body
  if (!res.ok || text.includes('<Error>')) throw new Error(`R2 completeMultipart failed (${res.status})`);
}

export async function abortMultipart(cfg: ServerConfig, key: string, uploadId: string): Promise<void> {
  const url = `${objectUrl(cfg, key)}?uploadId=${encodeURIComponent(uploadId)}`;
  await client(cfg).fetch(url, { method: 'DELETE' }).catch(() => undefined);
}

export async function headObject(
  cfg: ServerConfig,
  key: string
): Promise<{ exists: boolean; size: number }> {
  const res = await client(cfg).fetch(objectUrl(cfg, key), { method: 'HEAD' });
  if (res.status === 404) return { exists: false, size: 0 };
  if (!res.ok) throw new Error(`R2 head failed (${res.status})`);
  return { exists: true, size: Number(res.headers.get('content-length') ?? 0) };
}
