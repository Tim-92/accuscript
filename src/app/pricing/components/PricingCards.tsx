import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

const plans = [
  {
    name: 'Transcription',
    rate: '$0.55',
    unit: 'per audio minute',
    description:
      'Human-reviewed transcription for legal, insurance, business, education, research and general clients.',
    features: [
      'Personal review by Tim',
      'Speaker identification available',
      'Timestamps available',
      'Verbatim or clean-read format',
      'Legal or general formatting',
      'Delivered in Word, PDF or TXT',
    ],
    cta: 'Request Transcription Quote',
  },
  {
    name: 'Captioning',
    rate: '$0.75',
    unit: 'per minute',
    description:
      'Professionally timed and formatted captions for YouTube, online courses, podcasts, social media and business video.',
    features: [
      'Personal review by Tim',
      'Non-SDH and SDH captions',
      'Proper timing & segmentation',
      'Readability-focused formatting',
      'Speaker identification in SDH',
      'Delivered in SRT, VTT or SCC',
    ],
    cta: 'Request Captioning Quote',
  },
];

export default function PricingCards() {
  return (
    <section className="py-20 bg-muted">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-6">
          {plans?.map((plan) => (
            <div
              key={plan?.name}
              className="bg-card border border-border rounded-3xl p-8 flex flex-col justify-between card-hover"
            >
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-700 text-foreground">{plan?.name}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{plan?.description}</p>
                </div>
                <div>
                  <span className="text-4xl font-800 text-primary">{plan?.rate}</span>
                  <span className="text-sm text-muted-foreground ml-2">{plan?.unit}</span>
                  <p className="text-xs text-muted-foreground mt-1">Starting rate · final price confirmed before work begins</p>
                </div>
                <ul className="space-y-3">
                  {plan?.features?.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-foreground">
                      <Icon name="CheckIcon" size={16} className="text-primary flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href="/request-a-quote"
                className="mt-8 flex items-center justify-center gap-2 py-4 rounded-full text-sm font-700 transition-colors border border-border text-foreground hover:bg-secondary"
              >
                {plan?.cta}
                <Icon name="ArrowRightIcon" size={16} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}