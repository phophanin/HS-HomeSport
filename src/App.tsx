import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  DEFAULT_PRODUCTS,
  DEFAULT_STORE_SETTINGS,
  CATEGORIES,
} from './data/defaultProducts';
import { Product, StoreSettings, CartItem, Currency, Language } from './types';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { CategoryIconStrip } from './components/CategoryIconStrip';
import { CategoryBannerGrid } from './components/CategoryBannerGrid';
import { FilterBar, SortOption } from './components/FilterBar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { InquiryBagDrawer } from './components/InquiryBagDrawer';
import { AdminPanelModal } from './components/AdminPanelModal';
import { AdminPasscodeModal } from './components/AdminPasscodeModal';
import { ClubBanner } from './components/ClubBanner';
import { Footer } from './components/Footer';
import {
  generateSingleOrderMessage,
  getTelegramOrderUrl,
  getTotalStock,
} from './utils/formatters';
import { ArrowRight, ShoppingBag, Send, Sparkles, RefreshCw, Flame } from 'lucide-react';

export default function App() {
  // Persistence for products (v6)
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('homesport_products_v6');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse saved products', e);
      }
    }
    return DEFAULT_PRODUCTS;
  });

  // Persistence for store settings
  const [settings, setSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('homesport_settings_v6');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          telegramUsername: 'doublenin', // Explicitly guaranteed
        };
      } catch (e) {
        console.error('Failed to parse saved settings', e);
      }
    }
    return {
      ...DEFAULT_STORE_SETTINGS,
      telegramUsername: 'doublenin',
    };
  });

  // Persistence for Inquiry Cart Bag
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('homesport_cart_v6');
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
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [selectedSize, setSelectedSize] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  // UI preferences
  const [currency, setCurrency] = useState<Currency>('USD');
  const [language, setLanguage] = useState<Language>('km'); // Default to Khmer as requested

  // Modals & Drawers
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isPasscodeOpen, setIsPasscodeOpen] = useState(false);

  const handleRequestAdminAccess = () => {
    setIsPasscodeOpen(true);
  };

  const catalogSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('homesport_products_v6', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('homesport_settings_v6', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('homesport_cart_v6', JSON.stringify(cartItems));
  }, [cartItems]);

  // Extract all unique sizes across catalog for size filter pills
  const availableSizes = useMemo(() => {
    const sizeSet = new Set<string>();
    products.forEach((p) => {
      p.sizes.forEach((s) => sizeSet.add(s.size));
    });
    return Array.from(sizeSet).sort((a, b) => {
      const numA = parseInt(a, 10);
      const numB = parseInt(b, 10);
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      return a.localeCompare(b);
    });
  }, [products]);

  // Filtered & Sorted products list
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Search Filter (checks title in English, title in Khmer, brand, sku, description)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = product.name.toLowerCase().includes(q);
          const matchNameKm = product.nameKm?.toLowerCase().includes(q);
          const matchBrand = product.brand.toLowerCase().includes(q);
          const matchSku = product.sku.toLowerCase().includes(q);
          const matchCategory = product.category.toLowerCase().includes(q);
          if (!matchName && !matchNameKm && !matchBrand && !matchSku && !matchCategory) {
            return false;
          }
        }

        // Category Filter
        if (selectedCategory !== 'all' && product.category !== selectedCategory) {
          return false;
        }

        // Brand Filter
        if (selectedBrand !== 'All Brands' && product.brand !== selectedBrand) {
          return false;
        }

        // In-Stock Only Filter
        if (inStockOnly && getTotalStock(product) <= 0) {
          return false;
        }

        // Sale Only Filter
        if (onSaleOnly && (!product.salePrice || product.salePrice >= product.price)) {
          return false;
        }

        // Specific Size Filter
        if (selectedSize !== 'all') {
          const hasSizeInStock = product.sizes.some(
            (s) => s.size === selectedSize && s.stock > 0
          );
          if (!hasSizeInStock) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = a.salePrice ?? a.price;
        const priceB = b.salePrice ?? b.price;

        if (sortBy === 'price-asc') return priceA - priceB;
        if (sortBy === 'price-desc') return priceB - priceA;
        if (sortBy === 'discount') {
          const discA = a.salePrice ? (a.price - a.salePrice) / a.price : 0;
          const discB = b.salePrice ? (b.price - b.salePrice) / b.price : 0;
          return discB - discA;
        }
        if (sortBy === 'newest') {
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        }
        // Default: featured
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [
    products,
    searchQuery,
    selectedCategory,
    selectedBrand,
    inStockOnly,
    onSaleOnly,
    selectedSize,
    sortBy,
  ]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'all' ||
    selectedBrand !== 'All Brands' ||
    inStockOnly ||
    onSaleOnly ||
    selectedSize !== 'all' ||
    sortBy !== 'featured';

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedBrand('All Brands');
    setInStockOnly(false);
    setOnSaleOnly(false);
    setSelectedSize('all');
    setSortBy('featured');
  };

  const scrollToCatalog = () => {
    catalogSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectProduct = (product: Product) => {
    setActiveModalProduct(product);
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

  // Direct order via Telegram (@doublenin)
  const handleDirectTelegramOrder = (product: Product, size: string) => {
    const message = generateSingleOrderMessage(product, size, 1, settings);
    const url = getTelegramOrderUrl(settings.telegramUsername, message);
    window.open(url, '_blank');
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

  // Trending / Featured spotlight products
  const trendingProducts = useMemo(() => {
    return products.filter((p) => p.isTrending || p.isFeatured).slice(0, 4);
  }, [products]);

  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf9] text-neutral-900 font-sans antialiased selection:bg-neutral-900 selection:text-white">
      {/* 1. Header (Sticky navigation + Announcement + Telegram + Currency & Language switchers) */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (q.trim()) scrollToCatalog();
        }}
        currency={currency}
        onCurrencyToggle={() => setCurrency((prev) => (prev === 'USD' ? 'KHR' : 'USD'))}
        language={language}
        onLanguageToggle={() => setLanguage((prev) => (prev === 'km' ? 'en' : 'km'))}
        cartCount={totalCartItemCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={handleRequestAdminAccess}
        settings={settings}
        activeCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          scrollToCatalog();
        }}
      />

      <main className="flex-1">
        {/* 2. Hero Campaign Banner (Cinematic, Athletic, direct Telegram CTA) */}
        <HeroBanner
          language={language}
          onExploreClick={scrollToCatalog}
          settings={settings}
        />

        {/* 3. Quick Category Icon Strip */}
        <CategoryIconStrip
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            scrollToCatalog();
          }}
          language={language}
        />

        {/* 4. Visual 4-Column Feature Category Cards */}
        <CategoryBannerGrid
          language={language}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            scrollToCatalog();
          }}
          settings={settings}
        />

        {/* 5. Main Catalog Section */}
        <section ref={catalogSectionRef} className="py-8 scroll-mt-20">
          {/* Section Header */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-neutral-950 uppercase tracking-tight">
                {selectedCategory === 'all'
                  ? language === 'km'
                    ? 'កាតាឡុកទំនិញកីឡាទាំងអស់'
                    : 'All Sport Products'
                  : CATEGORIES.find((c) => c.id === selectedCategory)?.nameKm ||
                    CATEGORIES.find((c) => c.id === selectedCategory)?.name}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 font-khmer mt-0.5">
                {language === 'km'
                  ? 'ស្វែងរក ជ្រើសរើសទំហំ (Size) និងចុច Chat កុម្ម៉ង់ផ្ទាល់ទៅកាន់ Telegram'
                  : 'Browse items, check sizes & stock, chat directly to order via Telegram'}
              </p>
            </div>

            {/* Quick reset if filtered */}
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-red-600 hover:text-red-700 font-bold bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <span>{language === 'km' ? 'ជម្រះការជ្រើសរើស' : 'Reset Filters'}</span>
              </button>
            )}
          </div>

          {/* Sticky Filter & Sort Toolbar */}
          <FilterBar
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            selectedBrand={selectedBrand}
            onSelectBrand={setSelectedBrand}
            sortBy={sortBy}
            onSortChange={setSortBy}
            inStockOnly={inStockOnly}
            onToggleInStockOnly={() => setInStockOnly((prev) => !prev)}
            onSaleOnly={onSaleOnly}
            onToggleOnSaleOnly={() => setOnSaleOnly((prev) => !prev)}
            selectedSize={selectedSize}
            onSelectSize={setSelectedSize}
            availableSizes={availableSizes}
            totalResults={filteredProducts.length}
            onResetFilters={handleResetFilters}
            hasActiveFilters={hasActiveFilters}
            language={language}
          />

          {/* Product Cards Grid */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    currency={currency}
                    language={language}
                    settings={settings}
                    onSelectProduct={handleSelectProduct}
                    onAddToCart={handleAddToCart}
                    onQuickTelegram={(prod, size) => handleDirectTelegramOrder(prod, size)}
                  />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-20 bg-white rounded-2xl border border-neutral-200 p-8 shadow-xs max-w-xl mx-auto space-y-4">
                <h3 className="font-display font-bold text-lg text-neutral-900">
                  {language === 'km'
                    ? 'រកមិនឃើញទំនិញដែលត្រូវនឹងការស្វែងរកទេ'
                    : 'No matching products found'}
                </h3>
                <p className="text-xs text-neutral-500 font-khmer max-w-md mx-auto">
                  {language === 'km'
                    ? 'សូមព្យាយាមផ្លាស់ប្តូរពាក្យស្វែងរក ឬដក Filter ចេញដើម្បីមើលទំនិញផ្សេងទៀត។'
                    : 'Try clearing some filters or searching with a different term to explore our sports gear.'}
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer"
                >
                  {language === 'km' ? 'បង្ហាញទំនិញទាំងអស់ឡើងវិញ' : 'Show All Products'}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* 6. Telegram Club & VIP Community Banner */}
        <ClubBanner language={language} settings={settings} />
      </main>

      {/* Floating Action Buttons on Mobile (Clean text buttons) */}
      <div className="fixed bottom-5 right-5 z-30 flex flex-col gap-2 md:hidden">
        {totalCartItemCount > 0 && (
          <button
            onClick={() => setIsCartOpen(true)}
            className="px-4 py-2.5 bg-neutral-900 text-white rounded-xl shadow-xl flex items-center gap-1.5 text-xs font-bold cursor-pointer active:scale-95"
            title="Inquiry Bag"
          >
            <span>{language === 'km' ? 'កន្ត្រក' : 'Bag'}: {totalCartItemCount}</span>
          </button>
        )}
        <a
          href={`https://t.me/${settings.telegramUsername.replace('@', '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl shadow-xl flex items-center justify-center text-xs font-bold cursor-pointer active:scale-95"
          title="Direct Telegram Chat"
        >
          <span>Telegram</span>
        </a>
      </div>

      {/* Product Detail Modal */}
      {activeModalProduct && (
        <ProductDetailModal
          product={activeModalProduct}
          onClose={() => setActiveModalProduct(null)}
          currency={currency}
          language={language}
          settings={settings}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Slide-out Inquiry Bag Drawer */}
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

      {/* Admin Passcode Gatekeeper (Requires Secret PIN) */}
      <AdminPasscodeModal
        isOpen={isPasscodeOpen}
        onClose={() => setIsPasscodeOpen(false)}
        onSuccess={() => {
          setIsPasscodeOpen(false);
          setIsAdminOpen(true);
        }}
        settings={settings}
        language={language}
      />

      {/* Admin Panel Modal */}
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
        onOpenAdmin={handleRequestAdminAccess}
        onSelectCategory={(catId) => {
          setSelectedCategory(catId);
          scrollToCatalog();
        }}
      />
    </div>
  );
}
