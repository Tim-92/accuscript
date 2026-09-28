'use client';
import React, { useEffect, useRef } from 'react';
import Icon from '@/components/ui/AppIcon';

const steps = [
  {
    number: '01',
    icon: 'ClipboardDocumentListIcon',
    title: 'Tell Me What You Need',
    description:
      'Select transcription or captioning, describe your project, and let me know any special requirements such as formatting, speaker identification, timestamps or turnaround time.',
  },
  {
    number: '02',
    icon: 'ArrowUpTrayIcon',
    title: 'Upload Your Recording',
    description:
      'Upload your audio or video file securely through the website. I accept all common formats including MP3, MP4, WAV, M4A, MOV and more.',
  },
  {
    number: '03',
    icon: 'MagnifyingGlassIcon',
    title: 'I Review the Project',
    description:
      'I personally review the recording, duration, audio quality, number of speakers and your requirements before confirming the final quote.',
  },
  {
    number: '04',
    icon: 'PencilSquareIcon',
    title: 'I Transcribe, Caption & Review',
    description:
      'The recording is processed and I personally review and prepare the final work—verifying accuracy, formatting, speaker labels and caption timing.',
  },
  {
    number: '05',
    icon: 'CheckBadgeIcon',
    title: 'Receive Your Files',
    description:
      'Download or receive your completed files in the agreed format. I deliver clean, ready-to-use transcripts and captions on time.',
  },
];

export default function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null);

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
      { threshold: 0.1 }
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-background" id="how-it-works">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center space-y-3 mb-16 reveal-hidden stagger-1">
          <span className="pill-badge">How It Works</span>
          <h2 className="text-section-title text-foreground">Simple. Personal. Reliable.</h2>
          <p className="text-base text-muted-foreground max-w-lg mx-auto">
            Every project follows the same straightforward five-step process. No surprises.
          </p>
        </div>

        {/* Steps — asymmetric layout */}
        <div className="relative">
          {/* Vertical connector line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-border hidden md:block" aria-hidden="true" />

          <div className="space-y-10">
            {steps.map((step, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div
                  key={step.number}
                  className={`reveal-hidden stagger-${(i % 5) + 1} relative flex flex-col md:flex-row items-start md:items-center gap-6 ${
                    isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Content card */}
                  <div className={`flex-1 ${isLeft ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'}`}>
                    <div
                      className={`bg-card border border-border rounded-2xl p-6 inline-block w-full md:max-w-sm card-hover ${
                        isLeft ? 'md:ml-auto' : 'md:mr-auto'
                      }`}
                    >
                      <div className={`flex items-center gap-3 mb-3 ${isLeft ? 'md:flex-row-reverse' : ''}`}>
                        <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                          <Icon name={step.icon as Parameters<typeof Icon>[0]['name']} size={18} className="text-primary" />
                        </div>
                        <h3 className="text-sm font-700 text-foreground">{step.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                    </div>
                  </div>

                  {/* Center number node */}
                  <div className="hidden md:flex w-16 h-16 rounded-full bg-primary text-primary-foreground items-center justify-center font-800 text-sm flex-shrink-0 z-10 shadow-md">
                    {step.number}
                  </div>

                  {/* Mobile number */}
                  <div className="md:hidden flex items-center gap-3 mb-1">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-800 text-xs">
                      {step.number}
                    </div>
                  </div>

                  {/* Empty flex spacer for opposite side */}
                  <div className="hidden md:block flex-1" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}