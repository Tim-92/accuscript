'use client';
import React, { useEffect, useRef } from 'react';
import Icon from '@/components/ui/AppIcon';

const factors = [
  { icon: 'MicrophoneIcon', title: 'Audio Quality', text: 'Clear, studio-quality audio requires less review time. Poor audio, background noise or heavy accents may require additional work.' },
  { icon: 'UserGroupIcon', title: 'Number of Speakers', text: 'Projects with multiple speakers require careful identification and labeling. More speakers means more review time.' },
  { icon: 'BoltIcon', title: 'Turnaround Time', text: 'Standard turnaround is discussed at quote stage. Rush projects requiring faster delivery may be subject to additional fees.' },
  { icon: 'DocumentTextIcon', title: 'Formatting Requirements', text: 'Legal transcription formatting, custom templates, verbatim transcription or specialized formatting take additional time.' },
  { icon: 'ClockIcon', title: 'Timestamps', text: 'Adding timestamps throughout a transcript or caption file requires additional review and formatting time.' },
  { icon: 'ChatBubbleBottomCenterTextIcon', title: 'Caption Complexity', text: 'SDH captions with sound effects, music cues and speaker identification require more detailed review than standard captions.' },
  { icon: 'AcademicCapIcon', title: 'Specialized Terminology', text: 'Legal, medical or technical terminology requires careful verification to ensure accuracy.' },
  { icon: 'CogIcon', title: 'Special Requirements', text: 'Custom formatting specifications, specific file formats or other special requirements are always discussed before work begins.' },
];

export default function PricingFactors() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const items = el.querySelectorAll<HTMLElement>('.reveal-hidden');
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('reveal-visible'); }); },
      { threshold: 0.1 }
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-background border-y border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center space-y-3 mb-12 reveal-hidden stagger-1">
          <span className="pill-badge">What Affects the Final Price</span>
          <h2 className="text-section-title text-foreground">
            Why quotes may vary
          </h2>
          <p className="text-base text-muted-foreground max-w-xl mx-auto">
            The starting rate is the baseline. I always confirm the final price with you before starting work.
            Here are the factors that may affect the final quote.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {factors.map((f, i) => (
            <div key={f.title} className={`reveal-hidden stagger-${(i % 4) + 1} bg-card border border-border rounded-2xl p-5 card-hover`}>
              <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center mb-3">
                <Icon name={f.icon as Parameters<typeof Icon>[0]['name']} size={18} className="text-primary" />
              </div>
              <h3 className="text-sm font-700 text-foreground mb-2">{f.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}