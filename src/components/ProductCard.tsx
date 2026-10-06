import React, { useState } from 'react';
import { Currency, Language, Product, StoreSettings } from '../types';
import { calculateDiscount, formatPrice, getTotalStock } from '../utils/formatters';

interface ProductCardProps {
  product: Product;
  currency: Currency;
  language: Language;
  settings: StoreSettings;
  onSelectProduct: (product: Product) => void;
  onAddToCart?: (product: Product, size: string, quantity: number) => void;
  onQuickTelegram?: (product: Product, size: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  language,
  settings,
  onSelectProduct,
  onAddToCart,
  onQuickTelegram,
}) => {
  const discount = calculateDiscount(product.price, product.salePrice);
  const activePrice = product.salePrice ?? product.price;
  const totalStock = getTotalStock(product);
  const isOutOfStock = totalStock <= 0;

  // Selected size for quick actions
  const firstAvailableSize =
    product.sizes.find((s) => s.stock > 0)?.size || product.sizes[0]?.size || '';
  const [selectedQuickSize, setSelectedQuickSize] = useState<string>(firstAvailableSize);

  return (
    <div className="group bg-white rounded-xl border border-neutral-200 hover:border-neutral-900 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* 1. Image Stage with Clean Badges */}
      <div
        onClick={() => onSelectProduct(product)}
        className="relative aspect-[4/3] sm:aspect-[1/1] bg-neutral-50 overflow-hidden cursor-pointer"
      >
        <img
          src={product.images[0]}
          alt={product.name}
          referrerPolicy="no-referrer"
          loading="lazy"
          className="w-full h-full object-contain p-3 sm:p-4 transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Top Badges (Clean text tags) */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10">
          {discount > 0 && (
            <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-2xs tracking-wider uppercase">
              -{discount}%
            </span>
          )}
          {product.isNew && (
            <span className="bg-neutral-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-2xs tracking-wider uppercase">
              NEW
            </span>
          )}
        </div>

        {/* Brand & Ground Type Badge */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1 z-10">
          <span className="bg-white/95 text-neutral-800 text-[10px] font-bold px-2 py-0.5 rounded border border-neutral-200">
            {product.brand}
          </span>
          {product.groundType && (
            <span className="bg-neutral-900 text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
              {product.groundType.split(' ')[0]}
            </span>
          )}
        </div>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-[2px] flex items-center justify-center z-20">
            <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded uppercase tracking-wider">
              {language === 'km' ? 'ដាច់ស្តុក' : 'Out of Stock'}
            </span>
          </div>
        )}

        {/* Quick View Hover Button (Normal clean text) */}
        <div className="absolute inset-x-0 bottom-2.5 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectProduct(product);
            }}
            className="bg-neutral-900 hover:bg-black text-white text-xs font-bold px-4 py-1.5 rounded-lg shadow-md cursor-pointer"
          >
            <span>{language === 'km' ? 'មើលលម្អិត' : 'View Details'}</span>
          </button>
        </div>
      </div>

      {/* 2. Product Info */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-3 bg-white">
        <div>
          {/* Category kicker */}
          <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-0.5">
            {product.categoryKm && language === 'km' ? product.categoryKm : product.category}
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onSelectProduct(product)}
            className="font-display font-bold text-xs sm:text-sm text-neutral-900 line-clamp-2 hover:text-red-600 transition-colors cursor-pointer leading-snug"
          >
            {language === 'km' && product.nameKm ? product.nameKm : product.name}
          </h3>

          {/* Price Block: Dual Currency & Discount */}
          <div className="mt-2 flex items-baseline flex-wrap gap-x-2 gap-y-0.5">
            <span className="font-display font-black text-base sm:text-lg text-neutral-950 tabular-nums">
              {formatPrice(activePrice, currency, settings.exchangeRate)}
            </span>

            {discount > 0 && (
              <span className="text-xs text-neutral-400 line-through tabular-nums font-medium">
                {formatPrice(product.price, currency, settings.exchangeRate)}
              </span>
            )}

            {/* Equivalent Price in other currency */}
            <span className="text-[11px] font-semibold text-neutral-500 tabular-nums">
              (
              {currency === 'USD'
                ? formatPrice(activePrice, 'KHR', settings.exchangeRate)
                : formatPrice(activePrice, 'USD', settings.exchangeRate)}
              )
            </span>
          </div>
        </div>

        {/* 3. Sizes & Stock Indicators (Clean text) */}
        <div className="pt-2 border-t border-neutral-100 space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold text-neutral-600">
              {language === 'km' ? 'ទំហំ (Sizes):' : 'Available Sizes:'}
            </span>
            <span
              className={`font-bold ${
                isOutOfStock
                  ? 'text-red-600'
                  : totalStock <= 3
                  ? 'text-amber-600'
                  : 'text-emerald-700'
              }`}
            >
              {isOutOfStock
                ? language === 'km'
                  ? 'ដាច់ស្តុក'
                  : 'Out of Stock'
                : language === 'km'
                ? `សល់ ${totalStock}`
                : `Stock: ${totalStock}`}
            </span>
          </div>

          {/* Size Pills Strip (Clean normal text) */}
          <div className="flex flex-wrap gap-1">
            {product.sizes.map((sz) => {
              const inStock = sz.stock > 0;
              const isSelected = selectedQuickSize === sz.size;

              return (
                <button
                  key={sz.size}
                  onClick={() => inStock && setSelectedQuickSize(sz.size)}
                  disabled={!inStock}
                  className={`px-1.5 py-0.5 rounded text-[11px] font-mono font-medium transition-all border cursor-pointer ${
                    !inStock
                      ? 'bg-neutral-100 text-neutral-400 border-neutral-200 line-through cursor-not-allowed'
                      : isSelected
                      ? 'bg-neutral-900 text-white border-neutral-900 font-bold'
                      : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  <span>{sz.size}</span>
                  {inStock && (
                    <span className="text-[9px] opacity-75 ml-0.5">({sz.stock})</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Action Buttons: Normal clean text, no icons */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          {/* Telegram Chat to Order Button */}
          <button
            onClick={() => onQuickTelegram && onQuickTelegram(product, selectedQuickSize)}
            disabled={isOutOfStock}
            className={`w-full py-2 px-2 rounded-lg text-xs font-bold transition-all text-center cursor-pointer ${
              isOutOfStock
                ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                : 'bg-sky-500 hover:bg-sky-600 text-white active:scale-95'
            }`}
          >
            <span className="truncate">
              {language === 'km' ? 'កុម្ម៉ង់ Telegram' : 'Order Telegram'}
            </span>
          </button>

          {/* View Details Button */}
          <button
            onClick={() => onSelectProduct(product)}
            className="w-full py-2 px-2 rounded-lg text-xs font-bold bg-neutral-900 hover:bg-neutral-800 text-white transition-all text-center active:scale-95 cursor-pointer"
          >
            <span className="truncate">
              {language === 'km' ? 'មើលលម្អិត' : 'View Details'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
