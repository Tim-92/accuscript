import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import IndustriesHero from './components/IndustriesHero';
import IndustryDetail from './components/IndustryDetail';
import IndustriesCTA from './components/IndustriesCTA';

export const metadata: Metadata = {
  title: 'Industries Served — Accuscript Transcription & Captioning',
  description:
    'Tim at Accuscript provides professional transcription and captioning for legal, insurance, education, business, research, and content creator industries. Human-reviewed, personally handled.',
  openGraph: {
    title: 'Industries Served — Accuscript Transcription & Captioning',
    description:
      'Professional transcription and captioning for legal, insurance, education, business, research, and content creators. Personally handled by Tim.',
    url: 'https://accuscript5943.builtwithrocket.new/industries',
  },
};

export default function IndustriesPage() {
  return (
    <>
      <div className="noise-overlay" aria-hidden="true" />
      <Header />
      <main>
        <IndustriesHero />
        <IndustryDetail />
        <IndustriesCTA />
      </main>
      <Footer />
    </>
  );
}
