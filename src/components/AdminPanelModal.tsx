import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Edit2,
  Save,
  RotateCcw,
  DollarSign,
  Package,
  Settings,
  Sparkles,
  Download,
  Check,
} from 'lucide-react';
import { BRANDS, CATEGORIES, DEFAULT_PRODUCTS } from '../data/defaultProducts';
import { Product, StoreSettings } from '../types';
import { calculateDiscount, getTotalStock } from '../utils/formatters';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSaveProducts: (products: Product[]) => void;
  settings: StoreSettings;
  onSaveSettings: (settings: StoreSettings) => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  products,
  onSaveProducts,
  settings,
  onSaveSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'add' | 'settings' | 'banners'>('products');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    nameKm: '',
    subtitle: '',
    brand: 'HOME SPORT',
    category: 'boots',
    price: 120,
    salePrice: 89,
    sku: 'HS-PRO-01',
    groundType: 'FG',
    color: 'White / Silver',
    description: '',
    descriptionKm: '',
    images: ['/src/assets/images/product_boot_white_1791256052582.jpg'],
    sizes: [
      { size: '39', stock: 2 },
      { size: '40', stock: 4 },
      { size: '41', stock: 5 },
      { size: '42', stock: 0 },
      { size: '43', stock: 2 },
    ],
    isFeatured: true,
    isTrending: false,
    isNew: true,
  });

  const [imageUrlInput, setImageUrlInput] = useState('');
  const [newSizeInput, setNewSizeInput] = useState('');
  const [newStockInput, setNewStockInput] = useState(1);
  const [settingsForm, setSettingsForm] = useState<StoreSettings>({ ...settings });
  const [saveToast, setSaveToast] = useState(false);

  if (!isOpen) return null;

  const handleStartEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({ ...product });
    setActiveTab('add');
  };

  const handleStartAddNew = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      nameKm: '',
      subtitle: '',
      brand: 'HOME SPORT',
      category: 'boots',
      price: 120,
      salePrice: 89,
      sku: `HS-${Math.floor(1000 + Math.random() * 9000)}`,
      groundType: 'FG',
      color: 'White / Gold',
      description: 'High performance football gear with responsive touch and durable traction.',
      descriptionKm: 'សម្ភារៈកីឡាគុណភាពខ្ពស់ ស្បែកទន់ស្រួល និងបាតទ្រនាប់រឹងមាំសម្រាប់ទីលាន។',
      images: ['/src/assets/images/product_boot_white_1791256052582.jpg'],
      sizes: [
        { size: '39', stock: 2 },
        { size: '40', stock: 3 },
        { size: '41', stock: 4 },
        { size: '42', stock: 1 },
        { size: '43', stock: 0 },
      ],
      isFeatured: false,
      isTrending: true,
      isNew: true,
    });
    setActiveTab('add');
  };

  const handleAddSize = () => {
    if (!newSizeInput.trim()) return;
    const existing = formData.sizes || [];
    if (existing.some((s) => s.size === newSizeInput.trim())) return;

    setFormData({
      ...formData,
      sizes: [...existing, { size: newSizeInput.trim(), stock: Number(newStockInput) || 0 }],
    });
    setNewSizeInput('');
    setNewStockInput(1);
  };

  const handleRemoveSize = (sizeName: string) => {
    const existing = formData.sizes || [];
    setFormData({
      ...formData,
      sizes: existing.filter((s) => s.size !== sizeName),
    });
  };

  const handleUpdateSizeStock = (sizeName: string, delta: number) => {
    const existing = formData.sizes || [];
    setFormData({
      ...formData,
      sizes: existing.map((s) =>
        s.size === sizeName ? { ...s, stock: Math.max(0, s.stock + delta) } : s
      ),
    });
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    const existing = formData.images || [];
    setFormData({
      ...formData,
      images: [...existing, imageUrlInput.trim()],
    });
    setImageUrlInput('');
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const existing = formData.images || [];
    setFormData({
      ...formData,
      images: existing.filter((_, idx) => idx !== indexToRemove),
    });
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const base64Url = event.target.result as string;
        const existing = formData.images || [];
        setFormData({
          ...formData,
          images: [...existing, base64Url],
        });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSelectPresetImage = (url: string) => {
    const existing = formData.images || [];
    if (!existing.includes(url)) {
      setFormData({
        ...formData,
        images: [...existing, url],
      });
    }
  };

  const handleBannerUpload = (
    field: keyof StoreSettings,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const base64Url = event.target.result as string;
        const updated = { ...settingsForm, [field]: base64Url };
        setSettingsForm(updated);
        onSaveSettings(updated);
        setSaveToast(true);
        setTimeout(() => setSaveToast(false), 2000);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleBannerUrlChange = (field: keyof StoreSettings, url: string) => {
    const updated = { ...settingsForm, [field]: url };
    setSettingsForm(updated);
    onSaveSettings(updated);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const handleTableQuickStock = (productId: string, sizeName: string, delta: number) => {
    const updated = products.map((p) => {
      if (p.id !== productId) return p;
      return {
        ...p,
        sizes: p.sizes.map((s) =>
          s.size === sizeName ? { ...s, stock: Math.max(0, s.stock + delta) } : s
        ),
      };
    });
    onSaveProducts(updated);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('តើអ្នកពិតជាចង់លុបទំនិញនេះចេញពី Catalog មែនទេ?')) {
      const updated = products.filter((p) => p.id !== id);
      onSaveProducts(updated);
    }
  };

  const handleSaveProductForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      alert('សូមបញ្ចូលឈ្មោះទំនិញ (Product Name)');
      return;
    }

    if (editingProduct) {
      const updated = products.map((p) =>
        p.id === editingProduct.id ? ({ ...p, ...formData, id: p.id } as Product) : p
      );
      onSaveProducts(updated);
    } else {
      const newProduct: Product = {
        ...(formData as Product),
        id: `hs-${Date.now().toString().slice(-4)}`,
        createdAt: new Date().toISOString(),
      };
      onSaveProducts([newProduct, ...products]);
    }

    setActiveTab('products');
    setEditingProduct(null);
  };

  const handleSaveSettingsForm = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(settingsForm);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const handleResetCatalog = () => {
    if (window.confirm('តើអ្នកចង់ Reset ទិន្នន័យ Catalog ទៅទិន្នន័យគំរូដើមវិញទេ?')) {
      onSaveProducts(DEFAULT_PRODUCTS);
    }
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `homesport-catalog-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-black/50 backdrop-blur-xs">
      <div
        className="relative w-full max-w-5xl bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] text-neutral-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-150 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#383b32] text-white flex items-center justify-center font-athletic text-base font-bold">
              HS
            </div>
            <div>
              <h2 className="font-athletic text-lg font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
                <span>HOME SPORT Store Admin</span>
                <span className="text-xs px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 font-mono normal-case">
                  Settings
                </span>
              </h2>
              <p className="text-xs text-neutral-500 font-khmer">
                គ្រប់គ្រងទំនិញ, ស្តុកតាម Size, អត្រាប្រាក់ USD/KHR និងតំណភ្ជាប់ Telegram
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-black hover:bg-neutral-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 border-b border-neutral-200 bg-neutral-50/60 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('products')}
              className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'products'
                  ? 'border-[#383b32] text-[#383b32]'
                  : 'border-transparent text-neutral-500 hover:text-black'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>បញ្ជីទំនិញ ({products.length})</span>
            </button>

            <button
              onClick={handleStartAddNew}
              className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'add'
                  ? 'border-[#383b32] text-[#383b32]'
                  : 'border-transparent text-neutral-500 hover:text-black'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>{editingProduct ? 'កែប្រែទំនិញ' : 'បន្ថែមទំនិញថ្មី'}</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'settings'
                  ? 'border-[#383b32] text-[#383b32]'
                  : 'border-transparent text-neutral-500 hover:text-black'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>ការកំណត់ហាង & អត្រាប្រាក់</span>
            </button>

            <button
              onClick={() => setActiveTab('banners')}
              className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'banners'
                  ? 'border-[#383b32] text-[#383b32]'
                  : 'border-transparent text-neutral-500 hover:text-black'
              }`}
            >
              <span>រូបភាពទំព័រដើម (Homepage Banners)</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 pb-2">
            <button
              onClick={handleExportJSON}
              className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-neutral-200 hover:bg-neutral-100 text-neutral-700 rounded-lg flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3 h-3" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={handleResetCatalog}
              className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-neutral-200 hover:bg-rose-50 text-neutral-500 hover:text-rose-600 rounded-lg flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* TAB 1: PRODUCTS LIST */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-neutral-900 font-khmer">
                    តារាងគ្រប់គ្រងស្តុក (Stock & Size Inventory)
                  </h3>
                  <p className="text-xs text-neutral-500 font-khmer">
                    ចុច +/- ដើម្បីកែសម្រួលស្តុកតាម Size ភ្លាមៗ ឬចុចកែប្រែទំនិញ។
                  </p>
                </div>
                <button
                  onClick={handleStartAddNew}
                  className="px-3.5 py-2 bg-[#383b32] hover:bg-[#282a23] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>បន្ថែមទំនិញ</span>
                </button>
              </div>

              <div className="overflow-x-auto border border-neutral-200 rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50 text-neutral-600 uppercase tracking-wider font-athletic text-[11px] border-b border-neutral-200">
                    <tr>
                      <th className="p-3">Product</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Price (USD)</th>
                      <th className="p-3">Sizes & Stock Counter</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200/80 bg-white">
                    {products.map((p) => {
                      const totalStock = getTotalStock(p);
                      const discount = calculateDiscount(p.price, p.salePrice);
                      return (
                        <tr key={p.id} className="hover:bg-neutral-50/60 transition-colors">
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg bg-neutral-100 border border-neutral-200 p-1 shrink-0 flex items-center justify-center">
                                <img
                                  src={p.images[0]}
                                  alt=""
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <div className="min-w-0 max-w-[200px]">
                                <div className="font-bold text-neutral-900 truncate">{p.name}</div>
                                <div className="text-[10px] text-neutral-400 font-mono">
                                  {p.sku}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 font-mono font-bold mr-1">
                              {p.brand}
                            </span>
                            <span className="text-[11px] text-neutral-500 block mt-1">
                              {p.category}
                            </span>
                          </td>

                          <td className="p-3">
                            <div className="font-athletic text-sm font-bold text-neutral-900 tabular-nums">
                              ${(p.salePrice ?? p.price).toFixed(2)}
                            </div>
                            {discount > 0 && (
                              <div className="text-[10px] text-neutral-400 line-through tabular-nums">
                                ${p.price.toFixed(2)} (-{discount}%)
                              </div>
                            )}
                          </td>

                          <td className="p-3">
                            <div className="flex flex-wrap gap-1.5 max-w-sm">
                              {p.sizes.map((s) => (
                                <div
                                  key={s.size}
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[11px] font-mono ${
                                    s.stock > 0
                                      ? 'bg-neutral-50 border-neutral-200 text-neutral-800'
                                      : 'bg-rose-50 border-rose-200 text-rose-600'
                                  }`}
                                >
                                  <span className="font-bold">{s.size}:</span>
                                  <span className="font-bold">{s.stock}</span>
                                  <div className="flex gap-0.5 ml-1">
                                    <button
                                      onClick={() => handleTableQuickStock(p.id, s.size, -1)}
                                      disabled={s.stock <= 0}
                                      className="w-4 h-4 bg-white border border-neutral-300 hover:bg-neutral-100 rounded flex items-center justify-center text-[10px] disabled:opacity-30 cursor-pointer"
                                    >
                                      -
                                    </button>
                                    <button
                                      onClick={() => handleTableQuickStock(p.id, s.size, 1)}
                                      className="w-4 h-4 bg-white border border-neutral-300 hover:bg-neutral-100 rounded flex items-center justify-center text-[10px] cursor-pointer"
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="text-[10px] text-neutral-500 mt-1 font-mono">
                              Total Stock: {totalStock}
                            </div>
                          </td>

                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleStartEdit(p)}
                                className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.id)}
                                className="p-1.5 rounded-lg bg-neutral-100 hover:bg-rose-100 text-neutral-500 hover:text-rose-600 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: ADD OR EDIT */}
          {activeTab === 'add' && (
            <form onSubmit={handleSaveProductForm} className="space-y-5 max-w-3xl mx-auto text-xs">
              <div className="p-3 rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-neutral-600 shrink-0" />
                <span>
                  {editingProduct
                    ? `កំពុងកែប្រែទំនិញ: ${editingProduct.name}`
                    : 'បន្ថែមទំនិញថ្មី (កំណត់ទំហំ Size, ស្តុក, តម្លៃ, រូបភាព)'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-neutral-700">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. HOME SPORT COURT PRO"
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 focus:outline-none focus:border-black"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-neutral-700 font-khmer">Subtitle / ភាសាខ្មែរ</label>
                  <input
                    type="text"
                    value={formData.subtitle || ''}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="e.g. ស្បែកជើងបាល់ទាត់ល្បឿនលឿន"
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 focus:outline-none focus:border-black font-khmer"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-neutral-700">Brand</label>
                  <select
                    value={formData.brand || 'HOME SPORT'}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 focus:outline-none focus:border-black"
                  >
                    {BRANDS.filter((b) => b !== 'All Brands').map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-neutral-700">Category</label>
                  <select
                    value={formData.category || 'boots'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 focus:outline-none focus:border-black"
                  >
                    {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.nameKm})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-neutral-700">Original Price ($ USD) *</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={formData.price || 0}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 focus:outline-none focus:border-black"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-neutral-700">Sale Price ($ USD)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.salePrice ?? ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        salePrice: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    placeholder="e.g. 95"
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              {/* Product Images & Upload Section */}
              <div className="space-y-3 pt-2 border-t border-neutral-200">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-neutral-800 text-sm">
                    រូបភាពទំនិញ (Product Images & Upload)
                  </label>
                  <span className="text-[11px] font-semibold text-neutral-500">
                    {formData.images?.length || 0} រូបភាព
                  </span>
                </div>

                {/* Current Images Gallery Preview */}
                <div className="flex flex-wrap gap-2.5">
                  {formData.images && formData.images.length > 0 ? (
                    formData.images.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative group w-20 h-20 rounded-xl bg-neutral-100 border border-neutral-200 overflow-hidden shrink-0 p-1 flex items-center justify-center shadow-2xs"
                      >
                        <img
                          src={img}
                          alt=""
                          className="w-full h-full object-contain"
                        />
                        {idx === 0 && (
                          <span className="absolute top-1 left-1 bg-neutral-900 text-white text-[8px] font-bold px-1 rounded">
                            Cover
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded text-[10px] w-4 h-4 flex items-center justify-center cursor-pointer shadow-xs"
                          title="Delete photo"
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 bg-neutral-50 border border-dashed border-neutral-300 rounded-xl text-neutral-400 text-xs w-full text-center">
                      មិនទាន់មានរូបភាពនៅឡើយទេ
                    </div>
                  )}
                </div>

                {/* Add Image Options: File Upload from Phone/Computer OR Image URL */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Option A: Direct Device File Upload */}
                  <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl space-y-1.5">
                    <span className="font-bold text-neutral-800 block text-xs">
                      Upload រូបភាពពីទូរស័ព្ទ ឬកុំព្យូទ័រ
                    </span>
                    <label className="block w-full py-2 px-3 bg-white hover:bg-neutral-100 border border-neutral-300 rounded-lg text-center font-bold text-neutral-800 cursor-pointer transition-colors text-xs shadow-2xs">
                      <span>ជ្រើសរើសឯកសាររូបភាព (Choose File)</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Option B: Image URL link */}
                  <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl space-y-1.5">
                    <span className="font-bold text-neutral-800 block text-xs">
                      ឬបិទភ្ជាប់តំណ Link រូបភាព (Image URL)
                    </span>
                    <div className="flex gap-1.5">
                      <input
                        type="url"
                        value={imageUrlInput}
                        onChange={(e) => setImageUrlInput(e.target.value)}
                        placeholder="https://example.com/shoe.jpg"
                        className="flex-1 px-2.5 py-1.5 bg-white border border-neutral-300 rounded-lg text-xs text-neutral-900"
                      />
                      <button
                        type="button"
                        onClick={handleAddImageUrl}
                        className="px-3 py-1.5 bg-neutral-900 hover:bg-black text-white rounded-lg font-bold text-xs cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                {/* Option C: Quick Preset Sport Photos */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-semibold text-neutral-500">
                    ជ្រើសរើសរូបភាពគំរូកីឡាដែលមានស្រាប់ (Quick Presets):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: 'Mercurial FG', url: '/src/assets/images/boot_mercurial_vapor_1791205277714.jpg' },
                      { label: 'Predator Elite', url: '/src/assets/images/boot_predator_elite_1791205294570.jpg' },
                      { label: 'Cambodia Kit', url: '/src/assets/images/jersey_cambodia_kit_1791205311701.jpg' },
                      { label: 'Grip Socks', url: '/src/assets/images/gear_grip_socks_1791205326910.jpg' },
                      { label: 'Sport Bag', url: '/src/assets/images/cat_sport_bags_1791256037463.jpg' },
                      { label: 'Shorts', url: '/src/assets/images/product_shorts_white_1791256091416.jpg' },
                      { label: 'Cap', url: '/src/assets/images/product_cap_white_1791256076833.jpg' },
                      { label: 'White Boot', url: '/src/assets/images/product_boot_white_1791256052582.jpg' },
                    ].map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => handleSelectPresetImage(preset.url)}
                        className="px-2 py-1 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-700 rounded text-[11px] font-medium cursor-pointer"
                      >
                        + {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sizes and stock */}
              <div className="space-y-2 pt-2 border-t border-neutral-200">
                <label className="font-bold text-neutral-800">
                  Size & Stock Management
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {formData.sizes?.map((s) => (
                    <div
                      key={s.size}
                      className="p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl flex items-center justify-between"
                    >
                      <div>
                        <div className="font-mono text-xs font-bold text-neutral-900">
                          Size {s.size}
                        </div>
                        <div className="text-[10px] text-neutral-500 font-mono">
                          Stock: {s.stock}
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleUpdateSizeStock(s.size, -1)}
                          disabled={s.stock <= 0}
                          className="w-5 h-5 bg-white border border-neutral-300 text-neutral-700 rounded text-xs flex items-center justify-center cursor-pointer"
                        >
                          -
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateSizeStock(s.size, 1)}
                          className="w-5 h-5 bg-white border border-neutral-300 text-neutral-700 rounded text-xs flex items-center justify-center cursor-pointer"
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveSize(s.size)}
                          className="w-5 h-5 text-neutral-400 hover:text-rose-600 ml-1 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 items-center pt-1">
                  <input
                    type="text"
                    value={newSizeInput}
                    onChange={(e) => setNewSizeInput(e.target.value)}
                    placeholder="New Size (40, M)"
                    className="w-32 px-3 py-1.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs text-neutral-900"
                  />
                  <input
                    type="number"
                    min="0"
                    value={newStockInput}
                    onChange={(e) => setNewStockInput(Number(e.target.value))}
                    placeholder="Qty"
                    className="w-20 px-3 py-1.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs text-neutral-900"
                  />
                  <button
                    type="button"
                    onClick={handleAddSize}
                    className="px-3 py-1.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Add Size
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1 pt-2 border-t border-neutral-200">
                <label className="font-bold text-neutral-700 font-khmer">ការពិពណ៌នាទំនិញ</label>
                <textarea
                  rows={3}
                  value={formData.descriptionKm || formData.description || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, descriptionKm: e.target.value, description: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 focus:outline-none focus:border-black font-khmer"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setActiveTab('products')}
                  className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl font-bold cursor-pointer"
                >
                  បោះបង់
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#383b32] hover:bg-[#282a23] text-white rounded-xl font-bold cursor-pointer"
                >
                  <Save className="w-4 h-4 inline mr-1" />
                  {editingProduct ? 'រក្សាទុកការកែប្រែ' : 'រក្សាទុកទំនិញថ្មី'}
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: SETTINGS */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettingsForm} className="space-y-4 max-w-xl mx-auto text-xs">
              {saveToast && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2 font-bold animate-in fade-in">
                  <Check className="w-4 h-4" />
                  <span>បានរក្សាទុកការកំណត់ហាងដោយជោគជ័យ!</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="font-bold text-neutral-700">Store Name</label>
                <input
                  type="text"
                  value={settingsForm.storeName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 font-bold"
                />
              </div>

              {/* Exchange Rate */}
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-neutral-900">
                  <DollarSign className="w-4 h-4" />
                  <span>អត្រាប្តូរប្រាក់ USD / KHR Exchange Rate</span>
                </div>
                <div className="flex items-center gap-3 pt-1">
                  <span className="font-bold text-neutral-700">1 USD =</span>
                  <input
                    type="number"
                    value={settingsForm.exchangeRate}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, exchangeRate: Number(e.target.value) || 4100 })
                    }
                    className="w-32 px-3 py-2 bg-white border border-neutral-300 rounded-xl text-neutral-900 font-mono font-bold"
                  />
                  <span className="font-bold text-neutral-700">KHR (៛)</span>
                </div>
              </div>

              {/* Telegram Username */}
              <div className="space-y-1">
                <label className="font-bold text-neutral-700">
                  Telegram Username (សម្រាប់ Chat to Order)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-neutral-400 font-bold">@</span>
                  <input
                    type="text"
                    value={settingsForm.telegramUsername.replace('@', '')}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, telegramUsername: e.target.value.trim() })
                    }
                    placeholder="doublenin"
                    className="w-full pl-8 pr-4 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="font-bold text-neutral-700">Store Contact Phone</label>
                <input
                  type="text"
                  value={settingsForm.phone}
                  onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900"
                />
              </div>

              {/* Admin Secret PIN Security */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
                <div>
                  <label className="font-bold text-neutral-900 block">
                    លេខកូដសម្ងាត់ការពារ Admin (Secret PIN Protection)
                  </label>
                  <span className="text-[11px] text-neutral-600 font-khmer">
                    ការពារមិនឱ្យ Client ឬអតិថិជនចូលកែប្រែទិន្នន័យ និងស្តុកបាន
                  </span>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={settingsForm.adminPin || '8899'}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, adminPin: e.target.value.trim() })
                    }
                    placeholder="8899"
                    className="w-36 px-3 py-2 bg-white border border-amber-300 rounded-xl text-neutral-900 font-mono font-bold text-sm tracking-widest"
                  />
                  <span className="text-[11px] text-neutral-500 font-khmer">
                    (កូដដើម: 8899 — អ្នកអាចប្តូរជាលេខផ្ទាល់ខ្លួនបាន)
                  </span>
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#383b32] hover:bg-[#282a23] text-white rounded-xl font-bold cursor-pointer"
                >
                  រក្សាទុកការកំណត់ហាង (Save Settings)
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: HOMEPAGE BANNERS & IMAGES */}
          {activeTab === 'banners' && (
            <div className="space-y-6 max-w-4xl mx-auto text-xs">
              {saveToast && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2 font-bold animate-in fade-in">
                  <Check className="w-4 h-4" />
                  <span>បានផ្លាស់ប្តូររូបភាពទំព័រដើមដោយជោគជ័យ!</span>
                </div>
              )}

              <div className="border-b border-neutral-200 pb-3">
                <h3 className="font-bold text-base text-neutral-900">
                  គ្រប់គ្រងរូបភាពនៅលើ Homepage (ដោយមិនបាច់សរសេរកូដ)
                </h3>
                <p className="text-neutral-500 font-khmer mt-0.5">
                  អ្នកអាចជ្រើសរើសរូបភាពពីទូរស័ព្ទ ឬកុំព្យូទ័រ (Choose File) ឬបិទភ្ជាប់ Link រូបភាព។ រូបភាពនៅលើ Homepage នឹងផ្លាស់ប្តូរភ្លាមៗ!
                </p>
              </div>

              {/* 1. Hero Campaign Image */}
              <div className="p-4 sm:p-5 bg-neutral-50 border border-neutral-200 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-neutral-900">
                      ១. រូបភាព Hero Banner ធំនៅទំព័រដើម (Main Campaign Photo)
                    </h4>
                    <span className="text-neutral-500 text-[11px] font-khmer">
                      បង្ហាញនៅផ្នែកខាងស្តាំនៃ Hero Banner
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      handleBannerUrlChange(
                        'heroBannerImage',
                        '/src/assets/images/hero_athlete_light_1791255981071.jpg'
                      )
                    }
                    className="text-[11px] font-bold text-neutral-600 hover:text-black bg-white border border-neutral-200 px-2.5 py-1 rounded-lg cursor-pointer"
                  >
                    Reset រូបដើម
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  {/* Current Photo Preview */}
                  <div className="w-32 aspect-[3/4] bg-neutral-200 rounded-xl overflow-hidden border border-neutral-300 shrink-0 shadow-xs">
                    <img
                      src={
                        settingsForm.heroBannerImage ||
                        '/src/assets/images/hero_athlete_light_1791255981071.jpg'
                      }
                      alt="Hero Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex-1 space-y-3 w-full">
                    {/* Upload File */}
                    <div className="p-3 bg-white border border-neutral-200 rounded-xl space-y-1">
                      <span className="font-bold text-neutral-800 block text-xs">
                        Upload រូបថតថ្មីពីទូរស័ព្ទ ឬកុំព្យូទ័រ
                      </span>
                      <label className="block w-full py-2.5 px-3 bg-neutral-900 hover:bg-black text-white text-center font-bold rounded-lg cursor-pointer transition-colors text-xs shadow-xs">
                        <span>ជ្រើសរើសរូបថត (Choose File from Device)</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleBannerUpload('heroBannerImage', e)}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* URL Input */}
                    <div className="p-3 bg-white border border-neutral-200 rounded-xl space-y-1">
                      <span className="font-bold text-neutral-800 block text-xs">
                        ឬបិទភ្ជាប់តំណ Link រូបភាព (Image URL)
                      </span>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          placeholder="https://example.com/banner.jpg"
                          defaultValue={settingsForm.heroBannerImage || ''}
                          onBlur={(e) => {
                            if (e.target.value.trim()) {
                              handleBannerUrlChange('heroBannerImage', e.target.value.trim());
                            }
                          }}
                          className="flex-1 px-3 py-1.5 bg-neutral-50 border border-neutral-300 rounded-lg text-xs text-neutral-900"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Four Category Cards */}
              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-sm text-neutral-900">
                  ២. រូបភាពកាត Collection ទាំង ៤ នៅលើ Homepage (Category Cards)
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Card 1: Football Boots */}
                  <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-neutral-900">
                        កាតស្បែកជើងបាល់ទាត់ (Football Boots)
                      </span>
                    </div>

                    <div className="flex gap-3 items-center">
                      <div className="w-20 h-24 bg-neutral-200 rounded-lg overflow-hidden border border-neutral-300 shrink-0">
                        <img
                          src={
                            settingsForm.categoryBootsImage ||
                            '/src/assets/images/cat_football_boots_1791255998020.jpg'
                          }
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <label className="block w-full py-2 px-2 bg-neutral-900 hover:bg-black text-white text-center font-bold rounded-lg cursor-pointer text-xs">
                          <span>Upload រូបថតថ្មី</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleBannerUpload('categoryBootsImage', e)}
                            className="hidden"
                          />
                        </label>
                        <input
                          type="url"
                          placeholder="Image URL..."
                          defaultValue={settingsForm.categoryBootsImage || ''}
                          onBlur={(e) => {
                            if (e.target.value.trim()) {
                              handleBannerUrlChange('categoryBootsImage', e.target.value.trim());
                            }
                          }}
                          className="w-full px-2.5 py-1.5 bg-white border border-neutral-300 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Match Jerseys */}
                  <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-neutral-900">
                        កាតអាវកីឡា (Match Kits & Polos)
                      </span>
                    </div>

                    <div className="flex gap-3 items-center">
                      <div className="w-20 h-24 bg-neutral-200 rounded-lg overflow-hidden border border-neutral-300 shrink-0">
                        <img
                          src={
                            settingsForm.categoryJerseysImage ||
                            '/src/assets/images/cat_match_jerseys_1791256009910.jpg'
                          }
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <label className="block w-full py-2 px-2 bg-neutral-900 hover:bg-black text-white text-center font-bold rounded-lg cursor-pointer text-xs">
                          <span>Upload រូបថតថ្មី</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleBannerUpload('categoryJerseysImage', e)}
                            className="hidden"
                          />
                        </label>
                        <input
                          type="url"
                          placeholder="Image URL..."
                          defaultValue={settingsForm.categoryJerseysImage || ''}
                          onBlur={(e) => {
                            if (e.target.value.trim()) {
                              handleBannerUrlChange('categoryJerseysImage', e.target.value.trim());
                            }
                          }}
                          className="w-full px-2.5 py-1.5 bg-white border border-neutral-300 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Socks & Accessories */}
                  <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-neutral-900">
                        កាតស្រោមជើង & សម្ភារៈ (Pro Accessories)
                      </span>
                    </div>

                    <div className="flex gap-3 items-center">
                      <div className="w-20 h-24 bg-neutral-200 rounded-lg overflow-hidden border border-neutral-300 shrink-0">
                        <img
                          src={
                            settingsForm.categorySocksImage ||
                            '/src/assets/images/cat_accessories_gear_1791256021862.jpg'
                          }
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <label className="block w-full py-2 px-2 bg-neutral-900 hover:bg-black text-white text-center font-bold rounded-lg cursor-pointer text-xs">
                          <span>Upload រូបថតថ្មី</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleBannerUpload('categorySocksImage', e)}
                            className="hidden"
                          />
                        </label>
                        <input
                          type="url"
                          placeholder="Image URL..."
                          defaultValue={settingsForm.categorySocksImage || ''}
                          onBlur={(e) => {
                            if (e.target.value.trim()) {
                              handleBannerUrlChange('categorySocksImage', e.target.value.trim());
                            }
                          }}
                          className="w-full px-2.5 py-1.5 bg-white border border-neutral-300 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card 4: Sport Travel Bags */}
                  <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-neutral-900">
                        កាតកាតាបកីឡា (Sports Travel Bags)
                      </span>
                    </div>

                    <div className="flex gap-3 items-center">
                      <div className="w-20 h-24 bg-neutral-200 rounded-lg overflow-hidden border border-neutral-300 shrink-0">
                        <img
                          src={
                            settingsForm.categoryBagsImage ||
                            '/src/assets/images/cat_sport_bags_1791256037463.jpg'
                          }
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <label className="block w-full py-2 px-2 bg-neutral-900 hover:bg-black text-white text-center font-bold rounded-lg cursor-pointer text-xs">
                          <span>Upload រូបថតថ្មី</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleBannerUpload('categoryBagsImage', e)}
                            className="hidden"
                          />
                        </label>
                        <input
                          type="url"
                          placeholder="Image URL..."
                          defaultValue={settingsForm.categoryBagsImage || ''}
                          onBlur={(e) => {
                            if (e.target.value.trim()) {
                              handleBannerUrlChange('categoryBagsImage', e.target.value.trim());
                            }
                          }}
                          className="w-full px-2.5 py-1.5 bg-white border border-neutral-300 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
