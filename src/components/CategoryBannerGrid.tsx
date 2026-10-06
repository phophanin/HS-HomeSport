import React from 'react';
import { Language, StoreSettings } from '../types';

interface CategoryBannerGridProps {
  language: Language;
  onSelectCategory: (catId: string) => void;
  settings: StoreSettings;
}

export const CategoryBannerGrid: React.FC<CategoryBannerGridProps> = ({
  language,
  onSelectCategory,
  settings,
}) => {
  const cards = [
    {
      id: 'boots',
      titleEn: "MEN'S FOOTBALL",
      titleKm: 'ស្បែកជើងបាល់ទាត់',
      descEn: 'Engineered for explosive acceleration & turf traction',
      descKm: 'រចនាឡើងសម្រាប់ល្បឿនស្ទុះ និងទាត់បាល់មានលំនឹងខ្ពស់',
      image: settings.categoryBootsImage || '/src/assets/images/cat_football_boots_1791255998020.jpg',
    },
    {
      id: 'jerseys',
      titleEn: 'MATCH KITS & POLOS',
      titleKm: 'អាវកីឡាផ្លូវការ',
      descEn: 'Breathable lightweight weave for matchday dominance',
      descKm: 'ក្រណាត់ត្រជាក់ស្រួល បឺតញើស និងមានខ្យល់ចេញចូលល្អ',
      image: settings.categoryJerseysImage || '/src/assets/images/cat_match_jerseys_1791256009910.jpg',
    },
    {
      id: 'socks',
      titleEn: 'PRO ACCESSORIES',
      titleKm: 'សម្ភារៈកីឡា & ស្រោមជើង',
      descEn: 'Silicone anti-slip grip socks & training essentials',
      descKm: 'ស្រោមជើង Grip ការពារការរអិល និងសម្ភារៈហ្វឹកហាត់',
      image: settings.categorySocksImage || '/src/assets/images/cat_accessories_gear_1791256021862.jpg',
    },
    {
      id: 'bags',
      titleEn: 'SPORTS TRAVEL BAGS',
      titleKm: 'កាតាបកីឡា',
      descEn: 'Waterproof multi-compartment boot duffle bags',
      descKm: 'កាតាបស្ពាយធំទូលាយ មានថតដាច់ដោយឡែកដាក់ស្បែកជើង',
      image: settings.categoryBagsImage || '/src/assets/images/cat_sport_bags_1791256037463.jpg',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => onSelectCategory(card.id)}
            className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer shadow-xs border border-neutral-200/60"
          >
            {/* Background Lifestyle Image */}
            <img
              src={card.image}
              alt={card.titleEn}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            />

            {/* Dark Gradient Overlay for legible typography */}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/30 to-transparent" />

            {/* Content pinned to bottom */}
            <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col justify-end text-white space-y-1.5">
              <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-300 font-mono">
                COLLECTION
              </span>

              <h3 className="font-athletic text-lg sm:text-xl font-bold tracking-tight uppercase leading-tight">
                {language === 'km' ? card.titleKm : card.titleEn}
              </h3>

              <p className="text-[11px] text-neutral-300 font-khmer line-clamp-1 leading-normal opacity-90">
                {language === 'km' ? card.descKm : card.descEn}
              </p>

              <div className="pt-2">
                <span className="inline-block px-3 py-1 bg-white/20 hover:bg-white text-white hover:text-black rounded-lg text-xs font-bold backdrop-blur-xs transition-colors">
                  {language === 'km' ? 'មើលទំនិញ' : 'Explore'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
