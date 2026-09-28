'use client';
import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';

type ServiceType = 'transcription' | 'captioning';

const RATES: Record<ServiceType, number> = {
  transcription: 0.55,
  captioning: 0.75,
};

export default function PricingCalculator() {
  const router = useRouter();
  const [service, setService] = useState<ServiceType>('transcription');
  const [minutes, setMinutes] = useState<string>('60');
  const [inputError, setInputError] = useState('');

  const parsedMinutes = parseFloat(minutes);
  const validMinutes = !isNaN(parsedMinutes) && parsedMinutes > 0;
  const rate = RATES[service];
  const estimate = validMinutes ? parsedMinutes * rate : 0;

  const handleMinutesChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setMinutes(val);
    if (val === '') {
      setInputError('Please enter a duration.');
    } else if (isNaN(parseFloat(val)) || parseFloat(val) <= 0) {
      setInputError('Please enter a valid number of minutes.');
    } else {
      setInputError('');
    }
  }, []);

  const handleContinue = () => {
    if (!validMinutes) return;
    const params = new URLSearchParams({
      service,
      minutes: String(parsedMinutes),
      estimate: estimate.toFixed(2),
    });
    router.push(`/request-a-quote?${params.toString()}`);
  };

  return (
    <section className="py-24 bg-muted border-y border-border" id="calculator">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center space-y-3 mb-12">
          <span className="pill-badge">Pricing Estimator</span>
          <h2 className="text-section-title text-foreground">
            Estimate your project cost
          </h2>
          <p className="text-base text-muted-foreground max-w-xl mx-auto">
            Select a service and enter your audio or video duration to get an instant starting estimate.
          </p>
        </div>

        <div className="bg-card border border-border rounded-3xl p-8 md:p-10 shadow-sm space-y-8">
          {/* Service Toggle */}
          <div>
            <label className="block text-sm font-700 text-foreground mb-3">Service</label>
            <div className="flex gap-3 flex-wrap">
              {(['transcription', 'captioning'] as ServiceType[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setService(s)}
                  className={`px-6 py-3 rounded-full text-sm font-700 border transition-all min-h-[44px] ${
                    service === s
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background text-foreground border-border hover:border-primary hover:text-primary'
                  }`}
                >
                  {s === 'transcription' ? 'Transcription' : 'Captioning'}
                  <span className="ml-2 text-xs opacity-70">
                    ${RATES[s].toFixed(2)}/min
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Duration Input */}
          <div>
            <label htmlFor="calc-minutes" className="block text-sm font-700 text-foreground mb-3">
              Audio / Video Duration (minutes)
            </label>
            <div className="flex items-center gap-3">
              <input
                id="calc-minutes"
                type="number"
                min="1"
                step="0.5"
                value={minutes}
                onChange={handleMinutesChange}
                placeholder="e.g. 60"
                className="w-40 px-4 py-3 border border-border rounded-xl text-sm font-500 bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
              <span className="text-sm text-muted-foreground">minutes</span>
            </div>
            {inputError && (
              <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                <Icon name="ExclamationCircleIcon" size={14} />
                {inputError}
              </p>
            )}
          </div>

          {/* Calculation Display */}
          {validMinutes && (
            <div className="bg-secondary border border-primary/20 rounded-2xl p-6 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <Icon name="CalculatorIcon" size={18} className="text-primary" />
                <span className="text-xs font-700 uppercase tracking-wider text-primary">Estimated Starting Price</span>
              </div>
              <div className="text-sm text-muted-foreground">
                <span className="font-600 text-foreground">{parsedMinutes}-minute {service}</span>
                {' '}×{' '}
                <span className="font-600 text-foreground">${rate.toFixed(2)}</span>
                {' '}={' '}
                <span className="text-2xl font-800 text-primary">${estimate.toFixed(2)}</span>
                <span className="text-xs ml-1">estimated starting price</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed border-t border-border pt-3 mt-2">
                <strong>Disclaimer:</strong> This is an estimate based on the starting rate. The final quote may vary
                depending on audio quality, number of speakers, turnaround time, formatting requirements, timestamps,
                caption requirements and overall project complexity. I&apos;ll confirm the exact price before starting work.
              </p>
            </div>
          )}

          {/* CTA */}
          <button
            onClick={handleContinue}
            disabled={!validMinutes}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-4 rounded-full text-sm font-700 hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed min-h-[52px]"
          >
            Continue to Request a Quote
            <Icon name="ArrowRightIcon" size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}