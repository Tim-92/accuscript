'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

const faqs = [
  { q: 'Do you use AI?', a: "Yes, I use AI-assisted tools as part of my workflow to work efficiently. But I don't send clients raw, unreviewed AI output. Every transcript and caption I deliver has been personally reviewed and prepared by me." },
  { q: 'Are transcripts reviewed by a human?', a: "Yes. Every single project is personally reviewed by me, Tim. I verify accuracy, formatting, speaker identification, terminology and readability before delivering the finished work." },
  { q: 'Why should I pay for transcription when AI can do it?', a: "Free AI transcription can produce a rough draft quickly, but it regularly makes mistakes with names, numbers, terminology, speaker identification and punctuation. For legal, insurance, professional or public-facing work, those errors matter. You are paying me to take responsibility for a finished, accurate, properly formatted document—not a rough draft." },
  { q: "What is your transcription rate?", a: "Transcription starts at $0.55 per audio minute. The final price is confirmed with you before work begins and may vary based on audio quality, number of speakers, turnaround time, formatting and other project requirements." },
  { q: "What is your captioning rate?", a: "Captioning starts at $0.75 per minute. The final price is confirmed with you before work begins." },
  { q: 'Can I request a custom quote?', a: "Absolutely. Every project is different. Use the Request a Quote page to describe your project and I'll review it and confirm a price before starting any work." },
  { q: 'Do you offer rush services?', a: "Rush availability depends on my current workload. Please mention your deadline when requesting a quote and I\'ll let you know what\'s possible." },
  { q: 'Can I pay online?', a: "Yes. Payment can be made online. I\'ll confirm payment details when the quote is approved. I accept payment before delivering the completed files." },
];

export default function PricingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 bg-background">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center space-y-3 mb-12">
          <span className="pill-badge">Pricing FAQ</span>
          <h2 className="text-section-title text-foreground">Common questions</h2>
        </div>
        <div className="space-y-3">
          {faqs?.map((faq, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left gap-4 min-h-[64px]"
                aria-expanded={openIndex === i}
              >
                <span className="text-sm font-700 text-foreground">{faq?.q}</span>
                <Icon
                  name={openIndex === i ? 'ChevronUpIcon' : 'ChevronDownIcon'}
                  size={18}
                  className="text-muted-foreground flex-shrink-0 transition-transform"
                />
              </button>
              {openIndex === i && (
                <div className="px-6 pb-6 text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">
                  {faq?.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}