export interface ProductSize {
  size: string;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  nameKm?: string;
  brand: string;
  category: string;
  categoryKm?: string;
  price: number; // Original Price in USD
  salePrice?: number; // Sale Price in USD (if on sale)
  description: string;
  descriptionKm?: string;
  images: string[];
  sizes: ProductSize[];
  isFeatured?: boolean;
  isTrending?: boolean;
  isNew?: boolean;
  sku: string;
  color?: string;
  groundType?: string; // e.g. FG, AG, TF, IC
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  nameKm: string;
  icon: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  telegramUsername: string; // e.g. homesportkh
  facebookPage: string; // e.g. homesportcambodia
  phone: string; // e.g. +855 96 888 9999
  exchangeRate: number; // 1 USD = 4100 KHR
  addressKm: string;
  addressEn: string;
  deliveryInfoKm: string;
  deliveryInfoEn: string;
}

export interface CartItem {
  id: string; // unique item id in cart (productId + size)
  product: Product;
  selectedSize: string;
  quantity: number;
}

export type Currency = 'USD' | 'KHR';
export type Language = 'km' | 'en';
