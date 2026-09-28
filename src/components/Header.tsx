'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Examples', href: '/examples' },
  { label: 'Industries', href: '/industries' },
  { label: 'About', href: '/about' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-sm py-2.5'
            : 'bg-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 lg:px-6 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <AppLogo size={34} />
            <span className="font-bold text-base lg:text-lg tracking-tight text-foreground">
              Accuscript
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-4 lg:gap-6 xl:gap-8 flex-1 justify-center">
            {navLinks?.map((link) => (
              <Link
                key={link?.href}
                href={link?.href}
                className="nav-link-underline text-sm font-600 text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
              >
                {link?.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/request-a-quote"
              className="hidden md:inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 lg:px-5 py-2 lg:py-2.5 rounded-full text-sm font-700 hover:bg-accent transition-colors whitespace-nowrap"
            >
              Get a Quote
            </Link>
            <button
              className="md:hidden p-2 rounded-lg text-foreground"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Icon name="Bars3Icon" size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] bg-background/98 backdrop-blur-md flex flex-col">
          <div className="flex items-center justify-between px-6 py-5 border-b border-border">
            <Link href="/" className="flex items-center gap-2.5" onClick={() => setMobileOpen(false)}>
              <AppLogo size={32} />
              <span className="font-bold text-lg tracking-tight">Accuscript</span>
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 rounded-lg text-foreground"
              aria-label="Close menu"
            >
              <Icon name="XMarkIcon" size={24} />
            </button>
          </div>
          <nav className="flex flex-col gap-1 px-4 py-6 flex-1">
            {navLinks?.map((link) => (
              <Link
                key={link?.href}
                href={link?.href}
                onClick={() => setMobileOpen(false)}
                className="text-lg font-600 px-4 py-4 rounded-xl hover:bg-secondary text-foreground transition-colors min-h-[44px] flex items-center"
              >
                {link?.label}
              </Link>
            ))}
          </nav>
          <div className="px-6 pb-8">
            <Link
              href="/request-a-quote"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-4 rounded-full text-base font-700 w-full"
            >
              Get a Quote
            </Link>
          </div>
        </div>
      )}
    </>
  );
}