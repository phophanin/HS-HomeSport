import React from 'react';
import { Language, StoreSettings } from '../types';

interface ClubBannerProps {
  language: Language;
  settings: StoreSettings;
}

export const ClubBanner: React.FC<ClubBannerProps> = ({ language, settings }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="bg-[#f4f4f2] rounded-3xl border border-neutral-200/80 p-8 sm:p-10 lg:p-12 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Club Card Graphic */}
        <div className="lg:col-span-4 flex items-center justify-center">
          <div className="w-full max-w-xs aspect-[1.58/1] rounded-2xl bg-neutral-900 text-white p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-athletic text-lg font-bold tracking-wider">HOME SPORT</span>
                <span className="text-[10px] font-mono uppercase bg-white/20 px-2 py-0.5 rounded font-bold">CLUB</span>
              </div>
              <div className="text-[10px] text-neutral-400 font-mono tracking-widest mt-1">
                PREMIUM ATHLETE PASS
              </div>
            </div>

            <div className="flex items-end justify-between font-mono text-xs">
              <span className="text-neutral-400">@doublenin</span>
              <span className="text-amber-400 font-bold">VIP MEMBER</span>
            </div>
          </div>
        </div>

        {/* Center: Information & Perks (Clean text list) */}
        <div className="lg:col-span-5 space-y-4">
          <div>
            <h2 className="font-athletic text-2xl sm:text-3xl font-bold uppercase text-[#141513] tracking-tight">
              {language === 'km'
                ? 'ចូលរួមសហគមន៍ HOME SPORT TELEGRAM'
                : 'JOIN HOME SPORT TELEGRAM CLUB'}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 font-khmer mt-1">
              {language === 'km'
                ? 'ទទួលបានដំណឹងស្បែកជើងបាល់ទាត់មកដល់ថ្មីមុនគេ ការបញ្ចុះតម្លៃពិសេស និងសេវាកុម្ម៉ង់ផ្ទាល់រហ័ស។'
                : 'Exclusive drops, early access to limited edition boots, personalized support and member bonuses.'}
            </p>
          </div>

          {/* 4 Clean Text Perks (No icons) */}
          <div className="grid grid-cols-2 gap-2.5 pt-2 text-xs">
            <div className="p-2 bg-white rounded-lg border border-neutral-200/80 text-neutral-800">
              <span className="text-[11px] font-bold font-khmer">5% VIP Bonus</span>
            </div>

            <div className="p-2 bg-white rounded-lg border border-neutral-200/80 text-neutral-800">
              <span className="text-[11px] font-bold font-khmer">Early Boot Drops</span>
            </div>

            <div className="p-2 bg-white rounded-lg border border-neutral-200/80 text-neutral-800">
              <span className="text-[11px] font-bold font-khmer">Exclusive Discounts</span>
            </div>

            <div className="p-2 bg-white rounded-lg border border-neutral-200/80 text-neutral-800">
              <span className="text-[11px] font-bold font-khmer">Grip Socks Gifts</span>
            </div>
          </div>
        </div>

        {/* Right: Join Telegram Button (Clean normal text) */}
        <div className="lg:col-span-3 flex flex-col items-start lg:items-end justify-center space-y-2">
          <a
            href={`https://t.me/${settings.telegramUsername.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3.5 bg-neutral-900 hover:bg-black text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all text-center cursor-pointer"
          >
            <span>{language === 'km' ? 'ចូលរួម Telegram @doublenin' : 'Join Club @doublenin'}</span>
          </a>
          <span className="text-[11px] text-neutral-500 font-mono">
            Support: 24/7 Fast Response
          </span>
        </div>
      </div>
    </div>
  );
};
