import React from 'react';
import { Truck, RotateCcw, ShieldCheck, Headphones } from 'lucide-react';
import { Language, StoreSettings } from '../types';

interface TrustBarProps {
  language: Language;
  settings: StoreSettings;
}

export const TrustBar: React.FC<TrustBarProps> = ({ language, settings }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-xs grid grid-cols-2 md:grid-cols-4 gap-6">
        {/* Item 1 */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-800 shrink-0">
            <Truck className="w-5 h-5 stroke-[1.5]" />
          </div>
          <div className="text-xs">
            <div className="font-bold text-neutral-900 leading-tight">
              {language === 'km' ? 'ដឹកជញ្ជូនរហ័ស' : 'Free Delivery'}
            </div>
            <div className="text-neutral-500 text-[11px] mt-0.5 font-khmer">
              {language === 'km' ? '២៥ ខេត្ត-ក្រុង' : 'All 25 Provinces'}
            </div>
          </div>
        </div>

        {/* Item 2 */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-800 shrink-0">
            <RotateCcw className="w-5 h-5 stroke-[1.5]" />
          </div>
          <div className="text-xs">
            <div className="font-bold text-neutral-900 leading-tight">
              {language === 'km' ? 'ប្តូរ Size ងាយស្រួល' : 'Easy Exchange'}
            </div>
            <div className="text-neutral-500 text-[11px] mt-0.5 font-khmer">
              {language === 'km' ? 'ក្នុងរយៈពេល ៣ ថ្ងៃ' : 'Within 3 days'}
            </div>
          </div>
        </div>

        {/* Item 3 */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-800 shrink-0">
            <ShieldCheck className="w-5 h-5 stroke-[1.5]" />
          </div>
          <div className="text-xs">
            <div className="font-bold text-neutral-900 leading-tight">
              {language === 'km' ? 'ទំនិញសុទ្ធ ១០០%' : '100% Original'}
            </div>
            <div className="text-neutral-500 text-[11px] mt-0.5 font-khmer">
              {language === 'km' ? 'ធានាគុណភាពផ្លូវការ' : 'Verified authenticity'}
            </div>
          </div>
        </div>

        {/* Item 4 */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-800 shrink-0">
            <Headphones className="w-5 h-5 stroke-[1.5]" />
          </div>
          <div className="text-xs">
            <div className="font-bold text-neutral-900 leading-tight">
              {language === 'km' ? 'សេវាជំនួយ ២៤/៧' : '24/7 Support'}
            </div>
            <div className="text-neutral-500 text-[11px] mt-0.5 font-khmer">
              <a
                href={`https://t.me/${settings.telegramUsername.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#383b32] font-semibold hover:underline"
              >
                @{settings.telegramUsername.replace('@', '')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
