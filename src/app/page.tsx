import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/app/components/HeroSection';
import WhyAccuscriptSection from '@/app/components/WhyAccuscriptSection';
import PricingCalculator from '@/app/components/PricingCalculator';
import HowItWorksSection from '@/app/components/HowItWorksSection';
import IndustriesSection from '@/app/components/IndustriesSection';
import ContactBand from '@/app/components/ContactBand';

export default function HomePage() {
  return (
    <>
      <div className="noise-overlay" aria-hidden="true" />
      <Header />
      <main>
        <HeroSection />
        <WhyAccuscriptSection />
        <PricingCalculator />
        <HowItWorksSection />
        <IndustriesSection />
        <ContactBand />
      </main>
      <Footer />
    </>
  );
}