import React from 'react';
import { ArrowUpDown, Check, X, Tag } from 'lucide-react';
import { BRANDS, CATEGORIES } from '../data/defaultProducts';
import { Language } from '../types';

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'discount' | 'newest';

interface FilterBarProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  selectedBrand: string;
  onSelectBrand: (brand: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  inStockOnly: boolean;
  onToggleInStockOnly: () => void;
  onSaleOnly: boolean;
  onToggleOnSaleOnly: () => void;
  selectedSize: string;
  onSelectSize: (size: string) => void;
  availableSizes: string[];
  totalResults: number;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
  language: Language;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedBrand,
  onSelectBrand,
  sortBy,
  onSortChange,
  inStockOnly,
  onToggleInStockOnly,
  onSaleOnly,
  onToggleOnSaleOnly,
  selectedSize,
  onSelectSize,
  availableSizes,
  totalResults,
  onResetFilters,
  hasActiveFilters,
  language,
}) => {
  return (
    <div className="bg-neutral-950/95 border-b border-white/[0.08] sticky top-16 sm:top-18 z-30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 space-y-3">
        {/* Row 1: Category Segmented Scrollable Filter */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-white text-neutral-950 font-semibold shadow-xs'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{language === 'km' ? cat.nameKm : cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Row 2: Secondary Controls: Brand, Size, Stock Toggle, Sort, Result Count */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1 border-t border-white/[0.04]">
          {/* Left Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Brand Dropdown */}
            <div className="flex items-center gap-1 bg-neutral-900 border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-neutral-300">
              <span className="text-neutral-500 font-mono text-[11px]">
                {language === 'km' ? 'ម៉ាក:' : 'Brand:'}
              </span>
              <select
                value={selectedBrand}
                onChange={(e) => onSelectBrand(e.target.value)}
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer text-xs"
              >
                {BRANDS.map((b) => (
                  <option key={b} value={b} className="bg-neutral-900 text-neutral-200">
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* In-Stock Toggle */}
            <button
              onClick={onToggleInStockOnly}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                inStockOnly
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                  : 'bg-neutral-900 border-white/[0.08] text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                  inStockOnly ? 'bg-emerald-500 border-emerald-400 text-neutral-950' : 'border-neutral-600'
                }`}
              >
                {inStockOnly && <Check className="w-2.5 h-2.5 stroke-[3]" />}
              </div>
              <span>{language === 'km' ? 'មានក្នុងស្តុក' : 'In Stock'}</span>
            </button>

            {/* Sale Toggle */}
            <button
              onClick={onToggleOnSaleOnly}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                onSaleOnly
                  ? 'bg-amber-400/10 border-amber-400/40 text-amber-300'
                  : 'bg-neutral-900 border-white/[0.08] text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Tag className="w-3 h-3 text-amber-400" />
              <span>{language === 'km' ? 'បញ្ចុះតម្លៃ (Sale)' : 'Sale Offers'}</span>
            </button>

            {/* Size Filter Pills (Desktop) */}
            {availableSizes.length > 0 && (
              <div className="hidden xl:flex items-center gap-1 pl-2 border-l border-white/[0.08]">
                <span className="text-neutral-500 font-mono text-[11px] mr-1">Size:</span>
                <button
                  onClick={() => onSelectSize('all')}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                    selectedSize === 'all'
                      ? 'bg-white text-neutral-950 font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  All
                </button>
                {availableSizes.slice(0, 6).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => onSelectSize(selectedSize === sz ? 'all' : sz)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                      selectedSize === sz
                        ? 'bg-amber-400 text-neutral-950 font-bold'
                        : 'text-neutral-400 hover:text-white bg-neutral-900 border border-white/[0.06]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Controls: Sort & Clear */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-neutral-900 border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-neutral-300">
              <ArrowUpDown className="w-3 h-3 text-neutral-500" />
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer text-xs"
              >
                <option value="featured" className="bg-neutral-900 text-neutral-200">
                  {language === 'km' ? 'ពិសេស (Featured)' : 'Featured'}
                </option>
                <option value="price-asc" className="bg-neutral-900 text-neutral-200">
                  {language === 'km' ? 'តម្លៃទាប ➡ ខ្ពស់' : 'Price: Low to High'}
                </option>
                <option value="price-desc" className="bg-neutral-900 text-neutral-200">
                  {language === 'km' ? 'តម្លៃខ្ពស់ ➡ ទាប' : 'Price: High to Low'}
                </option>
                <option value="discount" className="bg-neutral-900 text-neutral-200">
                  {language === 'km' ? 'បញ្ចុះតម្លៃ (%)' : 'Biggest Discount'}
                </option>
                <option value="newest" className="bg-neutral-900 text-neutral-200">
                  {language === 'km' ? 'ទំនិញថ្មី (Newest)' : 'Newest First'}
                </option>
              </select>
            </div>

            {hasActiveFilters && (
              <button
                onClick={onResetFilters}
                className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-lg transition-colors flex items-center gap-1 text-[11px]"
                title="Reset Filters"
              >
                <X className="w-3.5 h-3.5" />
                <span>{language === 'km' ? 'សម្អាត' : 'Reset'}</span>
              </button>
            )}

            <span className="font-mono text-neutral-500 text-xs pl-1">
              ({totalResults})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
