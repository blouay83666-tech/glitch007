"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface CartItem {
  key: string; // productId|color|size — identifies a unique line
  productId: number;
  name: string;
  price: number;
  color: string;
  size: string;
  image: string;
  qty: number;
}

interface CartCtx {
  items: CartItem[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  addItem: (item: Omit<CartItem, "key" | "qty">, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  removeItem: (key: string) => void;
  clear: () => void;
}

const noop = () => {};
const CartContext = createContext<CartCtx>({
  items: [],
  count: 0,
  subtotal: 0,
  isOpen: false,
  open: noop,
  close: noop,
  addItem: noop,
  setQty: noop,
  removeItem: noop,
  clear: noop,
});

export const useCart = () => useContext(CartContext);

const STORAGE_KEY = "glitch_cart";
const lineKey = (productId: number, color: string, size: string) =>
  `${productId}|${color}|${size}`;

export default function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load a saved cart on first mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      /* ignore corrupted storage */
    }
  }, []);

  // Persist on every change.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage full / unavailable — cart still works in-memory */
    }
  }, [items]);

  const addItem = useCallback(
    (item: Omit<CartItem, "key" | "qty">, qty = 1) => {
      const key = lineKey(item.productId, item.color, item.size);
      setItems((prev) => {
        const existing = prev.find((i) => i.key === key);
        if (existing) {
          return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i));
        }
        return [...prev, { ...item, key, qty }];
      });
      setIsOpen(true);
    },
    []
  );

  const setQty = useCallback((key: string, qty: number) => {
    setItems((prev) =>
      prev
        .map((i) => (i.key === key ? { ...i, qty: Math.max(0, qty) } : i))
        .filter((i) => i.qty > 0)
    );
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartCtx>(() => {
    const count = items.reduce((n, i) => n + i.qty, 0);
    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    return {
      items,
      count,
      subtotal,
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      addItem,
      setQty,
      removeItem,
      clear,
    };
  }, [items, isOpen, addItem, setQty, removeItem, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
