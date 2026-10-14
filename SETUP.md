# AccuScript — Quote Form Setup (Cloudflare Workers + R2 + Resend)

This guide connects the quote form to a **private Cloudflare R2 bucket** and **Resend** emails, and deploys the site to **Cloudflare Workers** using OpenNext.

How it works: the browser asks `/api/upload/init` for a short-lived presigned URL, uploads the file **directly to R2**, `/api/upload/complete` verifies the object exists in R2 (size matches), then `/api/quote` re-verifies and emails you (with a temporary private download link, valid 7 days) and emails the client a confirmation. Secrets only ever live on the server.

---

## 1. Install dependencies
```
npm install
```

## 2. Create the private R2 bucket
1. Cloudflare dashboard → **R2 Object Storage** → **Create bucket**.
2. Pick a name (e.g. your own choice). Leave **Public access disabled** (do NOT enable r2.dev or a custom public domain).
3. Put that name in `R2_BUCKET_NAME`.

## 3. Create narrowly scoped R2 credentials
1. R2 → **Manage API Tokens** → **Create API token**.
2. Permission: **Object Read & Write**. Under **Specify bucket(s)**, select only your bucket.
3. Copy the **Access Key ID** and **Secret Access Key** (shown once) → `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`.
4. Your **Account ID** is on the R2 overview page → `R2_ACCOUNT_ID`.

## 4. Configure R2 CORS (required for browser uploads)
Bucket → **Settings** → **CORS Policy** → add (replace the origins with your real site URL(s)):
```json
[
  {
    "AllowedOrigins": ["https://your-domain.example", "http://localhost:4028"],
    "AllowedMethods": ["PUT"],
    "AllowedHeaders": ["content-type"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```
`ExposeHeaders: ["ETag"]` is **required** — large (multipart) uploads fail without it.

## 5. Abandoned upload cleanup (recommended)
Bucket → **Settings** → **Object lifecycle rules**:
- Add rule: **Abort incomplete multipart uploads** after 1 day.
- Optional: delete objects under prefix `quotes/` after e.g. 90 days.

## 6. Set up Resend
1. Create an account at resend.com → **Domains** → add `accu-script.com` and add the DNS records Resend shows (SPF, DKIM) in Cloudflare DNS. Wait until it shows **Verified**.
2. **API Keys** → create a key with **Sending access** → `RESEND_API_KEY`.
3. `QUOTE_FROM_EMAIL` and `QUOTE_NOTIFICATION_EMAIL` are both `tim@accu-script.com`. The sender only works once the domain is verified. Make sure `tim@accu-script.com` can actually receive mail (e.g. Cloudflare Email Routing or your mailbox provider).

## 7. Environment variables
See `.env.local.example` (placeholders only):

| Variable | Purpose |
|---|---|
| `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME` | Private R2 access |
| `RESEND_API_KEY` | Resend sending key |
| `QUOTE_NOTIFICATION_EMAIL` | Where quote notifications go |
| `QUOTE_FROM_EMAIL` | Verified sender address |
| `APP_BASE_URL` | Public site URL |
| `UPLOAD_TOKEN_SECRET` | Random 32+ char string for signing upload tokens (`openssl rand -base64 48`) |

None of these use the `NEXT_PUBLIC_` prefix, so they are never sent to the browser.

## 8. Local development
```
cp .env.local.example .env.local     # then fill in real values
npm run dev                          # http://localhost:4028
```
To test in the real Workers runtime:
```
cp .dev.vars.example .dev.vars       # then also add every variable from .env.local.example to .dev.vars
npm run preview
```

## 9. Static asset caching file
Create a file named `_headers` (no extension) inside `public/` containing:
```
/_next/static/*
  Cache-Control: public,max-age=31536000,immutable
```
(It could not be auto-created by the editor.)

## 10. Deploy to Cloudflare Workers
```
npx wrangler login
npm run deploy
```
**If you deploy through Cloudflare Workers Builds (Git-connected)**, set these in Workers & Pages → your Worker → Settings → Build:
- **Build command:** `npm run cf:build`  (runs `opennextjs-cloudflare build`, which creates `.open-next/`)
- **Deploy command:** `npm run cf:deploy`  (runs `opennextjs-cloudflare deploy`)

Do NOT use `npm run build` + `npx wrangler deploy`: that only runs `next build`, so `.open-next/` is never created and the deploy fails with "Could not find compiled Open Next config, did you run the build command?".

Then add each variable from section 7 as a **secret**:
```
npx wrangler secret put R2_ACCOUNT_ID
npx wrangler secret put R2_ACCESS_KEY_ID
npx wrangler secret put R2_SECRET_ACCESS_KEY
npx wrangler secret put R2_BUCKET_NAME
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put QUOTE_NOTIFICATION_EMAIL
npx wrangler secret put QUOTE_FROM_EMAIL
npx wrangler secret put APP_BASE_URL
npx wrangler secret put UPLOAD_TOKEN_SECRET
```
(Or in the dashboard: Workers & Pages → your Worker → Settings → Variables and Secrets.) If you deploy via Workers Builds from GitHub, also add them under **Build variables and secrets**. Attach your custom domain under Settings → Domains & Routes. The Worker name in `wrangler.jsonc` is `accuscript`; change both `name` and the `WORKER_SELF_REFERENCE` service if you rename it.

## 11. Abuse protection (recommended)
The built-in rate limiter is per-instance (best effort). For a hard limit add a Cloudflare **WAF → Rate limiting rule** for paths starting with `/api/` (e.g. 20 requests / 10 minutes per IP).

## 12. Test with a small file first
1. Open `/request-a-quote`, choose a tiny MP3 (a few MB), fill the form, submit.
2. Confirm: progress bar reaches 100%, success page shows a job reference.
3. Check `tim@accu-script.com` for the notification (job ref, details, filename, size, download button) and the client address for the confirmation.
4. In R2, confirm the object exists under `quotes/<job-ref>/`.
5. Click the download link to confirm it works, and confirm the bucket URL itself is NOT publicly accessible.
6. Then test a file over 100MB (uses multipart) before accepting large client files.

## Notes & limits
- Files ≤100MB upload with one presigned PUT; larger files (up to 1.5GB) use 64MB multipart parts with per-part retry.
- Download links expire after 7 days (the R2 presign maximum). Download files promptly; the object itself stays private in R2.
- If the notification email fails, the client sees an error and can retry; the same job reference is reused, so no duplicate jobs are created. If only the client confirmation fails, the quote still succeeds.
- Duplicate protection is per-instance memory plus Resend idempotency keys (24h).
- Not tested by the developer: real R2 uploads, Resend delivery and Cloudflare deployment require your credentials. Please follow step 12.
