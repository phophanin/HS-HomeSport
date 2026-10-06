import React from 'react';
import { Send, Phone, MapPin, Clock, Mail } from 'lucide-react';
import { Language, StoreSettings } from '../types';

interface FooterProps {
  settings: StoreSettings;
  language: Language;
  onOpenAdmin: () => void;
  onSelectCategory: (catId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  language,
  onOpenAdmin,
  onSelectCategory,
}) => {
  return (
    <footer className="bg-white border-t border-neutral-200/80 text-neutral-600 text-xs mt-12">
      {/* Upper Footer Columns (Exact match to reference image) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 border-b border-neutral-200/60">
        {/* Brand & Socials Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2b2d26] text-white font-athletic text-lg font-black flex items-center justify-center tracking-tighter">
              HS
            </div>
            <div>
              <span className="font-athletic text-xl font-bold tracking-wider text-[#1c1d1a] uppercase leading-none">
                HOME <span className="text-[#383b32]">SPORT</span>
              </span>
              <div className="text-[9px] uppercase tracking-widest text-neutral-400 font-semibold">
                Move Ahead · Catalog
              </div>
            </div>
          </div>

          <p className="text-neutral-500 text-xs leading-relaxed font-khmer max-w-sm">
            {language === 'km'
              ? 'ឧបករណ៍កីឡាអាជីព ស្បែកជើងបាល់ទាត់ អាវកីឡា និងសម្ភារៈហ្វឹកហាត់។ បច្ចេកវិទ្យាទំនើប ផាសុកភាព និងស្ទីលប្រណិតក្នុងផលិតផលនីមួយៗ។'
              : 'Premium athletic equipment for football and active lifestyle. Advanced technology, comfort and style in every product.'}
          </p>

          {/* Social Links (Clean normal text) */}
          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
            <a
              href={`https://t.me/${settings.telegramUsername.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-900 hover:text-white font-bold transition-colors"
            >
              <span>Telegram: @{settings.telegramUsername.replace('@', '')}</span>
            </a>
            <a
              href={`https://m.me/${settings.facebookPage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-900 hover:text-white font-bold transition-colors"
            >
              <span>Facebook</span>
            </a>
            <a
              href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
              className="px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-900 hover:text-white font-bold transition-colors"
            >
              <span>Call: {settings.phone}</span>
            </a>
          </div>
        </div>

        {/* Column 1: Catalog */}
        <div className="space-y-3">
          <h4 className="font-athletic text-xs font-bold text-neutral-900 uppercase tracking-wider">
            {language === 'km' ? 'កាតាឡុក' : 'CATALOG'}
          </h4>
          <ul className="space-y-2 text-xs text-neutral-500">
            <li>
              <button
                onClick={() => onSelectCategory('boots')}
                className="hover:text-black transition-colors cursor-pointer"
              >
                {language === 'km' ? 'ស្បែកជើង' : 'Shoes & Boots'}
              </button>
            </li>
            <li>
              <button
                onClick={() => onSelectCategory('jerseys')}
                className="hover:text-black transition-colors cursor-pointer"
              >
                {language === 'km' ? 'អាវកីឡា & ប៉ូឡូ' : 'Jerseys & Polos'}
              </button>
            </li>
            <li>
              <button
                onClick={() => onSelectCategory('bags')}
                className="hover:text-black transition-colors cursor-pointer"
              >
                {language === 'km' ? 'កាតាបកីឡា' : 'Sports Bags'}
              </button>
            </li>
            <li>
              <button
                onClick={() => onSelectCategory('shorts')}
                className="hover:text-black transition-colors cursor-pointer"
              >
                {language === 'km' ? 'ខោខ្លី' : 'Match Shorts'}
              </button>
            </li>
            <li>
              <button
                onClick={() => onSelectCategory('socks')}
                className="hover:text-black transition-colors cursor-pointer"
              >
                {language === 'km' ? 'ស្រោមជើង Grip' : 'Grip Socks'}
              </button>
            </li>
            <li>
              <button
                onClick={() => onSelectCategory('all')}
                className="hover:text-black transition-colors cursor-pointer font-medium text-neutral-800"
              >
                {language === 'km' ? 'ទំនិញទាំងអស់' : 'All Products'}
              </button>
            </li>
          </ul>
        </div>

        {/* Column 2: Customer Service */}
        <div className="space-y-3">
          <h4 className="font-athletic text-xs font-bold text-neutral-900 uppercase tracking-wider">
            {language === 'km' ? 'សេវាកម្មអតិថិជន' : 'CUSTOMER CARE'}
          </h4>
          <ul className="space-y-2 text-xs text-neutral-500 font-khmer">
            <li>{language === 'km' ? 'ការដឹកជញ្ជូន & ទូទាត់' : 'Delivery & Payment'}</li>
            <li>{language === 'km' ? 'ការប្តូរទំនិញក្នុង ៣ ថ្ងៃ' : '3-Day Size Exchange'}</li>
            <li>{language === 'km' ? 'តារាងទំហំ Size Guide' : 'Boot Size Guide'}</li>
            <li>{language === 'km' ? 'កម្មវិធីសមាជិក Club' : 'Telegram Club'}</li>
            <li>{language === 'km' ? 'សំណួរញឹកញាប់ (FAQ)' : 'Help & FAQ'}</li>
          </ul>
        </div>

        {/* Column 3: Company */}
        <div className="space-y-3">
          <h4 className="font-athletic text-xs font-bold text-neutral-900 uppercase tracking-wider">
            {language === 'km' ? 'អំពីហាង' : 'COMPANY'}
          </h4>
          <ul className="space-y-2 text-xs text-neutral-500 font-khmer">
            <li>{language === 'km' ? 'អំពី HOME SPORT' : 'About HOME SPORT'}</li>
            <li>{language === 'km' ? 'បច្ចេកវិទ្យា & គុណភាព' : 'Technology & Fabric'}</li>
            <li>{language === 'km' ? 'សេចក្តីប្រកាសព័ត៌មាន' : 'Catalog News'}</li>
            <li>{language === 'km' ? 'សេវាកម្មអតិថិជន' : 'Customer Service'}</li>
          </ul>
        </div>

        {/* Column 4: Contacts */}
        <div className="space-y-3">
          <h4 className="font-athletic text-xs font-bold text-neutral-900 uppercase tracking-wider">
            {language === 'km' ? 'ទំនាក់ទំនង' : 'CONTACTS'}
          </h4>
          <ul className="space-y-2 text-xs text-neutral-600">
            <li>
              <span className="text-neutral-400 font-medium">Phone: </span>
              <span className="font-mono font-bold text-neutral-800">{settings.phone}</span>
            </li>
            <li>
              <span className="text-neutral-400 font-medium">Telegram: </span>
              <a
                href={`https://t.me/${settings.telegramUsername.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono font-bold text-sky-600 hover:underline"
              >
                @{settings.telegramUsername.replace('@', '')}
              </a>
            </li>
            <li className="font-khmer">
              <span className="text-neutral-400 font-medium">Address: </span>
              <span>{language === 'km' ? settings.addressKm : settings.addressEn}</span>
            </li>
            <li>
              <span className="text-neutral-400 font-medium">Hours: </span>
              <span>{language === 'km' ? '8:00 – 21:00' : 'Daily 8:00 – 21:00'}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Lower Copyright Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-neutral-400">
        <div>
          © {new Date().getFullYear()} HOME SPORT Catalog. All rights reserved.
        </div>
        <div className="flex items-center gap-4 sm:gap-6">
          <span className="hover:text-black cursor-pointer">
            {language === 'km' ? 'គោលការណ៍ភាពឯកជន' : 'Privacy Policy'}
          </span>
          <span className="hover:text-black cursor-pointer">
            {language === 'km' ? 'លក្ខខណ្ឌប្រើប្រាស់' : 'Terms of Service'}
          </span>
          <button
            onClick={onOpenAdmin}
            className="hover:text-neutral-700 transition-colors cursor-pointer text-[10px] text-neutral-400 font-mono tracking-tight flex items-center gap-1"
            title="Owner Admin Access (PIN Protected)"
          >
            <span>🔒</span>
            <span>{language === 'km' ? 'Admin ម្ចាស់ហាង' : 'Owner Admin'}</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
