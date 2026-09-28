'use client';
import React, { useEffect, useState, useRef } from 'react';

interface CaptionFrame {
  time: number;
  nonSDH: string;
  sdh: string;
  sdhExtra?: string; // additional SDH-only cue
}

const captionScript: CaptionFrame[] = [
  {
    time: 0,
    nonSDH: '',
    sdh: '',
    sdhExtra: '[Upbeat background music]',
  },
  {
    time: 2000,
    nonSDH: "Welcome back, everyone.",
    sdh: "Welcome back, everyone.",
    sdhExtra: '',
  },
  {
    time: 4500,
    nonSDH: "Today we're talking about something\nthat affects all of us.",
    sdh: "Today we're talking about something\nthat affects all of us.",
    sdhExtra: '',
  },
  {
    time: 7500,
    nonSDH: '',
    sdh: '',
    sdhExtra: '[Audience applause]',
  },
  {
    time: 9000,
    nonSDH: "I've been researching this for months,\nand honestly...",
    sdh: "I've been researching this for months,\nand honestly...",
    sdhExtra: '',
  },
  {
    time: 12000,
    nonSDH: "...the results surprised me.",
    sdh: "...the results surprised me.",
    sdhExtra: '',
  },
  {
    time: 14000,
    nonSDH: '',
    sdh: '',
    sdhExtra: '[Laughter from audience]',
  },
  {
    time: 15500,
    nonSDH: "Let me show you the numbers.",
    sdh: "Let me show you the numbers.",
    sdhExtra: '',
  },
  {
    time: 17500,
    nonSDH: '',
    sdh: '',
    sdhExtra: '[Music fades out]',
  },
  {
    time: 19000,
    nonSDH: "First, let's look at the data\nfrom 2023.",
    sdh: "First, let's look at the data\nfrom 2023.",
    sdhExtra: '',
  },
  {
    time: 22000,
    nonSDH: '',
    sdh: '',
    sdhExtra: '[INTERVIEWER]: Can you explain\nwhat this chart shows?',
  },
  {
    time: 24500,
    nonSDH: "Sure. The blue line represents\nmonthly active users.",
    sdh: "Sure. The blue line represents\nmonthly active users.",
    sdhExtra: '',
  },
  {
    time: 27500,
    nonSDH: "And this spike here — that's when\nwe launched the new feature.",
    sdh: "And this spike here — that's when\nwe launched the new feature.",
    sdhExtra: '',
  },
  {
    time: 30500,
    nonSDH: '',
    sdh: '',
    sdhExtra: '[Notification sound]',
  },
  {
    time: 32000,
    nonSDH: "Sorry about that.",
    sdh: "Sorry about that.",
    sdhExtra: '',
  },
  {
    time: 34000,
    nonSDH: "Where were we? Right — the feature launch.",
    sdh: "Where were we? Right — the feature launch.",
    sdhExtra: '',
  },
];

const LOOP_DURATION = 37000;

function VideoFrame({
  label,
  badge,
  badgeColor,
  currentFrame,
  showSDH,
}: {
  label: string;
  badge: string;
  badgeColor: string;
  currentFrame: CaptionFrame | null;
  showSDH: boolean;
}) {
  const [captionKey, setCaptionKey] = useState(0);
  const prevFrameRef = useRef<CaptionFrame | null>(null);

  useEffect(() => {
    if (currentFrame !== prevFrameRef.current) {
      setCaptionKey((k) => k + 1);
      prevFrameRef.current = currentFrame;
    }
  }, [currentFrame]);

  const mainText = currentFrame
    ? showSDH
      ? currentFrame.sdh
      : currentFrame.nonSDH
    : '';
  const extraText = showSDH && currentFrame ? currentFrame.sdhExtra || '' : '';
  const isExtraOnly = !mainText && !!extraText;
  const displayText = isExtraOnly ? extraText : mainText;
  const showExtra = !isExtraOnly && !!extraText;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className={`text-xs font-700 uppercase tracking-widest px-3 py-1 rounded-full ${badgeColor}`}>
          {badge}
        </span>
        <h3 className="text-base font-700 text-foreground">{label}</h3>
      </div>

      {/* Video frame */}
      <div className="rounded-2xl overflow-hidden border border-border shadow-lg bg-slate-900 aspect-video relative select-none">
        {/* Mock video content */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Simulated presenter silhouette */}
          <div className="flex flex-col items-center gap-3 opacity-20">
            <div className="w-16 h-16 rounded-full bg-slate-500" />
            <div className="w-32 h-2 rounded bg-slate-500" />
            <div className="w-24 h-2 rounded bg-slate-500" />
          </div>
          {/* Mock slide/screen area */}
          <div className="absolute right-8 top-8 w-28 h-20 rounded-lg bg-slate-700 border border-slate-600 flex items-center justify-center opacity-30">
            <div className="space-y-1.5 w-16">
              <div className="h-1.5 bg-slate-400 rounded" />
              <div className="h-1.5 bg-slate-400 rounded w-3/4" />
              <div className="h-1.5 bg-slate-400 rounded w-1/2" />
            </div>
          </div>
        </div>

        {/* Caption bar */}
        <div className="absolute bottom-0 left-0 right-0 pb-4 px-4 flex flex-col items-center gap-1 min-h-[80px] justify-end">
          {displayText ? (
            <div
              key={captionKey}
              className="caption-fade-in text-center"
            >
              {showExtra && (
                <div className="text-yellow-300 text-xs font-600 mb-1 bg-black/70 px-3 py-1 rounded-md inline-block">
                  {extraText}
                </div>
              )}
              <div
                className={`bg-black/80 px-4 py-2 rounded-lg text-sm font-500 leading-snug whitespace-pre-line text-center ${
                  isExtraOnly ? 'text-yellow-300' : 'text-white'
                }`}
              >
                {displayText}
              </div>
            </div>
          ) : (
            <div className="h-10" />
          )}
        </div>

        {/* Play indicator */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/50 rounded-full px-2.5 py-1">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-white text-xs font-600">LIVE</span>
        </div>

        {/* CC badge */}
        <div className="absolute top-3 right-3 bg-black/60 rounded px-2 py-0.5">
          <span className="text-white text-xs font-700 tracking-wide">CC</span>
        </div>
      </div>
    </div>
  );
}

export default function CaptionTypesSection() {
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setPlaying(true);
        else setPlaying(false);
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!playing) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      startRef.current = null;
      return;
    }

    const animate = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const e = (ts - startRef.current) % LOOP_DURATION;
      setElapsed(e);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing]);

  // Find current active frame
  const currentFrame = captionScript.reduce<CaptionFrame | null>((acc, frame) => {
    if (elapsed >= frame.time) return frame;
    return acc;
  }, null);

  // Progress bar
  const progress = (elapsed / LOOP_DURATION) * 100;

  return (
    <section ref={sectionRef} className="py-16 border-t border-border">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-0.5 bg-primary" />
            <span className="text-xs font-700 uppercase tracking-widest text-primary">
              Caption Types
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2 className="text-3xl md:text-4xl font-800 text-foreground tracking-tight">
              Non-SDH vs. SDH Captions
            </h2>
            <p className="text-muted-foreground max-w-md text-sm leading-relaxed">
              Watch the same content play side-by-side. SDH captions include sound cues and
              speaker IDs — critical for deaf and hard-of-hearing viewers.
            </p>
          </div>
        </div>

        {/* Side-by-side video frames */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
          <VideoFrame
            label="Non-SDH Captions"
            badge="Non-SDH"
            badgeColor="bg-secondary text-secondary-foreground border border-border"
            currentFrame={currentFrame}
            showSDH={false}
          />
          <VideoFrame
            label="SDH Captions"
            badge="SDH"
            badgeColor="bg-blue-50 text-blue-700 border border-blue-200"
            currentFrame={currentFrame}
            showSDH={true}
          />
        </div>

        {/* Shared progress bar */}
        <div className="mb-3 px-1">
          <div className="flex items-center gap-3 mb-1.5">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs text-muted-foreground font-500">Looping demo — both videos are in sync</span>
          </div>
          <div className="h-1 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-none"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* SDH cue legend */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-8">
          <p className="text-xs font-700 uppercase tracking-widest text-primary mb-3">
            SDH-only elements shown in this demo
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              '[Upbeat background music]',
              '[Audience applause]',
              '[Laughter from audience]',
              '[Music fades out]',
              '[INTERVIEWER]: speaker ID',
              '[Notification sound]',
            ].map((cue) => (
              <span
                key={cue}
                className="text-xs bg-white border border-blue-200 text-blue-700 font-600 px-3 py-1 rounded-full"
              >
                {cue}
              </span>
            ))}
          </div>
        </div>

        {/* Comparison callouts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-muted border border-border rounded-2xl p-6">
            <h4 className="font-700 text-foreground mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-muted-foreground inline-block" />
              Non-SDH — When to use it
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2"><span className="mt-0.5">→</span> Standard captions for general audiences</li>
              <li className="flex gap-2"><span className="mt-0.5">→</span> YouTube, social media, online courses</li>
              <li className="flex gap-2"><span className="mt-0.5">→</span> Dialogue and speech only — no sound cues</li>
              <li className="flex gap-2"><span className="mt-0.5">→</span> Viewers who can hear audio but want text support</li>
            </ul>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
            <h4 className="font-700 text-foreground mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary inline-block" />
              SDH — When to use it
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2"><span className="text-primary mt-0.5">→</span> Accessibility-first content for deaf/HoH viewers</li>
              <li className="flex gap-2"><span className="text-primary mt-0.5">→</span> Broadcast, streaming, educational platforms</li>
              <li className="flex gap-2"><span className="text-primary mt-0.5">→</span> Includes sound effects, music cues, speaker IDs</li>
              <li className="flex gap-2"><span className="text-primary mt-0.5">→</span> ADA/WCAG compliance requirements</li>
            </ul>
          </div>
        </div>

        {/* Bottom note */}
        <p className="text-center text-sm text-muted-foreground mt-8 max-w-xl mx-auto">
          The exact caption requirements depend on your content and intended audience.{' '}
          <a href="/request-a-quote" className="text-primary font-600 hover:underline">
            Tell me about your project
          </a>{' '}
          and I&apos;ll recommend the right format.
        </p>
      </div>
    </section>
  );
}
