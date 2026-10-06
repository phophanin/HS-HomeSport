import React from 'react';
import { Language, StoreSettings } from '../types';

interface HeroBannerProps {
  language: Language;
  onExploreClick: () => void;
  settings: StoreSettings;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  language,
  onExploreClick,
  settings,
}) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-4">
      {/* Container with light rounded canvas */}
      <div className="bg-[#f4f4f2] rounded-3xl overflow-hidden border border-neutral-200/60 p-6 sm:p-10 lg:p-12 relative shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Headline & Action Buttons */}
          <div className="lg:col-span-5 space-y-6 z-10">
            {/* Pill Tag */}
            <div className="inline-block bg-white/90 border border-neutral-200/80 rounded-full px-3.5 py-1 text-[11px] font-semibold text-neutral-700 uppercase tracking-wider shadow-xs">
              {language === 'km' ? 'ការប្រមូលផ្តុំពិសេស · 2024/25' : 'PREMIUM COLLECTION'}
            </div>

            {/* Giant Bold Headline */}
            <h1 className="font-athletic text-4xl sm:text-5xl lg:text-6xl font-bold uppercase text-[#141513] tracking-tight leading-[0.95] text-balance">
              {language === 'km' ? (
                <>
                  ឈុតកីឡា & ស្បែកជើង <br />
                  សម្រាប់ជ័យជម្នះ
                </>
              ) : (
                <>
                  MATCHDAY KIT <br />
                  FOR VICTORY
                </>
              )}
            </h1>

            {/* Subtitle Description */}
            <p className="text-sm text-neutral-600 leading-relaxed font-khmer max-w-md">
              {language === 'km'
                ? 'ឧបករណ៍កីឡាអាជីព ផលិតឡើងសម្រាប់ប្រសិទ្ធភាពខ្ពស់បំផុត ស្ទុះលឿន និងផាសុកភាពលើគ្រប់ទីលានប្រកួត។'
                : 'Professional athletic sportswear engineered for maximum performance, agility, and dominance on every pitch.'}
            </p>

            {/* Action Buttons (Clean normal text) */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onExploreClick}
                className="px-6 py-3.5 bg-neutral-900 hover:bg-black text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <span>{language === 'km' ? 'មើលទំនិញទាំងអស់' : 'Shop Collection'}</span>
              </button>

              <a
                href={`https://t.me/${settings.telegramUsername.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs sm:text-sm font-bold text-neutral-700 hover:text-black transition-colors underline-offset-4 hover:underline cursor-pointer"
              >
                {language === 'km' ? 'កុម្ម៉ង់តាម Telegram' : 'Direct Telegram'}
              </a>
            </div>

            {/* Slide Pagination Indicator */}
            <div className="pt-4 flex items-center gap-3 text-xs font-mono text-neutral-400">
              <span className="text-black font-bold">01</span>
              <span>02</span>
              <span>03</span>
            </div>
          </div>

          {/* Center Column: Athlete Photo with Bag */}
          <div className="lg:col-span-4 relative flex items-center justify-center">
            <div className="relative w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden shadow-xs border border-white/60">
              <img
                src={settings.heroBannerImage || '/src/assets/images/hero_athlete_light_1791255981071.jpg'}
                alt="HOME SPORT Athlete Campaign"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>

          {/* Far Right Column: 3 Clean Typography Trust Cards (No icons) */}
          <div className="lg:col-span-3 space-y-3">
            {/* Card 1: Free Delivery */}
            <div className="p-4 bg-white rounded-2xl border border-neutral-200/80 shadow-xs flex items-start gap-3.5 hover:border-neutral-300 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-900 font-mono font-bold text-xs shrink-0">
                01
              </div>
              <div className="text-xs">
                <div className="font-bold text-neutral-900 leading-tight">
                  {language === 'km' ? 'ដឹកជញ្ជូនរហ័ស' : 'Fast Delivery'}
                </div>
                <div className="text-neutral-500 text-[11px] mt-0.5 font-khmer">
                  {language === 'km' ? 'ទូទាំង ២៥ ខេត្ត-ក្រុង' : 'Across 25 provinces'}
                </div>
              </div>
            </div>

            {/* Card 2: Size Trial */}
            <div className="p-4 bg-white rounded-2xl border border-neutral-200/80 shadow-xs flex items-start gap-3.5 hover:border-neutral-300 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-900 font-mono font-bold text-xs shrink-0">
                02
              </div>
              <div className="text-xs">
                <div className="font-bold text-neutral-900 leading-tight">
                  {language === 'km' ? 'សាកល្បង Size' : 'Size Exchange'}
                </div>
                <div className="text-neutral-500 text-[11px] mt-0.5 font-khmer">
                  {language === 'km' ? 'ប្តូរបានក្នុងរយៈពេល ៣ ថ្ងៃ' : 'Exchange within 3 days'}
                </div>
              </div>
            </div>

            {/* Card 3: 100% Original */}
            <div className="p-4 bg-white rounded-2xl border border-neutral-200/80 shadow-xs flex items-start gap-3.5 hover:border-neutral-300 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-900 font-mono font-bold text-xs shrink-0">
                03
              </div>
              <div className="text-xs">
                <div className="font-bold text-neutral-900 leading-tight">
                  {language === 'km' ? 'ទំនិញសុទ្ធ ១០០%' : '100% Original Gear'}
                </div>
                <div className="text-neutral-500 text-[11px] mt-0.5 font-khmer">
                  {language === 'km' ? 'ធានាគុណភាពផ្លូវការ' : 'Guaranteed performance'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
