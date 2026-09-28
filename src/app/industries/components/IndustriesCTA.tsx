'use client';
import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

export default function IndustriesCTA() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref?.current;
    if (!el) return;
    const items = el?.querySelectorAll<HTMLElement>('.reveal-hidden');
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('reveal-visible'); }),
      { threshold: 0.1 }
    );
    items?.forEach((item) => observer?.observe(item));
    return () => observer?.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-24 bg-primary">
      <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
        <div className="reveal-hidden stagger-1">
          <span className="inline-flex items-center bg-white/10 text-white text-xs font-700 uppercase tracking-widest px-4 py-2 rounded-full">
            Work Directly With Accuscript
          </span>
        </div>
        <h2 className="reveal-hidden stagger-2 text-section-title text-white">
          Don&apos;t see your industry?<br />
          <span className="text-blue-200">Ask me anyway.</span>
        </h2>
        <p className="reveal-hidden stagger-3 text-lg text-blue-100 leading-relaxed max-w-2xl mx-auto">
          If you have audio or video that needs to be transcribed or captioned, there&apos;s a good chance I can help.
          Send me a message and I&apos;ll let you know what I can do for your specific project.
        </p>
        <div className="reveal-hidden stagger-4 flex flex-wrap justify-center gap-4 pt-2">
          <Link
            href="/request-a-quote"
            className="inline-flex items-center gap-2 bg-white text-primary px-7 py-3.5 rounded-full text-sm font-700 hover:bg-blue-50 transition-colors"
          >
            Request a Quote <Icon name="ArrowRightIcon" size={16} />
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 border border-white/30 text-white px-7 py-3.5 rounded-full text-sm font-600 hover:bg-white/10 transition-colors"
          >
            View Pricing
          </Link>
        </div>

        {/* Trust line */}
        <div className="reveal-hidden stagger-5 pt-4 flex items-center justify-center gap-6 flex-wrap">
          {['Human-reviewed', 'Personally handled', 'Direct communication']?.map((item) => (
            <div key={item} className="flex items-center gap-2 text-blue-100 text-sm">
              <Icon name="CheckCircleIcon" size={16} className="text-blue-200" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
