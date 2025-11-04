export type CartItem = {
  slug: string;
  productId: string;
  name: string;
  priceCents: number;
  currency: string;
  qty: number;
  size?: string | null;
  color?: string | null;
  image?: string | null;
};

const STORAGE_KEY = 'blueprint-cart-v1';

type Listener = (items: CartItem[]) => void;
const listeners = new Set<Listener>();

function notify() {
  if (typeof window === 'undefined') return;
  const items = readCart();
  for (const listener of listeners) {
    listener(items);
  }
}

export function readCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CartItem[];
  } catch (error) {
    console.error('Failed to read cart', error);
    return [];
  }
}

export function writeCart(items: CartItem[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  notify();
}

export function addToCart(item: CartItem) {
  if (typeof window === 'undefined') return;
  const existing = readCart();
  const idx = existing.findIndex(
    (entry) => entry.slug === item.slug && entry.size === item.size && entry.color === item.color
  );

  if (idx >= 0) {
    existing[idx] = { ...existing[idx], qty: existing[idx].qty + item.qty };
  } else {
    existing.push(item);
  }

  writeCart(existing);
}

export function removeFromCart(index: number) {
  const current = readCart();
  current.splice(index, 1);
  writeCart(current);
}

export function clearCart() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEY);
  notify();
}

export function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
