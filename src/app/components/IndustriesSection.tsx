'use client';
import React, { useEffect, useRef } from 'react';
import Icon from '@/components/ui/AppIcon';

const industries = [
  {
    icon: 'ScaleIcon',
    name: 'Legal',
    description:
      'Depositions, hearings, interviews, consultations, recorded statements and case-related recordings. Formatted to your specification.',
    tags: ['Depositions', 'Hearings', 'Statements'],
  },
  {
    icon: 'ShieldCheckIcon',
    name: 'Insurance',
    description:
      'Recorded statements, claimant interviews, witness interviews, adjuster recordings and other claim-related audio into organized documentation.',
    tags: ['Statements', 'Interviews', 'Claims'],
  },
  {
    icon: 'AcademicCapIcon',
    name: 'Education',
    description:
      'Lectures, seminars, research interviews, lessons, webinars, academic discussions and educational recordings.',
    tags: ['Lectures', 'Seminars', 'Research'],
  },
  {
    icon: 'BriefcaseIcon',
    name: 'Business',
    description:
      'Meetings, interviews, presentations, conferences, training sessions and corporate recordings.',
    tags: ['Meetings', 'Training', 'Conferences'],
  },
  {
    icon: 'BeakerIcon',
    name: 'Research',
    description:
      'Interviews, focus groups, academic recordings and qualitative research material requiring accurate speaker identification.',
    tags: ['Focus Groups', 'Interviews', 'Qualitative'],
  },
  {
    icon: 'VideoCameraIcon',
    name: 'Content Creators',
    description:
      'YouTube videos, podcasts, interviews, online courses and social media content. Captions and transcripts for accessibility and engagement.',
    tags: ['YouTube', 'Podcasts', 'Courses'],
  },
];

export default function IndustriesSection() {
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
    <section ref={sectionRef} className="py-24 bg-muted border-y border-border" id="industries">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Left sticky header */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
            <div className="reveal-hidden stagger-1">
              <span className="pill-badge">Industries I Serve</span>
            </div>
            <div className="reveal-hidden stagger-2">
              <h2 className="text-section-title text-foreground">
                Whoever you are,<br />
                <span className="text-primary">I can help.</span>
              </h2>
            </div>
            <p className="reveal-hidden stagger-3 text-base text-muted-foreground leading-relaxed">
              From legal depositions to podcast captions, I provide accurate human-reviewed transcription
              and captioning for a wide range of professional and creative clients.
            </p>
            <div className="reveal-hidden stagger-4 border-l-4 border-primary pl-5 py-2">
              <p className="text-sm font-600 text-foreground">
                Not sure which service fits your project?
              </p>
              <a
                href="/request-a-quote"
                className="text-sm text-primary font-700 hover:underline mt-1 inline-flex items-center gap-1"
              >
                Ask me directly <Icon name="ArrowRightIcon" size={14} />
              </a>
            </div>
          </div>

          {/* Right: industry rows */}
          <div className="lg:col-span-8 border-t border-border">
            {industries.map((ind, i) => (
              <div
                key={ind.name}
                className={`reveal-hidden stagger-${(i % 5) + 1} industry-row border-b border-border px-4 py-6 cursor-default`}
              >
                <div className="flex items-start gap-5">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon name={ind.icon as Parameters<typeof Icon>[0]['name']} size={20} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-base font-700 text-foreground">{ind.name}</h3>
                      <Icon
                        name="ArrowRightIcon"
                        size={16}
                        className="industry-arrow text-primary flex-shrink-0"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-1.5">{ind.description}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {ind.tags.map((tag) => (
                        <span key={tag} className="pill-badge text-[10px]">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}