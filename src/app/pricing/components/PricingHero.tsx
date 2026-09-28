import React from 'react';

export default function PricingHero() {
  return (
    <section className="pt-36 pb-16 bg-background border-b border-border">
      <div className="max-w-4xl mx-auto px-6 text-center space-y-5">
        <span className="pill-badge">Transparent Pricing</span>
        <h1 className="text-section-title text-foreground">
          Simple, honest pricing.<br />
          <span className="text-primary">No hidden fees.</span>
        </h1>
        <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Every project starts at a clear base rate. I confirm the final price with you before starting any work,
          so there are no surprises when the invoice arrives.
        </p>
      </div>
    </section>
  );
}