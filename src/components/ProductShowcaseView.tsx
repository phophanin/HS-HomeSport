import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Star,
  Ruler,
  ShoppingBag,
  Heart,
  Truck,
  RotateCcw,
  ShieldCheck,
  Search,
  ChevronDown,
  ChevronUp,
  Send,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Currency, Language, Product, StoreSettings } from '../types';
import { calculateDiscount, formatBothPrices, formatPrice, generateSingleOrderMessage, getTelegramOrderUrl } from '../utils/formatters';

interface ProductShowcaseViewProps {
  product: Product;
  currency: Currency;
  language: Language;
  settings: StoreSettings;
  onAddToCart: (product: Product, size: string, quantity: number) => void;
  onOpenTelegram: (product: Product, size: string) => void;
}

export const ProductShowcaseView: React.FC<ProductShowcaseViewProps> = ({
  product,
  currency,
  language,
  settings,
  onAddToCart,
  onOpenTelegram,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const firstAvailableSize = product.sizes.find((s) => s.stock > 0)?.size || product.sizes[0]?.size || '';
  const [selectedSize, setSelectedSize] = useState(firstAvailableSize);
  const [selectedColor, setSelectedColor] = useState(product.colorVariants?.[0]?.name || product.color || 'Volt Neon / Chrome');
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'materials' | 'size' | 'shipping'>('details');
  const [addedToast, setAddedToast] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  useEffect(() => {
    setActiveImageIndex(0);
    const firstSize = product.sizes.find((s) => s.stock > 0)?.size || product.sizes[0]?.size || '';
    setSelectedSize(firstSize);
    setSelectedColor(product.colorVariants?.[0]?.name || product.color || 'Default');
  }, [product.id]);

  const discount = calculateDiscount(product.price, product.salePrice);
  const activePrice = product.salePrice ?? product.price;
  const prices = formatBothPrices(activePrice, settings.exchangeRate);
  const originalPrices = formatBothPrices(product.price, settings.exchangeRate);

  const selectedSizeObj = product.sizes.find((s) => s.size === selectedSize);
  const selectedSizeStock = selectedSizeObj ? selectedSizeObj.stock : 0;
  const isSelectedSizeOutOfStock = selectedSizeStock <= 0;

  const colors = product.colorVariants || [
    { name: 'Volt Neon / Chrome', hex: '#d4ff00' },
    { name: 'Core Black / Silver', hex: '#1c1c1c' },
    { name: 'Electric Blue / White', hex: '#0066ff' },
  ];

  const handleAddToCart = () => {
    if (isSelectedSizeOutOfStock) return;
    onAddToCart(product, selectedSize, 1);
    setAddedToast(true);
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.7 },
    });
    setTimeout(() => setAddedToast(false), 2200);
  };

  const handleDirectTelegramOrder = () => {
    onOpenTelegram(product, selectedSize);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      {/* 1. PDP Top Stage (Matches exact layout from reference image) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Side: Thumbnail Rail + Main Image */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          {/* Vertical Thumbnail Column */}
          <div className="flex sm:flex-col gap-3 shrink-0 items-center overflow-x-auto sm:overflow-visible">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-16 sm:w-20 aspect-[3/4] rounded-xl overflow-hidden border-2 bg-neutral-100 transition-all cursor-pointer ${
                  activeImageIndex === idx
                    ? 'border-black ring-1 ring-black/20'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain p-1"
                />
              </button>
            ))}

            <div className="hidden sm:flex flex-col gap-1 text-neutral-400 pt-1">
              <button
                onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : product.images.length - 1))}
                className="p-1 hover:text-black cursor-pointer"
                title="Previous image"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveImageIndex((prev) => (prev < product.images.length - 1 ? prev + 1 : 0))}
                className="p-1 hover:text-black cursor-pointer"
                title="Next image"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main Hero Photograph Box */}
          <div className="relative flex-1 aspect-[3/4] bg-[#f8f8f7] rounded-2xl overflow-hidden border border-neutral-200/60 shadow-xs flex items-center justify-center p-6">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImageIndex + '-' + product.id}
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                referrerPolicy="no-referrer"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.25 }}
                className="w-full h-full object-contain transition-transform duration-500 ease-out hover:scale-105"
              />
            </AnimatePresence>

            {/* Magnifying Glass Zoom Icon */}
            <div className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs border border-neutral-200/80 flex items-center justify-center text-neutral-700 shadow-xs cursor-pointer hover:bg-white hover:scale-105 transition-all">
              <Search className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Right Side: Contiguous Purchase Module */}
        <div className="lg:col-span-5 space-y-6">
          {/* Pill Badge */}
          <div className="flex items-center gap-2">
            <span className="inline-block px-3 py-1 bg-neutral-100 text-neutral-800 text-xs font-semibold rounded-full tracking-wider font-mono">
              {product.isNew ? 'New Arrival' : 'Official Performance'}
            </span>
            <span className="text-xs font-mono text-neutral-400 uppercase">
              {product.brand} · SKU: {product.sku}
            </span>
          </div>

          {/* Product Title */}
          <div>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-neutral-900 tracking-tight leading-[1.1]">
              {product.name}
            </h1>
            {product.nameKm && (
              <p className="text-xs text-neutral-500 font-khmer mt-1 font-medium">
                {product.nameKm}
              </p>
            )}
          </div>

          {/* Reviews Row */}
          <div className="flex items-center gap-2 text-xs text-neutral-600">
            <div className="flex text-neutral-900">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-neutral-900 stroke-neutral-900" />
              ))}
            </div>
            <span className="font-semibold text-neutral-900">{product.rating || 4.9}</span>
            <span className="text-neutral-400">({product.reviewsCount || 128} reviews)</span>
          </div>

          {/* Pricing Block ($99.00 $150.00 34% OFF) */}
          <div className="flex items-baseline gap-3">
            <span className="font-display font-bold text-3xl text-neutral-950 tabular-nums">
              {formatPrice(activePrice, currency, settings.exchangeRate)}
            </span>
            {discount > 0 && (
              <span className="text-base text-neutral-400 line-through tabular-nums font-mono">
                {formatPrice(product.price, currency, settings.exchangeRate)}
              </span>
            )}
            {discount > 0 && (
              <span className="bg-black text-white text-xs font-bold px-2 py-0.5 rounded-md font-mono">
                {discount}% OFF
              </span>
            )}
            <span className="text-xs font-mono text-neutral-500 ml-auto tabular-nums">
              {currency === 'USD' ? prices.khr : prices.usd}
            </span>
          </div>

          {/* Description Prose */}
          <p className="text-sm text-neutral-600 leading-relaxed font-sans font-khmer">
            {language === 'km' ? product.descriptionKm || product.description : product.description}
          </p>

          {/* Color Selector */}
          <div className="space-y-2.5 pt-2 border-t border-neutral-150">
            <div className="text-xs font-semibold text-neutral-900">
              <span>Color: </span>
              <span className="text-neutral-500 font-normal">{selectedColor}</span>
            </div>

            <div className="flex items-center gap-2.5">
              {colors.map((c) => {
                const isSelected = selectedColor === c.name;
                return (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`w-7 h-7 rounded-full p-0.5 transition-all cursor-pointer ${
                      isSelected ? 'ring-2 ring-black ring-offset-2' : 'hover:scale-110'
                    }`}
                    title={c.name}
                  >
                    <div
                      className="w-full h-full rounded-full border border-black/10"
                      style={{ backgroundColor: c.hex }}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size Selector with Live Stock Status */}
          <div className="space-y-2.5 pt-2">
            <div className="flex items-center justify-between text-xs">
              <div className="font-semibold text-neutral-900">
                <span>Size: </span>
                <span className="text-neutral-900 font-bold">{selectedSize} </span>
                <span className="text-neutral-500 font-normal font-mono">
                  {isSelectedSizeOutOfStock ? (
                    <span className="text-rose-600 font-bold">(SOLD OUT)</span>
                  ) : (
                    <span className="text-emerald-700 font-medium">({selectedSizeStock} left in stock)</span>
                  )}
                </span>
              </div>

              <button
                onClick={() => setIsSizeGuideOpen(true)}
                className="text-neutral-700 hover:text-black flex items-center gap-1 font-medium cursor-pointer"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Size Guide</span>
              </button>
            </div>

            {/* Size boxes with live stock representation */}
            <div className="flex flex-wrap gap-2.5">
              {product.sizes.map((s) => {
                const isSelected = selectedSize === s.size;
                const isOut = s.stock <= 0;
                return (
                  <button
                    key={s.size}
                    onClick={() => setSelectedSize(s.size)}
                    className={`min-w-14 h-12 px-2.5 rounded-xl border text-xs font-mono transition-all cursor-pointer flex flex-col items-center justify-center ${
                      isSelected
                        ? 'bg-black text-white border-black shadow-xs'
                        : isOut
                        ? 'bg-neutral-100/70 text-neutral-400 border-neutral-200'
                        : 'bg-white text-neutral-800 border-neutral-300 hover:border-black'
                    }`}
                  >
                    <span className={`font-bold ${isOut && !isSelected ? 'line-through' : ''}`}>
                      {s.size}
                    </span>
                    <span
                      className={`text-[9px] uppercase tracking-tighter ${
                        isSelected
                          ? 'text-neutral-300'
                          : isOut
                          ? 'text-rose-500 font-bold'
                          : s.stock <= 2
                          ? 'text-amber-600 font-bold'
                          : 'text-neutral-400'
                      }`}
                    >
                      {isOut ? 'SOLD' : `${s.stock} left`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Primary Action Button (Add to Cart / Telegram) + Wishlist Heart */}
          <div className="pt-3 space-y-2.5">
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={!isSelectedSizeOutOfStock ? { scale: 1.02 } : {}}
                whileTap={!isSelectedSizeOutOfStock ? { scale: 0.98 } : {}}
                onClick={handleAddToCart}
                disabled={isSelectedSizeOutOfStock}
                className={`flex-1 h-13 font-medium text-sm rounded-xl transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-xs group ${
                  isSelectedSizeOutOfStock
                    ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                    : 'bg-black hover:bg-neutral-800 text-white'
                }`}
              >
                <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>
                  {isSelectedSizeOutOfStock
                    ? (language === 'km' ? 'ទំហំនេះអស់ស្តុក (Sold Out)' : 'Sold Out')
                    : addedToast
                    ? (language === 'km' ? '✓ បានដាក់ចូលកន្ត្រក' : '✓ Added to Order Bag')
                    : (language === 'km' ? 'ដាក់ចូលកន្ត្រក (Add to Cart)' : 'Add to Order Bag')}
                </span>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsLiked(!isLiked)}
                className={`w-13 h-13 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                  isLiked
                    ? 'border-rose-400 bg-rose-50 text-rose-500'
                    : 'border-neutral-300 hover:border-black text-neutral-800 bg-white'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-rose-500' : ''}`} />
              </motion.button>
            </div>

            {/* Direct Instant Order to Telegram */}
            <motion.button
              whileHover={!isSelectedSizeOutOfStock ? { scale: 1.01 } : {}}
              whileTap={!isSelectedSizeOutOfStock ? { scale: 0.99 } : {}}
              onClick={handleDirectTelegramOrder}
              disabled={isSelectedSizeOutOfStock}
              className={`w-full h-12 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer border ${
                isSelectedSizeOutOfStock
                  ? 'bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed'
                  : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border-neutral-200/80 shadow-2xs'
              }`}
            >
              <Send className="w-3.5 h-3.5 text-sky-600" />
              <span>
                {language === 'km'
                  ? `កុម្ម៉ង់ផ្ទាល់តាម Telegram @${settings.telegramUsername.replace('@', '')} →`
                  : `Chat to Order on Telegram @${settings.telegramUsername.replace('@', '')} →`}
              </span>
            </motion.button>
          </div>

          {/* 3-Point Shipping & Trust Row */}
          <div className="pt-4 border-t border-neutral-150 grid grid-cols-3 gap-3 text-xs text-neutral-600">
            <div className="flex items-start gap-2">
              <Truck className="w-4 h-4 text-neutral-800 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-neutral-900 leading-tight">Fast Delivery</div>
                <div className="text-[10px] text-neutral-500 mt-0.5 font-khmer">25 Provinces (1-2 days)</div>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <RotateCcw className="w-4 h-4 text-neutral-800 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-neutral-900 leading-tight">Size Exchange</div>
                <div className="text-[10px] text-neutral-500 mt-0.5 font-khmer">Within 3 days (unused)</div>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-neutral-800 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-neutral-900 leading-tight">100% Genuine</div>
                <div className="text-[10px] text-neutral-500 mt-0.5 font-khmer">Official authenticity</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Detailed Tabs Block & Close-up Spec */}
      <div className="mt-16 pt-10 border-t border-neutral-200">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Tab switcher + Feature Checklist */}
          <div className="lg:col-span-6 space-y-6">
            {/* Tabs Row */}
            <div className="flex items-center gap-8 border-b border-neutral-200 text-sm font-semibold">
              <button
                onClick={() => setActiveTab('details')}
                className={`pb-3 transition-colors cursor-pointer ${
                  activeTab === 'details' ? 'border-b-2 border-black text-black' : 'text-neutral-400 hover:text-black'
                }`}
              >
                Details
              </button>
              <button
                onClick={() => setActiveTab('materials')}
                className={`pb-3 transition-colors cursor-pointer ${
                  activeTab === 'materials' ? 'border-b-2 border-black text-black' : 'text-neutral-400 hover:text-black'
                }`}
              >
                Tech & Traction
              </button>
              <button
                onClick={() => setActiveTab('size')}
                className={`pb-3 transition-colors cursor-pointer ${
                  activeTab === 'size' ? 'border-b-2 border-black text-black' : 'text-neutral-400 hover:text-black'
                }`}
              >
                Size & Stock Matrix
              </button>
              <button
                onClick={() => setActiveTab('shipping')}
                className={`pb-3 transition-colors cursor-pointer ${
                  activeTab === 'shipping' ? 'border-b-2 border-black text-black' : 'text-neutral-400 hover:text-black'
                }`}
              >
                Shipping & Returns
              </button>
            </div>

            {/* Tab Body */}
            {activeTab === 'details' && (
              <div className="space-y-4 text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans font-khmer">
                <p>
                  {language === 'km'
                    ? product.descriptionKm || product.description
                    : product.description}
                </p>

                <ul className="space-y-2.5 pt-2">
                  {product.features?.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-neutral-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0"></span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'materials' && (
              <div className="space-y-3 text-xs sm:text-sm text-neutral-600 font-khmer">
                <p className="font-semibold text-neutral-900">បច្ចេកវិទ្យា & សម្ភារៈផលិត:</p>
                <p>• បាតទ្រនាប់ Air Zoom & Chassis រឹងមាំជំនួយការស្ទុះ</p>
                <p>• ស្បែក Gripknit / Microfiber ស្អិតគ្រប់គ្រងបាល់បានជាក់លាក់</p>
                <p>• គ្រាប់បន្លា Tri-Star Studs ងាយកាច់ទិសដៅរត់ និងទប់លំនឹង</p>
              </div>
            )}

            {activeTab === 'size' && (
              <div className="space-y-3 text-xs sm:text-sm text-neutral-600 font-mono font-khmer">
                <p className="font-semibold text-neutral-900">ស្តុកជាក់ស្តែងតាម Size:</p>
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {product.sizes.map((s) => (
                    <div key={s.size} className="p-2 rounded-lg bg-neutral-100 text-neutral-800">
                      Size {s.size}: <span className="font-bold">{s.stock > 0 ? `${s.stock} pairs` : 'SOLD OUT'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-3 text-xs sm:text-sm text-neutral-600 font-khmer">
                <p>🚚 ដឹកជញ្ជូនរហ័ស ២៥ ខេត្ត-ក្រុង៖</p>
                <p>• រាជធានីភ្នំពេញ៖ ដឹកជូនក្នុងរយៈពេល ១ ទៅ ២ ម៉ោង</p>
                <p>• បណ្តាខេត្ត៖ ផ្ញើតាម វីរៈប៊ុនថាំ (VET), Flash Express, J&T (១-២ ថ្ងៃ)</p>
                <p>• អាចប្តូរ Size បានក្នុងរយៈពេល ៣ ថ្ងៃប្រសិនបើពាក់មិនត្រូវ (ទំនិញមិនទាន់ពាក់លើទីលាន)។</p>
              </div>
            )}
          </div>

          {/* Right Column: Macro Detail Photo */}
          <div className="lg:col-span-6">
            <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200/80 shadow-xs flex items-center justify-center p-4">
              <img
                src={product.macroImage || product.images[0]}
                alt="Product Detail"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Size Guide Modal Popover */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-neutral-200 space-y-4 font-sans">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-150">
              <h3 className="font-display font-bold text-lg text-neutral-900">
                HOME SPORT · Official Size Guide
              </h3>
              <button
                onClick={() => setIsSizeGuideOpen(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-neutral-600 space-y-3 font-khmer">
              <p>តារាងប្រវែងជើងស្តង់ដារសម្រាប់ស្បែកជើងបាល់ទាត់ (EUR / CM):</p>
              <div className="overflow-x-auto border border-neutral-200 rounded-xl font-mono">
                <table className="w-full text-center text-xs">
                  <thead className="bg-neutral-100 text-neutral-700 font-bold border-b border-neutral-200">
                    <tr>
                      <th className="p-2">EUR</th>
                      <th className="p-2">US</th>
                      <th className="p-2">UK</th>
                      <th className="p-2">CM (ប្រវែងជើង)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-150">
                    <tr><td className="p-2 font-bold">39</td><td>6.5</td><td>6.0</td><td>24.5 cm</td></tr>
                    <tr><td className="p-2 font-bold">40</td><td>7.0</td><td>6.0</td><td>25.0 cm</td></tr>
                    <tr><td className="p-2 font-bold">41</td><td>8.0</td><td>7.0</td><td>26.0 cm</td></tr>
                    <tr><td className="p-2 font-bold">42</td><td>8.5</td><td>7.5</td><td>26.5 cm</td></tr>
                    <tr><td className="p-2 font-bold">43</td><td>9.5</td><td>8.5</td><td>27.5 cm</td></tr>
                    <tr><td className="p-2 font-bold">44</td><td>10.0</td><td>9.0</td><td>28.0 cm</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="text-[11px] text-neutral-500">
                💡 គន្លឹះ៖ ប្រសិនបើជើងរបស់អ្នកសំប៉ែត ឬពាក់ស្រោមជើងក្រាស់ (Grip socks) ខ្ញុំណែនាំឱ្យជ្រើសរើសធំជាងកន្លះលេខ (0.5 Size up)។
              </p>
            </div>

            <button
              onClick={() => setIsSizeGuideOpen(false)}
              className="w-full py-2.5 bg-black text-white text-xs font-semibold rounded-xl cursor-pointer"
            >
              យល់ព្រម
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
