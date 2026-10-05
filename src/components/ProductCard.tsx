import React, { useState } from 'react';
import { Eye, Send, ArrowUpRight } from 'lucide-react';
import { Currency, Language, Product, StoreSettings } from '../types';
import { calculateDiscount, formatPrice, getTotalStock } from '../utils/formatters';

interface ProductCardProps {
  product: Product;
  currency: Currency;
  language: Language;
  settings: StoreSettings;
  onSelectProduct: (product: Product) => void;
  onQuickTelegram: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  language,
  settings,
  onSelectProduct,
  onQuickTelegram,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const discount = calculateDiscount(product.price, product.salePrice);
  const totalStock = getTotalStock(product);
  const isOutOfStock = totalStock <= 0;
  const activePrice = product.salePrice ?? product.price;

  // Secondary image preview on hover if available
  const displayImage = isHovered && product.images.length > 1 ? product.images[1] : product.images[0];

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-neutral-900/60 hover:bg-neutral-900 border border-white/[0.06] hover:border-white/[0.16] rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between"
    >
      {/* Product Image Stage */}
      <div
        onClick={() => onSelectProduct(product)}
        className="relative aspect-[4/3] bg-neutral-950 overflow-hidden cursor-pointer flex items-center justify-center p-3"
      >
        <img
          src={displayImage}
          alt={product.name}
          referrerPolicy="no-referrer"
          loading="lazy"
          className="w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Minimalist Discount Callout (Zero-Pill: Clean minimal tag) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10 pointer-events-none">
          {discount > 0 && (
            <span className="font-mono text-xs font-bold text-amber-300 bg-neutral-950/80 backdrop-blur-md px-2 py-0.5 rounded border border-amber-400/30">
              −{discount}%
            </span>
          )}
          {product.isNew && (
            <span className="font-mono text-[10px] tracking-wider text-emerald-400 bg-neutral-950/80 backdrop-blur-md px-2 py-0.5 rounded border border-emerald-500/30 uppercase">
              New
            </span>
          )}
        </div>

        {/* Out of stock minimal scrim */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-neutral-950/75 backdrop-blur-[2px] flex items-center justify-center">
            <span className="font-mono text-xs font-bold text-neutral-400 uppercase tracking-widest px-3 py-1 bg-neutral-900/90 border border-white/10 rounded">
              {language === 'km' ? 'អស់ស្តុក' : 'Sold Out'}
            </span>
          </div>
        )}

        {/* Brand Kicker corner */}
        <div className="absolute bottom-2.5 right-2.5 text-[10px] font-mono tracking-widest text-neutral-500 uppercase bg-neutral-950/70 px-1.5 py-0.5 rounded backdrop-blur-xs">
          {product.brand}
        </div>
      </div>

      {/* Card Content & Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          {/* Unboxed Metadata Kicker (Category · Ground Type) */}
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
            <span>{product.brand}</span>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <span>{language === 'km' ? product.categoryKm || product.category : product.category}</span>
            {product.groundType && (
              <>
                <span aria-hidden="true" className="text-neutral-600">·</span>
                <span className="text-amber-400/90">{product.groundType}</span>
              </>
            )}
          </div>

          {/* Product Name */}
          <h3
            onClick={() => onSelectProduct(product)}
            className="font-bold text-sm sm:text-base text-neutral-100 group-hover:text-amber-300 transition-colors cursor-pointer line-clamp-1 leading-snug"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Khmer Subtitle if present */}
          {language === 'km' && product.nameKm && (
            <p className="text-[11px] text-neutral-400 line-clamp-1 font-khmer">
              {product.nameKm}
            </p>
          )}

          {/* Size Availability Micro-strip */}
          <div className="pt-2 flex items-center justify-between text-[11px]">
            <span className="text-neutral-500 font-mono text-[10px]">
              {language === 'km' ? 'ទំហំ Size:' : 'Sizes:'}
            </span>
            <div className="flex items-center gap-1 overflow-x-auto max-w-[170px] scrollbar-none">
              {product.sizes.slice(0, 5).map((s) => (
                <span
                  key={s.size}
                  className={`font-mono text-[10px] px-1 rounded ${
                    s.stock > 0
                      ? 'text-neutral-300 bg-neutral-800'
                      : 'text-neutral-600 line-through'
                  }`}
                  title={`Size ${s.size}: ${s.stock} in stock`}
                >
                  {s.size}
                </span>
              ))}
              {product.sizes.length > 5 && (
                <span className="text-neutral-500 text-[10px] font-mono">+</span>
              )}
            </div>
          </div>
        </div>

        {/* Pricing & Order Actions */}
        <div className="pt-3 border-t border-white/[0.06] space-y-3">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-athletic text-2xl font-bold tracking-tight text-white tabular-nums">
                {formatPrice(activePrice, currency, settings.exchangeRate)}
              </span>
              {discount > 0 && (
                <span className="text-xs font-mono text-neutral-500 line-through tabular-nums">
                  {formatPrice(product.price, currency, settings.exchangeRate)}
                </span>
              )}
            </div>

            <span className="font-mono text-[11px] text-neutral-500 tabular-nums">
              {currency === 'USD'
                ? `៛${Math.round(activePrice * settings.exchangeRate).toLocaleString()}`
                : `$${activePrice.toFixed(2)}`}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onSelectProduct(product)}
              className="py-2 px-3 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 text-neutral-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-neutral-400" />
              <span>{language === 'km' ? 'មើលលម្អិត' : 'Details'}</span>
            </button>

            <button
              onClick={() => onQuickTelegram(product)}
              disabled={isOutOfStock}
              className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                isOutOfStock
                  ? 'bg-neutral-850 text-neutral-600 cursor-not-allowed border border-white/[0.04]'
                  : 'bg-white hover:bg-neutral-200 text-neutral-950 font-bold shadow-sm'
              }`}
            >
              <Send className="w-3.5 h-3.5 text-sky-600" />
              <span>{language === 'km' ? 'Chat កុម្ម៉ង់' : 'Order'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
