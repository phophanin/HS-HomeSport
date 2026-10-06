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
      {/* Clean spacious banner without photo or 01 02 03 cards */}
      <div className="bg-[#f4f4f2] rounded-3xl border border-neutral-200/60 p-8 sm:p-12 lg:p-14 shadow-xs relative">
        <div className="max-w-3xl space-y-6">
          {/* Pill Tag */}
          <div className="inline-block bg-white border border-neutral-200/80 rounded-full px-4 py-1.5 text-xs font-semibold text-neutral-800 uppercase tracking-wider shadow-xs">
            {language === 'km' ? 'ការប្រមូលផ្តុំពិសេស · HOME SPORT' : 'PREMIUM ATHLETIC COLLECTION'}
          </div>

          {/* Giant Bold Headline */}
          <h1 className="font-athletic text-4xl sm:text-6xl lg:text-7xl font-bold uppercase text-[#141513] tracking-tight leading-[0.95] text-balance">
            {language === 'km' ? (
              <>
                ឈុតកីឡា & ស្បែកជើង <br />
                <span className="text-[#383b32]">សម្រាប់ជ័យជម្នះ</span>
              </>
            ) : (
              <>
                MATCHDAY GEAR <br />
                <span className="text-[#383b32]">FOR VICTORY</span>
              </>
            )}
          </h1>

          {/* Subtitle Description */}
          <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-khmer max-w-2xl">
            {language === 'km'
              ? 'ឧបករណ៍កីឡាអាជីព ស្បែកជើងបាល់ទាត់ អាវកីឡា និងសម្ភារៈហ្វឹកហាត់។ ផលិតឡើងសម្រាប់ប្រសិទ្ធភាពខ្ពស់បំផុត ស្ទុះលឿន និងផាសុកភាពលើគ្រប់ទីលានប្រកួត។'
              : 'Professional athletic sportswear, boots, jerseys and training essentials. Engineered for maximum performance, agility, and dominance on every pitch.'}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-3">
            <button
              onClick={onExploreClick}
              className="px-8 py-4 bg-neutral-900 hover:bg-black text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all cursor-pointer active:scale-95"
            >
              <span>{language === 'km' ? 'មើលទំនិញទាំងអស់' : 'Shop All Gear'}</span>
            </button>

            <a
              href={`https://t.me/${settings.telegramUsername.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-4 bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-300 font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer shadow-xs active:scale-95"
            >
              {language === 'km' ? 'Chat កុម្ម៉ង់ Telegram' : 'Direct Telegram'}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
