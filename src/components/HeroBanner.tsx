import React from 'react';
import { ArrowRight, Send, ShieldCheck, Truck } from 'lucide-react';
import { Language, StoreSettings } from '../types';

interface HeroBannerProps {
  language: Language;
  onExploreClick: () => void;
  productCount: number;
  settings: StoreSettings;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  language,
  onExploreClick,
  productCount,
  settings,
}) => {
  return (
    <section className="relative overflow-hidden bg-neutral-950 border-b border-white/[0.08]">
      {/* Cinematic Background with Measured Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_football_boot_1791205260989.jpg"
          alt="HOME SPORT Elite Football Campaign"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-45 scale-105 transition-transform duration-1000 ease-out"
        />
        {/* Measured Vignette Scrim */}
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/85 to-neutral-950/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 lg:py-28">
        <div className="max-w-2xl space-y-6">
          {/* Subtle Editorial Kicker */}
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400">
            <span>Official 2024/25 Catalog</span>
            <span aria-hidden="true" className="text-neutral-600">/</span>
            <span>Phnom Penh, Cambodia</span>
          </div>

          {/* Headline with text-wrap balance */}
          <h1 className="font-athletic text-4xl sm:text-6xl lg:text-7xl font-bold uppercase text-white tracking-tight leading-[0.95] text-balance">
            Precision Gear. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-white">
              Matchday Ready.
            </span>
          </h1>

          {/* Subtitle in clean prose */}
          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-khmer max-w-xl">
            {language === 'km'
              ? 'កាតាឡុកស្បែកជើងបាល់ទាត់ អាវកីឡាឈុតក្លឹប ខោ និងសម្ភារៈកីឡាគុណភាពខ្ពស់ ពិនិត្យ Size និង Stock ផ្ទាល់ រួចចុច Chat កុម្ម៉ង់តាម Telegram ភ្លាមៗ។'
              : 'Authentic football boots, club jerseys, and performance technical gear with real-time size availability. Connect directly via Telegram for instant orders.'}
          </p>

          {/* Direct Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onExploreClick}
              className="px-6 py-3 bg-white hover:bg-neutral-200 text-neutral-950 font-athletic text-base font-bold tracking-wider uppercase rounded-full shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <span>{language === 'km' ? 'ចូលមើលកាតាឡុក' : 'Explore Collection'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href={`https://t.me/${settings.telegramUsername.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 bg-neutral-900/90 hover:bg-neutral-800 text-white border border-white/10 hover:border-white/20 rounded-full font-athletic text-base tracking-wider uppercase transition-all flex items-center gap-2"
            >
              <Send className="w-4 h-4 text-sky-400" />
              <span>Telegram Chat</span>
            </a>
          </div>

          {/* Trust Metrics Adjacency (Zero-Pill, Typographic Separators) */}
          <div className="pt-6 border-t border-white/[0.08] flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-neutral-400 font-medium">
            <div className="flex items-center gap-2 text-neutral-200">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>100% Genuine Athletic Equipment</span>
            </div>
            <span aria-hidden="true" className="text-neutral-700 hidden sm:inline">·</span>
            <div className="flex items-center gap-2 text-neutral-200">
              <Truck className="w-4 h-4 text-amber-400" />
              <span>{language === 'km' ? 'ដឹកជញ្ជូនរហ័ស ២៥ ខេត្ត-ក្រុង' : '25 Provinces Fast Delivery'}</span>
            </div>
            <span aria-hidden="true" className="text-neutral-700 hidden sm:inline">·</span>
            <div className="font-mono text-neutral-400">
              {productCount} {language === 'km' ? 'ទំនិញក្នុងស្តុក' : 'Curated Items'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
