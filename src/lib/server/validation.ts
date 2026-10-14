export const MAX_FILE_BYTES = Math.floor(1.5 * 1024 * 1024 * 1024);
export const SINGLE_PUT_MAX_BYTES = 100 * 1024 * 1024; // files up to 100MB use one PUT
export const PART_SIZE_BYTES = 64 * 1024 * 1024; // multipart part size (R2 min 5MiB, max 10,000 parts)

export const ALLOWED_EXTENSIONS = [
  'mp3', 'wav', 'mp4', 'm4a', 'ogg', 'mov', 'avi', 'webm', 'aac', 'flac',
] as const;

const EXT_MIME: Record<string, string> = {
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
  mp4: 'video/mp4',
  m4a: 'audio/mp4',
  ogg: 'audio/ogg',
  mov: 'video/quicktime',
  avi: 'video/x-msvideo',
  webm: 'video/webm',
  aac: 'audio/aac',
  flac: 'audio/flac',
};

export function sanitizeFilename(name: string): string {
  const base = name.split(/[\\/]/).pop() ?? 'file';
  const cleaned = base
    .normalize('NFKD')
    .replace(/[^\w.\- ]+/g, '')
    .replace(/\s+/g, '_')
    .replace(/\.{2,}/g, '.')
    .replace(/^\.+/, '')
    .slice(0, 120);
  return cleaned || 'file';
}

export function getExtension(name: string): string {
  const idx = name.lastIndexOf('.');
  return idx === -1 ? '' : name.slice(idx + 1).toLowerCase();
}

export function mimeForExtension(ext: string): string {
  return EXT_MIME[ext] ?? 'application/octet-stream';
}

export function isAllowedExtension(ext: string): boolean {
  return (ALLOWED_EXTENSIONS as readonly string[]).includes(ext);
}

export function isValidEmail(v: unknown): v is string {
  return typeof v === 'string' && v.length <= 254 && /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/.test(v);
}

export function cleanText(v: unknown, max: number): string {
  if (typeof v !== 'string') return '';
  // strip control chars except newline/tab
  // eslint-disable-next-line no-control-regex
  return v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, max);
}

export function isHttpUrl(v: string): boolean {
  try {
    const u = new URL(v);
    return u.protocol === 'https:' || u.protocol === 'http:';
  } catch {
    return false;
  }
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}
