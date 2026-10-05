import React from 'react';
import { Send, MessageCircle, Phone, MapPin, ShieldCheck, Truck, Clock, Sparkles } from 'lucide-react';
import { Language, StoreSettings } from '../types';

interface FooterProps {
  settings: StoreSettings;
  language: Language;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, language, onOpenAdmin }) => {
  return (
    <footer className="bg-neutral-950 border-t border-neutral-800 text-neutral-400 text-xs">
      {/* Upper info banners */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-6 border-b border-neutral-850">
        {/* Brand & Mission */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center font-athletic text-xl font-black text-neutral-950">
              HS
            </div>
            <span className="font-athletic text-xl font-black text-white tracking-wider">
              HOME <span className="text-amber-400">SPORT</span>
            </span>
          </div>
          <p className="text-neutral-400 leading-relaxed font-khmer text-[11px]">
            {language === 'km'
              ? 'កាតាឡុកទំនិញកីឡាជំនាញ ស្បែកជើងបាល់ទាត់ អាវកីឡាឈុតក្លឹប ខោ ស្រោមជើង និងសម្ភារៈកីឡាគ្រប់ប្រភេទ គុណភាពសុទ្ធ ១០០%។'
              : 'Professional football boots & sportswear catalog. High quality, verified sizes and instant chat-to-order system.'}
          </p>
          <div className="text-[11px] text-amber-400/90 font-mono">
            {language === 'km' ? `អត្រាប្រាក់: 1$ = ${settings.exchangeRate.toLocaleString()} ៛` : `Rate: $1 = ${settings.exchangeRate.toLocaleString()} KHR`}
          </div>
        </div>

        {/* Quick Contact & Order channels */}
        <div className="space-y-2">
          <h4 className="font-athletic font-bold text-white uppercase tracking-wider text-xs">
            {language === 'km' ? 'ទំនាក់ទំនងកុម្ម៉ង់ផ្ទាល់' : 'Direct Order Channels'}
          </h4>
          <ul className="space-y-1.5 text-[11px]">
            <li>
              <a
                href={`https://t.me/${settings.telegramUsername.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sky-400 hover:text-sky-300 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Telegram: @{settings.telegramUsername.replace('@', '')}</span>
              </a>
            </li>
            <li>
              <a
                href={`https://m.me/${settings.facebookPage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Messenger: /{settings.facebookPage}</span>
              </a>
            </li>
            <li>
              <a
                href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
                className="flex items-center gap-2 text-neutral-300 hover:text-white transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>{settings.phone}</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Address & Hours */}
        <div className="space-y-2">
          <h4 className="font-athletic font-bold text-white uppercase tracking-wider text-xs">
            {language === 'km' ? 'ទីតាំង & ម៉ោងបើកហាង' : 'Location & Store Hours'}
          </h4>
          <div className="space-y-1.5 text-[11px]">
            <p className="flex items-start gap-1.5 font-khmer">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-amber-400 mt-0.5" />
              <span>{language === 'km' ? settings.addressKm : settings.addressEn}</span>
            </p>
            <p className="flex items-center gap-1.5 text-neutral-400">
              <Clock className="w-3.5 h-3.5 shrink-0 text-amber-400" />
              <span>{language === 'km' ? 'បើកជារៀងរាល់ថ្ងៃ: 8:00 AM – 9:00 PM' : 'Open Daily: 8:00 AM – 9:00 PM'}</span>
            </p>
            <p className="flex items-center gap-1.5 text-neutral-400">
              <Truck className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
              <span>{language === 'km' ? 'ផ្ញើទំនិញទូទាំង ២៥ ខេត្ត-ក្រុង' : 'Nationwide 25 provinces shipping'}</span>
            </p>
          </div>
        </div>

        {/* Catalog workflow helper */}
        <div className="space-y-2 p-3 rounded-2xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs uppercase font-athletic">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'km' ? 'របៀបកុម្ម៉ង់ទំនិញ' : 'How It Works'}</span>
          </div>
          <ol className="text-[10px] space-y-1 text-neutral-300 font-khmer">
            <li>1. ជ្រើសរើសទំនិញដែលពេញចិត្ត</li>
            <li>2. មើលទំហំ Size & Stock ដែលនៅសល់</li>
            <li>3. ចុច "Chat កុម្ម៉ង់" ➡ ផ្ញើសារស្វ័យប្រវត្តិ</li>
            <li>4. ហាងនឹងឆ្លើយតប និងផ្ញើទំនិញជូនភ្លាមៗ</li>
          </ol>
          <div className="pt-1">
            <button
              onClick={onOpenAdmin}
              className="text-[10px] text-amber-400/80 hover:text-amber-300 underline font-medium"
            >
              ចូល Admin Dashboard (សម្រាប់ម្ចាស់ហាង)
            </button>
          </div>
        </div>
      </div>

      {/* Lower copyright bar */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-neutral-500">
        <div>
          © {new Date().getFullYear()} HOME SPORT Catalog (catalog.homesportkh.com). All rights reserved.
        </div>
        <div className="flex items-center gap-4">
          <span>Performance Store Concept</span>
          <span>•</span>
          <button
            onClick={onOpenAdmin}
            className="hover:text-amber-400 transition-colors"
          >
            Admin Panel
          </button>
        </div>
      </div>
    </footer>
  );
};
