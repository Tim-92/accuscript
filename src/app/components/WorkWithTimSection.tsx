'use client';
import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

export default function WorkWithTimSection() {
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
    <section ref={sectionRef} className="py-24 bg-background" id="work-with-tim">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: rotated photo treatment */}
          <div className="relative flex justify-center lg:justify-start reveal-hidden stagger-1">
            <div className="relative w-full max-w-sm">
              {/* Rotated background card */}
              <div
                className="absolute inset-0 bg-secondary border border-border rounded-3xl"
                style={{ transform: 'rotate(-3deg)' }}
                aria-hidden="true" />
              
              {/* Main photo */}
              <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-xl">
                <AppImage
                  src="https://img.rocket.new/generatedImages/rocket_gen_img_162394200-1773114820577.png"
                  alt="Tim, a professional man in his thirties smiling at a well-lit desk with a clean bright home office background"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 90vw, 400px" />
                
              </div>
              {/* Overlapping info card */}
              <div
                className="absolute -bottom-8 -right-8 bg-card border border-border rounded-2xl p-5 shadow-lg w-52"
                style={{ transform: 'rotate(3deg)' }}>
                
                <p className="text-xs font-700 uppercase tracking-wider text-muted-foreground mb-1">One point of contact</p>
                <p className="text-lg font-800 text-foreground">Tim</p>
                <p className="text-xs text-muted-foreground mt-1">Accuscript</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-xs text-muted-foreground">Available for new projects</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: content */}
          <div className="space-y-8 lg:pl-4">
            <div className="reveal-hidden stagger-1">
              <span className="pill-badge">Work Directly With Tim</span>
            </div>
            <div className="reveal-hidden stagger-2">
              <h2 className="text-section-title text-foreground">
                One project.<br />
                One point of contact.<br />
                <span className="text-primary">Me.</span>
              </h2>
            </div>
            <div className="reveal-hidden stagger-3 space-y-4 text-base text-muted-foreground leading-relaxed">
              <p>
                Accuscript isn&apos;t a large transcription company. It&apos;s me. I&apos;m Tim, and I provide
                transcription and captioning services directly to my clients.
              </p>
              <p>
                When you send me your project, you communicate directly with the person handling the work.
                You get direct answers to your questions, you can explain special requirements directly to me,
                and you know exactly who is responsible for the finished result.
              </p>
              <p>
                I use modern technology where it helps me work efficiently. But every transcript and caption
                set I deliver has been personally reviewed and prepared by me.
              </p>
            </div>

            <div className="reveal-hidden stagger-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
              { icon: 'ChatBubbleLeftRightIcon', text: 'Communicate directly with me' },
              { icon: 'LockClosedIcon', text: 'Your files handled with care' },
              { icon: 'ClockIcon', text: 'Clear turnaround times' },
              { icon: 'DocumentCheckIcon', text: 'Personal review on every project' }].
              map((item) =>
              <div key={item.text} className="flex items-center gap-3 py-3">
                  <Icon name={item.icon as Parameters<typeof Icon>[0]['name']} size={18} className="text-primary flex-shrink-0" />
                  <span className="text-sm font-500 text-foreground">{item.text}</span>
                </div>
              )}
            </div>

            <div className="reveal-hidden stagger-5 flex flex-wrap gap-3 pt-2">
              <Link
                href="/request-a-quote"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-4 rounded-full text-sm font-700 hover:bg-accent transition-colors">
                
                Send Me Your Project
                <Icon name="ArrowRightIcon" size={16} />
              </Link>
              <a
                href="mailto:tim@accuscript.com"
                className="inline-flex items-center gap-2 border border-border text-foreground bg-background px-7 py-4 rounded-full text-sm font-700 hover:bg-secondary transition-colors">
                
                <Icon name="EnvelopeIcon" size={16} />
                Email Tim Directly
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>);

}