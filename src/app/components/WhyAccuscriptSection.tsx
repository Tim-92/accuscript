'use client';
import React, { useEffect, useRef } from 'react';
import Icon from '@/components/ui/AppIcon';

const differentiators = [
  {
    icon: 'CheckCircleIcon',
    title: 'Accuracy you can rely on',
    text: 'Every transcript and caption set is personally reviewed for names, terminology, numbers, punctuation and context—not just spell-checked.',
  },
  {
    icon: 'UserCircleIcon',
    title: 'One person responsible',
    text: 'You know exactly who is handling your project. When you send me your recording, I personally review and prepare the finished work.',
  },
  {
    icon: 'DocumentCheckIcon',
    title: 'Formatting that fits your needs',
    text: 'Legal, general, verbatim, clean-read, timestamped, SDH or Non-SDH—I format the output to match your specific requirements.',
  },
  {
    icon: 'ClockIcon',
    title: 'Speaker identification included',
    text: 'Multiple speakers are identified and labeled correctly. I listen carefully to distinguish voices, not rely on automated speaker diarization alone.',
  },
];

export default function WhyAccuscriptSection() {
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
    <section ref={sectionRef} className="py-24 bg-background" id="why-accuscript">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <div className="space-y-8">
            <div className="reveal-hidden stagger-1">
              <span className="pill-badge">Why Accuscript</span>
            </div>
            <div className="reveal-hidden stagger-2">
              <h2 className="text-section-title text-foreground">
                AI is part of the<br />
                process. It isn&apos;t<br />
                <span className="text-primary">the product.</span>
              </h2>
            </div>
            <div className="reveal-hidden stagger-3 space-y-5">
              <p className="text-base text-muted-foreground leading-relaxed">
                Modern AI-assisted transcription can make the process faster. But AI can generate mistakes
                involving names, terminology, numbers, punctuation, speaker identification, formatting and context.
                Captions also require proper timing, segmentation, readability and synchronization—none of which
                automated tools handle reliably on their own.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed">
                I use technology where it helps. But I personally review and prepare every piece of work
                according to your requirements. Technology is the tool. I am the service.
              </p>
              <div className="border-l-4 border-primary pl-5 py-2">
                <p className="text-base font-700 text-foreground italic">
                  &ldquo;You are not paying me to press a button. You are paying me to take responsibility
                  for the finished work.&rdquo;
                </p>
                <p className="text-sm text-muted-foreground mt-2">— Accuscript</p>
              </div>
            </div>
          </div>

          {/* Right: differentiator cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {differentiators.map((item, i) => (
              <div
                key={item.title}
                className={`reveal-hidden stagger-${i + 2} card-hover bg-card border border-border rounded-2xl p-6 space-y-3`}
              >
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                  <Icon name={item.icon as Parameters<typeof Icon>[0]['name']} size={20} className="text-primary" />
                </div>
                <h3 className="text-sm font-700 text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* AI comparison row */}
        <div className="mt-16 reveal-hidden stagger-1">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-muted border border-border rounded-2xl p-7">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-border flex items-center justify-center">
                  <Icon name="CpuChipIcon" size={18} className="text-muted-foreground" />
                </div>
                <h3 className="text-sm font-700 text-muted-foreground uppercase tracking-wider">Raw AI Output</h3>
              </div>
              <ul className="space-y-2.5">
                {[
                  'Misidentified names and terminology',
                  'Incorrect punctuation and sentence breaks',
                  'Mixed-up speakers or no labels',
                  'Caption timing errors and over-long lines',
                  'No formatting for legal or professional use',
                  'No accountability for errors',
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <Icon name="XMarkIcon" size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-secondary border border-primary/20 rounded-2xl p-7">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Icon name="UserCircleIcon" size={18} className="text-primary-foreground" />
                </div>
                <h3 className="text-sm font-700 text-primary uppercase tracking-wider">Accuscript — Human Review</h3>
              </div>
              <ul className="space-y-2.5">
                {[
                  'Names, terminology and numbers verified',
                  'Correct punctuation and natural sentence flow',
                  'Speakers clearly identified and labeled',
                  'Captions properly timed and segmented',
                  'Formatted to your legal, business or creative spec',
                  'One person accountable for the finished work',
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2.5 text-sm text-foreground">
                    <Icon name="CheckIcon" size={16} className="text-primary flex-shrink-0 mt-0.5" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}