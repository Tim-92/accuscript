'use client';
import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

const industryPills = ['Legal', 'Insurance', 'Education', 'Business', 'Research', 'Content Creators'];

export default function IndustriesHero() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const items = el.querySelectorAll<HTMLElement>('.reveal-hidden');
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('reveal-visible'); }),
      { threshold: 0.1 }
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="pt-32 pb-20 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left content */}
          <div className="lg:col-span-7 space-y-7">
            <div className="reveal-hidden stagger-1">
              <span className="pill-badge">Industries I Serve</span>
            </div>
            <h1 className="reveal-hidden stagger-2 text-section-title text-foreground">
              Whoever you are,<br />
              <span className="text-primary">I can help.</span>
            </h1>
            <p className="reveal-hidden stagger-3 text-lg text-muted-foreground leading-relaxed max-w-xl">
              From legal depositions to podcast captions, I provide accurate, human-reviewed transcription
              and captioning for professionals and creators across a wide range of industries.
              Every project is personally handled by me — not a team, not an algorithm.
            </p>
            <div className="reveal-hidden stagger-4 flex flex-wrap gap-3">
              {industryPills.map((pill) => (
                <span
                  key={pill}
                  className="inline-flex items-center gap-1.5 bg-secondary text-secondary-foreground text-xs font-700 px-4 py-2 rounded-full border border-border"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                  {pill}
                </span>
              ))}
            </div>
            <div className="reveal-hidden stagger-5 flex flex-wrap gap-4 pt-2">
              <Link
                href="/request-a-quote"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full text-sm font-700 hover:bg-accent transition-colors"
              >
                Request a Quote <Icon name="ArrowRightIcon" size={16} />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 border border-border text-foreground px-6 py-3 rounded-full text-sm font-600 hover:bg-secondary transition-colors"
              >
                View Pricing
              </Link>
            </div>
          </div>

          {/* Right: stat cards */}
          <div className="reveal-hidden stagger-3 lg:col-span-5 grid grid-cols-2 gap-4">
            {[
              { value: '6+', label: 'Industries Served', icon: 'BuildingOfficeIcon' },
              { value: '$0.55', label: 'Per Audio Minute', icon: 'DocumentTextIcon' },
              { value: '$0.75', label: 'Per Caption Minute', icon: 'FilmIcon' },
              { value: '100%', label: 'Human Reviewed', icon: 'UserCircleIcon' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-card border border-border rounded-2xl p-5 space-y-3"
              >
                <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
                  <Icon name={stat.icon as Parameters<typeof Icon>[0]['name']} size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-800 text-foreground tracking-tight">{stat.value}</p>
                  <p className="text-xs text-muted-foreground font-500 mt-0.5">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
