import React from 'react';
import { motion } from 'motion/react';
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
      {/* Clean spacious banner with Motion animations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="bg-[#f4f4f2] rounded-3xl border border-neutral-200/60 p-8 sm:p-12 lg:p-14 shadow-xs relative overflow-hidden"
      >
        {/* Subtle decorative athletic background watermarks with motion */}
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
          className="absolute -right-24 -bottom-24 w-96 h-96 rounded-full border border-neutral-300/40 pointer-events-none select-none"
        />

        <div className="max-w-3xl space-y-6 relative z-10">
          {/* Pill Tag with entrance */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-white border border-neutral-200/80 rounded-full px-4 py-1.5 text-xs font-semibold text-neutral-800 uppercase tracking-wider shadow-xs"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{language === 'km' ? 'ការប្រមូលផ្តុំពិសេស · ផ្ទះកីឡា' : 'PREMIUM ATHLETIC COLLECTION'}</span>
          </motion.div>

          {/* Giant Bold Headline with motion */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-athletic text-4xl sm:text-6xl lg:text-7xl font-bold uppercase text-[#141513] tracking-tight leading-[0.95] text-balance"
          >
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
          </motion.h1>

          {/* Subtitle Description */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-sm sm:text-base text-neutral-600 leading-relaxed font-khmer max-w-2xl"
          >
            {language === 'km'
              ? 'ឧបករណ៍កីឡាអាជីព ស្បែកជើងបាល់ទាត់ អាវកីឡា និងសម្ភារៈហ្វឹកហាត់។ ផលិតឡើងសម្រាប់ប្រសិទ្ធភាពខ្ពស់បំផុត ស្ទុះលឿន និងផាសុកភាពលើគ្រប់ទីលានប្រកួត។'
              : 'Professional athletic sportswear, boots, jerseys and training essentials. Engineered for maximum performance, agility, and dominance on every pitch.'}
          </motion.p>

          {/* Action Buttons with spring hover effects */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center gap-4 pt-3"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onExploreClick}
              className="px-8 py-4 bg-neutral-900 hover:bg-black text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer"
            >
              <span>{language === 'km' ? 'មើលទំនិញទាំងអស់' : 'Shop All Gear'}</span>
            </motion.button>

            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              href={`https://t.me/${settings.telegramUsername.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-4 bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-300 font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer shadow-xs"
            >
              {language === 'km' ? 'Chat កុម្ម៉ង់ Telegram' : 'Direct Telegram'}
            </motion.a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};
