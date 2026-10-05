import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Edit2,
  Save,
  RotateCcw,
  Sliders,
  DollarSign,
  Package,
  Layers,
  Settings,
  Sparkles,
  Download,
  Upload,
  Check,
} from 'lucide-react';
import { BRANDS, CATEGORIES, DEFAULT_PRODUCTS } from '../data/defaultProducts';
import { Product, ProductSize, StoreSettings } from '../types';
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
  const [activeTab, setActiveTab] = useState<'products' | 'add' | 'settings'>('products');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // New/Edit Product Form State
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    nameKm: '',
    brand: 'Nike',
    category: 'boots',
    price: 100,
    salePrice: 79,
    sku: 'HS-PRO-01',
    groundType: 'FG',
    color: 'Black / Gold',
    description: '',
    descriptionKm: '',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80'],
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

  // Store Settings Form State
  const [settingsForm, setSettingsForm] = useState<StoreSettings>({ ...settings });
  const [saveToast, setSaveToast] = useState(false);

  if (!isOpen) return null;

  // Handle start editing an existing product
  const handleStartEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({ ...product });
    setActiveTab('add');
  };

  // Reset form to blank template
  const handleStartAddNew = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      nameKm: '',
      brand: 'Nike',
      category: 'boots',
      price: 120,
      salePrice: 89,
      sku: `HS-${Math.floor(1000 + Math.random() * 9000)}`,
      groundType: 'FG',
      color: 'Volt Yellow / Black',
      description: 'High performance football gear with responsive touch and durable traction.',
      descriptionKm: 'សម្ភារៈកីឡាគុណភាពខ្ពស់ ស្បែកទន់ស្រួល និងបាតទ្រនាប់រឹងមាំសម្រាប់ទីលាន។',
      images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80'],
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

  // Add size row in form
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

  // Quick Stock adjustment directly on the table
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

  // Delete product
  const handleDeleteProduct = (id: string) => {
    if (window.confirm('តើអ្នកពិតជាចង់លុបទំនិញនេះចេញពី Catalog មែនទេ?')) {
      const updated = products.filter((p) => p.id !== id);
      onSaveProducts(updated);
    }
  };

  // Save product from form
  const handleSaveProductForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      alert('សូមបញ្ចូលឈ្មោះទំនិញ (Product Name)');
      return;
    }

    if (editingProduct) {
      // Update
      const updated = products.map((p) =>
        p.id === editingProduct.id
          ? ({ ...p, ...formData, id: p.id } as Product)
          : p
      );
      onSaveProducts(updated);
    } else {
      // Create new
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

  // Save Store Settings
  const handleSaveSettingsForm = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(settingsForm);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  // Reset to default sample catalog
  const handleResetCatalog = () => {
    if (window.confirm('តើអ្នកចង់ Reset ទិន្នន័យ Catalog ទៅទិន្នន័យគំរូដើមវិញទេ?')) {
      onSaveProducts(DEFAULT_PRODUCTS);
    }
  };

  // Export JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `homesport-catalog-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          onSaveProducts(parsed);
          alert('បានបញ្ចូលទិន្នន័យ Catalog ដោយជោគជ័យ!');
        } else {
          alert('ទម្រង់ JSON មិនត្រឹមត្រូវ');
        }
      } catch (err) {
        alert('មានបញ្ហាក្នុងការអានឯកសារ JSON');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-neutral-950/85 backdrop-blur-md">
      <div 
        className="relative w-full max-w-5xl bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] text-neutral-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-athletic text-base font-bold">
              HS
            </div>
            <div>
              <h2 className="font-athletic text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>HOME SPORT Store Admin</span>
                <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono normal-case">
                  PHASE 5 & 6
                </span>
              </h2>
              <p className="text-xs text-neutral-400">
                គ្រប់គ្រងទំនិញ, ស្តុកតាម Size, តម្លៃ USD/KHR និងការតភ្ជាប់ Telegram
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 border-b border-neutral-800 bg-neutral-950/60 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('products')}
              className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'products'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>បញ្ជីទំនិញ ({products.length})</span>
            </button>

            <button
              onClick={handleStartAddNew}
              className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'add'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>{editingProduct ? 'កែប្រែទំនិញ' : 'បន្ថែមទំនិញថ្មី (Add Product)'}</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'settings'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>ការកំណត់ហាង & អត្រាប្រាក់</span>
            </button>
          </div>

          {/* Quick Data Actions */}
          <div className="hidden sm:flex items-center gap-2 pb-2">
            <button
              onClick={handleExportJSON}
              className="px-2.5 py-1 text-[11px] font-semibold bg-neutral-800 hover:bg-neutral-750 text-neutral-300 rounded-lg flex items-center gap-1"
              title="Export Products as JSON"
            >
              <Download className="w-3 h-3" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={handleResetCatalog}
              className="px-2.5 py-1 text-[11px] font-semibold bg-neutral-800 hover:bg-neutral-750 text-neutral-400 hover:text-red-400 rounded-lg flex items-center gap-1"
              title="Reset to initial default demo data"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* TAB 1: PRODUCTS LIST & INLINE STOCK */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-neutral-200">
                    តារាងគ្រប់គ្រងស្តុក (Stock & Size Inventory)
                  </h3>
                  <p className="text-xs text-neutral-400 font-khmer">
                    អ្នកអាចចុច +/- ដើម្បីកែសម្រួលស្តុកតាម Size ភ្លាមៗ ឬចុចកែប្រែព័ត៌មានទំនិញ។
                  </p>
                </div>
                <button
                  onClick={handleStartAddNew}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-amber-500/20"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>បន្ថែមទំនិញ</span>
                </button>
              </div>

              <div className="overflow-x-auto border border-neutral-800 rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-950 text-neutral-400 uppercase tracking-wider font-athletic text-[11px] border-b border-neutral-800">
                    <tr>
                      <th className="p-3">Product</th>
                      <th className="p-3">Brand / Cat</th>
                      <th className="p-3">Price (USD)</th>
                      <th className="p-3">Sizes & Stock Counter</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/80 bg-neutral-900/60">
                    {products.map((p) => {
                      const totalStock = getTotalStock(p);
                      const discount = calculateDiscount(p.price, p.salePrice);
                      return (
                        <tr key={p.id} className="hover:bg-neutral-850/50 transition-colors">
                          {/* Image & Title */}
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg bg-neutral-950 border border-neutral-800 p-1 shrink-0 flex items-center justify-center">
                                <img
                                  src={p.images[0]}
                                  alt=""
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <div className="min-w-0 max-w-[200px]">
                                <div className="font-bold text-white truncate">{p.name}</div>
                                <div className="text-[10px] text-neutral-400 font-mono">
                                  {p.sku}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Brand & Category */}
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-200 font-athletic font-bold mr-1">
                              {p.brand}
                            </span>
                            <span className="text-[11px] text-neutral-400 block mt-1">
                              {p.category}
                            </span>
                          </td>

                          {/* Price */}
                          <td className="p-3">
                            <div className="font-athletic text-sm font-bold text-amber-400">
                              ${(p.salePrice ?? p.price).toFixed(2)}
                            </div>
                            {discount > 0 && (
                              <div className="text-[10px] text-neutral-500 line-through">
                                ${p.price.toFixed(2)} (-{discount}%)
                              </div>
                            )}
                          </td>

                          {/* Inline Sizes Stock Editor */}
                          <td className="p-3">
                            <div className="flex flex-wrap gap-1.5 max-w-sm">
                              {p.sizes.map((s) => (
                                <div
                                  key={s.size}
                                  className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-lg border text-[11px] font-athletic ${
                                    s.stock > 0
                                      ? 'bg-neutral-950 border-neutral-750 text-neutral-200'
                                      : 'bg-red-950/20 border-red-900/40 text-red-400'
                                  }`}
                                >
                                  <span className="font-bold">{s.size}:</span>
                                  <span className="font-mono text-amber-400 font-bold">{s.stock}</span>
                                  <div className="flex gap-0.5 ml-1">
                                    <button
                                      onClick={() => handleTableQuickStock(p.id, s.size, -1)}
                                      disabled={s.stock <= 0}
                                      className="w-4 h-4 bg-neutral-800 hover:bg-neutral-700 text-white rounded flex items-center justify-center text-[10px] disabled:opacity-30"
                                      title="Decrease stock by 1"
                                    >
                                      -
                                    </button>
                                    <button
                                      onClick={() => handleTableQuickStock(p.id, s.size, 1)}
                                      className="w-4 h-4 bg-neutral-800 hover:bg-neutral-700 text-white rounded flex items-center justify-center text-[10px]"
                                      title="Increase stock by 1"
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="text-[10px] text-neutral-500 mt-1 font-mono">
                              Total Stock: {totalStock} pairs
                            </div>
                          </td>

                          {/* Action Buttons */}
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleStartEdit(p)}
                                className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-amber-400"
                                title="Edit product"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.id)}
                                className="p-1.5 rounded-lg bg-neutral-800 hover:bg-red-500/20 text-neutral-400 hover:text-red-400"
                                title="Delete product"
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

          {/* TAB 2: ADD OR EDIT PRODUCT */}
          {activeTab === 'add' && (
            <form onSubmit={handleSaveProductForm} className="space-y-5 max-w-3xl mx-auto">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>
                  {editingProduct
                    ? `កំពុងកែប្រែទំនិញ: ${editingProduct.name}`
                    : 'បន្ថែមទំនិញថ្មីទៅក្នុង Catalog (បញ្ចូល Stock តាម Size, តម្លៃ, រូបភាព)'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Product Name EN */}
                <div className="space-y-1">
                  <label className="font-bold text-neutral-300">
                    Product Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Nike Air Zoom Mercurial Vapor 16"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Product Name KM */}
                <div className="space-y-1">
                  <label className="font-bold text-neutral-300 font-khmer">
                    ឈ្មោះទំនិញ (ភាសាខ្មែរ)
                  </label>
                  <input
                    type="text"
                    value={formData.nameKm || ''}
                    onChange={(e) => setFormData({ ...formData, nameKm: e.target.value })}
                    placeholder="ឧ. ស្បែកជើងបាល់ទាត់ Nike Mercurial"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Brand */}
                <div className="space-y-1">
                  <label className="font-bold text-neutral-300">Brand</label>
                  <select
                    value={formData.brand || 'Nike'}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 focus:outline-none focus:border-amber-400"
                  >
                    {BRANDS.filter((b) => b !== 'All Brands').map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category */}
                <div className="space-y-1">
                  <label className="font-bold text-neutral-300">Category</label>
                  <select
                    value={formData.category || 'boots'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 focus:outline-none focus:border-amber-400"
                  >
                    {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.nameKm})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Original Price */}
                <div className="space-y-1">
                  <label className="font-bold text-neutral-300">
                    Original Price ($ USD) *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={formData.price || 0}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Sale Price */}
                <div className="space-y-1">
                  <label className="font-bold text-neutral-300">
                    Sale Price ($ USD) (ទុកចោលបើតម្លៃពេញ)
                  </label>
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
                    placeholder="e.g. 99"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* SKU Code */}
                <div className="space-y-1">
                  <label className="font-bold text-neutral-300">SKU Code</label>
                  <input
                    type="text"
                    value={formData.sku || ''}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="e.g. NK-MERC-16"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Ground Type / Color */}
                <div className="space-y-1">
                  <label className="font-bold text-neutral-300">Ground Type & Color</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={formData.groundType || ''}
                      onChange={(e) => setFormData({ ...formData, groundType: e.target.value })}
                      placeholder="FG, AG, TF, IC"
                      className="px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 focus:outline-none focus:border-amber-400"
                    />
                    <input
                      type="text"
                      value={formData.color || ''}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      placeholder="e.g. Black / Volt"
                      className="px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>

              {/* Multi-Size Stock Matrix (PHASE 6 from user prompt) */}
              <div className="space-y-2.5 pt-2 border-t border-neutral-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-white">
                      ការគ្រប់គ្រង Size & Stock (PHASE 6: 39→0, 40→2, 41→3...)
                    </h4>
                    <p className="text-[11px] text-neutral-400">
                      កំណត់ចំនួនស្តុកសម្រាប់ទំហំនីមួយៗ ដើម្បីឱ្យ Customer ដឹងមុននឹងកុម្ម៉ង់។
                    </p>
                  </div>
                </div>

                {/* Existing sizes */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {formData.sizes?.map((s) => (
                    <div
                      key={s.size}
                      className="p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl flex items-center justify-between"
                    >
                      <div>
                        <div className="font-athletic text-sm font-bold text-amber-400">
                          Size {s.size}
                        </div>
                        <div className="text-[10px] text-neutral-400 font-mono">
                          Stock: {s.stock}
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleUpdateSizeStock(s.size, -1)}
                          disabled={s.stock <= 0}
                          className="w-5 h-5 bg-neutral-800 text-neutral-200 hover:bg-neutral-700 rounded text-xs flex items-center justify-center disabled:opacity-30"
                        >
                          -
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateSizeStock(s.size, 1)}
                          className="w-5 h-5 bg-neutral-800 text-neutral-200 hover:bg-neutral-700 rounded text-xs flex items-center justify-center"
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveSize(s.size)}
                          className="w-5 h-5 text-neutral-500 hover:text-red-400 ml-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add new size input */}
                <div className="flex gap-2 items-center pt-1">
                  <input
                    type="text"
                    value={newSizeInput}
                    onChange={(e) => setNewSizeInput(e.target.value)}
                    placeholder="New Size (e.g. 45 or M)"
                    className="w-32 px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-400 font-athletic"
                  />
                  <input
                    type="number"
                    min="0"
                    value={newStockInput}
                    onChange={(e) => setNewStockInput(Number(e.target.value))}
                    placeholder="Stock Qty"
                    className="w-24 px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-400 font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleAddSize}
                    className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-amber-400 rounded-xl text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Size</span>
                  </button>
                </div>
              </div>

              {/* Product Images (Multiple Images) */}
              <div className="space-y-2 pt-2 border-t border-neutral-800 text-xs">
                <label className="font-bold text-neutral-300">
                  Product Image URLs (រូបភាព Front / Side / Back / Studs)
                </label>
                <div className="space-y-1.5">
                  {formData.images?.map((img, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="url"
                        value={img}
                        onChange={(e) => {
                          const updated = [...(formData.images || [])];
                          updated[idx] = e.target.value;
                          setFormData({ ...formData, images: updated });
                        }}
                        className="flex-1 px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-200 text-xs focus:outline-none focus:border-amber-400 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = formData.images?.filter((_, i) => i !== idx) || [];
                          setFormData({ ...formData, images: updated });
                        }}
                        className="p-1.5 text-neutral-500 hover:text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      placeholder="Add another image URL (https://...)"
                      className="flex-1 px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-400 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (imageUrlInput.trim()) {
                          setFormData({
                            ...formData,
                            images: [...(formData.images || []), imageUrlInput.trim()],
                          });
                          setImageUrlInput('');
                        }
                      }}
                      className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-amber-400 rounded-xl text-xs font-bold"
                    >
                      Add URL
                    </button>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2 border-t border-neutral-800">
                <div className="space-y-1">
                  <label className="font-bold text-neutral-300">Description (EN)</label>
                  <textarea
                    rows={3}
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div className="space-y-1 font-khmer">
                  <label className="font-bold text-neutral-300">ការពិពណ៌នា (ខ្មែរ)</label>
                  <textarea
                    rows={3}
                    value={formData.descriptionKm || ''}
                    onChange={(e) => setFormData({ ...formData, descriptionKm: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Badges / Status Checkboxes */}
              <div className="flex flex-wrap gap-4 pt-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured || false}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded bg-neutral-950 border-neutral-800 text-amber-500 focus:ring-0"
                  />
                  <span>Featured (ទំនិញពិសេស)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isTrending || false}
                    onChange={(e) => setFormData({ ...formData, isTrending: e.target.checked })}
                    className="rounded bg-neutral-950 border-neutral-800 text-amber-500 focus:ring-0"
                  />
                  <span>Trending / Hot (ពេញនិយម)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isNew || false}
                    onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                    className="rounded bg-neutral-950 border-neutral-800 text-amber-500 focus:ring-0"
                  />
                  <span>New Arrival (ទំនិញថ្មី)</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setActiveTab('products')}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-750 text-neutral-300 rounded-xl text-xs font-bold"
                >
                  បោះបង់
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-neutral-950 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-500/20"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingProduct ? 'រក្សាទុកការកែប្រែ' : 'រក្សាទុកទំនិញថ្មី'}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: STORE SETTINGS & EXCHANGE RATE (PHASE 8 & 9) */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettingsForm} className="space-y-4 max-w-xl mx-auto text-xs">
              {saveToast && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center gap-2 font-bold animate-in fade-in">
                  <Check className="w-4 h-4" />
                  <span>បានរក្សាទុកការកំណត់ហាងដោយជោគជ័យ!</span>
                </div>
              )}

              {/* Store Name & Tagline */}
              <div className="space-y-1">
                <label className="font-bold text-neutral-300">Store Name</label>
                <input
                  type="text"
                  value={settingsForm.storeName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 focus:outline-none focus:border-amber-400 font-bold"
                />
              </div>

              {/* USD/KHR Exchange Rate (PHASE 8) */}
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-400 text-sm">
                  <DollarSign className="w-4 h-4" />
                  <span>PHASE 8: អត្រាប្តូរប្រាក់ USD / KHR Exchange Rate</span>
                </div>
                <p className="text-[11px] text-neutral-400">
                  កំណត់អត្រាប្តូរប្រាក់សម្រាប់គណនាតម្លៃរៀល (៛) ដោយស្វ័យប្រវត្តិនឹងបង្ហាញលើ Website
                </p>
                <div className="flex items-center gap-3 pt-1">
                  <span className="font-bold text-neutral-300 text-sm">1 USD ($) =</span>
                  <input
                    type="number"
                    step="50"
                    value={settingsForm.exchangeRate}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, exchangeRate: Number(e.target.value) || 4100 })
                    }
                    className="w-36 px-3 py-2 bg-neutral-900 border border-neutral-750 rounded-xl text-amber-400 font-mono font-bold text-base focus:outline-none focus:border-amber-400"
                  />
                  <span className="font-bold text-neutral-300 text-sm">KHR (៛)</span>
                </div>
              </div>

              {/* Telegram Username */}
              <div className="space-y-1">
                <label className="font-bold text-neutral-300">
                  Telegram Username (សម្រាប់ Chat to Order)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-neutral-500 font-bold">@</span>
                  <input
                    type="text"
                    value={settingsForm.telegramUsername.replace('@', '')}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, telegramUsername: e.target.value.trim() })
                    }
                    placeholder="homesport_catalog"
                    className="w-full pl-8 pr-4 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Facebook Page */}
              <div className="space-y-1">
                <label className="font-bold text-neutral-300">
                  Facebook Page ID / Username (Messenger Order)
                </label>
                <input
                  type="text"
                  value={settingsForm.facebookPage}
                  onChange={(e) => setSettingsForm({ ...settingsForm, facebookPage: e.target.value })}
                  placeholder="homesportkh"
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="font-bold text-neutral-300">Store Contact Phone</label>
                <input
                  type="text"
                  value={settingsForm.phone}
                  onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                  placeholder="+855 96 888 9922"
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Delivery Info */}
              <div className="space-y-1">
                <label className="font-bold text-neutral-300 font-khmer">
                  ព័ត៌មានដឹកជញ្ជូន (ភាសាខ្មែរ)
                </label>
                <input
                  type="text"
                  value={settingsForm.deliveryInfoKm}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, deliveryInfoKm: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-neutral-950 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                >
                  <Save className="w-4 h-4" />
                  <span>រក្សាទុកការកំណត់ហាង (Save Store Settings)</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
