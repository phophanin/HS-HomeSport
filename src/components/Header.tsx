import React, { useState } from 'react';
import { Search, ShoppingBag, SlidersHorizontal, Globe, X } from 'lucide-react';
import { Currency, Language, StoreSettings } from '../types';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  currency: Currency;
  onCurrencyToggle: () => void;
  language: Language;
  onLanguageToggle: () => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  settings: StoreSettings;
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  currency,
  onCurrencyToggle,
  language,
  onLanguageToggle,
  cartCount,
  onOpenCart,
  onOpenAdmin,
  settings,
  activeCategory,
  onSelectCategory,
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navLinks = [
    { id: 'all', labelEn: 'All Collection', labelKm: 'ទំនិញទាំងអស់' },
    { id: 'boots', labelEn: 'Boots', labelKm: 'ស្បែកជើង' },
    { id: 'jerseys', labelEn: 'Jerseys', labelKm: 'អាវកីឡា' },
    { id: 'shorts', labelEn: 'Shorts', labelKm: 'ខោខ្លី' },
    { id: 'socks', labelEn: 'Grip Socks', labelKm: 'ស្រោមជើង' },
    { id: 'gloves', labelEn: 'Gloves & Gear', labelKm: 'សម្ភារៈ' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-neutral-950/90 backdrop-blur-xl border-b border-white/[0.08] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between gap-4">
        {/* Zone 1: Clean Minimalist Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onSelectCategory('all');
            }}
            className="group flex items-center gap-2.5"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-400 to-amber-200 text-neutral-950 font-athletic text-lg font-black flex items-center justify-center tracking-tighter shadow-sm group-hover:scale-105 transition-transform">
              HS
            </div>
            <div className="flex flex-col">
              <span className="font-athletic text-xl font-bold tracking-wider text-white group-hover:text-amber-300 transition-colors uppercase leading-none">
                HOME<span className="text-amber-400">SPORT</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-medium">
                Catalog & Direct Order
              </span>
            </div>
          </a>
        </div>

        {/* Zone 2: Clean Typography Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1.5 text-xs font-medium">
          {navLinks.map((link) => {
            const isActive = activeCategory === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onSelectCategory(link.id)}
                className={`px-3 py-1.5 rounded-full transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'text-neutral-950 bg-white font-semibold shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                }`}
              >
                {language === 'km' ? link.labelKm : link.labelEn}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Trigger / Inline Input */}
          <div className="relative">
            {isSearchOpen ? (
              <div className="flex items-center bg-neutral-900 border border-white/10 rounded-full pl-3 pr-2 py-1 w-56 sm:w-72 animate-in fade-in zoom-in-95 duration-150">
                <Search className="w-3.5 h-3.5 text-neutral-400 shrink-0 mr-2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder={language === 'km' ? 'ស្វែងរក ស្បែកជើង, អាវ...' : 'Search boots, jerseys...'}
                  className="w-full bg-transparent text-xs text-white placeholder-neutral-500 focus:outline-none"
                  autoFocus
                />
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    onSearchChange('');
                  }}
                  className="p-1 text-neutral-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-full transition-colors flex items-center gap-1.5 text-xs"
                title="Search Products"
              >
                <Search className="w-4 h-4" />
                <span className="hidden md:inline text-neutral-400 text-xs font-normal">
                  {language === 'km' ? 'ស្វែងរក' : 'Search'}
                </span>
              </button>
            )}
          </div>

          {/* Segmented Currency Selector */}
          <div className="flex items-center p-0.5 bg-neutral-900 border border-white/[0.08] rounded-full text-[11px] font-mono">
            <button
              onClick={() => currency !== 'USD' && onCurrencyToggle()}
              className={`px-2 py-1 rounded-full transition-all ${
                currency === 'USD'
                  ? 'bg-neutral-800 text-white font-bold shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              $ USD
            </button>
            <button
              onClick={() => currency !== 'KHR' && onCurrencyToggle()}
              className={`px-2 py-1 rounded-full transition-all ${
                currency === 'KHR'
                  ? 'bg-amber-400 text-neutral-950 font-bold shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              ៛ KHR
            </button>
          </div>

          {/* Language Toggle */}
          <button
            onClick={onLanguageToggle}
            className="px-2.5 py-1 text-neutral-300 hover:text-white bg-neutral-900/80 hover:bg-neutral-850 border border-white/[0.08] rounded-full text-xs font-medium transition-all flex items-center gap-1"
            title="Switch Language"
          >
            <Globe className="w-3 h-3 text-neutral-400" />
            <span>{language === 'km' ? 'ខ្មែរ' : 'EN'}</span>
          </button>

          {/* Order Bag Button */}
          <button
            onClick={onOpenCart}
            className="relative px-3 py-1.5 bg-neutral-900 hover:bg-neutral-850 border border-white/[0.08] hover:border-white/20 rounded-full text-white text-xs font-medium transition-all flex items-center gap-2 group"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline font-mono">Bag</span>
            {cartCount > 0 ? (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-neutral-950 text-[10px] font-black font-mono">
                {cartCount}
              </span>
            ) : (
              <span className="text-neutral-500 font-mono text-[11px]">0</span>
            )}
          </button>

          {/* Admin Settings Button */}
          <button
            onClick={onOpenAdmin}
            className="p-2 text-neutral-400 hover:text-amber-300 hover:bg-neutral-900 rounded-full transition-colors"
            title="Store Admin Panel"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
