import { Link } from "react-router-dom";
import {
  Store,
  Sparkles,
  Package,
  ArrowRight,
  Check,
  User as UserIcon,
  Quote,
  ChevronDown,
  Github,
  Twitter,
  Linkedin,
  Send,
  Heart,
  Database,
  Server,
  Cpu,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { gsap } from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { useEffect } from "react";


const HEADER_OFFSET = 72;

export default function Landing() {
  const { user } = useAuth();
  gsap.registerPlugin(ScrambleTextPlugin)

  useEffect(() => {
    const el = document.querySelector(".scramble-word");
    if (!el) return;

    gsap.to(el, {
      scrollTrigger: { trigger: el, start: "top 85%" },
      duration: 1.5,
      scrambleText: { text: "AI business manager", chars: "XO", revealDelay: 0.6, speed: 0.8 },
    });
  }, []);


  const scrollToSection = (id: any) => (e: any) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 bg-background border border-b">
        <div className="max-w-5xl   mx-auto px-4 sm:px-6 h-16 flex items-center justify-between  ">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-brand grid place-items-center text-brand-foreground shadow-glow">
              <Store className="h-4 w-4" />
            </div>
            <div>
              <div className="text-base font-semibold tracking-tight">ShopPilot AI</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#features" onClick={scrollToSection("features")} className="hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" onClick={scrollToSection("how-it-works")} className="hover:text-foreground transition-colors">How it works</a>
            <a href="#pricing" onClick={scrollToSection("pricing")} className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#faq" onClick={scrollToSection("faq")} className="hover:text-foreground transition-colors">FAQ</a>
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

      <section className="relative bg-gradient-hero overflow-hidden pt-12 pb-24">
        <div className="absolute inset-0 bg-grid-pattern opacity-100 z-0 pointer-events-none" />
        <div className="hero-mesh-glow" />

        <div className="absolute top-[40%] left-6 xl:left-16 -translate-y-1/2 hidden lg:block pointer-events-none select-none max-w-[240px] xl:max-w-[285px] z-10 animate-float-slow">
          <div className="relative p-2 rounded-2xl bg-card/60 backdrop-blur-md border border-border/80 shadow-2xl">
            <img src="/hero1.png" alt="ShopPilot UI Preview 1" className="rounded-xl w-full h-auto" />
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-brand opacity-5 blur-sm -z-10" />
          </div>
        </div>

        <div className="absolute top-[40%] right-6 xl:right-16 -translate-y-1/2 hidden lg:block pointer-events-none select-none max-w-[240px] xl:max-w-[285px] z-10 animate-float-delayed">
          <div className="relative p-2 rounded-2xl bg-card/60 backdrop-blur-md border border-border/80 shadow-2xl">
            <img src="/hero2.png" alt="ShopPilot UI Preview 2" className="rounded-xl w-full h-auto" />
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-brand opacity-5 blur-sm -z-10" />
          </div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand/5 border border-brand/20 px-4 py-1.5 text-xs font-semibold text-brand shadow-sm animate-pulse-subtle">
            <Sparkles className="h-3.5 w-3.5 text-brand" />
            <span>AI Copilot built-in for kirana & retail shops</span>
          </div>

          <h1 className="mt-6 text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] max-w-4xl mx-auto text-foreground">
            Your shop's <span className="text-brand scramble-word">AI business manager</span>, working 24/7.
          </h1>

          <p className="mt-6 text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            ShopPilot tracks inventory, generates invoices, and gives daily AI insights — custom built for Indian retail merchants.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
            {user ? (
              <div className="flex flex-col items-center gap-3">
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground bg-accent/40 px-3.5 py-1.5 rounded-full border border-border">
                  <UserIcon className="h-4 w-4 text-brand animate-pulse" />
                  Welcome back, <span className="font-semibold text-foreground">{user.owner_name || user.shop_name}</span>
                </span>
                <Link to="/dashboard" className="inline-flex h-12 items-center gap-2 px-6 rounded-xl bg-gradient-brand text-brand-foreground font-semibold shadow-lg hover:shadow-brand/20 hover:-translate-y-0.5 transition-all duration-300">
                  Go to Dashboard <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <>
                <Link to="/auth" className="inline-flex h-12 items-center gap-2 px-6 rounded-xl bg-gradient-brand text-brand-foreground font-semibold shadow-lg hover:shadow-brand/20 hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto justify-center">
                  Start Free Trial <ArrowRight className="h-4 w-4" />
                </Link>
                <a href="#demo" onClick={scrollToSection("demo")} className="inline-flex h-12 items-center gap-2 px-6 rounded-xl border border-border bg-card/80 backdrop-blur-sm text-foreground font-semibold shadow-sm hover:bg-accent hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto justify-center">
                  See Demo
                </a>
              </>
            )}
          </div>

          <div className="mt-12 flex flex-wrap justify-center items-center gap-x-8 gap-y-3 text-xs sm:text-sm text-muted-foreground border-t border-border/40 pt-8 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-brand shrink-0" /> No credit card required</span>
            <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-brand shrink-0" /> Setup in 2 minutes</span>
            <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-brand shrink-0" /> Works on any smartphone</span>
          </div>
        </div>

        <section id="demo" className="relative z-10 px-4 sm:px-6 pb-4">
          <div className="relative mx-auto max-w-5xl">
            <div className="group relative rounded-2xl border border-border bg-card/50 p-2 backdrop-blur-sm shadow-2xl transition-all duration-500 hover:shadow-brand/10 hover:border-brand/30">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-brand opacity-15 blur-xl group-hover:opacity-25 transition duration-500" />

              <div className="relative z-10 flex items-center justify-between border-b border-border/60 bg-muted/50 px-4 py-3 rounded-t-xl">
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-500/80" />
                  <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <span className="h-3 w-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex items-center gap-2 rounded bg-background px-3 py-1 text-[11px] text-muted-foreground border border-border/40 w-1/3 max-w-[240px] justify-center select-none font-mono">
                  <Store className="h-3 w-3 text-brand" /> app.shoppilot.ai
                </div>
                <div className="w-12" />
              </div>

              <div className="relative overflow-hidden rounded-b-xl border-t border-border/60">
                <img
                  src="/demoimg.png"
                  alt="ShopPilot App Dashboard Preview"
                  className="w-full h-auto object-cover object-top max-h-[600px] transition-transform duration-700 group-hover:scale-[1.005]"
                />
              </div>
            </div>
          </div>
        </section>
      </section>

      {/* <section className="relative z-20    sm:px-6  mx-auto flex items-center justify-center bg-secondary">
          <div className="absolute inset-0 bg-grid-pattern opacity-100 z-0 pointer-events-none" />
        <div className="rounded-[20px] border border-border/80 bg-card/80 max-w-5xl backdrop-blur-lg shadow-xl p-6 sm:p-10 mt-2 relative">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-border/60">
            {[
              { value: "2,400+", label: "Shops onboarded" },
              { value: "₹18Cr+", label: "Inventory tracked" },
              { value: "45,000+", label: "Invoices generated" },
              { value: "4.8/5", label: "Average rating" },
            ].map((s, index) => (
              <div
                key={s.label}
                className={`flex flex-col items-center justify-center text-center p-2 transition-transform duration-300 hover:scale-105 ${index >= 2 ? "pt-6 lg:pt-2" : ""
                  } ${index % 2 === 1 ? "border-l-0" : ""
                  }`}
              >
                <div className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-brand bg-clip-text text-transparent">
                  {s.value}
                </div>
                <div className="mt-2.5 text-[11px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      <section id="features" className="py-24 scroll-mt-20 relative bg-secondary ">
        <div className="absolute inset-0 bg-grid-pattern opacity-100 z-0 pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-brand/5 border border-brand/20 px-3.5 py-1.5 text-xs font-semibold text-brand tracking-wider uppercase">
              Everything you need
            </div>
            <h2 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
              One app to run your entire shop
            </h2>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Built specifically for Indian retail merchants — no POS hardware, no complex learning curve.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 [grid-auto-flow:dense]">
            {[
              { title: "Smart inventory", desc: "Add products, track stock, get low-stock alerts before you run out.", span: "md:col-span-2", image: "/inventory.png", class: "absolute right-4 bottom-10 w-18 md:right-6 md:bottom-4 md:w-32" },
              { title: "AI Copilot", desc: "Ask in plain English: 'Why did sales drop?' Get grounded, data-backed answers.", span: "md:row-span-2", image: "/copilot.png", class: "absolute right-4 bottom-10 w-18 md:right-26 md:bottom-17 md:w-32" },
              { title: "Instant invoices", desc: "Generate a tax invoice with one tap. Print or share over WhatsApp.", span: "md:row-span-2", image: "/receipt.png", class: "absolute right-4 bottom-10 w-18 md:right-26 md:bottom-17 md:w-32" },
              { title: "Daily insights", desc: "Fast movers, slow movers, restock suggestions — every morning.", image: "/chart.png", class: "absolute right-2 bottom-10 w-17  md:w-20" },
              { title: "Auto alerts", desc: "Nightly agent checks low stock and notifies you the next morning.", span: "md:col-span-2", image: "/commercial.png", class: "absolute right-4 bottom-8 w-18 md:right-6 md:bottom-4 md:w-32" },
            ].map((f) => (
              <div
                key={f.title}
                className={`group relative overflow-hidden rounded-2xl p-6 sm:p-8 flex flex-col premium-card bg-card border border-border shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-brand/30 hover:shadow-xl ${f.span ?? ""}`}
              >
                <div className="absolute -inset-px rounded-2xl bg-gradient-brand opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300 pointer-events-none" />
                <h3 className="mt-5 font-bold text-[30px] text-foreground tracking-tight">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground z-1">{f.desc}</p>
                <img src={f.image} alt="" className={f.class} />
              </div>
            ))}
          </div>
        </div>
    
      </section>

      <section id="how-it-works" className="py-24 bg-secondary/30 scroll-mt-20 border-y border-border/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-100 z-0 pointer-events-none" />

        {/* Decorative Glowing Connection/Flow Lines */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-30 dark:opacity-40">
          <svg className="w-full h-full min-w-[1400px] absolute left-1/2 -translate-x-1/2 top-0" fill="none" viewBox="0 0 1440 600">
            <path
              d="M -100 150 C 300 80, 500 480, 900 420 C 1100 400, 1300 160, 1600 120"
              stroke="url(#gradient-line-1)"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="animate-flow-slow"
            />
            <path
              d="M -50 480 C 400 520, 700 120, 1000 180 C 1200 200, 1350 450, 1550 480"
              stroke="url(#gradient-line-2)"
              strokeWidth="2"
              strokeLinecap="round"
              className="animate-flow-fast"
            />
            <path
              d="M 150 -50 C 350 220, 550 280, 750 320 C 950 360, 1150 250, 1350 650"
              stroke="url(#gradient-line-3)"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="animate-flow-slow"
            />
            <defs>
              <linearGradient id="gradient-line-1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.1" />
                <stop offset="30%" stopColor="#00a263" stopOpacity="0.75" />
                <stop offset="70%" stopColor="#00bd78" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
              </linearGradient>
              <linearGradient id="gradient-line-2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00a263" stopOpacity="0" />
                <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#00a263" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="gradient-line-3" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
                <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#00bd78" stopOpacity="0.1" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Left Floating Backend Card */}
        <div className="absolute top-[20%] left-4 xl:left-12 hidden lg:flex items-center gap-3 p-3.5 rounded-2xl bg-card/60 backdrop-blur-md border border-border/80 shadow-2xl pointer-events-none select-none animate-float-slow z-10">
          <div className="h-10 w-10 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 grid place-items-center text-blue-500 shadow-inner">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-foreground">Secure Database</div>
            <div className="text-[10px] font-semibold text-muted-foreground">PostgreSQL • Auto Backups</div>
          </div>
          <div className="absolute -inset-0.5 rounded-2xl bg-blue-500/10 opacity-10 blur-sm -z-10" />
        </div>

        {/* Right Floating Backend Card */}
        <div className="absolute bottom-[20%] right-4 xl:right-12 hidden lg:flex items-center gap-3 p-3.5 rounded-2xl bg-card/60 backdrop-blur-md border border-border/80 shadow-2xl pointer-events-none select-none animate-float-delayed z-10">
          <div className="h-10 w-10 rounded-xl bg-brand/10 dark:bg-brand/20 grid place-items-center text-brand shadow-inner">
            <Server className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-foreground">Cloud Server</div>
            <div className="text-[10px] font-semibold text-muted-foreground">API Sync • 99.9% Uptime</div>
          </div>
          <div className="absolute -inset-0.5 rounded-2xl bg-brand/10 opacity-10 blur-sm -z-10" />
        </div>

        {/* Floating CPU/AI Badge for Extra Visual Appeal */}
        <div className="absolute top-[10%] right-8 xl:right-24 hidden xl:flex items-center gap-3 p-3.5 rounded-2xl bg-card/60 backdrop-blur-md border border-border/80 shadow-2xl pointer-events-none select-none animate-float-slow z-10">
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 grid place-items-center text-amber-500 shadow-inner">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-foreground">AI Processing</div>
            <div className="text-[10px] font-semibold text-muted-foreground">Real-time Inference</div>
          </div>
          <div className="absolute -inset-0.5 rounded-2xl bg-amber-500/10 opacity-10 blur-sm -z-10" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-brand/5 border border-brand/20 px-3.5 py-1.5 text-xs font-semibold text-brand tracking-wider uppercase">
              Getting started
            </div>
            <h2 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
              Up and running in 3 steps
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                step: "01", 
                title: "Create your shop", 
                desc: "Sign up with your phone number and shop name — no paperwork needed.",
                icon: Store,
                color: "text-blue-500 bg-blue-500/10 dark:bg-blue-500/20"
              },
              { 
                step: "02", 
                title: "Add your products", 
                desc: "Type them in, import from Excel, or snap a photo of your stock register.",
                icon: Package,
                color: "text-amber-500 bg-amber-500/10 dark:bg-amber-500/20"
              },
              { 
                step: "03", 
                title: "Let Copilot take over", 
                desc: "Get daily insights, alerts, and answers to your business questions automatically.",
                icon: Sparkles,
                color: "text-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/20"
              },
            ].map((s, index) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.step}
                  className="group relative rounded-2xl p-6 sm:p-8 flex flex-col premium-card bg-card border border-border shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-brand/30 hover:shadow-xl"
                >
                  <div className="absolute -inset-px rounded-2xl bg-gradient-brand opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300 pointer-events-none" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-4xl font-extrabold text-muted-foreground/20 group-hover:text-brand/30 transition-colors duration-300 font-mono select-none">
                      {s.step}
                    </span>
                    <div className={`h-10 w-10 rounded-xl ${s.color} grid place-items-center shadow-inner transition-transform duration-300 group-hover:scale-110`}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <h3 className="mt-6 font-bold text-lg text-foreground tracking-tight">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>

                  {index < 2 && (
                    <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 z-20 hidden md:flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background shadow-soft text-muted-foreground transition-transform duration-300 group-hover:translate-x-3/4">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-30 relative bg-secondary/40">
        <div className="absolute inset-0 bg-grid-pattern opacity-100 z-0 pointer-events-none" />

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
          <div className="rounded-2xl border border-border  relative bg-white  shadow-glow p-5 space-y-3">
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

      <section className="relative py-20  bg-secondary/40">
        <div className="absolute inset-0 bg-grid-pattern opacity-100 z-0 pointer-events-none" />

        <div className="relative max-w-6xl mx-auto  rounded-2xl sm:px-6 p-4">
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

      <section id="pricing" className="py-20 scroll-mt-20 relative bg-secondary/40">
        <div className="absolute inset-0 bg-grid-pattern opacity-100 z-0 pointer-events-none" />
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
                className={`rounded-2xl border p-6 shadow-soft relative ${p.highlight
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
                  className={`mt-6 inline-flex w-full h-10 items-center justify-center rounded-lg text-sm font-medium ${p.highlight
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

      <section id="faq" className="py-20 bg-secondary/40 scroll-mt-20 relative">
       <div className="absolute inset-0 bg-grid-pattern opacity-100 z-0 pointer-events-none" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="text-xs font-semibold uppercase tracking-wider text-brand">Questions</div>
            <h2 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight">Frequently asked questions</h2>
          </div>
          <div className="space-y-3 ">
            {[
              { q: "Do I need any special hardware?", a: "No. ShopPilot works on any Android or iOS phone, and on desktop. No POS terminal or tablet required." },
              { q: "Can I import my existing stock list?", a: "Yes — upload an Excel sheet or type it in manually, and Copilot will help clean it up." },
              { q: "Is my data safe?", a: "All your sales and inventory data is encrypted in transit and at rest, with automatic daily backups." },
              { q: "Can I cancel anytime?", a: "Yes, there's no lock-in. You can downgrade to the free Starter plan whenever you like." },
            ].map((item) => (
              <details key={item.q} className="group rounded-xl border border-border bg-white p-4 z-1 relative   ">
                <summary className="flex items-center justify-between cursor-pointer list-none  font-medium text-sm">
                  {item.q}
                  <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform  group-open:rotate-180" />
                </summary>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.a}</p>
              </details> 
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-100 z-0 pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-brand px-8 sm:px-12 py-14 sm:py-16 flex flex-col sm:flex-row items-center justify-between gap-10">
            <div className="relative z-10 max-w-md text-center sm:text-left">
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-[1.1]">
                Start in 2 minutes.
                <br />
                Free during beta.
              </h2>
              <p className="mt-4 text-sm sm:text-base text-white/60">
                Join the shops already moving their inventory and sales onto ShopPilot.
              </p>

              {user ? (
                <div className="mt-8 flex flex-col items-center sm:items-start gap-3">
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-white/70">
                    <UserIcon className="h-4 w-4 text-brand animate-pulse" />
                    Logged in as <span className="font-semibold text-white">{user.owner_name || user.shop_name}</span>
                  </span>
                  <Link
                    to="/dashboard"
                    className="inline-flex h-11 items-center gap-1.5 px-6 rounded-full bg-white text-[#0b2a55] font-semibold hover:bg-white/90 transition-colors"
                  >
                    Go to Dashboard <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="mt-8 inline-flex h-11 items-center px-6 rounded-full bg-white text-[#0b2a55] font-semibold hover:bg-white/90 transition-colors"
                >
                  Get Started Free
                </Link>
              )}
            </div>

            <div className="relative z-10 shrink-0 w-56 sm:w-72">
              <img src="/analytics.png" alt="ShopPilot mascot" className="w-full h-auto" />
            </div>


            <div className="absolute -right-10 -bottom-16 h-72 w-72 sm:h-96 sm:w-96 rounded-full bg-white/5 blur-2xl" />
          </div>
        </div>
      </section>

      <footer className="relative border-t border-border bg-card/40 pt-16 pb-8 overflow-hidden">
        <div className="absolute left-1/4 bottom-0 -z-10 h-80 w-80 rounded-full bg-brand/5 blur-3xl" />
        <div className="absolute inset-0 bg-grid-pattern opacity-100 z-0 pointer-events-none" />
        <div className="absolute right-1/4 top-0 -z-10 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-12 pb-12">
            
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-gradient-brand grid place-items-center text-brand-foreground shadow-glow">
                  <Store className="h-4 w-4" />
                </div>
                <span className="text-lg font-bold tracking-tight bg-gradient-brand bg-clip-text text-transparent">
                  ShopPilot AI
                </span>
              </div>
              <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                Empowering Indian retail merchants and kirana shops with smart invoicing, real-time inventory tracking, and custom daily AI insights.
              </p>
              
              <div className="flex items-center gap-3 pt-2">
                {[
                  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
                  { icon: Github, href: "https://github.com", label: "GitHub" },
                  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
                ].map((social, i) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={i}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-all duration-200 hover:border-brand/40 hover:text-brand hover:shadow-soft"
                      aria-label={social.label}
                    >
                      <Icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3.5">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground/80">Product</h4>
              <ul className="space-y-2 text-sm">
                {[
                  { label: "Features", href: "features" },
                  { label: "App Demo", href: "demo" },
                  { label: "Pricing", href: "pricing" },
                ].map((link, i) => (
                  <li key={i}>
                    <a
                      href={`#${link.href}`}
                      onClick={scrollToSection(link.href)}
                      className="text-muted-foreground hover:text-brand transition-colors duration-150"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3.5">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground/80">Resources</h4>
              <ul className="space-y-2 text-sm">
                {[
                  { label: "FAQ", href: "faq" },
                  { label: "Support & Help", href: "#" },
                  { label: "Beta Program", href: "#" },
                  { label: "Terms of Service", href: "#" },
                ].map((link, i) => (
                  <li key={i}>
                    <a
                      href={link.href.startsWith("#") ? link.href : `#${link.href}`}
                      onClick={link.href.startsWith("#") ? undefined : scrollToSection(link.href)}
                      className="text-muted-foreground hover:text-brand transition-colors duration-150"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3.5">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground/80">Stay Updated</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Subscribe to get daily tips on growing your retail shop.
              </p>
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const target = e.currentTarget;
                  const emailInput = target.elements.namedItem("email") as HTMLInputElement;
                  if (emailInput && emailInput.value) {
                    toast.success(`Subscribed successfully with ${emailInput.value}!`);
                    emailInput.value = "";
                  } else {
                    toast.error("Please enter a valid email address.");
                  }
                }}
                className="flex items-center gap-1.5 pt-1"
              >
                <div className="relative w-full">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    required
                    className="w-full h-9 rounded-lg border border-border bg-card/60 px-3 pr-10 text-xs focus:border-brand focus:outline-none placeholder:text-muted-foreground/60 transition-colors"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 bottom-1 px-2.5 rounded-md bg-gradient-brand text-brand-foreground hover:opacity-95 transition-opacity grid place-items-center cursor-pointer"
                    aria-label="Subscribe"
                  >
                    <Send className="h-3 w-3" />
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="border-t border-border/60 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <div>
              © {new Date().getFullYear()} ShopPilot AI. All rights reserved.
            </div>
            <div className="flex items-center gap-1">
              <span>Made with</span>
              <Heart className="h-3 w-3 text-rose-500 fill-rose-500 animate-pulse" />
              <span>in India 🇮🇳</span>
            </div>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="group flex items-center gap-1 hover:text-brand transition-colors cursor-pointer"
            >
              Back to top
              <ArrowRight className="h-3 w-3 -rotate-90 transition-transform group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>
        <div className="text-center mt-12 select-none pointer-events-none z-2 relative ">
          <h1 className="font-extrabold text-[100px] sm:text-[200px] leading-none bg-gradient-to-t from-white via-[#00bd78] to-[#00bd78] bg-clip-text text-transparent">
            ShopPilot AI
          </h1>
        </div>
      </footer>
    </div>
  );
}