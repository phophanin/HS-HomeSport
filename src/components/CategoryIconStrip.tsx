import React from 'react';
import { CATEGORIES } from '../data/defaultProducts';
import { Language } from '../types';

interface CategoryIconStripProps {
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
  language: Language;
}

export const CategoryIconStrip: React.FC<CategoryIconStripProps> = ({
  selectedCategory,
  onSelectCategory,
  language,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
      <div className="bg-white rounded-xl border border-neutral-200/90 p-1.5 shadow-2xs flex items-center justify-between gap-1 overflow-x-auto scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                isSelected
                  ? 'bg-neutral-900 text-white shadow-xs font-bold'
                  : 'text-neutral-700 hover:text-black hover:bg-neutral-100'
              }`}
            >
              <span>{language === 'km' ? cat.nameKm : cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
