import 'server-only';

export interface ServerConfig {
  r2AccountId: string;
  r2AccessKeyId: string;
  r2SecretAccessKey: string;
  r2BucketName: string;
  resendApiKey: string;
  notificationEmail: string;
  fromEmail: string;
  appBaseUrl: string;
  tokenSecret: string;
}

const REQUIRED = [
  'R2_ACCOUNT_ID',
  'R2_ACCESS_KEY_ID',
  'R2_SECRET_ACCESS_KEY',
  'R2_BUCKET_NAME',
  'RESEND_API_KEY',
  'QUOTE_NOTIFICATION_EMAIL',
  'QUOTE_FROM_EMAIL',
  'APP_BASE_URL',
  'UPLOAD_TOKEN_SECRET',
] as const;

// Rejects the placeholder values shipped in .env / .env.local.example
const PLACEHOLDER = /^(your-|re_your|replace-with|changeme)/i;

export function getServerConfig(): { config?: ServerConfig; missing: string[] } {
  const missing: string[] = REQUIRED.filter((k) => {
    const v = process.env[k];
    return !v || PLACEHOLDER.test(v);
  });
  const secret = process.env.UPLOAD_TOKEN_SECRET;
  if (secret && !PLACEHOLDER.test(secret) && secret.length < 32 && !missing.includes('UPLOAD_TOKEN_SECRET')) {
    missing.push('UPLOAD_TOKEN_SECRET');
  }
  if (missing.length > 0) return { missing };
  return {
    missing: [],
    config: {
      r2AccountId: process.env.R2_ACCOUNT_ID!,
      r2AccessKeyId: process.env.R2_ACCESS_KEY_ID!,
      r2SecretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      r2BucketName: process.env.R2_BUCKET_NAME!,
      resendApiKey: process.env.RESEND_API_KEY!,
      notificationEmail: process.env.QUOTE_NOTIFICATION_EMAIL!,
      fromEmail: process.env.QUOTE_FROM_EMAIL!,
      appBaseUrl: process.env.APP_BASE_URL!.replace(/\/+$/, ''),
      tokenSecret: process.env.UPLOAD_TOKEN_SECRET!,
    },
  };
}
