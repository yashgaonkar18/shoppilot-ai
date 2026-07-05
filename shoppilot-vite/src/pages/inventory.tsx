import { useMemo, useState, useEffect } from "react";
import { Plus, Search, Edit3, Trash2, Package, AlertTriangle, X } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import type { Product } from "@/types/product";

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/api/product";
import { fmtINR } from "@/lib/format";
import { toast } from "sonner";

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await getProducts();

      setProducts(res.data.products);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  function LoadingTable() {
    return (
      <div className="divide-y divide-border animate-pulse">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between px-4 py-4"
          >
            <div className="space-y-2">
              <div className="h-4 w-40 rounded bg-muted"></div>
              <div className="h-3 w-24 rounded bg-muted"></div>
            </div>

            <div className="h-4 w-16 rounded bg-muted"></div>

            <div className="hidden md:block h-4 w-16 rounded bg-muted"></div>

            <div className="h-4 w-16 rounded bg-muted"></div>

            <div className="flex gap-2">
              <div className="h-8 w-8 rounded bg-muted"></div>
              <div className="h-8 w-8 rounded bg-muted"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [editing, setEditing] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);

  const categories = useMemo(() => {
    const s = new Set<string>();
    products.forEach((p) => p.category && s.add(p.category));
    return Array.from(s);
  }, [products]);

  const filtered = products.filter((p) => {
    const match = p.name.toLowerCase().includes(q.toLowerCase()) || (p.category ?? "").toLowerCase().includes(q.toLowerCase());
    const catMatch = cat === "all" || p.category === cat;
    return match && catMatch;
  });

  const handleSave = async (form: Partial<Product>) => {
    try {

      if (editing) {

        await updateProduct(editing._id, form);

        toast.success("Product Updated");

      } else {

        await createProduct(form);

        toast.success("Product Added");

      }

      await fetchProducts();

      setOpen(false);

      setEditing(null);

    } catch (err) {

      toast.error("Unable to save product");

    }
  };

  const handleDelete = async (id: string) => {

    if (!confirm("Delete this product?")) return;

    try {

      await deleteProduct(id);

      toast.success("Deleted");

      await fetchProducts();

    } catch {

      toast.error("Delete failed");

    }

  };

  return (
    <AppShell
      title="Inventory"
      subtitle={`${products.length} products in stock`}
      action={
        <button onClick={() => { setEditing(null); setOpen(true); }} className="inline-flex h-9 items-center gap-1.5 px-3 rounded-lg bg-gradient-brand text-brand-foreground text-sm font-medium shadow-glow hover:opacity-95">
          <Plus className="h-4 w-4" /> Add product
        </button>
      }
    >
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products…"
              className="w-full h-10 pl-9 pr-3 rounded-lg border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
            />
          </div>
          <select
            value={cat}
            onChange={(e) => setCat(e.target.value)}
            className="h-10 rounded-lg border border-input bg-card text-sm px-3 focus:outline-none focus:ring-2 focus:ring-ring/40"
          >
            <option value="all">All categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
  {loading ? (
    <LoadingTable />
  ) : filtered.length === 0 ? (
    <div className="p-12 text-center">
      <Package className="h-10 w-10 text-muted-foreground/40 mx-auto" />
      <p className="mt-3 text-sm text-muted-foreground">
        {q
          ? "No products match your search."
          : "No products yet. Add your first one."}
      </p>
    </div>
  ) : (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
          <tr>
            <th className="text-left font-medium px-4 py-3">Product</th>
            <th className="text-left font-medium px-4 py-3 hidden sm:table-cell">
              Category
            </th>
            <th className="text-right font-medium px-4 py-3">Stock</th>
            <th className="text-right font-medium px-4 py-3 hidden md:table-cell">
              Buy
            </th>
            <th className="text-right font-medium px-4 py-3">Sell</th>
            <th className="text-right font-medium px-4 py-3 w-px">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-border">
          {filtered.map((p) => {
            const low = p.qty <= p.low_stock_threshold;

            return (
              <tr key={p._id} className="hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{p.name}</td>

                <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground">
                  {p.category || "—"}
                </td>

                <td className="px-4 py-3 text-right">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${
                      low
                        ? "bg-destructive/10 text-destructive"
                        : "bg-success/10 text-success"
                    }`}
                  >
                    {low && <AlertTriangle className="h-3 w-3" />}
                    {p.qty} {p.unit}
                  </span>
                </td>

                <td className="px-4 py-3 text-right hidden md:table-cell text-muted-foreground">
                  {fmtINR(p.buy_price)}
                </td>

                <td className="px-4 py-3 text-right font-medium">
                  {fmtINR(p.sell_price)}
                </td>

                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => {
                        setEditing(p);
                        setOpen(true);
                      }}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>

                    <button
                      onClick={() => handleDelete(p._id)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-destructive/10 text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  )}
</div>
      </div>

      {open && <ProductDialog product={editing} onClose={() => { setOpen(false); setEditing(null); }} onSave={handleSave} />}
    </AppShell>
  );
}

function ProductDialog({ product, onClose, onSave }: { product: Product | null; onClose: () => void; onSave: (form: Partial<Product>) => void }) {
  const [form, setForm] = useState<Partial<Product>>(product ?? { name: "", category: "", qty: 0, unit: "pcs", buy_price: 0, sell_price: 0, low_stock_threshold: 5 });
  const set = <K extends keyof Product>(k: K, v: Product[K]) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl bg-card border border-border shadow-glow overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-semibold">{product ? "Edit product" : "New product"}</h2>
          <button onClick={onClose} className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-accent"><X className="h-4 w-4" /></button>
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); onSave(form); }}
          className="p-5 space-y-3"
        >
          <Field label="Name" value={String(form.name ?? "")} onChange={(v) => set("name", v)} required />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Category" value={String(form.category ?? "")} onChange={(v) => set("category", v)} placeholder="Snacks" />
            <Field label="Unit" value={String(form.unit ?? "pcs")} onChange={(v) => set("unit", v)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field type="number" label="Stock qty" value={String(form.qty ?? 0)} onChange={(v) => set("qty", Number(v))} />
            <Field type="number" label="Low-stock at" value={String(form.low_stock_threshold ?? 5)} onChange={(v) => set("low_stock_threshold", Number(v))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field type="number" label="Buy price (₹)" value={String(form.buy_price ?? 0)} onChange={(v) => set("buy_price", Number(v))} />
            <Field type="number" label="Sell price (₹)" value={String(form.sell_price ?? 0)} onChange={(v) => set("sell_price", Number(v))} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="h-10 px-4 rounded-lg border border-border text-sm font-medium hover:bg-accent">Cancel</button>
            <button type="submit" className="h-10 px-4 rounded-lg bg-gradient-brand text-brand-foreground text-sm font-medium shadow-glow hover:opacity-95">
              {product ? "Save changes" : "Add product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, required, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; required?: boolean; placeholder?: string; type?: string }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-foreground">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required}
        className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40" />
    </label>
  );
}
