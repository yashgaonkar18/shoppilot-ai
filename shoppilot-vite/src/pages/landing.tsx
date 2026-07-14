import { Link } from "react-router-dom";
import {
  Store,
  Sparkles,
  Package,
  Receipt,
  MessageCircle,
  BarChart3,
  ArrowRight,
  Check,
  Bell,
  User as UserIcon,
  Smartphone,
  ShieldCheck,
  Zap,
  Quote,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-brand grid place-items-center text-brand-foreground shadow-glow">
              <Store className="h-4 w-4" />
            </div>
            <div>
              <div className="text-base font-semibold tracking-tight">ShopPilot AI</div>
            </div>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                  <UserIcon className="h-4 w-4 text-brand" />
                  {user.owner_name || user.shop_name}
                </span>
                <Link to="/dashboard" className="inline-flex h-9 items-center gap-1.5 px-3.5 rounded-lg bg-gradient-brand text-brand-foreground text-sm font-medium shadow-glow hover:opacity-95">
                  Go to Dashboard <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ) : (
              <>
                <Link to="/auth" className="hidden sm:inline-flex h-9 items-center px-3 rounded-lg text-sm font-medium hover:bg-accent">Sign in</Link>
                <Link to="/auth" className="inline-flex h-9 items-center gap-1.5 px-3.5 rounded-lg bg-gradient-brand text-brand-foreground text-sm font-medium shadow-glow hover:opacity-95">
                  Start free <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative bg-gradient-hero overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-card border border-border px-3 py-1 text-xs font-medium shadow-soft">
            <Sparkles className="h-3 w-3 text-brand" /> AI Copilot built in
          </div>
          <h1 className="mt-5 text-4xl sm:text-6xl font-semibold tracking-tight leading-[1.05] max-w-3xl mx-auto">
            Your shop's <span className="text-brand">AI business manager</span>, working 24/7.
          </h1>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
            ShopPilot tracks inventory, generates invoices, and gives daily AI insights — built for Indian kirana, medical, and retail shops.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-2.5">
            {user ? (
              <div className="flex flex-col items-center gap-3">
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground bg-accent/40 px-3 py-1.5 rounded-full border border-border">
                  <UserIcon className="h-4 w-4 text-brand animate-pulse" />
                  Welcome back, <span className="font-semibold text-foreground">{user.owner_name || user.shop_name}</span>
                </span>
                <Link to="/dashboard" className="inline-flex h-11 items-center gap-1.5 px-5 rounded-lg bg-gradient-brand text-brand-foreground font-medium shadow-glow hover:opacity-95">
                  Go to Dashboard <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <>
                <Link to="/auth" className="inline-flex h-11 items-center gap-1.5 px-5 rounded-lg bg-gradient-brand text-brand-foreground font-medium shadow-glow hover:opacity-95">
                  Start free trial <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/auth" className="inline-flex h-11 items-center px-5 rounded-lg border border-border bg-card font-medium hover:bg-accent">
                  See demo
                </Link>
              </>
            )}
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Check className="h-3.5 w-3.5 text-success" /> No credit card</span>
            <span className="inline-flex items-center gap-1"><Check className="h-3.5 w-3.5 text-success" /> Setup in 2 minutes</span>
            <span className="inline-flex items-center gap-1"><Check className="h-3.5 w-3.5 text-success" /> Works on any phone</span>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-border bg-card/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {[
            { value: "2,400+", label: "Shops onboarded" },
            { value: "₹18Cr+", label: "Inventory tracked" },
            { value: "45,000+", label: "Invoices generated" },
            { value: "4.8/5", label: "Average rating" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-brand">{s.value}</div>
              <div className="mt-1 text-xs sm:text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature grid */}
      <section id="features" className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="text-xs font-semibold uppercase tracking-wider text-brand">Everything you need</div>
            <h2 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight">One app to run your shop</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Package, title: "Smart inventory", desc: "Add products, track stock, get low-stock alerts before you run out." },
              { icon: Receipt, title: "Instant invoices", desc: "Generate a tax invoice with one tap. Print or share over WhatsApp." },
              { icon: Sparkles, title: "AI Copilot", desc: "Ask in plain English: 'Why did sales drop?' Get grounded, data-backed answers." },
              { icon: BarChart3, title: "Daily insights", desc: "Fast movers, slow movers, restock suggestions — every morning." },
              { icon: Bell, title: "Auto alerts", desc: "Nightly agent checks low stock and notifies you the next morning." },
              { icon: MessageCircle, title: "Customer support (soon)", desc: "WhatsApp bot that answers customer queries from your inventory." },
              { icon: Smartphone, title: "Mobile-first", desc: "Runs great on any Android phone — no tablet or POS hardware needed." },
              { icon: ShieldCheck, title: "Secure by default", desc: "Your sales and stock data is encrypted and backed up automatically." },
              { icon: Zap, title: "Fast onboarding", desc: "Import your existing stock list from Excel or WhatsApp in minutes." },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-border bg-gradient-card p-5 shadow-soft hover:shadow-glow transition-shadow">
                <div className="h-10 w-10 rounded-lg bg-accent grid place-items-center text-accent-foreground">
                  <f.icon className="h-4 w-4" />
                </div>
                <h3 className="mt-4 font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 bg-secondary/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="text-xs font-semibold uppercase tracking-wider text-brand">Getting started</div>
            <h2 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight">Up and running in 3 steps</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: "01", title: "Create your shop", desc: "Sign up with your phone number and shop name — no paperwork needed." },
              { step: "02", title: "Add your products", desc: "Type them in, import from Excel, or snap a photo of your stock register." },
              { step: "03", title: "Let Copilot take over", desc: "Get daily insights, alerts, and answers to your business questions automatically." },
            ].map((s) => (
              <div key={s.step} className="relative rounded-2xl border border-border bg-card p-6 shadow-soft">
                <div className="text-4xl font-bold text-brand/20">{s.step}</div>
                <h3 className="mt-3 font-semibold">{s.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Killer feature */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-brand">Business Copilot</div>
            <h2 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight">A data analyst on your staff, for ₹299.</h2>
            <p className="mt-4 text-muted-foreground">
              Ask anything — "Why did soft drink sales drop?" — and Copilot queries your live inventory and sales to tell you exactly what happened and what to do.
            </p>
            <ul className="mt-6 space-y-2 text-sm">
              {["Grounded in your real data, not generic AI", "Suggests promos, bundles, restocks", "Works in Hindi soon"].map((p) => (
                <li key={p} className="flex gap-2"><Check className="h-4 w-4 text-success shrink-0 mt-0.5" /> {p}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-card shadow-glow p-5 space-y-3">
            <div className="text-xs text-muted-foreground">You asked</div>
            <div className="text-sm font-medium">"Why did soft drink sales drop this week?"</div>
            <div className="rounded-xl bg-gradient-card border border-border p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-brand">
                <Sparkles className="h-3.5 w-3.5" /> ShopPilot Copilot
              </div>
              <p className="text-sm leading-relaxed">
                Soft drink sales dropped 18% this week. <strong>Coca-Cola 2L</strong> was out of stock for 3 days (Mon–Wed). I recommend reordering 24 units today and adding <strong>Sprite</strong> and <strong>Thums Up</strong> as alternates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-secondary/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="text-xs font-semibold uppercase tracking-wider text-brand">Loved by shop owners</div>
            <h2 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight">What shopkeepers are saying</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { name: "Rajesh Gupta", shop: "Gupta Kirana Store, Pune", quote: "Copilot told me exactly which products to restock before Diwali. Sales went up 20% that week." },
              { name: "Fatima Sheikh", shop: "Al-Noor Medical, Hyderabad", quote: "Invoicing used to take my son an hour every evening. Now it's done in minutes on his phone." },
              { name: "Suresh Iyer", shop: "Iyer General Stores, Chennai", quote: "Low-stock alerts alone have saved me from running out of essentials at least a dozen times." },
            ].map((t) => (
              <div key={t.name} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <Quote className="h-5 w-5 text-brand/40" />
                <p className="mt-3 text-sm leading-relaxed">{t.quote}</p>
                <div className="mt-4 text-sm font-semibold">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.shop}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="text-xs font-semibold uppercase tracking-wider text-brand">Simple pricing</div>
            <h2 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight">Pick a plan that fits your shop</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                name: "Starter",
                price: "Free",
                desc: "For shops just getting started",
                features: ["Up to 100 products", "Basic invoicing", "Low-stock alerts"],
                highlight: false,
              },
              {
                name: "Growth",
                price: "₹299/mo",
                desc: "For shops ready to grow with AI",
                features: ["Unlimited products", "AI Copilot included", "Daily insights", "WhatsApp invoice sharing"],
                highlight: true,
              },
              {
                name: "Multi-store",
                price: "₹799/mo",
                desc: "For owners with multiple locations",
                features: ["Everything in Growth", "Up to 5 shop locations", "Combined analytics", "Priority support"],
                highlight: false,
              },
            ].map((p) => (
              <div
                key={p.name}
                className={`rounded-2xl border p-6 shadow-soft ${
                  p.highlight
                    ? "border-brand bg-gradient-card shadow-glow relative"
                    : "border-border bg-card"
                }`}
              >
                {p.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-semibold px-3 py-1 rounded-full bg-gradient-brand text-brand-foreground shadow-glow">
                    Most popular
                  </div>
                )}
                <h3 className="font-semibold">{p.name}</h3>
                <div className="mt-2 text-3xl font-semibold tracking-tight">{p.price}</div>
                <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
                <ul className="mt-5 space-y-2 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2"><Check className="h-4 w-4 text-success shrink-0 mt-0.5" /> {f}</li>
                  ))}
                </ul>
                <Link
                  to="/auth"
                  className={`mt-6 inline-flex w-full h-10 items-center justify-center rounded-lg text-sm font-medium ${
                    p.highlight
                      ? "bg-gradient-brand text-brand-foreground shadow-glow hover:opacity-95"
                      : "border border-border bg-card hover:bg-accent"
                  }`}
                >
                  Choose {p.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-secondary/40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="text-xs font-semibold uppercase tracking-wider text-brand">Questions</div>
            <h2 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight">Frequently asked questions</h2>
          </div>
          <div className="space-y-3">
            {[
              { q: "Do I need any special hardware?", a: "No. ShopPilot works on any Android or iOS phone, and on desktop. No POS terminal or tablet required." },
              { q: "Can I import my existing stock list?", a: "Yes — upload an Excel sheet or type it in manually, and Copilot will help clean it up." },
              { q: "Is my data safe?", a: "All your sales and inventory data is encrypted in transit and at rest, with automatic daily backups." },
              { q: "Can I cancel anytime?", a: "Yes, there's no lock-in. You can downgrade to the free Starter plan whenever you like." },
            ].map((item) => (
              <details key={item.q} className="group rounded-xl border border-border bg-card p-4 shadow-soft">
                <summary className="flex items-center justify-between cursor-pointer list-none font-medium text-sm">
                  {item.q}
                  <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">Start in 2 minutes. Free during beta.</h2>
          <p className="mt-3 text-muted-foreground">Join the shops already moving their inventory and sales onto ShopPilot.</p>
          {user ? (
            <div className="flex flex-col items-center gap-3 mt-6">
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                <UserIcon className="h-4 w-4 text-brand animate-pulse" />
                Logged in as <span className="font-semibold text-foreground">{user.owner_name || user.shop_name}</span>
              </span>
              <Link to="/dashboard" className="inline-flex h-11 items-center gap-1.5 px-5 rounded-lg bg-gradient-brand text-brand-foreground font-medium shadow-glow hover:opacity-95">
                Go to Dashboard <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <Link to="/auth" className="mt-6 inline-flex h-11 items-center gap-1.5 px-5 rounded-lg bg-gradient-brand text-brand-foreground font-medium shadow-glow hover:opacity-95">
              Create your shop <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </section>

      <footer className="border-t border-border py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-brand grid place-items-center text-brand-foreground">
              <Store className="h-3.5 w-3.5" />
            </div>
            <span className="text-sm font-medium">ShopPilot AI</span>
          </div>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#pricing" className="hover:text-foreground">Pricing</a>
            <a href="#faq" className="hover:text-foreground">FAQ</a>
          </div>
          <div className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} ShopPilot AI · Made in India 🇮🇳
          </div>
        </div>
      </footer>
    </div>
  );
}