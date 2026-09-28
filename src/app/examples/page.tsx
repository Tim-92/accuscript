import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TranscriptTypesSection from './components/TranscriptTypesSection';
import CaptionTypesSection from './components/CaptionTypesSection';

export const metadata: Metadata = {
  title: 'Transcript & Caption Examples | Accuscript',
  description:
    'See the difference between legal and general transcription formats, and compare Non-SDH vs SDH captions with live interactive examples. Understand exactly what you get with Accuscript.',
  openGraph: {
    title: 'Transcript & Caption Examples | Accuscript',
    description:
      'Interactive visual examples of legal vs general transcription and Non-SDH vs SDH captions.',
    url: 'https://accuscript5943.builtwithrocket.new/examples',
  },
};

export default function ExamplesPage() {
  return (
    <>
      <div className="noise-overlay" aria-hidden="true" />
      <Header />
      <main className="pt-24 pb-20 bg-background">
        {/* Page Header */}
        <section className="max-w-4xl mx-auto px-6 text-center mb-16">
          <span className="pill-badge mb-4 inline-block">See the Difference</span>
          <h1 className="text-section-title text-foreground mb-5">
            What does a finished transcript<br className="hidden md:block" /> actually look like?
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Not all transcripts are the same — and neither are captions. Browse interactive examples
            of each format so you know exactly what you&apos;re getting before you place an order.
          </p>
        </section>

        <TranscriptTypesSection />
        <CaptionTypesSection />
      </main>
      <Footer />
    </>
  );
}
