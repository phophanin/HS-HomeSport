import React, { useState } from 'react';
import { X, Trash2, Send, MessageCircle, Copy, Check, ShoppingBag, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, Currency, Language, StoreSettings } from '../types';
import { formatBothPrices, formatPrice, generateCartOrderMessage, getMessengerOrderUrl, getTelegramOrderUrl } from '../utils/formatters';

interface InquiryBagDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, newQuantity: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  currency: Currency;
  language: Language;
  settings: StoreSettings;
}

export const InquiryBagDrawer: React.FC<InquiryBagDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  currency,
  language,
  settings,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const totalUsd = cartItems.reduce((acc, item) => {
    const price = item.product.salePrice ?? item.product.price;
    return acc + price * item.quantity;
  }, 0);

  const prices = formatBothPrices(totalUsd, settings.exchangeRate);
  const cartOrderMessage = generateCartOrderMessage(cartItems, settings);

  const handleCopy = () => {
    navigator.clipboard.writeText(cartOrderMessage);
    setCopied(true);
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.7 },
    });
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendTelegram = () => {
    const url = getTelegramOrderUrl(settings.telegramUsername, cartOrderMessage);
    window.open(url, '_blank');
  };

  const handleSendMessenger = () => {
    navigator.clipboard.writeText(cartOrderMessage);
    const url = getMessengerOrderUrl(settings.facebookPage);
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-neutral-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-neutral-900 border-l border-neutral-800 shadow-2xl flex flex-col text-neutral-100">
          {/* Drawer Header */}
          <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/80">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <h2 className="font-athletic text-lg font-bold text-white uppercase tracking-wider">
                {language === 'km' ? 'កន្ត្រកកុម្ម៉ង់ទំនិញ' : 'Order Inquiry Bag'}
              </h2>
              <span className="text-xs bg-amber-500/20 text-amber-400 font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                {cartItems.length}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-neutral-800/80 border border-neutral-750 flex items-center justify-center text-neutral-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-base text-neutral-200">
                    {language === 'km' ? 'កន្ត្រករបស់អ្នកទទេ' : 'Your Bag is Empty'}
                  </h3>
                  <p className="text-xs text-neutral-400 max-w-xs font-khmer">
                    {language === 'km'
                      ? 'ជ្រើសរើសទំនិញដែលអ្នកពេញចិត្ត រួចចុច "ដាក់ចូលកន្ត្រក" ដើម្បីកុម្ម៉ង់ម្តងច្រើនមុខ!'
                      : 'Browse products and tap "Add to Bag" to inquire about multiple items at once!'}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-750 text-amber-400 rounded-xl text-xs font-bold transition-colors"
                >
                  {language === 'km' ? 'បន្តមើលទំនិញ' : 'Browse Catalog'}
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs text-neutral-400 pb-1">
                  <span>{language === 'km' ? 'មុខទំនិញដែលបានជ្រើស' : 'Selected Products'}</span>
                  <button
                    onClick={onClearCart}
                    className="text-neutral-500 hover:text-red-400 transition-colors text-[11px]"
                  >
                    {language === 'km' ? 'លុបទាំងអស់' : 'Clear All'}
                  </button>
                </div>

                {cartItems.map((item) => {
                  const unitPrice = item.product.salePrice ?? item.product.price;
                  const itemSubtotal = unitPrice * item.quantity;
                  const maxStockForSize = item.product.sizes.find(
                    (s) => s.size === item.selectedSize
                  )?.stock || 10;

                  return (
                    <div
                      key={item.id}
                      className="p-3 bg-neutral-950 border border-neutral-800 rounded-2xl flex gap-3 items-center"
                    >
                      {/* Thumbnail */}
                      <div className="w-16 h-16 rounded-xl bg-neutral-900 border border-white/[0.08] p-1 shrink-0 flex items-center justify-center">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                          {item.product.brand}
                        </div>
                        <h4 className="text-xs font-bold text-neutral-100 truncate">
                          {item.product.name}
                        </h4>
                        <div className="text-[11px] text-neutral-400 flex items-center gap-2 mt-0.5">
                          <span className="font-athletic px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-200">
                            Size: {item.selectedSize}
                          </span>
                          <span className="font-athletic font-bold text-amber-400">
                            {formatPrice(unitPrice, currency, settings.exchangeRate)}
                          </span>
                        </div>
                      </div>

                      {/* Quantity Controls & Remove */}
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-neutral-500 hover:text-red-400 p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 rounded-lg p-0.5 text-xs">
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="w-5 h-5 flex items-center justify-center text-neutral-300 hover:bg-neutral-800 rounded"
                          >
                            -
                          </button>
                          <span className="w-4 text-center font-athletic font-bold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => {
                              if (item.quantity < maxStockForSize) {
                                onUpdateQuantity(item.id, item.quantity + 1);
                              }
                            }}
                            disabled={item.quantity >= maxStockForSize}
                            className="w-5 h-5 flex items-center justify-center text-neutral-300 hover:bg-neutral-800 rounded disabled:opacity-30"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Drawer Footer with Checkout / Chat options */}
          {cartItems.length > 0 && (
            <div className="p-4 border-t border-neutral-800 bg-neutral-950 space-y-3">
              {/* Total Calculation */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span>{language === 'km' ? 'តម្លៃសរុប (Grand Total):' : 'Grand Total:'}</span>
                  <span className="font-mono text-neutral-300">{prices.khr}</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-semibold text-neutral-300">
                    {language === 'km' ? 'សរុបគិតជាដុល្លារ:' : 'Total in USD:'}
                  </span>
                  <span className="font-athletic text-2xl font-black text-amber-400">
                    {prices.usd}
                  </span>
                </div>
              </div>

              {/* Action buttons for Chat to Order */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleSendTelegram}
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 transition-all hover:scale-[1.01]"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {language === 'km'
                      ? 'ផ្ញើបញ្ជីកុម្ម៉ង់ទៅ Telegram'
                      : 'Send Full Order to Telegram'}
                  </span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleSendMessenger}
                    className="py-2.5 px-3 rounded-xl font-semibold text-xs bg-neutral-850 hover:bg-neutral-800 text-white border border-neutral-750 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-blue-400" />
                    <span>Facebook</span>
                  </button>

                  <button
                    onClick={handleCopy}
                    className="py-2.5 px-3 rounded-xl font-semibold text-xs bg-neutral-850 hover:bg-neutral-800 text-amber-400 border border-neutral-750 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? (language === 'km' ? 'បានចម្លង!' : 'Copied!') : (language === 'km' ? 'ចម្លងបញ្ជី' : 'Copy Slip')}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
