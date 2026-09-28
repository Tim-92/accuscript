import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import QuotePageClient from '@/app/request-a-quote/components/QuotePageClient';

export const metadata: Metadata = {
  title: 'Request a Quote — Accuscript Transcription & Captioning',
  description:
    'Request a transcription or captioning quote from Tim at Accuscript. Upload your file, select your options and get a confirmed price before work begins.',
};

export default function RequestAQuotePage() {
  return (
    <>
      <div className="noise-overlay" aria-hidden="true" />
      <Header />
      <main>
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-blue-600 text-lg">Loading...</div></div>}>
          <QuotePageClient />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}