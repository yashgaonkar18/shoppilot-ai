import { useSyncExternalStore } from "react";

export type Product = {
  id: string;
  name: string;
  category: string | null;
  qty: number;
  unit: string;
  buy_price: number;
  sell_price: number;
  low_stock_threshold: number;
};

export type SaleItem = {
  product_id: string | null;
  product_name: string;
  qty: number;
  unit_price: number;
  line_total: number;
};

export type Sale = {
  id: string;
  customer_name: string | null;
  customer_phone: string | null;
  total: number;
  sold_at: string;
  sale_items: SaleItem[];
};

export type Invoice = {
  id: string;
  invoice_number: string;
  total: number;
  created_at: string;
  sales: { customer_name: string | null; sale_items: SaleItem[] };
};

export type Profile = {
  id: string;
  email: string;
  shop_name: string;
  owner_name: string;
  phone: string;
  plan?: string;
  plan_expires_at?: string | null;
};

type State = {
  user: Profile | null;
  authLoading: boolean; // true while we check localStorage token on boot
  products: Product[];
  sales: Sale[];
  invoices: Invoice[];
};

const uid = () =>
  (globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2) + Date.now().toString(36));

const initial = (): State => ({
  user: null,
  authLoading: true, // start true — we don't know yet if token is valid
  products: [],
  sales: [],
  invoices: [],
});

let state: State = initial();
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => { listeners.add(l); return () => { listeners.delete(l); }; };
const getSnapshot = () => state;

export function useStore<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(subscribe, () => selector(state), () => selector(state));
}

export const store = {
  get: () => state,
  setUser(u: Profile | null) { state = { ...state, user: u, authLoading: false }; notify(); },
  setAuthLoading(v: boolean) { state = { ...state, authLoading: v }; notify(); },
  updateProfile(patch: Partial<Profile>) {
    if (!state.user) return;
    state = { ...state, user: { ...state.user, ...patch } };
    notify();
  },
  upsertProduct(p: Partial<Product> & { name: string }) {
    if (p.id) {
      state = { ...state, products: state.products.map((x) => x.id === p.id ? { ...x, ...p } as Product : x) };
    } else {
      const np: Product = {
        id: uid(),
        name: p.name,
        category: p.category ?? null,
        qty: p.qty ?? 0,
        unit: p.unit ?? "pcs",
        buy_price: p.buy_price ?? 0,
        sell_price: p.sell_price ?? 0,
        low_stock_threshold: p.low_stock_threshold ?? 5,
      };
      state = { ...state, products: [np, ...state.products] };
    }
    notify();
  },
  deleteProduct(id: string) {
    state = { ...state, products: state.products.filter((p) => p.id !== id) };
    notify();
  },
  createSale(input: { customer_name: string | null; customer_phone: string | null; items: { product_id: string | null; product_name: string; qty: number; unit_price: number }[] }) {
    const sale_items: SaleItem[] = input.items.map((i) => ({ ...i, line_total: i.qty * i.unit_price }));
    const total = sale_items.reduce((s, i) => s + i.line_total, 0);
    const now = new Date().toISOString();
    const sale: Sale = {
      id: uid(),
      customer_name: input.customer_name,
      customer_phone: input.customer_phone,
      total,
      sold_at: now,
      sale_items,
    };
    const products = state.products.map((p) => {
      const it = sale_items.find((i) => i.product_id === p.id);
      return it ? { ...p, qty: Math.max(0, p.qty - it.qty) } : p;
    });
    const invoice: Invoice = {
      id: uid(),
      invoice_number: `INV-${1000 + state.invoices.length}`,
      total,
      created_at: now,
      sales: { customer_name: input.customer_name, sale_items },
    };
    state = { ...state, products, sales: [sale, ...state.sales], invoices: [invoice, ...state.invoices] };
    notify();
    return { sale, invoice };
  },
  reset() { state = initial(); notify(); },
};