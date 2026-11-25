import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Package,
  Plus,
  Receipt,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { AppShell } from "@/components/app-shell";
import { getProducts } from "@/api/product";
import { getSales } from "@/api/sales";
import type { Product } from "@/types/product";
import type { Sale } from "@/types/sales";
import { fmtINR, timeAgo } from "@/lib/format";

type TrendDay = {
  key: string;
  label: string;
  total: number;
};

function DashboardSkeleton() {
  return (
    <div className="space-y-5 animate-pulse" aria-label="Loading dashboard">
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="h-28 rounded-2xl bg-card border border-border" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {[1, 2].map((item) => (
          <div key={item} className="h-64 rounded-2xl bg-card border border-border" />
        ))}
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  icon: Icon,
  children,
  className = "",
}: {
  title: string;
  icon: typeof Package;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-2xl border border-border bg-card shadow-soft ${className}`}>
      <div className="flex items-center gap-2.5 border-b border-border px-4 py-4 sm:px-5">
        <Icon className="h-4 w-4 text-brand" aria-hidden="true" />
        <h2 className="text-sm font-semibold">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function getLocalDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function SaleRow({ sale }: { sale: Sale }) {
  const itemSummary = sale.sale_items
    .slice(0, 2)
    .map((item) => `${item.product_name} ×${item.qty}`)
    .join(", ");
  const extraItems = sale.sale_items.length > 2 ? ` +${sale.sale_items.length - 2}` : "";

  return (
    <li className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{sale.customer_name || "Walk-in customer"}</p>
        <p className="truncate text-xs text-muted-foreground">
          {itemSummary}{extraItems}
        </p>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-sm font-semibold">{fmtINR(sale.total)}</p>
        <p className="text-xs text-muted-foreground">{timeAgo(sale.sold_at)}</p>
      </div>
    </li>
  );
}

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadDashboard = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true);
    setError(false);
    try {
      const [productsRes, salesRes] = await Promise.all([getProducts(), getSales()]);
      setProducts(productsRes.data.products);
      setSales(salesRes.data.sales);
    } catch (loadError) {
      console.error("Unable to load dashboard data", loadError);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard(true);
    const interval = window.setInterval(() => void loadDashboard(), 30000);
    return () => window.clearInterval(interval);
  }, [loadDashboard]);

  const stats = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);
    const todaySales = sales.filter((sale) => {
      const soldAt = new Date(sale.sold_at);
      return soldAt >= todayStart && soldAt < tomorrowStart;
    });

    const trendStart = new Date(todayStart);
    trendStart.setDate(trendStart.getDate() - 6);
    const trendMap = new Map<string, TrendDay>();
    for (let offset = 0; offset < 7; offset += 1) {
      const day = new Date(trendStart);
      day.setDate(trendStart.getDate() + offset);
      trendMap.set(getLocalDateKey(day), {
        key: getLocalDateKey(day),
        label: day.toLocaleDateString("en-IN", { weekday: "short" }),
        total: 0,
      });
    }
    sales.forEach((sale) => {
      const day = trendMap.get(getLocalDateKey(new Date(sale.sold_at)));
      if (day) day.total += sale.total;
    });

    const productSales = new Map<string, { qty: number; revenue: number }>();
    sales.forEach((sale) => {
      sale.sale_items.forEach((item) => {
        const current = productSales.get(item.product_name) ?? { qty: 0, revenue: 0 };
        current.qty += item.qty;
        current.revenue += item.line_total;
        productSales.set(item.product_name, current);
      });
    });

    return {
      todayTotal: todaySales.reduce((total, sale) => total + sale.total, 0),
      todayCount: todaySales.length,
      lowStock: products
        .filter((product) => product.qty <= product.low_stock_threshold)
        .sort((a, b) => a.qty - b.qty),
      topProducts: Array.from(productSales.entries())
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.qty - a.qty)
        .slice(0, 4),
      trend: Array.from(trendMap.values()),
      recentSales: [...sales]
        .sort((a, b) => new Date(b.sold_at).getTime() - new Date(a.sold_at).getTime())
        .slice(0, 5),
    };
  }, [products, sales]);

  const maxTrendTotal = Math.max(...stats.trend.map((day) => day.total), 0);
  const hasTrendSales = stats.trend.some((day) => day.total > 0);

  return (
    <AppShell
      title="Your shop today"
      subtitle={new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })}
    >
      {loading ? (
        <DashboardSkeleton />
      ) : error && products.length === 0 && sales.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-6 text-center sm:p-10">
          <AlertTriangle className="mx-auto h-9 w-9 text-warning-foreground" aria-hidden="true" />
          <h2 className="mt-3 text-lg font-semibold">Dashboard data couldn’t load</h2>
          <p className="mt-1 text-sm text-muted-foreground">Check your connection and try again.</p>
          <button
            type="button"
            onClick={() => void loadDashboard(true)}
            className="mt-5 inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground"
          >
            Try again
          </button>
        </div>
      ) : (
        <div className="space-y-5 pb-2">
          {error && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm">
              <span>Couldn’t refresh the latest shop data. Showing the last loaded figures.</span>
              <button
                type="button"
                onClick={() => void loadDashboard(true)}
                className="font-semibold text-brand underline underline-offset-2"
              >
                Retry
              </button>
            </div>
          )}

          <section aria-label="Quick actions" className="grid grid-cols-2 gap-3">
            <Link
              to="/sales"
              className="flex min-h-24 items-center justify-between gap-2 rounded-2xl bg-primary p-4 text-primary-foreground shadow-soft transition-colors hover:bg-primary/90 sm:min-h-28 sm:p-5"
            >
              <span>
                <span className="block text-lg font-semibold sm:text-xl">New sale</span>
                <span className="mt-1 block text-xs text-primary-foreground/80 sm:text-sm">Record a customer sale</span>
              </span>
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary-foreground/15">
                <Plus className="h-6 w-6" aria-hidden="true" />
              </span>
            </Link>
            <Link
              to="/inventory"
              className="flex min-h-24 items-center justify-between gap-2 rounded-2xl border border-border bg-card p-4 shadow-soft transition-colors hover:border-brand/50 sm:min-h-28 sm:p-5"
            >
              <span>
                <span className="block text-lg font-semibold sm:text-xl">Add stock</span>
                <span className="mt-1 block text-xs text-muted-foreground sm:text-sm">Update your inventory</span>
              </span>
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
                <Package className="h-5 w-5" aria-hidden="true" />
              </span>
            </Link>
          </section>

          <section aria-label="Today's summary" className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-4 shadow-soft sm:p-5">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground sm:text-sm">
                <Receipt className="h-4 w-4 text-brand" aria-hidden="true" /> Today’s sales
              </div>
              <p className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">{fmtINR(stats.todayTotal)}</p>
              <p className="mt-1 text-xs text-muted-foreground">{stats.todayCount} transaction{stats.todayCount === 1 ? "" : "s"}</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 shadow-soft sm:p-5">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground sm:text-sm">
                <AlertTriangle className="h-4 w-4 text-warning-foreground" aria-hidden="true" /> Items running low
              </div>
              <p className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">{stats.lowStock.length}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {stats.lowStock.length === 0 ? "Everything is above its threshold" : "Need a stock check"}
              </p>
            </div>
            <div className="col-span-2 rounded-2xl border border-border bg-card p-4 shadow-soft sm:col-span-1 sm:p-5">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground sm:text-sm">
                <ShoppingBag className="h-4 w-4 text-brand" aria-hidden="true" /> Products tracked
              </div>
              <p className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">{products.length}</p>
              <p className="mt-1 text-xs text-muted-foreground">In your inventory</p>
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <DashboardCard title="Sales trend · last 7 days" icon={BarChart3}>
              {hasTrendSales ? (
                <div className="grid h-48 grid-cols-7 items-end gap-2 px-4 py-5 sm:gap-3 sm:px-5">
                  {stats.trend.map((day) => (
                    <div key={day.key} className="flex h-full flex-col items-center justify-end gap-2">
                      <span className="w-full truncate text-center text-[10px] text-muted-foreground sm:text-xs">
                        {day.total > 0 ? fmtINR(day.total) : "—"}
                      </span>
                      <div
                        className="w-full max-w-10 rounded-t-md bg-brand/80"
                        style={{ height: `${Math.max((day.total / maxTrendTotal) * 100, day.total > 0 ? 8 : 2)}%` }}
                        role="img"
                        aria-label={`${day.label}: ${fmtINR(day.total)} in sales`}
                      />
                      <span className="text-[10px] text-muted-foreground sm:text-xs">{day.label}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex min-h-48 flex-col items-center justify-center px-5 text-center">
                  <TrendingUp className="h-7 w-7 text-muted-foreground/60" aria-hidden="true" />
                  <p className="mt-2 text-sm font-medium">Your sales trend will appear here</p>
                  <p className="mt-1 text-xs text-muted-foreground">Record sales to see the last seven days.</p>
                </div>
              )}
            </DashboardCard>

            <DashboardCard title="Top-selling products" icon={TrendingUp}>
              {stats.topProducts.length > 0 ? (
                <ol className="divide-y divide-border">
                  {stats.topProducts.map((product, index) => (
                    <li key={product.name} className="flex items-center gap-3 px-4 py-3 sm:px-5">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand/10 text-sm font-semibold text-brand">
                        {index + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.qty} sold</p>
                      </div>
                      <span className="shrink-0 text-sm font-semibold">{fmtINR(product.revenue)}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <div className="flex min-h-48 flex-col items-center justify-center px-5 text-center">
                  <ShoppingBag className="h-7 w-7 text-muted-foreground/60" aria-hidden="true" />
                  <p className="mt-2 text-sm font-medium">No product sales to rank yet</p>
                  <p className="mt-1 text-xs text-muted-foreground">Your best sellers will show up after a sale.</p>
                </div>
              )}
            </DashboardCard>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <DashboardCard title="Stock to check" icon={AlertTriangle}>
              {stats.lowStock.length > 0 ? (
                <ul className="divide-y divide-border">
                  {stats.lowStock.slice(0, 5).map((product) => (
                    <li key={product._id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{product.name} is low</p>
                        <p className="text-xs text-muted-foreground">
                          {product.qty} {product.unit} left · threshold {product.low_stock_threshold}
                        </p>
                      </div>
                      <Link
                        to="/inventory"
                        className="inline-flex min-h-10 shrink-0 items-center gap-1 rounded-lg px-3 text-sm font-semibold text-brand hover:bg-brand/5"
                      >
                        Add to reorder <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-5 py-8 text-center">
                  <p className="text-sm font-medium">{products.length ? "No items are running low" : "No inventory yet"}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {products.length ? "We’ll flag products when they reach their stock threshold." : "Add products to start tracking stock."}
                  </p>
                </div>
              )}
            </DashboardCard>

            <DashboardCard title="Recent sales" icon={Receipt}>
              {stats.recentSales.length > 0 ? (
                <>
                  <ul className="divide-y divide-border">
                    {stats.recentSales.map((sale) => <SaleRow key={sale._id} sale={sale} />)}
                  </ul>
                  <div className="border-t border-border px-4 py-3 sm:px-5">
                    <Link to="/sales" className="inline-flex min-h-10 items-center gap-1 text-sm font-semibold text-brand">
                      View all sales <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                </>
              ) : (
                <div className="px-5 py-8 text-center">
                  <p className="text-sm font-medium">No sales recorded yet</p>
                  <p className="mt-1 text-xs text-muted-foreground">Your completed sales will appear here.</p>
                  <Link to="/sales" className="mt-3 inline-flex min-h-10 items-center gap-1 text-sm font-semibold text-brand">
                    Record your first sale <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              )}
            </DashboardCard>
          </section>
        </div>
      )}
    </AppShell>
  );
}
