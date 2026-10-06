import React, { useState } from 'react';
import { X, Trash2, Send, MessageCircle, Copy, Check, ShoppingBag } from 'lucide-react';
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
      particleCount: 45,
      spread: 70,
      origin: { y: 0.7 },
    });
    setTimeout(() => setCopied(false), 2000);
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
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-neutral-200 shadow-2xl flex flex-col text-neutral-900">
          {/* Drawer Header */}
          <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-neutral-800" />
              <h2 className="font-athletic text-lg font-bold text-neutral-900 uppercase tracking-wider">
                {language === 'km' ? 'កន្ត្រកកុម្ម៉ង់ទំនិញ' : 'Shopping Bag'}
              </h2>
              <span className="text-xs bg-neutral-100 text-neutral-700 font-bold px-2 py-0.5 rounded-full font-mono">
                {cartItems.length}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-base text-neutral-900">
                    {language === 'km' ? 'កន្ត្រករបស់អ្នកទទេ' : 'Your Bag is Empty'}
                  </h3>
                  <p className="text-xs text-neutral-500 max-w-xs font-khmer">
                    {language === 'km'
                      ? 'ជ្រើសរើសទំនិញដែលអ្នកពេញចិត្ត រួចចុច "ដាក់ចូលកន្ត្រក" ដើម្បីកុម្ម៉ង់ម្តងច្រើនមុខ!'
                      : 'Explore our collection and add items to order together on Telegram!'}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-[#383b32] text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  {language === 'km' ? 'បន្តមើលកាតាឡុក' : 'Explore Catalog'}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-neutral-500 pb-1">
                  <span>{language === 'km' ? 'មុខទំនិញដែលបានជ្រើស' : 'Selected Products'}</span>
                  <button
                    onClick={onClearCart}
                    className="text-neutral-400 hover:text-rose-600 transition-colors text-[11px] cursor-pointer"
                  >
                    {language === 'km' ? 'លុបទាំងអស់' : 'Clear All'}
                  </button>
                </div>

                {cartItems.map((item) => {
                  const unitPrice = item.product.salePrice ?? item.product.price;
                  const maxStockForSize =
                    item.product.sizes.find((s) => s.size === item.selectedSize)?.stock || 10;

                  return (
                    <div
                      key={item.id}
                      className="p-3 bg-[#f8f8f7] border border-neutral-200/80 rounded-2xl flex gap-3 items-center"
                    >
                      {/* Thumbnail */}
                      <div className="w-16 h-16 rounded-xl bg-white border border-neutral-200 p-1 shrink-0 flex items-center justify-center">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] text-neutral-400 font-mono uppercase tracking-wider">
                          {item.product.brand}
                        </div>
                        <h4 className="text-xs font-bold text-neutral-900 truncate">
                          {item.product.name}
                        </h4>
                        <div className="text-[11px] text-neutral-600 flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-neutral-200/60">
                            Size: {item.selectedSize}
                          </span>
                          <span className="font-athletic font-bold text-neutral-900">
                            {formatPrice(unitPrice, currency, settings.exchangeRate)}
                          </span>
                        </div>
                      </div>

                      {/* Quantity Controls & Remove */}
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-neutral-400 hover:text-rose-600 p-1 cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <div className="flex items-center gap-1.5 bg-white border border-neutral-200 rounded-lg p-0.5 text-xs font-mono">
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="w-5 h-5 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 rounded cursor-pointer"
                          >
                            -
                          </button>
                          <span className="w-4 text-center font-bold">{item.quantity}</span>
                          <button
                            onClick={() => {
                              if (item.quantity < maxStockForSize) {
                                onUpdateQuantity(item.id, item.quantity + 1);
                              }
                            }}
                            disabled={item.quantity >= maxStockForSize}
                            className="w-5 h-5 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 rounded disabled:opacity-30 cursor-pointer"
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
            <div className="p-5 border-t border-neutral-100 bg-[#fbfbfb] space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-neutral-500 font-mono">
                  <span>Grand Total (KHR):</span>
                  <span className="font-semibold text-neutral-800">{prices.khr}</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-bold text-neutral-800 font-khmer">
                    {language === 'km' ? 'តម្លៃសរុប (USD):' : 'Total in USD:'}
                  </span>
                  <span className="font-athletic text-2xl font-bold text-[#141513]">
                    {prices.usd}
                  </span>
                </div>
              </div>

              {/* Action buttons (Clean normal text) */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleSendTelegram}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-sky-500 hover:bg-sky-600 text-white text-center shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  <span>
                    {language === 'km'
                      ? 'ផ្ញើបញ្ជីកុម្ម៉ង់ទៅ Telegram (@doublenin)'
                      : 'Send Full Order to Telegram (@doublenin)'}
                  </span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleSendMessenger}
                    className="py-2.5 px-3 rounded-xl font-bold text-xs bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-200 text-center cursor-pointer"
                  >
                    <span>Facebook Messenger</span>
                  </button>

                  <button
                    onClick={handleCopy}
                    className="py-2.5 px-3 rounded-xl font-bold text-xs bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-200 text-center cursor-pointer"
                  >
                    <span>{copied ? 'Copied' : 'Copy Slip'}</span>
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
