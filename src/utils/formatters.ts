import { Currency, Product, CartItem, StoreSettings } from '../types';

export function formatPrice(
  amountUsd: number,
  currency: Currency,
  exchangeRate: number = 4100
): string {
  if (currency === 'KHR') {
    const khr = Math.round(amountUsd * exchangeRate);
    return `៛${khr.toLocaleString()}`;
  }
  return `$${amountUsd.toFixed(amountUsd % 1 === 0 ? 0 : 2)}`;
}

export function formatBothPrices(
  amountUsd: number,
  exchangeRate: number = 4100
): { usd: string; khr: string } {
  const khr = Math.round(amountUsd * exchangeRate);
  return {
    usd: `$${amountUsd.toFixed(amountUsd % 1 === 0 ? 0 : 2)}`,
    khr: `៛${khr.toLocaleString()}`,
  };
}

export function calculateDiscount(originalPrice: number, salePrice?: number): number {
  if (!salePrice || salePrice >= originalPrice) return 0;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}

export function getTotalStock(product: Product): number {
  return product.sizes.reduce((acc, curr) => acc + curr.stock, 0);
}

export function generateSingleOrderMessage(
  product: Product,
  selectedSize: string,
  quantity: number,
  settings: StoreSettings
): string {
  const activePrice = product.salePrice ?? product.price;
  const itemTotalUsd = activePrice * quantity;
  const itemTotalKhr = Math.round(itemTotalUsd * settings.exchangeRate);

  return `សួស្តី ${settings.storeName}! 👋
ខ្ញុំចង់កុម្ម៉ង់ទំនិញពី Website Catalog៖
--------------------------------
📦 ទំនិញ / Product: ${product.name}
🏷️ ម៉ាក / Brand: ${product.brand}
🔖 លេខកូដ / SKU: ${product.sku}
📏 ទំហំ / Size: ${selectedSize}
🔢 ចំនួន / Qty: ${quantity}
💰 តម្លៃ / Price: $${itemTotalUsd.toFixed(2)} (៛${itemTotalKhr.toLocaleString()})
--------------------------------
📍 ទីតាំងទទួល (ភ្នំពេញ ឬ ខេត្ត): 
📞 លេខទូរស័ព្ទ: 

សូមជួយពិនិត្យស្តុក និងបញ្ជាក់ការដឹកជញ្ជូន។ អរគុណបាទ/ចាស! 🙏`;
}

export function generateCartOrderMessage(
  cartItems: CartItem[],
  settings: StoreSettings
): string {
  let totalUsd = 0;
  let itemsList = '';

  cartItems.forEach((item, index) => {
    const unitPrice = item.product.salePrice ?? item.product.price;
    const subtotal = unitPrice * item.quantity;
    totalUsd += subtotal;

    itemsList += `${index + 1}. ${item.product.name}
   - Size: ${item.selectedSize} | Qty: ${item.quantity}
   - Subtotal: $${subtotal.toFixed(2)} (${item.product.sku})\n`;
  });

  const totalKhr = Math.round(totalUsd * settings.exchangeRate);

  return `សួស្តី ${settings.storeName}! 👋
ខ្ញុំចង់កុម្ម៉ង់ទំនិញសរុប ${cartItems.length} មុខពី Website Catalog៖
================================
${itemsList}================================
💵 តម្លៃសរុប / Grand Total: $${totalUsd.toFixed(2)} (៛${totalKhr.toLocaleString()})
--------------------------------
📍 ទីតាំងដឹកជញ្ជូន: 
📞 លេខទូរស័ព្ទ: 

សូមជួយគិតប្រាក់ និងផ្ញើលេខកុង ABA មក។ អរគុណបាទ/ចាស! 🙏`;
}

export function getTelegramOrderUrl(username: string, message: string): string {
  const cleanUsername = username.replace('@', '').trim();
  return `https://t.me/${cleanUsername}?text=${encodeURIComponent(message)}`;
}

export function getMessengerOrderUrl(pageIdOrName: string): string {
  const clean = pageIdOrName.replace(/^https?:\/\/(www\.)?(facebook\.com|m\.me)\//, '').replace(/\/$/, '').trim();
  return `https://m.me/${clean}`;
}
