import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  DEFAULT_PRODUCTS,
  DEFAULT_STORE_SETTINGS,
} from './data/defaultProducts';
import { Product, StoreSettings, CartItem, Currency, Language } from './types';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { FilterBar, SortOption } from './components/FilterBar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { InquiryBagDrawer } from './components/InquiryBagDrawer';
import { AdminPanelModal } from './components/AdminPanelModal';
import { Footer } from './components/Footer';
import {
  calculateDiscount,
  generateSingleOrderMessage,
  getTelegramOrderUrl,
  getTotalStock,
} from './utils/formatters';
import { AlertCircle, ShoppingBag, Send } from 'lucide-react';

export default function App() {
  // Persistence for products (v2 to load high-res studio assets)
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('homesport_products_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved products', e);
      }
    }
    return DEFAULT_PRODUCTS;
  });

  // Persistence for store settings
  const [settings, setSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('homesport_settings_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved settings', e);
      }
    }
    return DEFAULT_STORE_SETTINGS;
  });

  // Persistence for Inquiry Cart Bag
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('homesport_cart_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved cart', e);
      }
    }
    return [];
  });

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('All Brands');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [selectedSize, setSelectedSize] = useState('all');

  // UI preferences
  const [currency, setCurrency] = useState<Currency>('USD');
  const [language, setLanguage] = useState<Language>('km');

  // Modals & Drawers
  const [detailModalProduct, setDetailModalProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Catalog container ref for smooth scrolling
  const catalogSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('homesport_products_v2', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('homesport_settings_v2', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('homesport_cart_v2', JSON.stringify(cartItems));
  }, [cartItems]);

  // Compute all available unique sizes across the catalog for quick filter
  const availableSizes = useMemo(() => {
    const sizeSet = new Set<string>();
    products.forEach((p) => {
      p.sizes.forEach((s) => {
        if (s.stock > 0) {
          sizeSet.add(s.size);
        }
      });
    });
    return Array.from(sizeSet).sort((a, b) => {
      const numA = parseFloat(a);
      const numB = parseFloat(b);
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }
      return a.localeCompare(b);
    });
  }, [products]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = p.name.toLowerCase().includes(q);
          const matchKm = p.nameKm?.toLowerCase().includes(q) || false;
          const matchBrand = p.brand.toLowerCase().includes(q);
          const matchCat = p.category.toLowerCase().includes(q);
          const matchSku = p.sku.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          if (!matchName && !matchKm && !matchBrand && !matchCat && !matchSku && !matchDesc) {
            return false;
          }
        }

        if (selectedCategory !== 'all') {
          if (p.category !== selectedCategory) return false;
        }

        if (selectedBrand !== 'All Brands') {
          if (p.brand !== selectedBrand) return false;
        }

        if (inStockOnly) {
          if (getTotalStock(p) <= 0) return false;
        }

        if (onSaleOnly) {
          const discount = calculateDiscount(p.price, p.salePrice);
          if (discount <= 0) return false;
        }

        if (selectedSize !== 'all') {
          const matchingSizeObj = p.sizes.find((s) => s.size === selectedSize);
          if (!matchingSizeObj || matchingSizeObj.stock <= 0) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = a.salePrice ?? a.price;
        const priceB = b.salePrice ?? b.price;

        switch (sortBy) {
          case 'price-asc':
            return priceA - priceB;
          case 'price-desc':
            return priceB - priceA;
          case 'discount':
            return calculateDiscount(b.price, b.salePrice) - calculateDiscount(a.price, a.salePrice);
          case 'newest':
            return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
          case 'featured':
          default:
            return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
        }
      });
  }, [
    products,
    searchQuery,
    selectedCategory,
    selectedBrand,
    sortBy,
    inStockOnly,
    onSaleOnly,
    selectedSize,
  ]);

  // Featured selection for homepage anchor
  const featuredProducts = useMemo(() => {
    return products.filter((p) => p.isFeatured || p.isTrending).slice(0, 4);
  }, [products]);

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedCategory !== 'all' ||
    selectedBrand !== 'All Brands' ||
    inStockOnly ||
    onSaleOnly ||
    selectedSize !== 'all';

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedBrand('All Brands');
    setInStockOnly(false);
    setOnSaleOnly(false);
    setSelectedSize('all');
    setSortBy('featured');
  };

  const handleShopNowClick = () => {
    catalogSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleQuickTelegram = (product: Product) => {
    const availableSize =
      product.sizes.find((s) => s.stock > 0)?.size || product.sizes[0]?.size || 'Standard';
    const message = generateSingleOrderMessage(product, availableSize, 1, settings);
    const url = getTelegramOrderUrl(settings.telegramUsername, message);
    window.open(url, '_blank');
  };

  const handleAddToCart = (product: Product, size: string, quantity: number) => {
    const itemId = `${product.id}-${size}`;
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        return prev.map((item) =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { id: itemId, product, selectedSize: size, quantity }];
    });
  };

  const handleUpdateCartQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveCartItem(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const totalCartItemCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100 font-khmer antialiased selection:bg-amber-400 selection:text-neutral-950">
      {/* 1. Header (Clean 3-Zone Contract) */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        currency={currency}
        onCurrencyToggle={() => setCurrency((prev) => (prev === 'USD' ? 'KHR' : 'USD'))}
        language={language}
        onLanguageToggle={() => setLanguage((prev) => (prev === 'km' ? 'en' : 'km'))}
        cartCount={totalCartItemCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        settings={settings}
        activeCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          handleShopNowClick();
        }}
      />

      {/* 2. Cinematic Hero Banner */}
      <HeroBanner
        language={language}
        onExploreClick={handleShopNowClick}
        productCount={products.length}
        settings={settings}
      />

      {/* 3. Refined Interactive Filter Bar */}
      <FilterBar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        selectedBrand={selectedBrand}
        onSelectBrand={setSelectedBrand}
        sortBy={sortBy}
        onSortChange={setSortBy}
        inStockOnly={inStockOnly}
        onToggleInStockOnly={() => setInStockOnly(!inStockOnly)}
        onSaleOnly={onSaleOnly}
        onToggleOnSaleOnly={() => setOnSaleOnly(!onSaleOnly)}
        selectedSize={selectedSize}
        onSelectSize={setSelectedSize}
        availableSizes={availableSizes}
        totalResults={filteredProducts.length}
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
        language={language}
      />

      {/* Main Content Area */}
      <main ref={catalogSectionRef} className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-12 w-full">
        {/* Featured Spotlights (When not filtered) */}
        {!hasActiveFilters && featuredProducts.length > 0 && (
          <section className="space-y-5">
            <div className="flex items-baseline justify-between border-b border-white/[0.06] pb-3">
              <div>
                <h2 className="font-athletic text-2xl font-bold tracking-tight text-white uppercase">
                  {language === 'km' ? 'ទំនិញពេញនិយម (Featured)' : 'Featured Spotlight'}
                </h2>
                <p className="text-xs text-neutral-400 font-khmer mt-0.5">
                  {language === 'km'
                    ? 'ម៉ូដស្បែកជើង និងអាវកីឡាដែលមានការកុម្ម៉ង់ច្រើនជាងគេប្រចាំសប្តាហ៍'
                    : 'The most requested boots & sportswear of the week'}
                </p>
              </div>

              <span className="font-mono text-xs text-neutral-500">
                04 Items
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={`feat-${product.id}`}
                  product={product}
                  currency={currency}
                  language={language}
                  settings={settings}
                  onSelectProduct={setDetailModalProduct}
                  onQuickTelegram={handleQuickTelegram}
                />
              ))}
            </div>
          </section>
        )}

        {/* Full Collection Catalog Grid */}
        <section className="space-y-5">
          <div className="flex items-baseline justify-between border-b border-white/[0.06] pb-3">
            <div>
              <h2 className="font-athletic text-2xl font-bold tracking-tight text-white uppercase">
                {language === 'km' ? 'កាតាឡុកទំនិញទាំងអស់' : 'All Collection'}
              </h2>
              <p className="text-xs text-neutral-400 font-khmer mt-0.5">
                {language === 'km'
                  ? 'ពិនិត្យទំហំ និងស្តុកជាក់ស្តែង រួចចុច Chat កុម្ម៉ង់ផ្ទាល់'
                  : 'Real-time stock verified athletic footwear and gear'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-amber-300 hover:text-white font-medium cursor-pointer"
                >
                  {language === 'km' ? 'សម្អាតការស្វែងរក' : 'Clear Filters'}
                </button>
              )}
              <span className="font-mono text-xs text-neutral-500">
                {filteredProducts.length} Items
              </span>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center space-y-4 bg-neutral-900/30 rounded-3xl border border-white/[0.06] p-8 max-w-lg mx-auto">
              <div className="w-12 h-12 rounded-full bg-neutral-850 flex items-center justify-center mx-auto text-neutral-500">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base text-white">
                  {language === 'km' ? 'រកមិនឃើញទំនិញដែលត្រូវនឹងការស្វែងរកទេ' : 'No matching items'}
                </h3>
                <p className="text-xs text-neutral-400 font-khmer">
                  {language === 'km'
                    ? 'សូមសាកល្បងសម្អាតពាក្យស្វែងរក ឬដោះការជ្រើសរើសដើម្បីមើលទំនិញទាំងអស់។'
                    : 'Try clearing the search query or reset size/brand filters.'}
                </p>
              </div>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-white text-neutral-950 font-athletic text-xs font-bold uppercase rounded-full hover:bg-neutral-200 transition-colors cursor-pointer"
              >
                {language === 'km' ? 'មើលទំនិញទាំងអស់' : 'Show All Items'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  currency={currency}
                  language={language}
                  settings={settings}
                  onSelectProduct={setDetailModalProduct}
                  onQuickTelegram={handleQuickTelegram}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Floating Action Buttons for Mobile */}
      <div className="fixed bottom-5 right-5 z-30 flex flex-col gap-2.5 md:hidden">
        {totalCartItemCount > 0 && (
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-12 h-12 bg-white text-neutral-950 rounded-full shadow-xl flex items-center justify-center relative cursor-pointer"
            title="Open Order Bag"
          >
            <ShoppingBag className="w-5 h-5 text-neutral-950" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 text-neutral-950 text-[10px] font-mono font-black rounded-full flex items-center justify-center">
              {totalCartItemCount}
            </span>
          </button>
        )}
        <a
          href={`https://t.me/${settings.telegramUsername.replace('@', '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 bg-sky-500 hover:bg-sky-400 text-white rounded-full shadow-xl flex items-center justify-center cursor-pointer"
          title="Direct Telegram Chat"
        >
          <Send className="w-5 h-5" />
        </a>
      </div>

      {/* Modals & Slide-out Drawers */}
      {detailModalProduct && (
        <ProductDetailModal
          product={detailModalProduct}
          onClose={() => setDetailModalProduct(null)}
          currency={currency}
          language={language}
          settings={settings}
          onAddToCart={handleAddToCart}
        />
      )}

      <InquiryBagDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        currency={currency}
        language={language}
        settings={settings}
      />

      <AdminPanelModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        onSaveProducts={setProducts}
        settings={settings}
        onSaveSettings={setSettings}
      />

      {/* Footer */}
      <Footer
        settings={settings}
        language={language}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />
    </div>
  );
}
