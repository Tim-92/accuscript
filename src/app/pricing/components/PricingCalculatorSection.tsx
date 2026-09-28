'use client';
import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';

type ServiceType = 'transcription' | 'captioning';
const RATES: Record<ServiceType, number> = { transcription: 0.55, captioning: 0.75 };

export default function PricingCalculatorSection() {
  const router = useRouter();
  const [service, setService] = useState<ServiceType>('transcription');
  const [minutes, setMinutes] = useState('60');
  const [inputError, setInputError] = useState('');

  const parsedMinutes = parseFloat(minutes);
  const validMinutes = !isNaN(parsedMinutes) && parsedMinutes > 0;
  const rate = RATES[service];
  const estimate = validMinutes ? parsedMinutes * rate : 0;

  const handleMinutesChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setMinutes(val);
    if (val === '' || isNaN(parseFloat(val)) || parseFloat(val) <= 0) {
      setInputError('Please enter a valid number of minutes.');
    } else {
      setInputError('');
    }
  }, []);

  const handleContinue = () => {
    if (!validMinutes) return;
    const params = new URLSearchParams({ service, minutes: String(parsedMinutes), estimate: estimate.toFixed(2) });
    router.push(`/request-a-quote?${params.toString()}`);
  };

  return (
    <section className="py-20 bg-muted border-b border-border" id="estimate">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center space-y-3 mb-10">
          <span className="pill-badge">Quick Estimator</span>
          <h2 className="text-section-title text-foreground">Calculate your estimate</h2>
        </div>
        <div className="bg-card border border-border rounded-3xl p-8 shadow-sm space-y-7">
          <div>
            <label className="block text-sm font-700 text-foreground mb-3">Service</label>
            <div className="flex gap-3 flex-wrap">
              {(['transcription', 'captioning'] as ServiceType[]).map((s) => (
                <button key={s} onClick={() => setService(s)}
                  className={`px-6 py-3 rounded-full text-sm font-700 border transition-all min-h-[44px] ${service === s ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-foreground border-border hover:border-primary'}`}>
                  {s === 'transcription' ? 'Transcription' : 'Captioning'}
                  <span className="ml-2 text-xs opacity-70">${RATES[s].toFixed(2)}/min</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="pricing-minutes" className="block text-sm font-700 text-foreground mb-3">Duration (minutes)</label>
            <input id="pricing-minutes" type="number" min="1" step="0.5" value={minutes} onChange={handleMinutesChange}
              className="w-40 px-4 py-3 border border-border rounded-xl text-sm font-500 bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all" />
            {inputError && <p className="text-xs text-red-500 mt-2 flex items-center gap-1"><Icon name="ExclamationCircleIcon" size={14} />{inputError}</p>}
          </div>
          {validMinutes && (
            <div className="bg-secondary border border-primary/20 rounded-2xl p-6 space-y-2">
              <p className="text-xs font-700 uppercase tracking-wider text-primary mb-2">Estimated Starting Price</p>
              <p className="text-sm text-muted-foreground">
                <span className="font-600 text-foreground">{parsedMinutes}-minute {service}</span> × <span className="font-600 text-foreground">${rate.toFixed(2)}</span> = <span className="text-2xl font-800 text-primary">${estimate.toFixed(2)}</span>
              </p>
              <p className="text-xs text-muted-foreground border-t border-border pt-3 mt-2">
                Estimate only. Final price confirmed before work begins.
              </p>
            </div>
          )}
          <button onClick={handleContinue} disabled={!validMinutes}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-4 rounded-full text-sm font-700 hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed min-h-[52px]">
            Continue to Request a Quote <Icon name="ArrowRightIcon" size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}