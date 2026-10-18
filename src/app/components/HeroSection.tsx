'use client';
import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

const floatingCards = [
  {
    id: 1,
    label: 'Legal Transcript',
    lines: [
      { speaker: 'Q:', text: 'Can you state your name for the record?' },
      { speaker: 'A:', text: 'Yes. My name is James R. Whitfield.' },
      { speaker: 'Q:', text: 'And where were you on the evening of—' },
    ],
    badge: 'Legal',
    badgeColor: 'bg-primary text-primary-foreground',
    floatClass: 'float-card-1',
  },
  {
    id: 2,
    label: 'Caption Preview',
    lines: [
      { speaker: '[SPEAKER 1]:', text: 'Welcome back to the podcast.' },
      { speaker: '[Music]', text: '♪ Intro theme ♪' },
      { speaker: '[SPEAKER 2]:', text: "Thanks for having me, it's great—" },
    ],
    badge: 'SDH Caption',
    badgeColor: 'bg-secondary text-secondary-foreground',
    floatClass: 'float-card-2',
  },
  {
    id: 3,
    label: 'Accuracy Check',
    content: (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
          <span className="text-xs text-muted-foreground">Speaker identified</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
          <span className="text-xs text-muted-foreground">Timestamps verified</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
          <span className="text-xs text-muted-foreground">Formatting applied</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
          <span className="text-xs font-600 text-foreground">Human review: Done</span>
        </div>
      </div>
    ),
    badge: 'QC',
    badgeColor: 'bg-primary text-primary-foreground',
    floatClass: 'float-card-3',
  },
];

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef?.current;
    if (!el) return;
    const items = el?.querySelectorAll<HTMLElement>('.reveal-hidden');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
          }
        });
      },
      { threshold: 0.1 }
    );
    items?.forEach((item) => observer?.observe(item));
    return () => observer?.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[90vh] flex items-center pt-28 pb-16 overflow-hidden bg-background"
      aria-label="Hero"
    >
      {/* Subtle blue tint background area */}
      <div className="absolute inset-0 bg-secondary opacity-30 pointer-events-none" aria-hidden="true" />

      {/* Vertical decorative text */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-3" aria-hidden="true">
        <span className="vertical-text text-[9px] font-700 uppercase tracking-[0.5em] text-muted-foreground opacity-40">
          Human Reviewed
        </span>
        <div className="w-px h-20 bg-border" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full">
        <div className="grid lg:grid-cols-12 gap-10 xl:gap-14 items-center">
          {/* Left: Text content */}
          <div className="lg:col-span-6 space-y-7">
            <div className="reveal-hidden stagger-1 space-y-5">
              <h1 className="text-4xl sm:text-5xl xl:text-6xl font-800 leading-[1.08] tracking-tight text-foreground">
                Your words <span className="text-primary">matter.</span>
                <br />
                I&apos;ll make sure they&apos;re captured properly.
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
                Professional transcription and captioning, human-reviewed on every project.
                We help legal professionals, educators, researchers, businesses and content
                creators turn audio and video into accurate, organized and usable text.
              </p>
            </div>

            <div className="reveal-hidden stagger-2 flex flex-wrap gap-3">
              <Link
                href="/request-a-quote"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-4 rounded-full text-sm font-700 hover:bg-accent transition-colors shadow-sm"
              >
                Request a Quote
                <Icon name="ArrowRightIcon" size={16} />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 border border-border text-foreground bg-background px-7 py-4 rounded-full text-sm font-700 hover:bg-secondary transition-colors"
              >
                Get an Estimate
              </Link>
            </div>

            <div className="reveal-hidden stagger-3 grid grid-cols-3 gap-3 max-w-xl pt-2">
              <div className="bg-card border border-border rounded-2xl px-4 py-4 text-center">
                <p className="text-2xl font-800 text-primary">$0.55</p>
                <p className="text-xs text-muted-foreground font-500 mt-1">per audio min<br />transcription</p>
              </div>
              <div className="bg-card border border-border rounded-2xl px-4 py-4 text-center">
                <p className="text-2xl font-800 text-primary">$0.75</p>
                <p className="text-xs text-muted-foreground font-500 mt-1">per minute<br />captioning</p>
              </div>
              <div className="bg-card border border-border rounded-2xl px-4 py-4 text-center">
                <p className="text-2xl font-800 text-foreground">100%</p>
                <p className="text-xs text-muted-foreground font-500 mt-1">human<br />reviewed</p>
              </div>
            </div>
          </div>

          {/* Right: Floating transcript cards */}
          <div className="lg:col-span-6 relative h-[500px] hidden lg:block">
            {/* Card 1 — top left */}
            <div
              className={`float-card-1 absolute top-0 left-0 bg-card border border-border rounded-2xl p-5 w-72 shadow-md`}
              aria-hidden="true"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-700 text-muted-foreground uppercase tracking-wider">
                  {floatingCards?.[0]?.label}
                </span>
                <span className={`pill-badge pill-badge-primary text-[10px]`}>
                  {floatingCards?.[0]?.badge}
                </span>
              </div>
              <div className="transcript-document space-y-1">
                {floatingCards?.[0]?.lines?.map((line, i) => (
                  <p key={i} className="text-foreground">
                    <span className="font-700 text-primary">{line?.speaker}</span>{' '}
                    {line?.text}
                  </p>
                ))}
              </div>
            </div>

            {/* Card 2 — bottom right */}
            <div
              className={`float-card-2 absolute bottom-20 right-0 bg-card border border-border rounded-2xl p-5 w-72 shadow-md`}
              aria-hidden="true"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-700 text-muted-foreground uppercase tracking-wider">
                  {floatingCards?.[1]?.label}
                </span>
                <span className="pill-badge text-[10px]">
                  {floatingCards?.[1]?.badge}
                </span>
              </div>
              <div className="transcript-document space-y-1">
                {floatingCards?.[1]?.lines?.map((line, i) => (
                  <p key={i} className={`${line?.speaker === '[Music]' ? 'italic text-muted-foreground' : 'text-foreground'}`}>
                    <span className="font-700 text-primary">{line?.speaker}</span>{' '}
                    {line?.text}
                  </p>
                ))}
              </div>
            </div>

            {/* Card 3 — center right */}
            <div
              className={`float-card-3 absolute top-1/2 -translate-y-1/2 right-8 bg-card border border-border rounded-2xl p-5 w-60 shadow-md`}
              aria-hidden="true"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-700 text-muted-foreground uppercase tracking-wider">
                  {floatingCards?.[2]?.label}
                </span>
                <span className="pill-badge pill-badge-primary text-[10px]">
                  {floatingCards?.[2]?.badge}
                </span>
              </div>
              {floatingCards?.[2]?.content}
            </div>

            {/* Center connecting line decoration */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-2 border-primary flex items-center justify-center bg-background shadow-sm">
              <Icon name="DocumentTextIcon" size={28} className="text-primary" />
            </div>
          </div>
        </div>

        {/* Mobile stat bar */}
        <div className="lg:hidden flex items-center justify-around mt-10 py-5 border-t border-border">
          <div className="text-center">
            <p className="text-xl font-800 text-primary">$0.55</p>
            <p className="text-xs text-muted-foreground">Transcription/min</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="text-center">
            <p className="text-xl font-800 text-primary">$0.75</p>
            <p className="text-xs text-muted-foreground">Captioning/min</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="text-center">
            <p className="text-xl font-800 text-foreground">100%</p>
            <p className="text-xs text-muted-foreground">Human reviewed</p>
          </div>
        </div>
      </div>
    </section>
  );
}