'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import { submitQuote, uploadFileToR2 } from '@/lib/quoteClient';

type ServiceType = 'transcription' | 'captioning';
type TranscriptType = 'general' | 'legal';
type TranscriptStyle = 'verbatim' | 'clean';
type CaptionFormat = 'non-sdh' | 'sdh';
type DeliveryFormat = 'docx' | 'pdf' | 'txt' | 'srt' | 'vtt' | 'scc';

const RATES: Record<ServiceType, number> = { transcription: 0.55, captioning: 0.75 };
const ACCEPTED_TYPES = ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/x-m4a', 'audio/ogg', 'video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'];
const ACCEPTED_EXT = '.mp3,.wav,.mp4,.m4a,.ogg,.mov,.avi,.webm,.aac,.flac';
const MAX_FILE_GB = 1.5;
const MAX_FILE_BYTES = MAX_FILE_GB * 1024 * 1024 * 1024;

interface FormState {
  service: ServiceType;
  minutes: string;
  transcriptType: TranscriptType;
  transcriptStyle: TranscriptStyle;
  captionFormat: CaptionFormat;
  speakerID: boolean;
  timestamps: boolean;
  rushService: boolean;
  deliveryFormat: DeliveryFormat;
  name: string;
  email: string;
  phone: string;
  notes: string;
  file: File | null;
  fileError: string;
  fileLink: string;
}

const INITIAL_STATE: FormState = {
  service: 'transcription',
  minutes: '60',
  transcriptType: 'general',
  transcriptStyle: 'clean',
  captionFormat: 'non-sdh',
  speakerID: false,
  timestamps: false,
  rushService: false,
  deliveryFormat: 'docx',
  name: '',
  email: '',
  phone: '',
  notes: '',
  file: null,
  fileError: '',
  fileLink: '',
};

type Step = 1 | 2 | 3;

export default function QuotePageClient() {
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<Step>(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitError, setSubmitError] = useState('');
  const [jobRef, setJobRef] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const verifiedRef = useRef<{ token: string; file: File } | null>(null);
  const [form, setForm] = useState<FormState>(() => {
    const svc = searchParams.get('service') as ServiceType | null;
    const mins = searchParams.get('minutes');
    return {
      ...INITIAL_STATE,
      service: svc === 'captioning' ? 'captioning' : 'transcription',
      minutes: mins || '60',
    };
  });

  const parsedMinutes = parseFloat(form.minutes);
  const validMinutes = !isNaN(parsedMinutes) && parsedMinutes > 0;
  const estimate = validMinutes ? parsedMinutes * RATES[form.service] : 0;

  const set = useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  // When switching to captioning, reset timestamps (not applicable) and reset delivery format
  useEffect(() => {
    if (form.service === 'captioning') {
      setForm((prev) => ({
        ...prev,
        timestamps: false,
        deliveryFormat: prev.deliveryFormat === 'docx' || prev.deliveryFormat === 'pdf' || prev.deliveryFormat === 'txt' ? 'srt' : prev.deliveryFormat,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        deliveryFormat: prev.deliveryFormat === 'srt' || prev.deliveryFormat === 'vtt' || prev.deliveryFormat === 'scc' ? 'docx' : prev.deliveryFormat,
      }));
    }
  }, [form.service]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) { set('file', null); set('fileError', ''); return; }
    if (!ACCEPTED_TYPES.includes(file.type) && !ACCEPTED_EXT.split(',').some((ext) => file.name.toLowerCase().endsWith(ext.replace('.', '')))) {
      set('file', null); set('fileError', 'Unsupported file type. Please upload MP3, MP4, WAV, M4A, MOV, AVI, OGG or WebM.');
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      set('file', null); set('fileError', `File is too large. Maximum size is ${MAX_FILE_GB}GB.`);
      return;
    }
    set('file', file); set('fileError', '');
  };

  const step1Valid = validMinutes;
  const step2Valid = form.name.trim().length > 1 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      let verifiedToken: string | undefined;
      if (form.file) {
        // Reuse a previously verified upload of the same file on retry
        if (verifiedRef.current && verifiedRef.current.file === form.file) {
          verifiedToken = verifiedRef.current.token;
        } else {
          setUploadProgress(0);
          const up = await uploadFileToR2(form.file, (f) => setUploadProgress(Math.min(1, f)));
          verifiedRef.current = { token: up.verifiedToken, file: form.file };
          verifiedToken = up.verifiedToken;
          setUploadProgress(1);
        }
      }
      const res = await submitQuote({
        service: form.service,
        minutes: parsedMinutes,
        transcriptType: form.transcriptType,
        transcriptStyle: form.transcriptStyle,
        captionFormat: form.captionFormat,
        speakerID: form.speakerID,
        timestamps: form.timestamps,
        rushService: form.rushService,
        deliveryFormat: form.deliveryFormat,
        name: form.name,
        email: form.email,
        phone: form.phone,
        notes: form.notes,
        fileLink: form.fileLink,
        verifiedToken,
        hp_field: honeypot,
      });
      setJobRef(res.jobRef);
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

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background pt-28 pb-20 px-6">
        <div className="max-w-lg w-full text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto">
            <Icon name="CheckCircleIcon" size={32} className="text-primary" />
          </div>
          <h1 className="text-2xl font-800 text-foreground">Quote request received!</h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            Thank you, {form.name.split(' ')[0]}. I&apos;ve received your project details and will personally
            review them and get back to you at <strong className="text-foreground">{form.email}</strong> with
            a confirmed quote before any work begins.
          </p>
          <div className="bg-card border border-border rounded-2xl p-6 text-left space-y-2">
            <p className="text-xs font-700 uppercase tracking-wider text-muted-foreground mb-3">Your Request Summary</p>
            <SummaryRow label="Service" value={form.service === 'transcription' ? 'Transcription' : 'Captioning'} />
            <SummaryRow label="Duration" value={`${parsedMinutes} minutes`} />
            {jobRef && <SummaryRow label="Job reference" value={jobRef} />}
            <SummaryRow label="Estimated starting price" value={`$${estimate.toFixed(2)}`} highlight />
            {form.file && <SummaryRow label="File uploaded" value={form.file.name} />}
            {form.fileLink && <SummaryRow label="File link" value={form.fileLink} />}
          </div>
          <p className="text-sm text-muted-foreground">
            Questions? Email me directly at{' '}
            <a href="mailto:tim@accu-script.com" className="text-primary font-600 hover:underline">tim@accu-script.com</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 bg-background min-h-screen">
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <div className="text-center space-y-3 mb-12">
          <span className="pill-badge">Request a Quote</span>
          <h1 className="text-section-title text-foreground">
            Tell me about your project
          </h1>
          <p className="text-base text-muted-foreground max-w-xl mx-auto">
            Fill in the details below. I&apos;ll personally review your project and confirm the final
            price before starting any work.
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {([1, 2, 3] as Step[]).map((s) => (
            <React.Fragment key={s}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-700 transition-all ${
                  step === s
                    ? 'bg-primary text-primary-foreground'
                    : step > s
                    ? 'bg-secondary text-primary border border-primary' :'bg-muted text-muted-foreground border border-border'
                }`}
              >
                {step > s ? <Icon name="CheckIcon" size={14} /> : s}
              </div>
              {s < 3 && <div className={`flex-1 max-w-[80px] h-px ${step > s ? 'bg-primary' : 'bg-border'}`} />}
            </React.Fragment>
          ))}
        </div>
        <div className="flex justify-center gap-12 mb-10 text-xs font-600 text-muted-foreground">
          <span className={step === 1 ? 'text-primary' : ''}>Project Details</span>
          <span className={step === 2 ? 'text-primary' : ''}>Your Info</span>
          <span className={step === 3 ? 'text-primary' : ''}>Review & Submit</span>
        </div>

        <form onSubmit={handleSubmit}>
          {/* ── STEP 1: Project Details ── */}
          {step === 1 && (
            <div className="bg-card border border-border rounded-3xl p-8 space-y-8">
              <h2 className="text-base font-700 text-foreground">Step 1: Project Details</h2>

              {/* Service */}
              <div>
                <label className="block text-sm font-700 text-foreground mb-3">Service *</label>
                <div className="flex gap-3 flex-wrap">
                  {(['transcription', 'captioning'] as ServiceType[]).map((s) => (
                    <button type="button" key={s} onClick={() => set('service', s)}
                      className={`px-6 py-3 rounded-full text-sm font-700 border transition-all min-h-[44px] ${form.service === s ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-foreground border-border hover:border-primary'}`}>
                      {s === 'transcription' ? 'Transcription' : 'Captioning'}
                      <span className="ml-2 text-xs opacity-70">${RATES[s].toFixed(2)}/min</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div>
                <label htmlFor="q-minutes" className="block text-sm font-700 text-foreground mb-3">
                  Approximate Duration (minutes) *
                </label>
                <input id="q-minutes" type="number" min="1" step="0.5" value={form.minutes}
                  onChange={(e) => set('minutes', e.target.value)}
                  className="w-48 px-4 py-3 border border-border rounded-xl text-sm font-500 bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all" />
                {validMinutes && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Estimated starting price: <strong className="text-primary">${estimate.toFixed(2)}</strong>
                    {' '}(${RATES[form.service].toFixed(2)}/min × {parsedMinutes} min)
                  </p>
                )}
              </div>

              {/* Transcription-specific options */}
              {form.service === 'transcription' && (
                <>
                  {/* Transcript Type: General or Legal */}
                  <div>
                    <label className="block text-sm font-700 text-foreground mb-3">Transcript Type</label>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {([
                        { val: 'general' as TranscriptType, label: 'General', desc: 'Conversational, business, education, research and general use' },
                        { val: 'legal' as TranscriptType, label: 'Legal', desc: 'Legal proceedings, depositions, court hearings and legal documents' },
                      ]).map((opt) => (
                        <button type="button" key={opt.val}
                          onClick={() => set('transcriptType', opt.val)}
                          className={`text-left px-4 py-3 rounded-xl border text-sm transition-all min-h-[44px] ${form.transcriptType === opt.val ? 'border-primary bg-secondary' : 'border-border hover:border-primary/50'}`}>
                          <span className="font-700 text-foreground block">{opt.label}</span>
                          <span className="text-xs text-muted-foreground">{opt.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Transcription Style: Verbatim or Clean Read */}
                  <div>
                    <label className="block text-sm font-700 text-foreground mb-3">Transcription Style</label>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {([
                        { val: 'verbatim' as TranscriptStyle, label: 'Verbatim', desc: 'Every word captured including filler words, false starts and repetitions' },
                        { val: 'clean' as TranscriptStyle, label: 'Clean Read', desc: 'Edited for readability — filler words removed, grammar cleaned up' },
                      ]).map((opt) => (
                        <button type="button" key={opt.val}
                          onClick={() => set('transcriptStyle', opt.val)}
                          className={`text-left px-4 py-3 rounded-xl border text-sm transition-all min-h-[44px] ${form.transcriptStyle === opt.val ? 'border-primary bg-secondary' : 'border-border hover:border-primary/50'}`}>
                          <span className="font-700 text-foreground block">{opt.label}</span>
                          <span className="text-xs text-muted-foreground">{opt.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Captioning-specific options */}
              {form.service === 'captioning' && (
                <div>
                  <label className="block text-sm font-700 text-foreground mb-3">Caption Type</label>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {([
                      { val: 'non-sdh' as CaptionFormat, label: 'Non-SDH Captions', desc: 'Spoken dialogue only' },
                      { val: 'sdh' as CaptionFormat, label: 'SDH Captions', desc: 'Includes sound effects, music cues, speaker ID' },
                    ]).map((opt) => (
                      <button type="button" key={opt.val}
                        onClick={() => set('captionFormat', opt.val)}
                        className={`text-left px-4 py-3 rounded-xl border text-sm transition-all min-h-[44px] ${form.captionFormat === opt.val ? 'border-primary bg-secondary' : 'border-border hover:border-primary/50'}`}>
                        <span className="font-700 text-foreground block">{opt.label}</span>
                        <span className="text-xs text-muted-foreground">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Options */}
              <div>
                <label className="block text-sm font-700 text-foreground mb-3">Additional Options</label>
                <div className="space-y-3">
                  {/* Speaker Identification — always shown, but description changes by service */}
                  <label className="flex items-start gap-3 cursor-pointer group min-h-[44px]">
                    <div
                      onClick={() => set('speakerID', !form.speakerID)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all cursor-pointer ${form.speakerID ? 'bg-primary border-primary' : 'border-border group-hover:border-primary'}`}
                    >
                      {form.speakerID && <Icon name="CheckIcon" size={12} className="text-primary-foreground" />}
                    </div>
                    <div>
                      <span className="text-sm font-600 text-foreground">
                        Speaker Identification{' '}
                        <span className="text-green-600 font-700">(Free)</span>
                      </span>
                      <span className="text-xs text-muted-foreground block">
                        {form.service === 'captioning' ?'Identify and label each speaker in the captions so viewers know who is speaking — ideal for interviews, panels and multi-speaker videos' :'Label each speaker separately throughout the transcript'}
                      </span>
                    </div>
                  </label>

                  {/* Timestamps — only shown for transcription */}
                  {form.service === 'transcription' && (
                    <label className="flex items-start gap-3 cursor-pointer group min-h-[44px]">
                      <div
                        onClick={() => set('timestamps', !form.timestamps)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all cursor-pointer ${form.timestamps ? 'bg-primary border-primary' : 'border-border group-hover:border-primary'}`}
                      >
                        {form.timestamps && <Icon name="CheckIcon" size={12} className="text-primary-foreground" />}
                      </div>
                      <div>
                        <span className="text-sm font-600 text-foreground">
                          Timestamps{' '}
                          <span className="text-green-600 font-700">(Free)</span>
                        </span>
                        <span className="text-xs text-muted-foreground block">Add time markers throughout the transcript</span>
                      </div>
                    </label>
                  )}

                  {/* Rush Service — always shown */}
                  <label className="flex items-start gap-3 cursor-pointer group min-h-[44px]">
                    <div
                      onClick={() => set('rushService', !form.rushService)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all cursor-pointer ${form.rushService ? 'bg-primary border-primary' : 'border-border group-hover:border-primary'}`}
                    >
                      {form.rushService && <Icon name="CheckIcon" size={12} className="text-primary-foreground" />}
                    </div>
                    <div>
                      <span className="text-sm font-600 text-foreground">Rush Service</span>
                      <span className="text-xs text-muted-foreground block">Faster turnaround (subject to availability and additional fee)</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Delivery format */}
              <div>
                <label className="block text-sm font-700 text-foreground mb-3">Preferred Delivery Format</label>
                <div className="flex flex-wrap gap-2">
                  {(form.service === 'transcription'
                    ? ['docx', 'pdf', 'txt'] as DeliveryFormat[]
                    : ['srt', 'vtt', 'scc'] as DeliveryFormat[]
                  ).map((fmt) => (
                    <button type="button" key={fmt}
                      onClick={() => set('deliveryFormat', fmt)}
                      className={`px-4 py-2 rounded-full text-xs font-700 border transition-all min-h-[36px] uppercase ${form.deliveryFormat === fmt ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-foreground hover:border-primary'}`}>
                      .{fmt}
                    </button>
                  ))}
                </div>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-700 text-foreground mb-3">Upload Your File <span className="text-muted-foreground font-400">(optional)</span></label>
                <div
                  className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all hover:border-primary ${form.fileError ? 'border-red-400' : 'border-border'}`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input ref={fileInputRef} type="file" accept={ACCEPTED_EXT} onChange={handleFileChange} className="hidden" />
                  {form.file ? (
                    <div className="space-y-2">
                      <Icon name="DocumentCheckIcon" size={28} className="text-primary mx-auto" />
                      <p className="text-sm font-700 text-foreground">{form.file.name}</p>
                      <p className="text-xs text-muted-foreground">{(form.file.size / 1024 / 1024).toFixed(1)} MB</p>
                      <button type="button" onClick={(e) => { e.stopPropagation(); set('file', null); set('fileError', ''); }}
                        className="text-xs text-red-500 hover:underline">Remove file</button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Icon name="ArrowUpTrayIcon" size={28} className="text-muted-foreground mx-auto" />
                      <p className="text-sm font-600 text-foreground">Click to upload your audio or video file</p>
                      <p className="text-xs text-muted-foreground">MP3, MP4, WAV, M4A, MOV, AVI, OGG, WebM · Max {MAX_FILE_GB}GB</p>
                    </div>
                  )}
                </div>
                {form.fileError && (
                  <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                    <Icon name="ExclamationCircleIcon" size={14} />{form.fileError}
                  </p>
                )}

                {/* Optional file link */}
                <div className="mt-4">
                  <label htmlFor="q-filelink" className="block text-sm font-600 text-foreground mb-1">
                    Or paste a file link <span className="text-muted-foreground font-400">(optional)</span>
                  </label>
                  <p className="text-xs text-muted-foreground mb-2">
                    If you can&apos;t upload directly, paste a Google Drive, Dropbox, WeTransfer or any other sharing link below.
                  </p>
                  <input
                    id="q-filelink"
                    type="url"
                    value={form.fileLink}
                    onChange={(e) => set('fileLink', e.target.value)}
                    placeholder="https://drive.google.com/... or https://www.dropbox.com/..."
                    className="w-full px-4 py-3 border border-border rounded-xl text-sm font-500 bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>
              </div>

              <button type="button" onClick={() => step1Valid && setStep(2)} disabled={!step1Valid}
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-4 rounded-full text-sm font-700 hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed min-h-[52px]">
                Continue to Contact Info <Icon name="ArrowRightIcon" size={16} />
              </button>
            </div>
          )}

          {/* ── STEP 2: Contact Info ── */}
          {step === 2 && (
            <div className="bg-card border border-border rounded-3xl p-8 space-y-6">
              <h2 className="text-base font-700 text-foreground">Step 2: Your Contact Information</h2>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="q-name" className="block text-sm font-700 text-foreground mb-2">Full Name *</label>
                  <input id="q-name" type="text" value={form.name} onChange={(e) => set('name', e.target.value)}
                    placeholder="Your full name"
                    className="w-full px-4 py-3 border border-border rounded-xl text-sm font-500 bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all" />
                </div>
                <div>
                  <label htmlFor="q-email" className="block text-sm font-700 text-foreground mb-2">Email Address *</label>
                  <input id="q-email" type="email" value={form.email} onChange={(e) => set('email', e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 border border-border rounded-xl text-sm font-500 bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all" />
                </div>
              </div>

              <div>
                <label htmlFor="q-phone" className="block text-sm font-700 text-foreground mb-2">Phone (optional)</label>
                <input id="q-phone" type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)}
                  placeholder="(555) 000-0000"
                  className="w-full sm:w-64 px-4 py-3 border border-border rounded-xl text-sm font-500 bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all" />
              </div>

              <div>
                <label htmlFor="q-notes" className="block text-sm font-700 text-foreground mb-2">
                  Project Notes (optional)
                </label>
                <textarea id="q-notes" rows={4} value={form.notes} onChange={(e) => set('notes', e.target.value)}
                  placeholder="Tell me about your project: industry, number of speakers, any special terminology, specific formatting requirements, deadline or anything else I should know..."
                  className="w-full px-4 py-3 border border-border rounded-xl text-sm font-500 bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none" />
              </div>

              <div className="flex gap-3 flex-wrap">
                <button type="button" onClick={() => setStep(1)}
                  className="flex items-center gap-2 border border-border text-foreground px-6 py-3 rounded-full text-sm font-700 hover:bg-secondary transition-colors min-h-[44px]">
                  <Icon name="ArrowLeftIcon" size={16} /> Back
                </button>
                <button type="button" onClick={() => step2Valid && setStep(3)} disabled={!step2Valid}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-full text-sm font-700 hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed min-h-[44px]">
                  Review & Submit <Icon name="ArrowRightIcon" size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Review & Submit ── */}
          {step === 3 && (
            <div className="relative bg-card border border-border rounded-3xl p-8 space-y-6">
              <h2 className="text-base font-700 text-foreground">Step 3: Review Your Request</h2>

              <div className="bg-muted rounded-2xl p-6 space-y-2">
                <p className="text-xs font-700 uppercase tracking-wider text-muted-foreground mb-4">Project Summary</p>
                <SummaryRow label="Service" value={form.service === 'transcription' ? 'Transcription' : 'Captioning'} />
                <SummaryRow label="Duration" value={`${parsedMinutes} minutes`} />
                {form.service === 'transcription' && (
                  <>
                    <SummaryRow label="Transcript Type" value={form.transcriptType === 'general' ? 'General' : 'Legal'} />
                    <SummaryRow label="Style" value={form.transcriptStyle === 'verbatim' ? 'Verbatim' : 'Clean Read'} />
                  </>
                )}
                {form.service === 'captioning' && (
                  <SummaryRow label="Caption Type" value={form.captionFormat === 'sdh' ? 'SDH Captions' : 'Non-SDH Captions'} />
                )}
                <SummaryRow label="Speaker Identification" value={form.speakerID ? 'Yes' : 'No'} />
                {form.service === 'transcription' && (
                  <SummaryRow label="Timestamps" value={form.timestamps ? 'Yes' : 'No'} />
                )}
                <SummaryRow label="Rush Service" value={form.rushService ? 'Requested' : 'No'} />
                <SummaryRow label="Delivery Format" value={`.${form.deliveryFormat.toUpperCase()}`} />
                {form.file && <SummaryRow label="File" value={form.file.name} />}
                {form.fileLink && <SummaryRow label="File Link" value={form.fileLink} />}
                <div className="border-t border-border pt-3 mt-3">
                  <SummaryRow label="Estimated Starting Price" value={`$${estimate.toFixed(2)}`} highlight />
                </div>
              </div>

              <div className="bg-muted rounded-2xl p-6 space-y-2">
                <p className="text-xs font-700 uppercase tracking-wider text-muted-foreground mb-4">Your Information</p>
                <SummaryRow label="Name" value={form.name} />
                <SummaryRow label="Email" value={form.email} />
                {form.phone && <SummaryRow label="Phone" value={form.phone} />}
                {form.notes && <SummaryRow label="Notes" value={form.notes} />}
              </div>

              <div className="bg-secondary border border-primary/20 rounded-xl p-4">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">What happens next:</strong> I&apos;ll personally review your project details and
                  get back to you at <strong className="text-foreground">{form.email}</strong> with a confirmed quote. No work begins
                  until you approve the final price. The estimate shown is the starting price and may vary based on
                  audio quality, speakers, formatting and other requirements.
                </p>
              </div>

              {/* Honeypot (hidden from real users) */}
              <input
                type="text"
                name="hp_field"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                className="absolute -left-[9999px] h-0 w-0 opacity-0"
              />

              {submitting && form.file && uploadProgress < 1 && (
                <div role="status" aria-live="polite">
                  <div className="flex justify-between text-xs font-600 text-foreground mb-2">
                    <span>Uploading {form.file.name}…</span>
                    <span>{Math.round(uploadProgress * 100)}%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all" style={{ width: `${Math.round(uploadProgress * 100)}%` }} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Please keep this page open until the upload finishes.</p>
                </div>
              )}
              {submitting && (!form.file || uploadProgress >= 1) && (
                <p className="text-xs text-muted-foreground" role="status">Sending your request…</p>
              )}

              {submitError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 flex items-start gap-2" role="alert">
                  <Icon name="ExclamationCircleIcon" size={16} className="mt-0.5 flex-shrink-0" />
                  <span>{submitError} Your details are still here — press the button to retry.</span>
                </div>
              )}

              <div className="flex gap-3 flex-wrap">
                <button type="button" onClick={() => setStep(2)} disabled={submitting}
                  className="flex items-center gap-2 border border-border text-foreground px-6 py-3 rounded-full text-sm font-700 hover:bg-secondary transition-colors min-h-[44px] disabled:opacity-40">
                  <Icon name="ArrowLeftIcon" size={16} /> Back
                </button>
                <button type="submit" disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-full text-sm font-700 hover:bg-accent transition-colors min-h-[44px] disabled:opacity-60 disabled:cursor-not-allowed">
                  {submitting ? 'Submitting…' : submitError ? 'Retry Submit' : 'Submit Quote Request'} <Icon name="PaperAirplaneIcon" size={16} />
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Direct contact fallback */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Prefer to reach out directly?{' '}
            <a href="mailto:tim@accu-script.com" className="text-primary font-700 hover:underline">
              Email Tim at tim@accu-script.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <span className="text-muted-foreground font-500 flex-shrink-0">{label}</span>
      <span className={`font-700 text-right ${highlight ? 'text-primary text-base' : 'text-foreground'}`}>{value}</span>
    </div>
  );
}