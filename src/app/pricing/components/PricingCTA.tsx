import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

export default function PricingCTA() {
  return (
    <section className="py-20 bg-primary">
      <div className="max-w-3xl mx-auto px-6 text-center space-y-6">
        <h2 className="text-section-title text-primary-foreground">
          Ready to get a confirmed quote?
        </h2>
        <p className="text-base text-primary-foreground/80">
          Tell me about your project and I&apos;ll review it personally and confirm the final price before starting any work.
        </p>
        <Link
          href="/request-a-quote"
          className="inline-flex items-center gap-2 bg-primary-foreground text-primary px-8 py-4 rounded-full text-sm font-700 hover:bg-secondary transition-colors"
        >
          Request a Quote <Icon name="ArrowRightIcon" size={16} />
        </Link>
      </div>
    </section>
  );
}