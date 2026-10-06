import React from 'react';
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
    <div className="bg-white/95 border-y border-neutral-200/80 sticky top-18 sm:top-20 z-30 backdrop-blur-md shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 space-y-2.5">
        {/* Row 1: Category Segmented Scrollable Filter (Pure clean text, no icons) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-neutral-900 text-white shadow-xs font-bold'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 hover:text-neutral-900'
                }`}
              >
                <span>{language === 'km' ? cat.nameKm : cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Row 2: Secondary Controls: Brand, Size, Stock Toggle, Sort, Result Count */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 text-xs pt-2 border-t border-neutral-100">
          {/* Left Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Brand Dropdown */}
            <div className="flex items-center gap-1.5 bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-1.5 text-neutral-700">
              <span className="text-neutral-500 font-medium text-[11px]">
                {language === 'km' ? 'ម៉ាក:' : 'Brand:'}
              </span>
              <select
                value={selectedBrand}
                onChange={(e) => onSelectBrand(e.target.value)}
                className="bg-transparent text-neutral-900 font-semibold focus:outline-none cursor-pointer text-xs"
              >
                {BRANDS.map((b) => (
                  <option key={b} value={b} className="bg-white text-neutral-900">
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* In-Stock Toggle (Clean normal text) */}
            <button
              onClick={onToggleInStockOnly}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                inStockOnly
                  ? 'bg-neutral-900 text-white border-neutral-900 shadow-2xs font-bold'
                  : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:border-neutral-300'
              }`}
            >
              <span>{language === 'km' ? 'មានក្នុងស្តុក' : 'In Stock'}</span>
            </button>

            {/* Sale Toggle (Clean normal text) */}
            <button
              onClick={onToggleOnSaleOnly}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                onSaleOnly
                  ? 'bg-red-600 text-white border-red-600 shadow-2xs font-bold'
                  : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:border-neutral-300'
              }`}
            >
              <span>{language === 'km' ? 'បញ្ចុះតម្លៃ' : 'On Sale'}</span>
            </button>

            {/* Size Filter Pills (Desktop - Clean normal text) */}
            {availableSizes.length > 0 && (
              <div className="hidden lg:flex items-center gap-1 pl-2 border-l border-neutral-200">
                <span className="text-neutral-500 font-medium text-[11px] mr-1">
                  {language === 'km' ? 'ទំហំ:' : 'Size:'}
                </span>
                <button
                  onClick={() => onSelectSize('all')}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                    selectedSize === 'all'
                      ? 'bg-neutral-900 text-white font-bold'
                      : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  All
                </button>
                {availableSizes.slice(0, 7).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => onSelectSize(selectedSize === sz ? 'all' : sz)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                      selectedSize === sz
                        ? 'bg-neutral-900 text-white font-bold'
                        : 'text-neutral-700 bg-neutral-100 border border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Controls: Sort, Count & Clear */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-1.5 text-neutral-700">
              <span className="text-neutral-500 font-medium text-[11px]">
                {language === 'km' ? 'តម្រៀប:' : 'Sort:'}
              </span>
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                className="bg-transparent text-neutral-900 font-semibold focus:outline-none cursor-pointer text-xs"
              >
                <option value="featured">
                  {language === 'km' ? 'ពេញនិយម (Featured)' : 'Featured'}
                </option>
                <option value="price-asc">
                  {language === 'km' ? 'តម្លៃ: ទាប ទៅ ខ្ពស់' : 'Price: Low to High'}
                </option>
                <option value="price-desc">
                  {language === 'km' ? 'តម្លៃ: ខ្ពស់ ទៅ ទាប' : 'Price: High to Low'}
                </option>
                <option value="discount">
                  {language === 'km' ? 'បញ្ចុះតម្លៃច្រើនជាងគេ' : 'Highest Discount'}
                </option>
                <option value="newest">
                  {language === 'km' ? 'ទំនិញថ្មីៗ (Newest)' : 'Newest'}
                </option>
              </select>
            </div>

            {/* Results Count Badge */}
            <div className="hidden sm:block px-2.5 py-1.5 rounded-lg bg-neutral-100 text-neutral-700 text-xs font-mono font-medium">
              {totalResults}{' '}
              <span className="font-sans text-[11px]">
                {language === 'km' ? 'មុខទំនិញ' : 'items'}
              </span>
            </div>

            {/* Reset Filters button */}
            {hasActiveFilters && (
              <button
                onClick={onResetFilters}
                className="px-2.5 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold transition-all cursor-pointer"
                title="Reset all filters"
              >
                <span>{language === 'km' ? 'ជម្រះ Filter' : 'Clear Filter'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
