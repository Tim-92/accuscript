'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Icon from '@/components/ui/AppIcon';

interface FAQItem {
  q: string;
  a: string;
}

interface FAQCategory {
  id: string;
  label: string;
  icon: string;
  items: FAQItem[];
}

const faqCategories: FAQCategory[] = [
  {
    id: 'ai',
    label: 'AI & Human Review',
    icon: 'CpuChipIcon',
    items: [
      {
        q: 'Do you use AI?',
        a: "Yes — I use AI-assisted tools as part of my workflow to work efficiently. But I don't send clients raw, unreviewed machine output. Every transcript and caption I deliver has been personally reviewed and prepared by me. AI is part of the process. It isn't the product.",
      },
      {
        q: 'Are transcripts reviewed by a human?',
        a: "Yes. Every single project is personally reviewed by me. I verify accuracy, formatting, speaker identification, terminology and readability before delivering the finished work. You are not receiving a rough draft — you are receiving a finished, reviewed document.",
      },
      {
        q: 'Why should I pay for transcription when AI can do it for free?',
        a: "Free AI transcription can produce a rough draft quickly, but it regularly makes mistakes with names, numbers, terminology, speaker identification, punctuation and context. For legal, insurance, professional or public-facing work, those errors matter. You are paying me to take responsibility for a finished, accurate, properly formatted document — not a rough draft you have to fix yourself.",
      },
      {
        q: "What does \"human-reviewed\" actually mean?",
        a: "It means I personally listen to or watch your recording while reviewing the transcript or captions. I correct errors, verify speaker labels, check terminology, apply your requested formatting and ensure the final file is ready to use. I don't just run a spell-check and call it done.",
      },
    ],
  },
  {
    id: 'pricing',
    label: 'Pricing & Rates',
    icon: 'CurrencyDollarIcon',
    items: [
      {
        q: 'What is your transcription rate?',
        a: "Transcription starts at $0.55 per audio minute. The final price is confirmed with you before work begins and may vary based on audio quality, number of speakers, turnaround time, formatting requirements, timestamps and project complexity.",
      },
      {
        q: 'What is your captioning rate?',
        a: "Captioning starts at $0.75 per minute. The final price is confirmed with you before work begins and may vary based on the type of captions required (Non-SDH or SDH), number of speakers, turnaround time and project complexity.",
      },
      {
        q: 'Why might the final price differ from the starting rate?',
        a: "The starting rates apply to straightforward projects with clear audio and a single speaker. Projects with multiple speakers, poor audio quality, heavy background noise, specialized terminology, rush turnaround, timestamps, SDH caption requirements or custom formatting may be priced higher. I always confirm the final price before starting any work.",
      },
      {
        q: 'Can I get an estimate before committing?',
        a: "Yes. Use the pricing calculator on the homepage or the Pricing page to get an instant estimate based on your project duration. You can also request a formal quote through the Request a Quote page, where I'll review your project details and confirm a price before any work begins.",
      },
      {
        q: 'Can I request a custom quote?',
        a: "Absolutely. Every project is different. Use the Request a Quote page to describe your project and I'll review it and confirm a price before starting any work. There's no obligation until you approve the quote.",
      },
    ],
  },
  {
    id: 'formats',
    label: 'File Formats',
    icon: 'DocumentTextIcon',
    items: [
      {
        q: 'What audio and video file formats do you accept?',
        a: "I accept most common audio and video formats, including MP3, MP4, WAV, M4A, MOV, AAC, FLAC, OGG, WMA, AVI and more. If you're unsure whether your format is supported, just ask before uploading. I can usually work with any format that plays on a standard media player.",
      },
      {
        q: 'What file formats do you deliver?',
        a: "For transcripts, I typically deliver Microsoft Word (.docx) or PDF, depending on your preference. Plain text (.txt) is also available. For captions, I deliver SRT files as standard, with VTT, SCC or other formats available on request. Just let me know your preferred format when placing your order.",
      },
      {
        q: 'What is the difference between legal and general transcription formatting?',
        a: "Legal transcription follows professional formatting conventions used in legal workflows — including case information headers, participant identification, Q&A formatting, page and line references, and precise speaker labeling. General transcription uses a cleaner conversational format with speaker names, paragraphs and readable layout. I can follow your specific formatting requirements or a template you provide.",
      },
      {
        q: 'What is the difference between Non-SDH and SDH captions?',
        a: "Non-SDH (non-Subtitles for the Deaf and Hard of Hearing) captions represent spoken dialogue with standard caption timing. SDH captions additionally include relevant non-speech information such as important sound effects, music cues and speaker identification — making the content accessible to viewers who cannot hear the audio. Visit the Examples page to see a visual demonstration of both.",
      },
    ],
  },
  {
    id: 'delivery',
    label: 'Delivery & Turnaround',
    icon: 'ClockIcon',
    items: [
      {
        q: 'How long does a project take?',
        a: "Turnaround time depends on the length and complexity of your project and my current workload. As a general guide, most standard projects are completed within 1–3 business days. Longer or more complex projects may take longer. I'll give you an estimated delivery time when I confirm your quote.",
      },
      {
        q: 'Do you offer rush services?',
        a: "Rush availability depends on my current workload. Please mention your deadline when requesting a quote and I'll let you know what's possible. Rush projects may be subject to an additional fee.",
      },
      {
        q: 'How will I receive my completed files?',
        a: "I'll deliver your completed files directly to you — typically via a secure download link or email attachment, depending on file size. I'll confirm the delivery method when we discuss your project.",
      },
      {
        q: 'What happens after I submit a quote request?',
        a: "After you submit your project details, I'll review your recording, duration, requirements and any notes you've provided. I'll then confirm the final price and estimated turnaround time. Work begins only after you approve the quote.",
      },
    ],
  },
  {
    id: 'speakers',
    label: 'Speakers & Timestamps',
    icon: 'UserGroupIcon',
    items: [
      {
        q: 'Can you identify speakers?',
        a: "Yes. Speaker identification is available as an option. I can label speakers by name (if provided), by role (e.g., Interviewer / Respondent) or by generic labels (Speaker 1, Speaker 2). Please indicate your preference when placing your order. Projects with multiple speakers or overlapping speech may affect pricing.",
      },
      {
        q: 'Can you add timestamps?',
        a: "Yes. Timestamps can be added at regular intervals (e.g., every 30 seconds or every minute) or at each speaker change, depending on your requirements. Please specify your preferred timestamp format and frequency when placing your order. Timestamps are available as an add-on and may affect the final price.",
      },
      {
        q: 'Can you transcribe verbatim — including filler words and false starts?',
        a: "Yes. I offer both verbatim transcription (capturing every word, filler word, false start and repetition exactly as spoken) and clean/edited transcription (removing filler words and false starts for readability). Please specify which style you need when placing your order.",
      },
    ],
  },
  {
    id: 'security',
    label: 'File Security',
    icon: 'ShieldCheckIcon',
    items: [
      {
        q: 'How are my files handled?',
        a: "I treat every file I receive as confidential. Your recordings and transcripts are used solely for the purpose of completing your project and are not shared with third parties. Files are handled with discretion throughout the process. If you have specific confidentiality requirements — such as for legal or insurance material — please mention them when placing your order.",
      },
      {
        q: 'Is my audio or video stored permanently?',
        a: "No. I do not retain your files indefinitely after a project is completed. If you have specific requirements about file retention or deletion, please let me know and I'll accommodate your request.",
      },
      {
        q: 'Can I send sensitive or confidential recordings?',
        a: "Yes. I regularly work with legal, insurance and business recordings that contain sensitive information. I handle all files with professional discretion. If your project has specific confidentiality requirements, please describe them when placing your order and I'll confirm whether I can accommodate them.",
      },
    ],
  },
  {
    id: 'payment',
    label: 'Payment Options',
    icon: 'CreditCardIcon',
    items: [
      {
        q: 'Can I pay online?',
        a: "Yes. Payment can be made online. I'll confirm payment details when the quote is approved. Payment is required before the completed files are delivered.",
      },
      {
        q: 'When do I pay?',
        a: "Payment is due after the quote is approved and before the completed files are delivered. I'll confirm the payment process when we finalize your project details.",
      },
      {
        q: 'Do you accept payment before starting work?',
        a: "For new clients, payment or a deposit may be required before work begins. I'll confirm the payment arrangement when I send your quote. Returning clients may have different arrangements.",
      },
      {
        q: 'Can I contact you directly with billing questions?',
        a: "Yes. You can reach me directly through the Contact page or by email. I handle all billing personally — there's no accounts department or support queue.",
      },
    ],
  },
];

function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {items.map((faq, i) => (
        <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden">
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between p-5 text-left gap-4 min-h-[60px]"
            aria-expanded={openIndex === i}
          >
            <span className="text-sm font-700 text-foreground leading-snug">{faq.q}</span>
            <span className="flex-shrink-0">
              <Icon
                name={openIndex === i ? 'ChevronUpIcon' : 'ChevronDownIcon'}
                size={16}
                className="text-muted-foreground transition-transform"
              />
            </span>
          </button>
          {openIndex === i && (
            <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function FAQPageClient() {
  const [activeCategory, setActiveCategory] = useState('ai');
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const items = el.querySelectorAll<HTMLElement>('.reveal-hidden');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('reveal-visible');
        });
      },
      { threshold: 0.06 }
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  const activeData = faqCategories.find((c) => c.id === activeCategory);

  return (
    <>
      <div className="noise-overlay" aria-hidden="true" />
      <Header />
      <main ref={sectionRef} className="pt-28 pb-24 bg-background">

        {/* Hero */}
        <section className="max-w-4xl mx-auto px-6 mb-20 text-center">
          <div className="reveal-hidden stagger-1 mb-4">
            <span className="pill-badge">FAQ</span>
          </div>
          <h1 className="reveal-hidden stagger-2 text-section-title text-foreground mb-5">
            Questions before you commit?<br />
            <span className="text-primary">Good. Ask them.</span>
          </h1>
          <p className="reveal-hidden stagger-3 text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Everything you need to know about how I work, what I charge, how your files are handled
            and what to expect — answered honestly, without the marketing fluff.
          </p>
        </section>

        {/* Desktop: Sidebar + Content */}
        <section className="max-w-7xl mx-auto px-6">
          <div className="hidden lg:grid lg:grid-cols-[280px_1fr] gap-10 items-start">

            {/* Sidebar category nav */}
            <aside className="reveal-hidden stagger-1 sticky top-28">
              <p className="text-xs font-700 uppercase tracking-widest text-muted-foreground mb-4 px-1">
                Browse by topic
              </p>
              <nav className="space-y-1">
                {faqCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-600 text-left transition-colors min-h-[44px] ${
                      activeCategory === cat.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                    }`}
                  >
                    <Icon
                      name={cat.icon as Parameters<typeof Icon>[0]['name']}
                      size={18}
                      className="flex-shrink-0"
                    />
                    {cat.label}
                  </button>
                ))}
              </nav>

              {/* Quick contact nudge */}
              <div className="mt-8 bg-secondary border border-border rounded-2xl p-5">
                <p className="text-xs font-700 text-foreground mb-1">Still have a question?</p>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                  Ask me directly. I respond personally.
                </p>
                <Link
                  href="/request-a-quote"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-full text-xs font-700 hover:bg-accent transition-colors w-full justify-center"
                >
                  <Icon name="EnvelopeIcon" size={14} />
                  Contact Tim
                </Link>
              </div>
            </aside>

            {/* FAQ content panel */}
            <div className="reveal-hidden stagger-2">
              {activeData && (
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-secondary border border-border flex items-center justify-center flex-shrink-0">
                      <Icon
                        name={activeData.icon as Parameters<typeof Icon>[0]['name']}
                        size={20}
                        className="text-primary"
                      />
                    </div>
                    <div>
                      <h2 className="text-xl font-700 text-foreground">{activeData.label}</h2>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {activeData.items.length} questions
                      </p>
                    </div>
                  </div>
                  <FAQAccordion items={activeData.items} />
                </div>
              )}
            </div>
          </div>

          {/* Mobile: flat accordion list by category */}
          <div className="lg:hidden space-y-10">
            {faqCategories.map((cat) => (
              <div key={cat.id} className="reveal-hidden stagger-1">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-xl bg-secondary border border-border flex items-center justify-center flex-shrink-0">
                    <Icon
                      name={cat.icon as Parameters<typeof Icon>[0]['name']}
                      size={18}
                      className="text-primary"
                    />
                  </div>
                  <h2 className="text-base font-700 text-foreground">{cat.label}</h2>
                </div>
                <FAQAccordion items={cat.items} />
              </div>
            ))}
          </div>
        </section>

        {/* Trust strip */}
        <section className="max-w-7xl mx-auto px-6 mt-24">
          <div className="reveal-hidden stagger-1 grid sm:grid-cols-3 gap-5">
            {[
              {
                icon: 'UserCircleIcon',
                title: 'One point of contact',
                desc: 'You communicate directly with me from first message to final delivery.',
              },
              {
                icon: 'DocumentCheckIcon',
                title: 'Every project reviewed',
                desc: 'No raw AI output. Every transcript and caption is personally reviewed before delivery.',
              },
              {
                icon: 'ShieldCheckIcon',
                title: 'Confidential handling',
                desc: 'Your files are treated with professional discretion throughout the entire process.',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-card border border-border rounded-2xl p-6 flex gap-4 items-start"
              >
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                  <Icon
                    name={item.icon as Parameters<typeof Icon>[0]['name']}
                    size={20}
                    className="text-primary"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-700 text-foreground mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-4xl mx-auto px-6 mt-20 text-center reveal-hidden stagger-1">
          <div className="bg-primary rounded-3xl p-12">
            <h2 className="text-2xl font-700 text-white mb-3">
              Ready to get started?
            </h2>
            <p className="text-blue-200 text-sm leading-relaxed mb-8 max-w-lg mx-auto">
              Request a quote, estimate your project cost, or send me a message directly.
              I respond personally.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/request-a-quote"
                className="inline-flex items-center gap-2 bg-white text-primary px-7 py-4 rounded-full text-sm font-700 hover:bg-blue-50 transition-colors"
              >
                Request a Quote
                <Icon name="ArrowRightIcon" size={16} />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 border border-blue-400 text-white px-7 py-4 rounded-full text-sm font-700 hover:bg-blue-700 transition-colors"
              >
                See Pricing
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
