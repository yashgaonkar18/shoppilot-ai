import {
  Package,
  Receipt,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  ArrowUpRight,
  Plus,
  Bell,
  Bot,
  Brain,
  TrendingDown,
  PackageSearch,
} from "lucide-react";
import { Link } from "react-router-dom";
import { AppShell } from "@/components/app-shell";
import { useEffect, useMemo, useState } from "react";

import { getProducts } from "@/api/product";
import { getSales } from "@/api/sales";
import { getBusinessInsights } from "@/api/ai";

import type { Product } from "@/types/product";
import type { Sale } from "@/types/sales";
import { fmtINR, timeAgo } from "@/lib/format";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Insights {
  summary: string;
  fast_movers: string[];
  slow_movers: string[];
  restock_now: string[];
  profit_tips: string[];
  business_health?: string;
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-5">
            <div className="h-10 w-10 rounded-lg bg-muted mb-4" />
            <div className="h-7 w-20 rounded bg-muted mb-2" />
            <div className="h-4 w-32 rounded bg-muted" />
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-8 rounded-lg bg-muted" />
            <div>
              <div className="h-4 w-36 rounded bg-muted mb-1" />
              <div className="h-3 w-24 rounded bg-muted" />
            </div>
          </div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-4 rounded bg-muted" style={{ width: `${90 - i * 8}%` }} />
          ))}
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <div className="h-5 w-24 rounded bg-muted mb-2" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between items-center">
              <div>
                <div className="h-4 w-28 rounded bg-muted mb-1" />
                <div className="h-3 w-20 rounded bg-muted" />
              </div>
              <div className="h-5 w-12 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-5 w-5 rounded bg-muted" />
          <div className="h-4 w-32 rounded bg-muted" />
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3 items-start">
            <div className="h-2.5 w-2.5 rounded-full bg-muted mt-1.5 shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-4 w-40 rounded bg-muted" />
              <div className="h-3 w-full rounded bg-muted" />
              <div className="h-3 w-24 rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <div className="h-5 w-32 rounded bg-muted mb-2" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex justify-between">
            <div>
              <div className="h-4 w-40 rounded bg-muted mb-2" />
              <div className="h-3 w-28 rounded bg-muted" />
            </div>
            <div>
              <div className="h-4 w-20 rounded bg-muted mb-2" />
              <div className="h-3 w-16 rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KpiCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  accent: "brand" | "success" | "warning" | "chart";
}) {
  const tones: Record<string, string> = {
    brand: "bg-gradient-brand text-brand-foreground",
    success: "bg-success/10 text-success",
    warning: "bg-warning/15 text-warning-foreground",
    chart: "bg-accent text-accent-foreground",
  };
  return (
    <div className="rounded-2xl border border-border bg-card p-4 lg:p-5 shadow-soft hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
      <div className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${tones[accent]}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="mt-3 text-2xl font-semibold tracking-tight">{value}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}

// ─── Insight List ─────────────────────────────────────────────────────────────

function InsightList({
  title,
  items,
  tone,
  icon: Icon,
}: {
  title: string;
  items: string[];
  tone: "success" | "warning" | "destructive";
  icon?: React.ComponentType<{ className?: string }>;
}) {
  if (!items || items.length === 0) return null;
  const tones: Record<string, string> = {
    success: "text-success",
    warning: "text-warning-foreground",
    destructive: "text-destructive",
  };
  const bgTones: Record<string, string> = {
    success: "bg-success/8",
    warning: "bg-warning/8",
    destructive: "bg-destructive/8",
  };
  return (
    <div className={`rounded-xl ${bgTones[tone]} border border-border p-3`}>
      <div className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider mb-2 ${tones[tone]}`}>
        {Icon && <Icon className="h-3.5 w-3.5" />}
        {title}
      </div>
      <ul className="space-y-1.5 text-sm">
        {items.map((t, i) => (
          <li key={i} className="flex gap-2 items-start">
            <span className={`${tones[tone]} mt-0.5`}>•</span>
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Sale Card ────────────────────────────────────────────────────────────────

function SaleCard({ sale }: { sale: Sale }) {
  const summary = sale.sale_items
    .slice(0, 2)
    .map((i: any) => `${i.product_name} ×${i.qty}`)
    .join(", ");
  const extra = sale.sale_items.length > 2 ? ` +${sale.sale_items.length - 2}` : "";

  return (
    <div className="p-4 flex items-center justify-between gap-4 hover:bg-accent/30 transition-colors duration-150 rounded-xl">
      <div className="min-w-0">
        <div className="text-sm font-medium truncate">{sale.customer_name || "Walk-in customer"}</div>
        <div className="text-xs text-muted-foreground truncate">
          {summary}
          {extra}
        </div>
      </div>
      <div className="text-right shrink-0">
        <div className="text-sm font-semibold text-success">{fmtINR(sale.total)}</div>
        <div className="text-xs text-muted-foreground">{timeAgo(sale.sold_at)}</div>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [insights, setInsights] = useState<Insights | null>(null);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
    const interval = setInterval(loadDashboard, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      // Load core data first — never blocked by AI
      const [productsRes, salesRes] = await Promise.all([
        getProducts(),
        getSales(),
      ]);

      setProducts(productsRes.data.products);
      setSales(salesRes.data.sales);

      // Load AI insights separately so a failure doesn't break dashboard
      loadInsights();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadInsights = async () => {
    try {
      setInsightsLoading(true);
      const res = await getBusinessInsights();
      if (res.data?.success !== false) {
        setInsights(res.data);
      }
    } catch (err) {
      // Silently fall back to local insights on error (rate limit, etc.)
      console.warn("AI insights unavailable, using local fallback");
    } finally {
      setInsightsLoading(false);
    }
  };

  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const month = new Date();
    month.setDate(1);
    month.setHours(0, 0, 0, 0);

    const todayTotal = sales
      .filter((s) => new Date(s.sold_at) >= today)
      .reduce((sum, s) => sum + s.total, 0);

    const monthTotal = sales
      .filter((s) => new Date(s.sold_at) >= month)
      .reduce((sum, s) => sum + s.total, 0);

    const lowStock = products.filter((p) => p.qty <= p.low_stock_threshold);

    return {
      productCount: products.length,
      todayTotal,
      monthTotal,
      lowStock,
      recentSales: sales.slice(0, 8),
    };
  }, [products, sales]);

  // Local computed insights — fallback when AI is unavailable
  const localInsights = useMemo((): Insights => {
    const counts = new Map<string, number>();
    sales.forEach((sale) =>
      sale.sale_items.forEach((item) => {
        counts.set(item.product_name, (counts.get(item.product_name) ?? 0) + item.qty);
      })
    );
    const sorted = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
    const fast = sorted.slice(0, 3).map(([name, qty]) => `${name} — ${qty} sold`);
    const sellingNames = new Set(sorted.map(([n]) => n));
    const slow = products
      .filter((p) => !sellingNames.has(p.name))
      .slice(0, 3)
      .map((p) => p.name);
    const restock = stats.lowStock.slice(0, 3).map((p) => `${p.name} (${p.qty} left)`);

    return {
      summary: `Your shop earned ${fmtINR(stats.monthTotal)} this month across ${sales.length} sales. ${stats.lowStock.length} items are running low.`,
      fast_movers: fast,
      slow_movers: slow,
      restock_now: restock,
      profit_tips: [
        "Bundle slow movers with fast sellers.",
        "Reorder staples before stock runs out.",
      ],
    };
  }, [products, sales, stats]);

  const activeInsights = insights ?? localInsights;

  return (
    <AppShell
      title="Good day, business is moving"
      subtitle={new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })}
      action={
        <Link
          to="/sales"
          className="hidden sm:inline-flex h-9 items-center gap-1.5 px-3 rounded-lg bg-gradient-brand text-brand-foreground text-sm font-medium shadow-glow hover:opacity-95 transition-opacity"
        >
          <Plus className="h-4 w-4" /> New sale
        </Link>
      }
    >
      {loading ? (
        <DashboardSkeleton />
      ) : (
        <div className="space-y-6">

          {/* ── KPI Cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            <KpiCard label="Total products" value={stats.productCount} icon={Package} accent="brand" />
            <KpiCard label="Today's sales" value={fmtINR(stats.todayTotal)} icon={Receipt} accent="success" />
            <KpiCard label="Monthly revenue" value={fmtINR(stats.monthTotal)} icon={TrendingUp} accent="chart" />
            <KpiCard label="Low stock alerts" value={stats.lowStock.length} icon={AlertTriangle} accent="warning" />
          </div>

          {/* ── AI Insights + Low Stock ── */}
          <div className="grid lg:grid-cols-3 gap-4">

            {/* AI Insights */}
            <div className="lg:col-span-2 rounded-2xl border border-border bg-gradient-card shadow-soft overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-gradient-brand grid place-items-center text-brand-foreground">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">AI Business Insights</div>
                    <div className="text-xs text-muted-foreground">
                      {insightsLoading ? "Analyzing your business..." : insights ? "Powered by Gemini" : "Local analysis"}
                    </div>
                  </div>
                </div>
                <Brain className={`h-4 w-4 ${insightsLoading ? "text-brand animate-pulse" : "text-muted-foreground"}`} />
              </div>

              <div className="p-5 space-y-4">
                {sales.length === 0 ? (
                  <div className="py-12 text-center">
                    <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold">No business data yet</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Start by adding products and recording your first sale. AI insights will appear automatically.
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {activeInsights.summary}
                    </p>

                    {activeInsights.business_health && (
                      <div className="rounded-xl bg-brand/5 border border-brand/20 p-3">
                        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand mb-1">
                          <TrendingUp className="h-3.5 w-3.5" /> Business Health
                        </div>
                        <p className="text-sm">{activeInsights.business_health}</p>
                      </div>
                    )}

                    <InsightList
                      title="Top sellers"
                      items={activeInsights.fast_movers}
                      tone="success"
                      icon={TrendingUp}
                    />
                    <InsightList
                      title="Slow movers"
                      items={activeInsights.slow_movers}
                      tone="warning"
                      icon={TrendingDown}
                    />
                    <InsightList
                      title="Restock now"
                      items={activeInsights.restock_now}
                      tone="destructive"
                      icon={PackageSearch}
                    />

                    {activeInsights.profit_tips && activeInsights.profit_tips.length > 0 && (
                      <div className="rounded-xl bg-accent/40 border border-border p-3">
                        <div className="text-xs font-semibold uppercase tracking-wider text-accent-foreground mb-1.5">
                          Profit tips
                        </div>
                        <ul className="space-y-1.5 text-sm">
                          {activeInsights.profit_tips.map((t, i) => (
                            <li key={i} className="flex gap-2">
                              <span className="text-brand">→</span>
                              {t}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}

                <Link
                  to="/copilot"
                  className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline"
                >
                  Open AI Copilot <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Low Stock */}
            <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
              <div className="p-5 border-b border-border">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning-foreground" />
                  <div>
                    <div className="text-sm font-semibold">Low stock</div>
                    <div className="text-xs text-muted-foreground">Reorder soon</div>
                  </div>
                </div>
              </div>
              <ul className="divide-y divide-border max-h-[420px] overflow-y-auto">
                {stats.lowStock.length === 0 ? (
                  <li className="p-5 text-sm text-muted-foreground">All stocked up ✨</li>
                ) : (
                  stats.lowStock.map((p) => (
                    <li
                      key={p._id}
                      className="p-4 flex items-center justify-between hover:bg-accent/30 transition-colors"
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">{p.name}</div>
                        <div className="text-xs text-muted-foreground">
                          Threshold {p.low_stock_threshold}
                        </div>
                      </div>
                      <span className="shrink-0 text-xs font-semibold px-2 py-1 rounded-md bg-destructive/10 text-destructive">
                        {p.qty} left
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>

         

          {/* ── Recent Sales ── */}
          <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div>
                <div className="text-sm font-semibold">Recent sales</div>
                <div className="text-xs text-muted-foreground">Last 8 transactions</div>
              </div>
              <Link to="/sales" className="text-xs font-medium text-brand hover:underline">
                View all
              </Link>
            </div>
            <div className="p-2">
              {stats.recentSales.length === 0 ? (
                <div className="py-10 text-center">
                  <Receipt className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">No sales yet</p>
                  <Link
                    to="/sales"
                    className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline mt-2"
                  >
                    Record your first sale <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-1">
                  {stats.recentSales.map((s) => (
                    <SaleCard key={s._id} sale={s} />
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      )}
    </AppShell>
  );
}
