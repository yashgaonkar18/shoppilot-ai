import { useEffect, useState } from "react";
import { Check, Sparkles, Zap, Building2, Loader2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import api from "@/api/axios";

const PLANS = [
  {
    key: "starter",
    name: "Starter",
    price: 0,
    icon: Sparkles,
    tagline: "Free during beta",
    features: [
      "Up to 50 products",
      "Daily AI insights",
      "Invoice generation",
      "Email support",
    ],
  },
  {
    key: "growth",
    name: "Growth",
    price: 299,
    icon: Zap,
    popular: true,
    tagline: "For active shops",
    features: [
      "Unlimited products",
      "AI Copilot (chat)",
      "Low-stock alerts",
      "WhatsApp invoices",
      "Priority support",
    ],
  },
  {
    key: "business",
    name: "Business",
    price: 999,
    icon: Building2,
    tagline: "Multi-staff",
    features: [
      "Everything in Growth",
      "Multi-user access",
      "Custom reports",
      "Tax filing exports",
      "Dedicated onboarding",
    ],
  },
];

function BillingSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-12 rounded-xl bg-muted" />
      <div className="grid md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <div className="h-5 w-5 rounded bg-muted" />
            <div className="h-5 w-24 rounded bg-muted" />
            <div className="h-3 w-32 rounded bg-muted" />
            <div className="h-8 w-20 rounded bg-muted" />
            <div className="h-10 w-full rounded-lg bg-muted" />
            <div className="space-y-2 pt-2">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="h-3 w-full rounded bg-muted" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BillingPage() {
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [planExpiresAt, setPlanExpiresAt] = useState<string | null>(null);
  const [planLoading, setPlanLoading] = useState(true);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCurrentPlan();
  }, []);

  const loadCurrentPlan = async () => {
    try {
      setPlanLoading(true);
      const { data } = await api.get("/auth/profile");
      setCurrentPlan(data.user?.plan ?? "starter");
      setPlanExpiresAt(data.user?.plan_expires_at ?? null);
    } catch (err) {
      console.error("Could not load current plan", err);
      setCurrentPlan("starter"); // safe fallback only after a real failure
    } finally {
      setPlanLoading(false);
    }
  };

  const handleUpgrade = async (planKey: string) => {
    if (planKey === "starter" || planKey === currentPlan) return;
    setError(null);
    setLoadingPlan(planKey);

    try {
      const { data } = await api.post("/billing/create-order", { plan: planKey });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "ShopPilot AI",
        description: `${planKey.charAt(0).toUpperCase() + planKey.slice(1)} Plan — Monthly`,
        order_id: data.orderId,
        theme: { color: "#6366f1" },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            await api.post("/billing/verify-payment", {
              ...response,
              plan: planKey,
            });
            await loadCurrentPlan();
          } catch {
            setError("Payment verification failed. Contact support.");
          } finally {
            setLoadingPlan(null);
          }
        },
        modal: {
          ondismiss: () => setLoadingPlan(null),
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", (response: any) => {
        setError(response.error?.description ?? "Payment failed. Please try again.");
        setLoadingPlan(null);
      });

      rzp.open();
    } catch (err) {
      setError("Could not initiate payment. Please try again.");
      setLoadingPlan(null);
    }
  };

  const planRank: Record<string, number> = { starter: 0, growth: 1, business: 2 };

  return (
    <AppShell
      title="Billing & subscription"
      subtitle="Choose a plan that fits your shop"
    >
      {planLoading || currentPlan === null ? (
        <BillingSkeleton />
      ) : (
        <>
          {/* Current plan banner */}
          <div className="mb-4 rounded-xl bg-accent/40 border border-border px-4 py-3 flex items-center justify-between flex-wrap gap-2">
            <span className="text-sm">
              Current plan: <span className="font-semibold capitalize">{currentPlan}</span>
            </span>
            {planExpiresAt && currentPlan !== "starter" && (
              <span className="text-xs text-muted-foreground">
                Renews / expires on{" "}
                {new Date(planExpiresAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            )}
          </div>

          {/* Error banner */}
          {error && (
            <div className="mb-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm px-4 py-3">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-4">
            {PLANS.map((p) => {
              const isLoading = loadingPlan === p.key;
              const isCurrent = currentPlan === p.key;
              const isDowngrade = planRank[p.key] < planRank[currentPlan];

              return (
                <div
                  key={p.name}
                  className={`relative rounded-2xl border bg-card p-6 shadow-soft transition-all duration-200 ${
                    isCurrent
                      ? "border-success shadow-md ring-1 ring-success/30"
                      : p.popular
                      ? "border-brand shadow-glow"
                      : "border-border"
                  }`}
                >
                  {isCurrent ? (
                    <span className="absolute -top-2.5 left-6 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-success text-success-foreground">
                      Current plan
                    </span>
                  ) : p.popular ? (
                    <span className="absolute -top-2.5 left-6 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-gradient-brand text-brand-foreground">
                      Most popular
                    </span>
                  ) : null}

                  <p.icon className="h-5 w-5 text-brand" />
                  <h3 className="mt-3 text-lg font-semibold">{p.name}</h3>
                  <p className="text-xs text-muted-foreground">{p.tagline}</p>

                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-3xl font-bold">₹{p.price}</span>
                    <span className="text-xs text-muted-foreground">/month</span>
                  </div>

                  <button
                    onClick={() => handleUpgrade(p.key)}
                    disabled={p.key === "starter" || isCurrent || isLoading || isDowngrade}
                    className={`mt-5 w-full h-10 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
                      isCurrent
                        ? "bg-success/10 text-success border border-success/30"
                        : p.popular
                        ? "bg-gradient-brand text-brand-foreground shadow-glow hover:opacity-90"
                        : "border border-border hover:bg-accent"
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Opening checkout...
                      </>
                    ) : isCurrent ? (
                      <>
                        <Check className="h-4 w-4" />
                        Active plan
                      </>
                    ) : isDowngrade ? (
                      "Contact support to downgrade"
                    ) : p.key === "starter" ? (
                      "Free plan"
                    ) : (
                      `Upgrade to ${p.name}`
                    )}
                  </button>

                  <ul className="mt-5 space-y-2 text-sm">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-muted-foreground mt-6 text-center">
            Secured by Razorpay. Billed in INR. Cancel any time.
          </p>
        </>
      )}
    </AppShell>
  );
}