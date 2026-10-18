'use client';
import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AboutPage() {
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
      { threshold: 0.08 }
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  const values = [
  {
    icon: 'UserCircleIcon',
    title: 'Personal accountability',
    desc: 'Every project I deliver has my name on it. I take that seriously.'
  },
  {
    icon: 'DocumentCheckIcon',
    title: 'Human review on every file',
    desc: 'I don\'t send you raw machine output. I review and prepare every transcript and caption set myself.'
  },
  {
    icon: 'ChatBubbleLeftRightIcon',
    title: 'Direct communication',
    desc: 'You talk to me — not a support queue, not a ticket system, not a stranger.'
  },
  {
    icon: 'ShieldCheckIcon',
    title: 'Careful file handling',
    desc: 'Your recordings are handled with discretion. I treat every file as confidential.'
  }];


  return (
    <>
      <div className="noise-overlay" aria-hidden="true" />
      <Header />
      <main ref={sectionRef} className="pt-28 pb-24 bg-background">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 mb-24">
        <div className="max-w-3xl">
          {/* Text */}
          <div className="space-y-8">
            <div className="reveal-hidden stagger-1">
              <span className="pill-badge">About Accuscript</span>
            </div>
            <div className="reveal-hidden stagger-2">
              <h1 className="text-section-title text-foreground">
                I&apos;m Tim.<br />
                <span className="text-primary">Accuscript is me.</span>
              </h1>
            </div>
            <div className="reveal-hidden stagger-3 space-y-5 text-base text-muted-foreground leading-relaxed">
              <p>
                Accuscript isn&apos;t a large transcription company. It&apos;s me. I provide transcription
                and captioning services directly to my clients — personally, from start to finish.
              </p>
              <p>
                When you send me your project, you&apos;re not entering a queue managed by a team of
                contractors you&apos;ll never meet. You&apos;re working with me. I review your recording,
                I prepare the transcript or captions, and I deliver the finished work to you.
              </p>
              <p>
                That&apos;s intentional. I built Accuscript as a personal service because I believe
                clients deserve to know exactly who is handling their files and who is responsible
                for the quality of the result.
              </p>
            </div>
            <div className="reveal-hidden stagger-4 flex flex-wrap gap-3 pt-2">
              <Link
                href="/request-a-quote"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-4 rounded-full text-sm font-700 hover:bg-accent transition-colors">
                
                Send Me Your Project
                <Icon name="ArrowRightIcon" size={16} />
              </Link>
              <a
                href="mailto:tim@accu-script.com"
                className="inline-flex items-center gap-2 border border-border text-foreground bg-background px-7 py-4 rounded-full text-sm font-700 hover:bg-secondary transition-colors">
                
                <Icon name="EnvelopeIcon" size={16} />
                Email Tim
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* My Story */}
      <section className="bg-secondary py-20 mb-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="reveal-hidden stagger-1 mb-10">
            <span className="pill-badge">My Story</span>
          </div>
          <div className="space-y-6 text-base text-muted-foreground leading-relaxed">
            <p className="reveal-hidden stagger-2 text-lg text-foreground font-500">
              I started Accuscript because I saw a gap between what automated transcription tools
              produce and what clients actually need.
            </p>
            <p className="reveal-hidden stagger-3">
              AI can generate a transcript quickly. But raw AI output can contain mistakes involving
              names, terminology, numbers, punctuation, speaker identification, formatting and context.
              Captions require proper timing, segmentation, readability and synchronization — none of
              which an AI handles reliably on its own.
            </p>
            <p className="reveal-hidden stagger-4">
              I use modern technology where it helps me work efficiently. But I don&apos;t hand you
              unreviewed machine output and call it done. Every transcript and caption set I deliver
              has been personally reviewed and prepared by me, according to your requirements.
            </p>
            <p className="reveal-hidden stagger-5">
              The core of what I offer is simple:{' '}
              <strong className="text-foreground">
                AI can generate the text. I make sure the final result is ready to use.
              </strong>
            </p>
            <p className="reveal-hidden stagger-5">
              I work with legal professionals, insurance professionals, educators, researchers,
              businesses and content creators. Whatever your project, you communicate directly with
              me, I personally handle the work, and I deliver a finished product you can actually use.
            </p>
          </div>
        </div>
      </section>

      {/* What I Believe */}
      <section className="max-w-7xl mx-auto px-6 mb-24">
        <div className="reveal-hidden stagger-1 mb-4">
          <span className="pill-badge">What I Stand For</span>
        </div>
        <div className="reveal-hidden stagger-2 mb-12">
          <h2 className="text-section-title text-foreground max-w-2xl">
            You&apos;re not paying me to press a button.
          </h2>
          <p className="mt-4 text-base text-muted-foreground max-w-2xl leading-relaxed">
            You&apos;re paying me to take responsibility for the finished work. That means accuracy,
            readability, proper formatting, correct speaker identification, and a final product
            that&apos;s ready to use — not a rough draft you have to fix yourself.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {values.map((v, i) =>
          <div
            key={v.title}
            className={`reveal-hidden stagger-${i + 1} bg-card border border-border rounded-2xl p-6 card-hover`}>
            
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center mb-4">
                <Icon name={v.icon as Parameters<typeof Icon>[0]['name']} size={20} className="text-primary" />
              </div>
              <h3 className="text-sm font-700 text-foreground mb-2">{v.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
            </div>
          )}
        </div>
      </section>

      {/* Not a Large Agency */}
      <section className="max-w-7xl mx-auto px-6 mb-24">
        <div className="grid lg:grid-cols-5 gap-10 items-center">
          <div className="lg:col-span-3 space-y-6 reveal-hidden stagger-1">
            <span className="pill-badge">Independent &amp; Personal</span>
            <h2 className="text-section-title text-foreground">
              Not a large agency.<br />
              <span className="text-primary">Just me.</span>
            </h2>
            <div className="space-y-4 text-base text-muted-foreground leading-relaxed">
              <p>
                Some transcription services are large companies with dozens of contractors, automated
                pipelines and support tickets. Accuscript is intentionally different.
              </p>
              <p>
                I keep Accuscript small on purpose. When you work with me, you get a single point of
                contact — me — from the moment you send your project to the moment you receive your
                finished files. There&apos;s no handoff, no miscommunication between departments, no
                wondering who actually worked on your transcript.
              </p>
              <p>
                If you have a question, you ask me. If you have a special requirement, you tell me.
                If something needs to be adjusted, I handle it. That&apos;s the kind of service I
                wanted to build, and it&apos;s what Accuscript is.
              </p>
            </div>
          </div>
          <div className="lg:col-span-2 reveal-hidden stagger-2">
            <div className="bg-secondary border border-border rounded-3xl p-8 space-y-5">
              {[
              { label: 'Who handles your project', value: 'Tim — personally' },
              { label: 'Who you communicate with', value: 'Tim — directly' },
              { label: 'Who reviews the final work', value: 'Tim — every time' },
              { label: 'Who is accountable for quality', value: 'Tim — always' }].
              map((row) =>
              <div key={row.label} className="flex items-start justify-between gap-4 pb-5 border-b border-border last:border-0 last:pb-0">
                  <span className="text-sm text-muted-foreground">{row.label}</span>
                  <span className="text-sm font-700 text-primary text-right">{row.value}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 text-center reveal-hidden stagger-1">
        <div className="bg-primary rounded-3xl p-12">
          <h2 className="text-2xl font-700 text-white mb-4">
            Ready to work directly with me?
          </h2>
          <p className="text-blue-200 mb-8 text-base leading-relaxed max-w-xl mx-auto">
            Send me your project and I&apos;ll personally review it and get back to you with a quote.
            No automated responses. No support queue. Just me.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/request-a-quote"
              className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-full text-sm font-700 hover:bg-blue-50 transition-colors">
              
              Request a Quote
              <Icon name="ArrowRightIcon" size={16} />
            </Link>
            <a
              href="mailto:tim@accu-script.com"
              className="inline-flex items-center gap-2 border border-blue-400 text-white px-8 py-4 rounded-full text-sm font-700 hover:bg-blue-700 transition-colors">
              
              <Icon name="EnvelopeIcon" size={16} />
              Email Me Directly
            </a>
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </>
);

}