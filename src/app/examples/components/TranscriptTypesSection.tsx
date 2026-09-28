'use client';
import React, { useRef, useEffect, useState } from 'react';

const legalTranscriptContent = `
IN THE CIRCUIT COURT OF THE FOURTH JUDICIAL CIRCUIT
IN AND FOR DUVAL COUNTY, FLORIDA

CASE NO.: 2024-CA-001847

─────────────────────────────────────────

DEPOSITION OF MARCUS R. HOLLOWAY

Taken on behalf of the Plaintiff
Date: September 12, 2024
Location: 220 Riverside Avenue, Suite 400
           Jacksonville, Florida 32202

Reported by: [Certified Court Reporter]

─────────────────────────────────────────

APPEARANCES:

  For the Plaintiff:
    JENNIFER L. CROSS, ESQ.
    Cross & Whitfield, P.A.

  For the Defendant:
    DAVID T. MARCUS, ESQ.
    Marcus & Stern, LLP

─────────────────────────────────────────

                  PROCEEDINGS

                 EXAMINATION
              BY MS. CROSS:

Q   Please state your full name for the record.

A   Marcus Raymond Holloway.

Q   And what is your current occupation,
    Mr. Holloway?

A   I'm a licensed civil engineer. I've been
    with Meridian Structural Group for about
    eleven years now.

Q   Were you present at the Lakeview
    construction site on the morning of
    March 4th, 2024?

A   Yes, I was. I arrived at approximately
    7:15 a.m.

Q   Can you describe what you observed upon
    your arrival?

A   When I pulled into the site, I noticed
    the east scaffolding section looked
    different from the previous day. There
    was a gap in the safety netting on the
    third level.

Q   Did you report that observation to
    anyone at the time?

A   I flagged it to the site supervisor —
    that would be Mr. Reyes — within about
    ten minutes of arriving.

                  MR. MARCUS:
    Objection. Calls for hearsay.

                  MS. CROSS:
    I'll rephrase.

Q   Without telling me what Mr. Reyes said,
    did you take any action after speaking
    with him?

A   Yes. I documented the condition in my
    site log and took photographs.

Q   I'm going to show you what has been
    marked as Plaintiff's Exhibit 14.
    Do you recognize this document?

A   Yes. That's a copy of my site log entry
    for March 4th.

Q   Is that your signature at the bottom?

A   It is.

─────────────────────────────────────────

[CONTINUED ON NEXT PAGE]

─────────────────────────────────────────
`.trim();

const generalTranscriptContent = `
INTERVIEW TRANSCRIPT
"Building a Sustainable Business in 2024"
Podcast: The Founder's Table
Episode 47 — Recorded August 29, 2024

─────────────────────────────────────────

[00:00:00] HOST (SARAH CHEN):
Welcome back to The Founder's Table. I'm Sarah Chen, and today I'm joined by
someone who built a seven-figure business
from a spare bedroom. Lena, thanks for
being here.

[00:00:11] LENA VASQUEZ:
Thanks for having me, Sarah. I've been
looking forward to this one.

[00:00:15] HOST:
Let's start at the beginning. You left a
pretty comfortable corporate job to do
this. What was going through your mind?

[00:00:23] LENA:
Honestly? Pure terror. [laughs] I had a
good salary, good benefits — the whole
package. But I kept coming back to this
idea I had, and I knew if I didn't try it,
I'd regret it for the rest of my life.

[00:00:38] HOST:
What was the idea?

[00:00:40] LENA:
Sustainable packaging for small e-commerce
businesses. At the time, most eco-friendly
options were priced for large retailers.
Small sellers couldn't afford them, so
they defaulted to plastic. I wanted to
change that.

[00:00:55] HOST:
And how did you validate the idea before
you quit your job?

[00:01:01] LENA:
I spent about six months talking to small
business owners — mostly through Facebook
groups and local markets. I wasn't selling
anything. I was just asking questions.
What do you use now? What would you switch
to if the price was right? What matters
most to your customers?

[00:01:19] HOST:
That's a really disciplined approach.

[00:01:22] LENA:
It saved me from building the wrong thing.
I had three or four assumptions that turned
out to be completely wrong. Better to find
that out before you've spent your savings.

[00:01:33] HOST:
When did you finally take the leap?

[00:01:36] LENA:
January 2021. I gave notice in December,
spent the holidays terrified, and launched
in January. First month revenue was $340.
[laughs] My husband was very patient.

─────────────────────────────────────────

[END OF EXCERPT]

─────────────────────────────────────────
`.trim();

function DocumentFrame({
  title,
  badge,
  badgeColor,
  content,
  animationDelay = 0,
}: {
  title: string;
  badge: string;
  badgeColor: string;
  content: string;
  animationDelay?: number;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );
    if (frameRef.current) observer.observe(frameRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const el = scrollRef.current;
    if (!el) return;

    let startTime: number | null = null;
    let rafId: number;
    const duration = 18000 + animationDelay * 2000;
    const totalHeight = el.scrollHeight / 2;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp - animationDelay * 1000;
      const elapsed = (timestamp - startTime) % duration;
      const progress = elapsed / duration;
      el.style.transform = `translateY(-${progress * totalHeight}px)`;
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [isVisible, animationDelay]);

  const lines = content.split('\n');
  const doubled = [...lines, ...lines];

  return (
    <div ref={frameRef} className="flex flex-col gap-3">
      {/* Label */}
      <div className="flex items-center gap-3">
        <span
          className={`text-xs font-700 uppercase tracking-widest px-3 py-1 rounded-full ${badgeColor}`}
        >
          {badge}
        </span>
        <h3 className="text-base font-700 text-foreground">{title}</h3>
      </div>

      {/* Browser Chrome Frame */}
      <div className="rounded-2xl border border-border shadow-lg overflow-hidden bg-white">
        {/* Browser bar */}
        <div className="bg-muted border-b border-border px-4 py-2.5 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400 opacity-70" />
            <div className="w-3 h-3 rounded-full bg-yellow-400 opacity-70" />
            <div className="w-3 h-3 rounded-full bg-green-400 opacity-70" />
          </div>
          <div className="flex-1 mx-3 bg-white border border-border rounded-md px-3 py-1 text-xs text-muted-foreground font-mono truncate">
            accuscript-transcript.pdf
          </div>
        </div>

        {/* Document area with scroll animation */}
        <div className="h-[420px] overflow-hidden bg-white relative">
          {/* Top fade */}
          <div className="absolute top-0 left-0 right-0 h-8 bg-white/80 z-10 pointer-events-none" style={{maskImage: 'linear-gradient(to bottom, white, transparent)'}} />
          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-12 z-10 pointer-events-none" style={{background: 'linear-gradient(to top, white 60%, transparent)'}} />

          <div ref={scrollRef} className="px-8 py-6 will-change-transform">
            {doubled.map((line, i) => {
              const isSeparator = line.startsWith('─');
              const isHeader = line.startsWith('IN THE') || line.startsWith('CASE') || line.startsWith('DEPOSITION') || line.startsWith('INTERVIEW') || line.startsWith('"');
              const isSpeaker = /^[A-Z\s]+:$/.test(line.trim()) || /^\s+[A-Z\s]+:$/.test(line);
              const isQA = /^\s*[QA]\s/.test(line);
              const isTimestamp = /^\[[\d:]+\]/.test(line.trim());

              return (
                <div
                  key={i}
                  className={`
                    transcript-document
                    ${isSeparator ? 'text-border my-1' : ''}
                    ${isHeader ? 'font-bold text-foreground text-center' : ''}
                    ${isSpeaker ? 'font-bold text-primary mt-2' : ''}
                    ${isQA ? 'text-foreground' : ''}
                    ${isTimestamp ? 'text-primary font-600' : ''}
                    ${!isSeparator && !isHeader && !isSpeaker && !isQA && !isTimestamp ? 'text-foreground/80' : ''}
                  `}
                >
                  {line || '\u00A0'}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TranscriptTypesSection() {
  return (
    <section className="py-16 border-t border-border">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-0.5 bg-primary" />
            <span className="text-xs font-700 uppercase tracking-widest text-primary">
              Transcript Types
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2 className="text-3xl md:text-4xl font-800 text-foreground tracking-tight">
              Legal vs. General Transcription
            </h2>
            <p className="text-muted-foreground max-w-md text-sm leading-relaxed">
              Scroll through live mock documents to see how each format is structured.
              Both examples are representative — exact formatting follows your specifications.
            </p>
          </div>
        </div>

        {/* Two-column document frames */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <DocumentFrame
            title="Legal Transcript Example"
            badge="Legal"
            badgeColor="bg-blue-50 text-blue-700 border border-blue-200"
            content={legalTranscriptContent}
            animationDelay={0}
          />
          <DocumentFrame
            title="General Transcript Example"
            badge="General"
            badgeColor="bg-secondary text-secondary-foreground border border-border"
            content={generalTranscriptContent}
            animationDelay={3}
          />
        </div>

        {/* Comparison callouts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
            <h4 className="font-700 text-foreground mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary inline-block" />
              Legal Transcription — When to use it
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2"><span className="text-primary mt-0.5">→</span> Depositions, hearings, recorded statements</li>
              <li className="flex gap-2"><span className="text-primary mt-0.5">→</span> Formal Q&amp;A structure with attorney/witness labels</li>
              <li className="flex gap-2"><span className="text-primary mt-0.5">→</span> Case information, appearances, and page/line formatting</li>
              <li className="flex gap-2"><span className="text-primary mt-0.5">→</span> Objections, exhibits, and procedural notations</li>
              <li className="flex gap-2"><span className="text-primary mt-0.5">→</span> Formatting follows your firm&apos;s or jurisdiction&apos;s specifications</li>
            </ul>
          </div>
          <div className="bg-muted border border-border rounded-2xl p-6">
            <h4 className="font-700 text-foreground mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-muted-foreground inline-block" />
              General Transcription — When to use it
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2"><span className="text-muted-foreground mt-0.5">→</span> Interviews, podcasts, research recordings</li>
              <li className="flex gap-2"><span className="text-muted-foreground mt-0.5">→</span> Speaker-labeled paragraphs with optional timestamps</li>
              <li className="flex gap-2"><span className="text-muted-foreground mt-0.5">→</span> Clean, readable format for general use</li>
              <li className="flex gap-2"><span className="text-muted-foreground mt-0.5">→</span> Verbatim or edited/clean versions available</li>
              <li className="flex gap-2"><span className="text-muted-foreground mt-0.5">→</span> Business meetings, educational recordings, content creation</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
