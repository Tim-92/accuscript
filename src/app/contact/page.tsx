'use client';
import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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

const ACCEPTED_TYPES = [
  'audio/mpeg', 'audio/mp4', 'audio/wav', 'audio/ogg', 'audio/flac', 'audio/aac',
  'video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm',
  'application/pdf', 'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const MAX_MB = 100;

interface FormState {
  name: string;
  email: string;
  inquiryType: string;
  message: string;
}

export default function ContactPage() {
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    inquiryType: '',
    message: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setFileError('');
    if (!selected) { setFile(null); return; }
    if (!ACCEPTED_TYPES.includes(selected.type)) {
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
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1200);
  };

  const isValid = form.name.trim() && form.email.trim() && form.inquiryType && form.message.trim();

  return (
    <>
      <div className="noise-overlay" aria-hidden="true" />
      <Header />
      <main className="min-h-screen bg-background pt-28 pb-20">
        <div className="max-w-5xl mx-auto px-6">

          {/* Page Header */}
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

            {/* Form */}
            <div className="lg:col-span-3">
              {submitted ? (
                <div className="bg-white border border-border rounded-2xl p-10 text-center shadow-sm">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                    <Icon name="CheckCircleIcon" size={32} className="text-primary" />
                  </div>
                  <h2 className="text-2xl font-700 text-foreground mb-3">Message Sent</h2>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Thanks for reaching out. I'll review your message and get back to you as soon as I can — usually within one business day.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: '', email: '', inquiryType: '', message: '' }); setFile(null); }}
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full text-sm font-700 hover:bg-accent transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white border border-border rounded-2xl p-8 shadow-sm flex flex-col gap-6">

                  {/* Name */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="name" className="text-sm font-600 text-foreground">
                      Your Name <span className="text-primary">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Jane Smith"
                      className="w-full border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors bg-background"
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className="text-sm font-600 text-foreground">
                      Email Address <span className="text-primary">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="jane@example.com"
                      className="w-full border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors bg-background"
                    />
                  </div>

                  {/* Inquiry Type */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="inquiryType" className="text-sm font-600 text-foreground">
                      Inquiry Type <span className="text-primary">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="inquiryType"
                        name="inquiryType"
                        required
                        value={form.inquiryType}
                        onChange={handleChange}
                        className="w-full border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors bg-background appearance-none pr-10"
                      >
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

                  {/* Message */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="message" className="text-sm font-600 text-foreground">
                      Message <span className="text-primary">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell me about your project, question, or anything else you'd like to discuss…"
                      className="w-full border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors bg-background resize-none"
                    />
                  </div>

                  {/* File Upload (optional) */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-600 text-foreground">
                      Attach a File <span className="text-muted-foreground font-400">(optional)</span>
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Audio, video, PDF, or Word document — up to {MAX_MB} MB. Not required to send a message.
                    </p>

                    {!file ? (
                      <label
                        htmlFor="file-upload"
                        className="mt-1 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-xl px-6 py-8 cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
                      >
                        <Icon name="ArrowUpTrayIcon" size={24} className="text-muted-foreground" />
                        <span className="text-sm font-500 text-muted-foreground">Click to browse or drag a file here</span>
                        <input
                          id="file-upload"
                          ref={fileInputRef}
                          type="file"
                          accept=".mp3,.mp4,.m4a,.wav,.ogg,.flac,.aac,.mov,.avi,.webm,.pdf,.doc,.docx"
                          onChange={handleFile}
                          className="sr-only"
                        />
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
                        <button type="button" onClick={removeFile} className="shrink-0 text-muted-foreground hover:text-foreground transition-colors p-1">
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

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={!isValid || submitting}
                    className="mt-2 flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full text-sm font-700 hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Icon name="PaperAirplaneIcon" size={16} />
                        Send Message to Tim
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2 flex flex-col gap-6">

              {/* Direct contact card */}
              <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
                <h2 className="text-base font-700 text-foreground mb-4">Direct Contact</h2>
                <div className="flex flex-col gap-4">
                  <a
                    href="mailto:tim@accuscript.com"
                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                      <Icon name="EnvelopeIcon" size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-600 text-muted-foreground uppercase tracking-wide mb-0.5">Email</p>
                      <p className="font-600 text-foreground">tim@accuscript.com</p>
                    </div>
                  </a>
                </div>
              </div>

              {/* What to expect */}
              <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
                <h2 className="text-base font-700 text-foreground mb-4">What to Expect</h2>
                <ul className="flex flex-col gap-3">
                  {[
                    { icon: 'ClockIcon', text: 'I typically reply within one business day.' },
                    { icon: 'UserCircleIcon', text: 'You\'ll hear directly from me — not a support bot.' },
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

              {/* Ready to order CTA */}
              <div className="bg-primary rounded-2xl p-6 text-primary-foreground">
                <h2 className="text-base font-700 mb-2">Ready to place an order?</h2>
                <p className="text-sm opacity-80 mb-4 leading-relaxed">
                  If you already know what you need, skip straight to the quote form and I'll get started.
                </p>
                <Link
                  href="/request-a-quote"
                  className="inline-flex items-center gap-2 bg-white text-primary px-5 py-2.5 rounded-full text-sm font-700 hover:bg-secondary transition-colors"
                >
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
