'use client';
import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { submitContact, uploadFileToR2 } from '@/lib/quoteClient';

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

const ACCEPTED_EXT = ['mp3', 'mp4', 'm4a', 'wav', 'ogg', 'flac', 'aac', 'mov', 'avi', 'webm', 'pdf', 'doc', 'docx'];
const MAX_MB = 100;

interface FormState {
  name: string;
  email: string;
  inquiryType: string;
  message: string;
}

const EMPTY: FormState = { name: '', email: '', inquiryType: '', message: '' };

export default function ContactPage() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [honeypot, setHoneypot] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const verifiedRef = useRef<{ token: string; file: File } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setFileError('');
    verifiedRef.current = null;
    if (!selected) { setFile(null); return; }
    const ext = selected.name.split('.').pop()?.toLowerCase() ?? '';
    if (!ACCEPTED_EXT.includes(ext)) {
      setFileError('Unsupported file type. Please upload an audio, video, PDF, or Word document.');
      setFile(null);
      return;
    }
    if (selected.size > MAX_MB * 1024 * 1024) {
      setFileError(`File is too large. Maximum size is ${MAX_MB} MB.`);
      setFile(null);
      return;
    }
    setFile(selected);
  };

  const removeFile = () => {
    setFile(null);
    setFileError('');
    verifiedRef.current = null;
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      let verifiedToken: string | undefined;
      if (file) {
        if (verifiedRef.current && verifiedRef.current.file === file) {
          verifiedToken = verifiedRef.current.token;
        } else {
          setUploadProgress(0);
          const up = await uploadFileToR2(file, (f) => setUploadProgress(Math.min(1, f)), 'contact');
          verifiedRef.current = { token: up.verifiedToken, file };
          verifiedToken = up.verifiedToken;
          setUploadProgress(1);
        }
      }
      await submitContact({ ...form, verifiedToken, hp_field: honeypot });
      setSubmitted(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error && err.message
          ? err.message
          : 'Something went wrong. Please try again or email tim@accu-script.com.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const resetAll = () => {
    setSubmitted(false);
    setForm(EMPTY);
    setFile(null);
    setSubmitError('');
    verifiedRef.current = null;
  };

  const isValid = form.name.trim() && form.email.trim() && form.inquiryType && form.message.trim();
  const inputCls =
    'w-full border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors bg-background';

  return (
    <>
      <div className="noise-overlay" aria-hidden="true" />
      <Header />
      <main className="min-h-screen bg-background pt-28 pb-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-12">
            <p className="text-xs font-700 uppercase tracking-widest text-primary mb-3">Get in Touch</p>
            <h1 className="text-4xl md:text-5xl font-800 text-foreground tracking-tight leading-tight mb-4">
              Send Me a Message
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              Have a question, want to discuss a project, or just not sure where to start? Reach out — I read every message personally and reply promptly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
            <div className="lg:col-span-3">
              {submitted ? (
                <div className="bg-white border border-border rounded-2xl p-10 text-center shadow-sm">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                    <Icon name="CheckCircleIcon" size={32} className="text-primary" />
                  </div>
                  <h2 className="text-2xl font-700 text-foreground mb-3">Message Sent</h2>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Thanks for reaching out. I&apos;ll review your message and get back to you as soon as I can — usually within one business day.
                  </p>
                  <button
                    onClick={resetAll}
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full text-sm font-700 hover:bg-accent transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="relative bg-white border border-border rounded-2xl p-8 shadow-sm flex flex-col gap-6">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="name" className="text-sm font-600 text-foreground">
                      Your Name <span className="text-primary">*</span>
                    </label>
                    <input id="name" name="name" type="text" autoComplete="name" required value={form.name}
                      onChange={handleChange} placeholder="Jane Smith" className={inputCls} />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className="text-sm font-600 text-foreground">
                      Email Address <span className="text-primary">*</span>
                    </label>
                    <input id="email" name="email" type="email" autoComplete="email" required value={form.email}
                      onChange={handleChange} placeholder="jane@example.com" className={inputCls} />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="inquiryType" className="text-sm font-600 text-foreground">
                      Inquiry Type <span className="text-primary">*</span>
                    </label>
                    <div className="relative">
                      <select id="inquiryType" name="inquiryType" required value={form.inquiryType}
                        onChange={handleChange} className={`${inputCls} appearance-none pr-10`}>
                        <option value="" disabled>Select an inquiry type…</option>
                        {INQUIRY_TYPES.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <Icon name="ChevronDownIcon" size={16} />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="message" className="text-sm font-600 text-foreground">
                      Message <span className="text-primary">*</span>
                    </label>
                    <textarea id="message" name="message" required rows={6} value={form.message}
                      onChange={handleChange}
                      placeholder="Tell me about your project, question, or anything else you'd like to discuss…"
                      className={`${inputCls} resize-none`} />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-600 text-foreground">
                      Attach a File <span className="text-muted-foreground font-400">(optional)</span>
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Audio, video, PDF, or Word document — up to {MAX_MB} MB. Not required to send a message.
                    </p>

                    {!file ? (
                      <label htmlFor="file-upload"
                        className="mt-1 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-xl px-6 py-8 cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                        <Icon name="ArrowUpTrayIcon" size={24} className="text-muted-foreground" />
                        <span className="text-sm font-500 text-muted-foreground">Click to browse or drag a file here</span>
                        <input id="file-upload" ref={fileInputRef} type="file"
                          accept={ACCEPTED_EXT.map((x) => `.${x}`).join(',')}
                          onChange={handleFile} className="sr-only" />
                      </label>
                    ) : (
                      <div className="mt-1 flex items-center justify-between gap-3 border border-border rounded-xl px-4 py-3 bg-primary/5">
                        <div className="flex items-center gap-3 min-w-0">
                          <Icon name="DocumentIcon" size={20} className="text-primary shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm font-600 text-foreground truncate">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(1)} MB</p>
                          </div>
                        </div>
                        <button type="button" onClick={removeFile} disabled={submitting}
                          className="shrink-0 text-muted-foreground hover:text-foreground transition-colors p-1">
                          <Icon name="XMarkIcon" size={18} />
                        </button>
                      </div>
                    )}

                    {fileError && (
                      <p className="text-xs text-red-600 flex items-center gap-1.5 mt-1">
                        <Icon name="ExclamationCircleIcon" size={14} />
                        {fileError}
                      </p>
                    )}
                  </div>

                  {/* Honeypot (hidden from real users) */}
                  <input type="text" name="hp_field" tabIndex={-1} autoComplete="off" aria-hidden="true"
                    value={honeypot} onChange={(e) => setHoneypot(e.target.value)}
                    className="absolute -left-[9999px] h-0 w-0 opacity-0" />

                  {submitting && file && uploadProgress < 1 && (
                    <div role="status" aria-live="polite">
                      <div className="flex justify-between text-xs font-600 text-foreground mb-2">
                        <span>Uploading {file.name}…</span>
                        <span>{Math.round(uploadProgress * 100)}%</span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary transition-all" style={{ width: `${Math.round(uploadProgress * 100)}%` }} />
                      </div>
                    </div>
                  )}

                  {submitError && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 flex items-start gap-2" role="alert">
                      <Icon name="ExclamationCircleIcon" size={16} className="mt-0.5 flex-shrink-0" />
                      <span>{submitError} Your message is still here — press the button to retry.</span>
                    </div>
                  )}

                  <button type="submit" disabled={!isValid || submitting}
                    className="mt-2 flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full text-sm font-700 hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    {submitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Icon name="PaperAirplaneIcon" size={16} />
                        {submitError ? 'Retry' : 'Send Message to Tim'}
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
                <h2 className="text-base font-700 text-foreground mb-4">Direct Contact</h2>
                <a href="mailto:tim@accu-script.com"
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors group">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Icon name="EnvelopeIcon" size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-600 text-muted-foreground uppercase tracking-wide mb-0.5">Email</p>
                    <p className="font-600 text-foreground">tim@accu-script.com</p>
                  </div>
                </a>
              </div>

              <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
                <h2 className="text-base font-700 text-foreground mb-4">What to Expect</h2>
                <ul className="flex flex-col gap-3">
                  {[
                    { icon: 'ClockIcon', text: 'I typically reply within one business day.' },
                    { icon: 'UserCircleIcon', text: "You'll hear directly from me — not a support bot." },
                    { icon: 'ChatBubbleLeftRightIcon', text: 'No pressure. Ask anything before committing to a project.' },
                    { icon: 'LockClosedIcon', text: 'Your details are kept private and never shared.' },
                  ].map((item) => (
                    <li key={item.text} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <Icon name={item.icon as Parameters<typeof Icon>[0]['name']} size={16} className="text-primary mt-0.5 shrink-0" />
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-primary rounded-2xl p-6 text-primary-foreground">
                <h2 className="text-base font-700 mb-2">Ready to place an order?</h2>
                <p className="text-sm opacity-80 mb-4 leading-relaxed">
                  If you already know what you need, skip straight to the quote form and I&apos;ll get started.
                </p>
                <Link href="/request-a-quote"
                  className="inline-flex items-center gap-2 bg-white text-primary px-5 py-2.5 rounded-full text-sm font-700 hover:bg-secondary transition-colors">
                  Request a Quote
                  <Icon name="ArrowRightIcon" size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
