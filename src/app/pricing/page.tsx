import React from 'react';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PricingHero from '@/app/pricing/components/PricingHero';
import PricingCards from '@/app/pricing/components/PricingCards';
import PricingFactors from '@/app/pricing/components/PricingFactors';
import PricingCalculatorSection from '@/app/pricing/components/PricingCalculatorSection';
import PricingFAQ from '@/app/pricing/components/PricingFAQ';
import PricingCTA from '@/app/pricing/components/PricingCTA';

export const metadata: Metadata = {
  title: 'Pricing — Accuscript Transcription & Captioning',
  description:
    'Transparent starting rates: $0.55/min for transcription and $0.75/min for captioning. Estimate your project cost and request a quote from Tim at Accuscript.',
};

export default function PricingPage() {
  return (
    <>
      <div className="noise-overlay" aria-hidden="true" />
      <Header />
      <main>
        <PricingHero />
        <PricingCards />
        <PricingFactors />
        <PricingCalculatorSection />
        <PricingFAQ />
        <PricingCTA />
      </main>
      <Footer />
    </>
  );
}