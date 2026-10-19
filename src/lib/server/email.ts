import 'server-only';
import type { ServerConfig } from './config';
import { escapeHtml } from './validation';

export interface QuoteEmailData {
  jobRef: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
  service: string;
  minutes: number;
  estimate: number;
  details: [string, string][];
  fileName?: string;
  fileSize?: string;
  downloadUrl?: string;
  fileLink?: string;
}

export interface ContactEmailData {
  ref: string;
  name: string;
  email: string;
  inquiryType: string;
  message: string;
  fileName?: string;
  fileSize?: string;
  downloadUrl?: string;
}

async function sendEmail(
  cfg: ServerConfig,
  payload: { to: string[]; subject: string; html: string; text: string; reply_to?: string },
  idempotencyKey: string
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cfg.resendApiKey}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify({
        from: `AccuScript <${cfg.fromEmail}>`,
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
        text: payload.text,
        ...(payload.reply_to ? { reply_to: payload.reply_to } : {}),
      }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      console.error('Resend error status', res.status, detail.slice(0, 300));
      return { ok: false, error: `Resend responded with status ${res.status}` };
    }
    return { ok: true };
  } catch {
    console.error('Resend request failed');
    return { ok: false, error: 'Could not reach Resend' };
  }
}

function rows(details: [string, string][]): string {
  return details
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#666;vertical-align:top">${escapeHtml(k)}</td><td style="padding:6px 0;font-weight:600">${escapeHtml(v)}</td></tr>`
    )
    .join('');
}

export async function sendNotification(cfg: ServerConfig, d: QuoteEmailData) {
  const all: [string, string][] = [
    ['Job reference', d.jobRef],
    ['Client', d.name],
    ['Email', d.email],
    ['Phone', d.phone || '—'],
    ['Service', d.service],
    ['Duration', `${d.minutes} minutes`],
    ['Estimated starting price', `$${d.estimate.toFixed(2)}`],
    ...d.details,
    ['Original filename', d.fileName || '—'],
    ['File size', d.fileSize || '—'],
  ];
  if (d.fileLink) all.push(['Client-provided file link', d.fileLink]);
  const download = d.downloadUrl
    ? `<p style="margin:16px 0"><a href="${escapeHtml(d.downloadUrl)}" style="background:#111;color:#fff;padding:10px 18px;border-radius:999px;text-decoration:none">Download file (private link, expires in 7 days)</a></p>`
    : '';
  const html = `<div style="font-family:Arial,sans-serif;max-width:600px">
<h2>New quote request ${escapeHtml(d.jobRef)}</h2>
<table style="border-collapse:collapse;font-size:14px">${rows(all)}</table>
${download}
<p style="font-size:14px"><strong>Project notes:</strong><br/>${escapeHtml(d.notes || '—').replace(/\n/g, '<br/>')}</p>
</div>`;
  const text =
    `New quote request ${d.jobRef}\n\n` +
    all.map(([k, v]) => `${k}: ${v}`).join('\n') +
    (d.downloadUrl ? `\n\nDownload (private link, expires in 7 days):\n${d.downloadUrl}` : '') +
    `\n\nNotes:\n${d.notes || '—'}`;
  return sendEmail(
    cfg,
    {
      to: [cfg.notificationEmail],
      subject: `New quote request ${d.jobRef} — ${d.name}`,
      html,
      text,
      reply_to: d.email,
    },
    `notify-${d.jobRef}`
  );
}

export async function sendConfirmation(cfg: ServerConfig, d: QuoteEmailData) {
  const first = d.name.split(' ')[0] || d.name;
  const summary: [string, string][] = [
    ['Job reference', d.jobRef],
    ['Service', d.service],
    ['Duration', `${d.minutes} minutes`],
    ['Estimated starting price', `$${d.estimate.toFixed(2)}`],
    ...(d.fileName ? ([['File received', d.fileName]] as [string, string][]) : []),
  ];
  const html = `<div style="font-family:Arial,sans-serif;max-width:600px">
<h2>Thank you, ${escapeHtml(first)} — we received your quote request</h2>
<p>I'll personally review your project and reply with a confirmed quote before any work begins. Please keep your job reference handy: <strong>${escapeHtml(d.jobRef)}</strong>.</p>
<table style="border-collapse:collapse;font-size:14px">${rows(summary)}</table>
<p style="font-size:13px;color:#666">The estimate is a starting price and may vary based on audio quality, speakers and formatting. Just reply to this email if you have questions.</p>
<p>— Tim, AccuScript</p>
</div>`;
  const text =
    `Thank you, ${first} — we received your quote request.\n\n` +
    summary.map(([k, v]) => `${k}: ${v}`).join('\n') +
    `\n\nI'll review your project and reply with a confirmed quote before any work begins.\n— Tim, AccuScript`;
  return sendEmail(
    cfg,
    {
      to: [d.email],
      subject: `We received your quote request (${d.jobRef})`,
      html,
      text,
      reply_to: cfg.notificationEmail,
    },
    `confirm-${d.jobRef}`
  );
}

export async function sendContactNotification(cfg: ServerConfig, d: ContactEmailData) {
  const all: [string, string][] = [
    ['Reference', d.ref],
    ['Name', d.name],
    ['Email', d.email],
    ['Inquiry type', d.inquiryType],
    ['Attachment', d.fileName ? `${d.fileName} (${d.fileSize ?? ''})` : '—'],
  ];
  const download = d.downloadUrl
    ? `<p style="margin:16px 0"><a href="${escapeHtml(d.downloadUrl)}" style="background:#111;color:#fff;padding:10px 18px;border-radius:999px;text-decoration:none">Download attachment (private link, expires in 7 days)</a></p>`
    : '';
  const html = `<div style="font-family:Arial,sans-serif;max-width:600px">
<h2>New contact message ${escapeHtml(d.ref)}</h2>
<table style="border-collapse:collapse;font-size:14px">${rows(all)}</table>
${download}
<p style="font-size:14px"><strong>Message:</strong><br/>${escapeHtml(d.message).replace(/\n/g, '<br/>')}</p>
</div>`;
  const text =
    `New contact message ${d.ref}\n\n` +
    all.map(([k, v]) => `${k}: ${v}`).join('\n') +
    (d.downloadUrl ? `\n\nDownload attachment (private link, expires in 7 days):\n${d.downloadUrl}` : '') +
    `\n\nMessage:\n${d.message}`;
  return sendEmail(
    cfg,
    {
      to: [cfg.notificationEmail],
      subject: `Contact: ${d.inquiryType} — ${d.name} (${d.ref})`,
      html,
      text,
      reply_to: d.email,
    },
    `contact-notify-${d.ref}`
  );
}

export async function sendContactConfirmation(cfg: ServerConfig, d: ContactEmailData) {
  const first = d.name.split(' ')[0] || d.name;
  const html = `<div style="font-family:Arial,sans-serif;max-width:600px">
<h2>Thanks for reaching out, ${escapeHtml(first)}</h2>
<p>I received your message and will reply personally, usually within one business day. Reference: <strong>${escapeHtml(d.ref)}</strong>.</p>
<p style="font-size:13px;color:#666">Just reply to this email if you want to add anything.</p>
<p>— Tim, AccuScript</p>
</div>`;
  const text =
    `Thanks for reaching out, ${first}.\n\nI received your message and will reply personally, usually within one business day. Reference: ${d.ref}.\n\n— Tim, AccuScript`;
  return sendEmail(
    cfg,
    {
      to: [d.email],
      subject: `We received your message (${d.ref})`,
      html,
      text,
      reply_to: cfg.notificationEmail,
    },
    `contact-confirm-${d.ref}`
  );
}
