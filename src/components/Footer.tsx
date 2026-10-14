import React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';

const serviceLinks = [
  { label: 'Transcription', href: '/' },
  { label: 'Captioning', href: '/' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Request a Quote', href: '/request-a-quote' },
];

const infoLinks = [
  { label: 'Home', href: '/' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy Policy', href: '/' },
  { label: 'Terms of Service', href: '/' },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Row 1 */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-10 pb-10 border-b border-border">
          {/* Brand */}
          <div className="flex flex-col gap-4 max-w-xs">
            <Link href="/" className="flex items-center gap-2.5">
              <AppLogo size={32} />
              <span className="font-bold text-base tracking-tight text-foreground">Accuscript</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Professional transcription &amp; captioning, human-reviewed on every project.
            </p>
            <p className="text-xs text-muted-foreground font-500">
              Modern technology. Human review. Direct communication.
            </p>
          </div>

          {/* Services */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-700 uppercase tracking-widest text-muted-foreground">Services</p>
            {serviceLinks?.map((l) => (
              <Link
                key={l?.label}
                href={l?.href}
                className="text-sm font-500 text-muted-foreground hover:text-foreground transition-colors min-h-[44px] flex items-center"
              >
                {l?.label}
              </Link>
            ))}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-700 uppercase tracking-widest text-muted-foreground">Info</p>
            {infoLinks?.map((l) => (
              <Link
                key={l?.label}
                href={l?.href}
                className="text-sm font-500 text-muted-foreground hover:text-foreground transition-colors min-h-[44px] flex items-center"
              >
                {l?.label}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-700 uppercase tracking-widest text-muted-foreground">Contact</p>
            <a
              href="mailto:tim@accu-script.com"
              className="text-sm font-500 text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 min-h-[44px]"
            >
              <Icon name="EnvelopeIcon" size={16} />
              tim@accu-script.com
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 border border-border text-foreground px-5 py-2.5 rounded-full text-sm font-700 hover:border-primary hover:text-primary transition-colors w-fit"
            >
              Send a Message
            </Link>
            <Link
              href="/request-a-quote"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-700 hover:bg-accent transition-colors w-fit mt-1"
            >
              Get a Quote
            </Link>
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8">
          <p className="text-xs text-muted-foreground font-500">
            © 2026 Accuscript. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xs font-500 text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <span className="text-border">·</span>
            <Link href="/" className="text-xs font-500 text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}