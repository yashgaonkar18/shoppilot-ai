
import { FileDown, Package, Receipt, ScrollText, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { useEffect, useMemo, useState } from "react";

import { getProducts } from "@/api/product";
import { getSales } from "@/api/sales";
import { getInvoices } from "@/api/invoice";

import type { Product } from "@/types/product";
import type { Sale } from "@/types/sales";
import type { Invoice } from "@/types/invoice";
import { downloadCSV } from "@/lib/download";
import { fmtINR } from "@/lib/format";
import { toast } from "sonner";

export default function ReportsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, salesRes, invoicesRes] = await Promise.all([
        getProducts(),
        getSales(),
        getInvoices(),
      ]);

      setProducts(productsRes.data.products);
      setSales(salesRes.data.sales);
      setInvoices(invoicesRes.data.invoices);
    } catch (err) {
      console.log(err);
    }
  };

  const stats = useMemo(() => {
    const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
    const lowStock = products.filter((p) => p.qty <= p.low_stock_threshold).length;
    const counts = new Map<string, number>();
    sales.forEach((s) => s.sale_items.forEach((i) => counts.set(i.product_name, (counts.get(i.product_name) ?? 0) + i.qty)));
    const topProducts = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5);
    return { totalRevenue, lowStock, productCount: products.length, saleCount: sales.length, topProducts };
  }, [products, sales]);

  const exportInventory = () => {
    const rows = [
      ["Name", "Category", "Stock", "Unit", "Buy Price", "Sell Price", "Low Stock Threshold"],
      ...products.map((p) => [p.name, p.category || "", String(p.qty), p.unit, String(p.buy_price), String(p.sell_price), String(p.low_stock_threshold)]),
    ];
    downloadCSV("inventory.csv", rows);
    toast.success("Inventory downloaded");
  };

  const exportSales = () => {
    const rows = [
      ["Date", "Customer", "Phone", "Items", "Total"],
      ...sales.map((s) => [
        new Date(s.sold_at).toLocaleString("en-IN"),
        s.customer_name || "Walk-in",
        s.customer_phone || "",
        s.sale_items.map((i) => `${i.product_name} x${i.qty}`).join("; "),
        String(s.total),
      ]),
    ];
    downloadCSV("sales.csv", rows);
    toast.success("Sales history downloaded");
  };

  const exportInvoices = () => {
    const rows = [
      ["Invoice Number", "Date", "Customer", "Items", "Total"],
      ...invoices.map((inv) => [
        inv.invoice_number,
        new Date(inv.created_at).toLocaleString("en-IN"),
        inv.sale.customer_name || "Walk-in",
        inv.sale.sale_items.map((i) => `${i.product_name} x${i.qty}`).join("; "),
        String(inv.total),
      ]),
    ];
    downloadCSV("invoices.csv", rows);
    toast.success("Invoices downloaded");
  };

  const exportSummary = () => {
    const rows = [
      ["Shop Report Summary"],
      ["Generated", new Date().toLocaleString("en-IN")],
      [],
      ["Metric", "Value"],
      ["Total Products", String(stats.productCount)],
      ["Total Sales", String(stats.saleCount)],
      ["Total Revenue", fmtINR(stats.totalRevenue)],
      ["Low Stock Items", String(stats.lowStock)],
      [],
      ["Top Products", "Qty Sold"],
      ...stats.topProducts.map(([name, qty]) => [name, String(qty)]),
    ];
    downloadCSV("shop_summary.csv", rows);
    toast.success("Summary report downloaded");
  };

  const cards = [
    { title: "Inventory", desc: `${stats.productCount} products`, icon: Package, action: exportInventory },
    { title: "Sales History", desc: `${stats.saleCount} transactions`, icon: Receipt, action: exportSales },
    { title: "Invoices", desc: `${invoices.length} invoices`, icon: ScrollText, action: exportInvoices },
    { title: "Summary Report", desc: "Overview + top sellers", icon: TrendingUp, action: exportSummary },
  ];

  return (
    <AppShell title="Reports & Downloads" subtitle="Export your shop data as CSV">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.title} className="rounded-2xl border border-border bg-card shadow-soft p-5 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 rounded-lg bg-accent text-accent-foreground grid place-items-center">
                <c.icon className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-semibold">{c.title}</div>
                <div className="text-xs text-muted-foreground">{c.desc}</div>
              </div>
            </div>
            <button
              onClick={c.action}
              className="mt-auto inline-flex items-center justify-center gap-2 h-10 rounded-lg border border-border text-sm font-medium hover:bg-accent transition-colors"
            >
              <FileDown className="h-4 w-4" /> Download CSV
            </button>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
