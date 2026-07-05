import { useMemo, useState, useEffect } from "react";
import { Plus, Trash2, ShoppingCart, Receipt } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { fmtINR, timeAgo } from "@/lib/format";
import { toast } from "sonner";
import { getProducts } from "@/api/product";
import { getSales, createSale } from "@/api/sales";
import type { Product } from "@/types/product";
import type { Sale } from "@/types/sales";

type CartItem = {
  product_id: string | null;
  product_name: string;
  qty: number;
  unit_price: number;
};

function ProductsSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border bg-card p-3">
          <div className="h-4 w-24 bg-muted rounded mb-2" />
          <div className="h-3 w-16 bg-muted rounded" />
          <div className="flex justify-between mt-5">
            <div className="h-4 w-14 bg-muted rounded" />
            <div className="h-3 w-10 bg-muted rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

function SalesSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card divide-y divide-border animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex justify-between items-center p-4">
          <div>
            <div className="h-4 w-36 bg-muted rounded mb-2" />
            <div className="h-3 w-48 bg-muted rounded" />
          </div>
          <div className="text-right">
            <div className="h-4 w-20 bg-muted rounded mb-2" />
            <div className="h-3 w-16 bg-muted rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function SalesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState("");
  const [phone, setPhone] = useState("");
  const [q, setQ] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsRes, salesRes] = await Promise.all([
        getProducts(),
        getSales(),
      ]);
      setProducts(productsRes.data.products);
      setSales(salesRes.data.sales);
    } catch (err) {
      toast.error("Failed to load sales data");
    } finally {
      setLoading(false);
    }
  };

  const total = useMemo(
    () => cart.reduce((s, i) => s + i.qty * i.unit_price, 0),
    [cart]
  );

  const filtered = q
    ? products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()))
    : products.slice(0, 12);

  const addToCart = (p: Product) => {
    setCart((c) => {
      const ex = c.find((i) => i.product_id === p._id);
      if (ex)
        return c.map((i) =>
          i.product_id === p._id ? { ...i, qty: i.qty + 1 } : i
        );
      return [
        ...c,
        {
          product_id: p._id,
          product_name: p.name,
          qty: 1,
          unit_price: p.sell_price,
        },
      ];
    });
  };

  const updateQty = (idx: number, qty: number) => {
    if (qty <= 0) {
      setCart((c) => c.filter((_, i) => i !== idx));
      return;
    }
    setCart((c) => c.map((it, i) => (i === idx ? { ...it, qty } : it)));
  };

  const submit = async () => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }
    try {
      setSubmitting(true);
      await createSale({
        customer_name: customer || null,
        customer_phone: phone || null,
        items: cart,
      });
      toast.success("Sale completed!");
      setCart([]);
      setCustomer("");
      setPhone("");
      loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Sale failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppShell title="Sales" subtitle="Record a new sale or browse history">
      {/*
        Layout: 3-column grid
        Col 1-2: product grid (scrollable)
        Col 3: cart (sticky) + recent sales below cart
      */}
      <div className="grid lg:grid-cols-3 gap-4 items-start">

        {/* ── Left: Product search + grid ── */}
        <div className="lg:col-span-2 space-y-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products…"
            className="w-full h-10 rounded-lg border border-input bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
          />
          {loading ? (
            <ProductsSkeleton />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {filtered.map((p) => (
                <button
                  key={p._id}
                  onClick={() => addToCart(p)}
                  className="text-left rounded-xl border border-border bg-card p-3 hover:border-brand hover:shadow-soft transition-all"
                >
                  <div className="text-sm font-medium truncate">{p.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {p.category || "—"}
                  </div>
                  <div className="mt-2 flex items-end justify-between">
                    <div className="text-sm font-semibold">
                      {fmtINR(p.sell_price)}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {p.qty} in stock
                    </div>
                  </div>
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="text-sm text-muted-foreground col-span-full">
                  No products found. Add some in Inventory.
                </p>
              )}
            </div>
          )}

          {/* Recent sales — below product grid on left column */}
          <div className="pt-2">
            <div className="flex items-center gap-2 mb-3">
              <Receipt className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold">Recent sales</h2>
            </div>
            {loading ? (
              <SalesSkeleton />
            ) : (
              <div className="rounded-2xl border border-border bg-card shadow-soft divide-y divide-border">
                {sales.length === 0 && (
                  <div className="p-6 text-sm text-muted-foreground">
                    No sales yet.
                  </div>
                )}
                {sales.slice(0, 10).map((s) => (
                  <div
                    key={s._id}
                    className="p-4 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">
                        {s.customer_name || "Walk-in"}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {s.sale_items
                          .map((i: any) => `${i.product_name} ×${i.qty}`)
                          .join(", ")}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-semibold text-success">
                        {fmtINR(s.total)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {timeAgo(s.sold_at)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Right: Cart — sticky so it never moves ── */}
        <div className="lg:sticky lg:top-20">
          <div className="rounded-2xl border border-border bg-card shadow-soft">
            <div className="p-4 border-b border-border flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              <div className="text-sm font-semibold">Current sale</div>
              <span className="ml-auto text-xs text-muted-foreground">
                {cart.length} item{cart.length !== 1 && "s"}
              </span>
            </div>

            <div className="p-4 space-y-3">
              {/* Customer info */}
              <div className="grid grid-cols-2 gap-2">
                <input
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  placeholder="Customer (optional)"
                  className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
                />
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone"
                  className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
                />
              </div>

              {/* Cart items */}
              <div className="max-h-64 overflow-y-auto -mx-1 px-1 space-y-1.5">
                {cart.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-8">
                    Tap products to add them to the sale.
                  </p>
                )}
                {cart.map((it, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2 rounded-lg bg-muted/40"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {it.product_name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {fmtINR(it.unit_price)} each
                      </div>
                    </div>
                    <input
                      type="number"
                      value={it.qty}
                      min={0}
                      onChange={(e) => updateQty(i, Number(e.target.value))}
                      className="w-14 h-8 rounded-md border border-input bg-card px-2 text-sm text-center"
                    />
                    <button
                      onClick={() => updateQty(i, 0)}
                      className="h-8 w-8 inline-flex items-center justify-center rounded-md text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Total + submit */}
              <div className="border-t border-border pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-semibold text-lg">{fmtINR(total)}</span>
                </div>
                <button
                  onClick={submit}
                  disabled={cart.length === 0 || submitting}
                  className="w-full h-11 rounded-lg bg-gradient-brand text-brand-foreground text-sm font-semibold shadow-glow hover:opacity-95 disabled:opacity-50 inline-flex items-center justify-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  {submitting ? "Processing..." : "Complete sale & generate invoice"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}