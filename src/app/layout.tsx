import React from 'react';
import type { Metadata, Viewport } from 'next';
import { DM_Sans } from 'next/font/google';
import '../styles/tailwind.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'Accuscript — Professional Transcription & Captioning by Tim',
  description:
    'Accuscript is a personal transcription and captioning service operated by Tim. Human-reviewed transcripts and captions for legal, business, education and content creators.',
  icons: {
    icon: [{ url: '/assets/accuscript-logo.svg', type: 'image/svg+xml' }],
    shortcut: [{ url: '/assets/accuscript-logo.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/assets/accuscript-logo.svg', type: 'image/svg+xml' }],
  },
  openGraph: {
    title: 'Accuscript — Transcription & Captioning by Tim',
    description: 'Human-reviewed transcription and captioning. Modern technology, personal service.',
    images: [{ url: '/assets/images/app_logo.png', width: 1200, height: 630 }],
  },
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Accuscript',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/assets/accuscript-logo.svg`,
  email: 'tim@accu-script.com',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={dmSans.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />

        <script type="module" async src="https://static.rocket.new/rocket-web.js?_cfg=https%3A%2F%2Faccuscript5943back.builtwithrocket.new&_be=https%3A%2F%2Fappanalytics.rocket.new&_v=0.1.21" />
        <script type="module" defer src="https://static.rocket.new/rocket-shot.js?v=0.0.3" /></head>
      <body className={dmSans.className}>
        {children}
</body>
    </html>
  );
}