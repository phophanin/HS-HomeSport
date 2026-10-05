import React, { useState } from 'react';
import {
  X,
  Send,
  MessageCircle,
  Phone,
  Copy,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  ShoppingBag,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Currency, Language, Product, StoreSettings } from '../types';
import {
  calculateDiscount,
  formatBothPrices,
  generateSingleOrderMessage,
  getMessengerOrderUrl,
  getTelegramOrderUrl,
  getTotalStock,
} from '../utils/formatters';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  currency: Currency;
  language: Language;
  settings: StoreSettings;
  onAddToCart: (product: Product, size: string, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  currency,
  language,
  settings,
  onAddToCart,
}) => {
  const firstAvailableSize =
    product.sizes.find((s) => s.stock > 0)?.size || product.sizes[0]?.size || '';
  const [selectedSize, setSelectedSize] = useState<string>(firstAvailableSize);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);
  const [addedToast, setAddedToast] = useState<boolean>(false);

  const selectedSizeObj = product.sizes.find((s) => s.size === selectedSize);
  const selectedSizeStock = selectedSizeObj ? selectedSizeObj.stock : 0;
  const isSelectedSizeOutOfStock = selectedSizeStock <= 0;
  const totalStock = getTotalStock(product);

  const discount = calculateDiscount(product.price, product.salePrice);
  const activePrice = product.salePrice ?? product.price;
  const prices = formatBothPrices(activePrice, settings.exchangeRate);
  const originalPrices = formatBothPrices(product.price, settings.exchangeRate);

  const orderMessage = generateSingleOrderMessage(
    product,
    selectedSize || 'Standard',
    quantity,
    settings
  );

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(orderMessage);
    setCopied(true);
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.8 },
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenTelegram = () => {
    const url = getTelegramOrderUrl(settings.telegramUsername, orderMessage);
    window.open(url, '_blank');
  };

  const handleOpenMessenger = () => {
    navigator.clipboard.writeText(orderMessage);
    const url = getMessengerOrderUrl(settings.facebookPage);
    window.open(url, '_blank');
  };

  const handleAddToCart = () => {
    if (isSelectedSizeOutOfStock) return;
    onAddToCart(product, selectedSize, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-neutral-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-neutral-900 border border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl my-auto text-neutral-100 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between bg-neutral-950/80 sticky top-0 z-20">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
            <span className="text-white font-semibold">{product.brand}</span>
            <span aria-hidden="true" className="text-neutral-600">/</span>
            <span>SKU: {product.sku}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Gallery Column */}
          <div className="md:col-span-6 space-y-4">
            <div className="relative aspect-[4/3] rounded-2xl bg-neutral-950 border border-white/[0.06] overflow-hidden flex items-center justify-center p-4">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />

              {discount > 0 && (
                <span className="absolute top-3 left-3 font-mono text-xs font-bold text-amber-300 bg-neutral-950/85 px-2.5 py-1 rounded border border-amber-400/30">
                  −{discount}% OFF
                </span>
              )}

              {product.groundType && (
                <span className="absolute bottom-3 left-3 font-mono text-xs text-neutral-300 bg-neutral-950/85 px-2 py-0.5 rounded border border-white/10">
                  {product.groundType}
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-16 rounded-xl bg-neutral-950 border p-1 transition-all ${
                      activeImageIndex === idx
                        ? 'border-white ring-1 ring-white/20'
                        : 'border-white/10 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}

            {/* Service & Delivery trust markers */}
            <div className="p-4 rounded-2xl bg-neutral-950/60 border border-white/[0.04] space-y-2.5 text-xs text-neutral-400">
              <div className="flex items-center gap-2 text-neutral-200">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>100% Genuine Athletic Equipment</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-neutral-500 shrink-0" />
                <span>{language === 'km' ? settings.deliveryInfoKm : settings.deliveryInfoEn}</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-neutral-500 shrink-0" />
                <span>{language === 'km' ? 'ប្តូរ Size ក្នុងរយៈពេល ៣ ថ្ងៃ (មិនទាន់ពាក់)' : 'Size exchange within 3 days (unused)'}</span>
              </div>
            </div>
          </div>

          {/* Details & Purchase Module Column */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              {/* Product Header */}
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-1">
                  {product.brand} · {product.category}
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-athletic uppercase">
                  {product.name}
                </h1>
                {product.nameKm && language === 'km' && (
                  <p className="text-xs text-neutral-400 mt-1 font-khmer">
                    {product.nameKm}
                  </p>
                )}
              </div>

              {/* Pricing Module */}
              <div className="p-4 rounded-2xl bg-neutral-950/80 border border-white/[0.06] flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-mono tracking-widest text-neutral-500 mb-0.5">
                    Catalog Price
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="font-athletic text-3xl font-bold text-white tabular-nums">
                      {prices.usd}
                    </span>
                    {discount > 0 && (
                      <span className="text-sm font-mono text-neutral-500 line-through tabular-nums">
                        {originalPrices.usd}
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-mono text-neutral-400 mt-0.5 tabular-nums">
                    {prices.khr}
                  </div>
                </div>

                {discount > 0 && (
                  <div className="text-right">
                    <span className="font-mono text-xs text-amber-300 bg-amber-400/10 border border-amber-400/20 px-2.5 py-1 rounded-lg">
                      Save ${(product.price - (product.salePrice || product.price)).toFixed(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-khmer">
                <p>{language === 'km' ? product.descriptionKm || product.description : product.description}</p>
              </div>

              {/* Size Selector */}
              <div className="space-y-2.5 pt-2 border-t border-white/[0.06]">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-neutral-300 font-semibold uppercase tracking-wider">
                    {language === 'km' ? 'ជ្រើសរើសទំហំ Size:' : 'Select Size:'}
                  </span>
                  <span className="font-mono text-xs">
                    {isSelectedSizeOutOfStock ? (
                      <span className="text-red-400 font-semibold">អស់ស្តុក (Sold Out)</span>
                    ) : (
                      <span className="text-emerald-400 font-semibold">
                        {selectedSizeStock} {language === 'km' ? 'ក្នុងស្តុក' : 'available'}
                      </span>
                    )}
                  </span>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {product.sizes.map((s) => {
                    const isSelected = selectedSize === s.size;
                    const isOut = s.stock <= 0;
                    return (
                      <button
                        key={s.size}
                        onClick={() => {
                          setSelectedSize(s.size);
                          if (quantity > s.stock && s.stock > 0) {
                            setQuantity(s.stock);
                          }
                        }}
                        className={`py-2 px-2 rounded-xl text-center border font-mono transition-all flex flex-col items-center justify-center cursor-pointer ${
                          isSelected
                            ? 'bg-white text-neutral-950 border-white font-bold shadow-md'
                            : isOut
                            ? 'bg-neutral-950/60 border-white/[0.04] text-neutral-600'
                            : 'bg-neutral-900 border-white/[0.08] text-neutral-300 hover:border-white/20 hover:text-white'
                        }`}
                      >
                        <span className={`text-sm font-bold ${isOut && !isSelected ? 'line-through' : ''}`}>
                          {s.size}
                        </span>
                        <span className={`text-[9px] uppercase font-mono ${isSelected ? 'text-neutral-900' : isOut ? 'text-red-500' : 'text-neutral-500'}`}>
                          {isOut ? 'SOLD' : `${s.stock} left`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="flex items-center justify-between pt-1">
                <span className="font-mono text-xs text-neutral-400">
                  {language === 'km' ? 'ចំនួន:' : 'Quantity:'}
                </span>

                <div className="flex items-center gap-2 bg-neutral-950 border border-white/[0.08] rounded-xl p-1 font-mono">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || isSelectedSizeOutOfStock}
                    className="w-7 h-7 rounded-lg text-neutral-300 hover:bg-neutral-850 flex items-center justify-center disabled:opacity-30 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm font-bold text-white tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => {
                      if (!isSelectedSizeOutOfStock && quantity < selectedSizeStock) {
                        setQuantity(quantity + 1);
                      }
                    }}
                    disabled={isSelectedSizeOutOfStock || quantity >= selectedSizeStock}
                    className="w-7 h-7 rounded-lg text-neutral-300 hover:bg-neutral-850 flex items-center justify-center disabled:opacity-30 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Chat To Order Actions */}
            <div className="space-y-3 pt-4 border-t border-white/[0.08]">
              {/* Slip Preview */}
              <div className="p-3 rounded-xl bg-neutral-950 border border-white/[0.06] text-xs font-mono space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-neutral-400">
                  <span>Telegram Order Message</span>
                  <button
                    onClick={handleCopyMessage}
                    className="text-amber-300 hover:text-white flex items-center gap-1 font-sans font-semibold cursor-pointer"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="text-[11px] text-neutral-400 whitespace-pre-line line-clamp-2">
                  {orderMessage}
                </div>
              </div>

              {/* Primary Order CTAs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  onClick={handleOpenTelegram}
                  disabled={isSelectedSizeOutOfStock}
                  className={`py-3 px-4 rounded-xl font-athletic text-base tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isSelectedSizeOutOfStock
                      ? 'bg-neutral-850 text-neutral-600 cursor-not-allowed border border-white/[0.04]'
                      : 'bg-white hover:bg-neutral-200 text-neutral-950 font-bold shadow-md'
                  }`}
                >
                  <Send className="w-4 h-4 text-sky-600" />
                  <span>{language === 'km' ? 'កុម្ម៉ង់តាម Telegram' : 'Order via Telegram'}</span>
                </button>

                <button
                  onClick={handleOpenMessenger}
                  disabled={isSelectedSizeOutOfStock}
                  className={`py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all border cursor-pointer ${
                    isSelectedSizeOutOfStock
                      ? 'bg-neutral-850 text-neutral-600 border-white/[0.04] cursor-not-allowed'
                      : 'bg-neutral-800 hover:bg-neutral-750 text-white border-white/[0.08]'
                  }`}
                >
                  <MessageCircle className="w-4 h-4 text-blue-400" />
                  <span>Facebook Messenger</span>
                </button>
              </div>

              {/* Add to Order Bag */}
              <div className="flex gap-2">
                <button
                  onClick={handleAddToCart}
                  disabled={isSelectedSizeOutOfStock}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all border cursor-pointer ${
                    isSelectedSizeOutOfStock
                      ? 'bg-neutral-900 text-neutral-600 border-white/[0.04] cursor-not-allowed'
                      : 'bg-neutral-900 hover:bg-neutral-850 text-white border-white/[0.08] hover:border-white/20'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4 text-amber-400" />
                  <span>
                    {addedToast
                      ? (language === 'km' ? '✓ បានដាក់ចូលកន្ត្រក!' : '✓ Added to Bag')
                      : (language === 'km' ? 'ដាក់ចូលកន្ត្រកកុម្ម៉ង់ច្រើនមុខ' : 'Add to Order Bag (Multi-item)')}
                  </span>
                </button>

                <a
                  href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
                  className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-850 text-neutral-300 hover:text-white rounded-xl text-xs font-semibold border border-white/[0.08] flex items-center gap-1.5"
                  title="Call Store"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{language === 'km' ? 'ទូរស័ព្ទ' : 'Call'}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
