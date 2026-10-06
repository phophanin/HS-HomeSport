import React, { useState } from 'react';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'all', labelEn: 'ALL PRODUCTS', labelKm: 'ទំនិញទាំងអស់' },
    { id: 'boots', labelEn: 'BOOTS', labelKm: 'ស្បែកជើងបាល់ទាត់' },
    { id: 'jerseys', labelEn: 'JERSEYS', labelKm: 'អាវកីឡា' },
    { id: 'shorts', labelEn: 'SHORTS', labelKm: 'ខោខ្លី' },
    { id: 'bags', labelEn: 'BAGS', labelKm: 'កាតាប' },
    { id: 'socks', labelEn: 'SOCKS & GEAR', labelKm: 'ស្រោមជើង & សម្ភារៈ' },
  ];

  const cleanTelegramUsername = settings.telegramUsername.replace('@', '').trim();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-200/90 shadow-2xs transition-all">
      {/* 1. Top Announcement Bar (Clean normal text, no emojis) */}
      <div className="bg-neutral-900 text-neutral-200 text-xs py-2 px-4 sm:px-8 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Left: Direct Telegram Link */}
          <a
            href={`https://t.me/${cleanTelegramUsername}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-400 hover:text-sky-300 font-bold text-xs tracking-wide transition-colors shrink-0"
            title="Chat on Telegram"
          >
            <span>Telegram: @{cleanTelegramUsername}</span>
          </a>

          {/* Center Announcement (Pure clean text) */}
          <div className="hidden md:flex flex-1 text-center font-medium items-center justify-center text-xs text-neutral-300 font-khmer">
            <span>
              {language === 'km'
                ? 'HOME SPORT Catalog · ដឹកជញ្ជូនរហ័ស ២៥ ខេត្ត-ក្រុង (ភ្នំពេញ ១-២ ម៉ោង)'
                : 'HOME SPORT Catalog · Fast Delivery 25 Provinces across Cambodia'}
            </span>
          </div>

          {/* Right: Currency & Language Switchers (Clean normal text) */}
          <div className="flex items-center gap-2.5 shrink-0 text-xs">
            {/* Language Toggle */}
            <button
              onClick={onLanguageToggle}
              className="text-neutral-300 hover:text-white font-bold transition-colors cursor-pointer bg-neutral-800 hover:bg-neutral-700 px-2.5 py-1 rounded text-xs"
              title="Change Language"
            >
              <span>{language === 'km' ? 'ខ្មែរ' : 'EN'}</span>
            </button>

            {/* Currency Toggle */}
            <button
              onClick={onCurrencyToggle}
              className="font-bold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer font-mono bg-neutral-800 hover:bg-neutral-700 px-2.5 py-1 rounded text-xs"
              title="Toggle Currency USD / KHR"
            >
              <span>{currency === 'USD' ? '$ USD' : '៛ KHR'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Left: Brand Logo Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1 text-xs font-bold text-neutral-800 hover:text-black border border-neutral-300 rounded px-2 py-1 cursor-pointer lg:hidden"
            title="Menu"
          >
            <span>Menu</span>
          </button>

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onSelectCategory('all');
            }}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <span className="font-display font-black text-xl sm:text-2xl tracking-tight text-neutral-950 uppercase leading-none">
              HOME <span className="text-red-600">SPORT</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 font-mono hidden sm:inline">
              CATALOG
            </span>
          </a>
        </div>

        {/* Center: Desktop Navigation Links (Normal clean text) */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-neutral-800 tracking-wider">
          {navLinks.map((link) => {
            const isSelected = activeCategory === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onSelectCategory(link.id)}
                className={`transition-colors py-1 relative cursor-pointer ${
                  isSelected
                    ? 'text-neutral-950 font-black'
                    : 'text-neutral-600 hover:text-neutral-950 font-bold'
                }`}
              >
                <span>{language === 'km' ? link.labelKm : link.labelEn}</span>
                {isSelected && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-neutral-950 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Actions with normal text labels */}
        <div className="flex items-center gap-2 sm:gap-3 text-neutral-800">
          {/* Search Input Box with Text */}
          <div className="flex items-center bg-neutral-100 rounded-lg px-2.5 py-1.5 w-36 sm:w-56 border border-neutral-200">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={language === 'km' ? 'ស្វែងរក...' : 'Search gear...'}
              className="w-full bg-transparent text-xs text-neutral-900 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="text-[11px] font-bold text-neutral-500 hover:text-black ml-1 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Telegram Chat Button (Clean text) */}
          <a
            href={`https://t.me/${cleanTelegramUsername}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-2xs transition-all cursor-pointer"
            title="Chat Direct to Telegram"
          >
            <span>{language === 'km' ? 'Chat Telegram' : 'Telegram'}</span>
          </a>

          {/* Inquiry Bag Button (Clean text with counter) */}
          <button
            onClick={onOpenCart}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-neutral-900 hover:bg-neutral-800 text-white transition-colors cursor-pointer flex items-center gap-1.5"
            title="Shopping Inquiry Bag"
          >
            <span>{language === 'km' ? 'កន្ត្រក' : 'Bag'}</span>
            <span className="font-mono bg-red-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {cartCount}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Clean text) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-200 px-6 py-4 bg-white space-y-2 shadow-md">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onSelectCategory(link.id);
                setIsMobileMenuOpen(false);
              }}
              className={`block w-full text-left py-2 text-xs font-bold tracking-wider cursor-pointer ${
                activeCategory === link.id ? 'text-red-600' : 'text-neutral-800 hover:text-black'
              }`}
            >
              {language === 'km' ? link.labelKm : link.labelEn}
            </button>
          ))}
          <div className="pt-3 border-t border-neutral-200 flex flex-col gap-2">
            <a
              href={`https://t.me/${cleanTelegramUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 bg-sky-500 text-white rounded-lg text-xs font-bold text-center"
            >
              Telegram: @{cleanTelegramUsername}
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
