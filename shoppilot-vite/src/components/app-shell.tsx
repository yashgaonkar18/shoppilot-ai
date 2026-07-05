import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Receipt,
  ScrollText,
  Sparkles,
  Settings,
  CreditCard,
  LogOut,
  Store,
  Menu,
  X,
  FolderDown,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import { store } from "@/lib/mock-store";
import { cn } from "@/lib/utils";
import { NotificationBell } from "@/components/notification-bell";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/inventory", label: "Inventory", icon: Package },
  { to: "/sales", label: "Sales", icon: Receipt },
  { to: "/invoices", label: "Invoices", icon: ScrollText },
  { to: "/copilot", label: "AI Copilot", icon: Sparkles, badge: "AI" },
  { to: "/billing", label: "Billing", icon: CreditCard },
  { to: "/reports", label: "Reports", icon: FolderDown },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children, title, subtitle, action }: {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const handleSignOut = () => {
    store.setUser(null);
    navigate("/");
  };

  const shopName = user?.shop_name || "My Shop";
  const initials = shopName.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase()).join("") || "S";

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
        <SidebarInner shopName={shopName} initials={initials} onSignOut={handleSignOut} />
      </aside>

      {/* Sidebar — mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="relative h-full w-72 bg-sidebar border-r border-sidebar-border flex flex-col">
            <SidebarInner shopName={shopName} initials={initials} onSignOut={handleSignOut} />
          </aside>
        </div>
      )}

      <div className="flex flex-1 flex-col min-w-0">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/80 backdrop-blur px-4 lg:px-8 h-16">
          <button
            className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border border-border"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
          <div className="flex-1 min-w-0">
            {title && <h1 className="text-lg font-semibold leading-tight truncate">{title}</h1>}
            {subtitle && <p className="text-xs text-muted-foreground truncate">{subtitle}</p>}
          </div>
          <NotificationBell />
          {action}
        </header>
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

function SidebarInner({ shopName, initials, onSignOut }: { shopName: string; initials: string; onSignOut: () => void }) {
  const location = useLocation();
  return (
    <>
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-sidebar-border">
        <div className="h-9 w-9 rounded-lg bg-gradient-brand grid place-items-center text-brand-foreground shadow-glow">
          <Store className="h-4 w-4" />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold tracking-tight">ShopPilot</div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">AI Business Manager</div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {NAV.map((item) => {
          const { to, label, icon: Icon } = item;
          const badge = "badge" in item ? item.badge : undefined;
          const active = location.pathname === to || (to !== "/dashboard" && location.pathname.startsWith(to));
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
              )}
            >
              <Icon className={cn("h-4 w-4", active && "text-brand")} />
              <span className="flex-1">{label}</span>
              {badge && (
                <span className="text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-md bg-gradient-brand text-brand-foreground">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <div className="h-9 w-9 shrink-0 rounded-full bg-primary text-primary-foreground grid place-items-center text-sm font-semibold">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{shopName}</div>
            <div className="text-xs text-muted-foreground">Shop owner</div>
          </div>
          <button onClick={onSignOut} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground" aria-label="Sign out">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </>
  );
}