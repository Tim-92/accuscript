import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

export default function ContactBand() {
  return (
    <section className="py-20 bg-primary" aria-label="Contact CTA">
      <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
        <h2 className="text-section-title text-primary-foreground">
          Ready to get started?
        </h2>
        <p className="text-base text-primary-foreground/80 max-w-xl mx-auto">
          Send me your project and I&apos;ll personally review it and get back to you with a confirmed quote.
          No automated responses. Just me.
        </p>
        <div className="flex flex-wrap gap-4 justify-center pt-2">
          <Link
            href="/request-a-quote"
            className="inline-flex items-center gap-2 bg-primary-foreground text-primary px-8 py-4 rounded-full text-sm font-700 hover:bg-secondary transition-colors"
          >
            Request a Quote
            <Icon name="ArrowRightIcon" size={16} />
          </Link>
          <a
            href="mailto:tim@accuscript.com"
            className="inline-flex items-center gap-2 border border-primary-foreground/40 text-primary-foreground px-8 py-4 rounded-full text-sm font-700 hover:bg-primary-foreground/10 transition-colors"
          >
            <Icon name="EnvelopeIcon" size={16} />
            Send an Email
          </a>
        </div>
        <p className="text-xs text-primary-foreground/60 pt-2">
          Modern technology. Human review. Direct communication.
        </p>
      </div>
    </section>
  );
}