// Best-effort, per-isolate rate limiter. For hard guarantees, add a Cloudflare
// WAF rate-limiting rule on /api/* (see SETUP.md).
const buckets = new Map<string, { count: number; resetAt: number }>();
const processed = new Map<string, { result: unknown; expiresAt: number }>();

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (v.resetAt < now) buckets.delete(k);
  }
  const b = buckets.get(key);
  if (!b || b.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (b.count >= limit) return false;
  b.count += 1;
  return true;
}

export function getClientIp(req: Request): string {
  return (
    req.headers.get('cf-connecting-ip') ||
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  );
}

export function getProcessed<T>(jobRef: string): T | undefined {
  const hit = processed.get(jobRef);
  if (!hit) return undefined;
  if (hit.expiresAt < Date.now()) {
    processed.delete(jobRef);
    return undefined;
  }
  return hit.result as T;
}

export function setProcessed(jobRef: string, result: unknown, ttlMs = 60 * 60 * 1000) {
  if (processed.size > 2000) {
    const now = Date.now();
    for (const [k, v] of processed) if (v.expiresAt < now) processed.delete(k);
  }
  processed.set(jobRef, { result, expiresAt: Date.now() + ttlMs });
}
