import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Store, Sparkles, Eye, EyeOff } from "lucide-react";
import { store } from "@/lib/mock-store";
import { toast } from "sonner";
import { registerUser, loginUser } from "@/api/auth.ts";

export default function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [shopName, setShopName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (mode === "signup") {
        const res = await registerUser({
          email,
          password,
          shop_name: shopName,
          owner_name: ownerName,
          phone: "",
        });

        localStorage.setItem("token", res.data.token);
        store.setUser(res.data.user);
        toast.success("Account created successfully");
        navigate("/dashboard");
      } else {
        const res = await loginUser({
          email,
          password,
        });

        localStorage.setItem("token", res.data.token);
        store.setUser(res.data.user);
        toast.success("Login Successful");
        navigate("/dashboard");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="hidden lg:flex relative flex-col justify-between p-12 bg-gradient-hero overflow-hidden">
        <Link to="/" className="flex items-center gap-2.5 relative z-10">
          <div className="h-10 w-10 rounded-xl bg-gradient-brand grid place-items-center text-brand-foreground shadow-glow">
            <Store className="h-5 w-5" />
          </div>
          <div>
            <div className="text-base font-semibold tracking-tight">ShopPilot AI</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">For modern kiranas</div>
          </div>
        </Link>

        <div className="relative z-10 space-y-6 max-w-md">
          <div className="inline-flex items-center gap-2 rounded-full bg-card border border-border px-3 py-1 text-xs font-medium shadow-soft">
            <Sparkles className="h-3 w-3 text-brand" />
            AI Business Copilot
          </div>
          <h2 className="text-4xl font-semibold tracking-tight leading-[1.05]">
            Run your shop like the <span className="text-brand">big chains</span> do.
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Track inventory, generate invoices, and get daily AI insights — all in one
            place. Built for Indian kirana, medical, and retail stores.
          </p>
        </div>
      </div>

      <div className="flex flex-col p-6 sm:p-12">
        <div className="lg:hidden mb-8">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-brand grid place-items-center text-brand-foreground shadow-glow">
              <Store className="h-4 w-4" />
            </div>
            <div className="text-base font-semibold tracking-tight">ShopPilot AI</div>
          </Link>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-sm w-full mx-auto">
          <h1 className="text-2xl font-semibold tracking-tight">
            {mode === "signin" ? "Welcome back" : "Create your shop"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === "signin"
              ? "Sign in to continue to your dashboard."
              : "Get started — no credit card required."}
          </p>

          <div className="mt-6 flex p-1 rounded-lg bg-muted text-sm font-medium">
            <button
              type="button"
              onClick={() => setMode("signin")}
              className={`flex-1 h-9 rounded-md ${
                mode === "signin" ? "bg-card shadow-soft" : "text-muted-foreground"
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`flex-1 h-9 rounded-md ${
                mode === "signup" ? "bg-card shadow-soft" : "text-muted-foreground"
              }`}
            >
              Sign up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-3">
            {mode === "signup" && (
              <>
                <Input
                  label="Shop name"
                  value={shopName}
                  onChange={setShopName}
                  placeholder="Sharma Kirana Store"
                  required
                />
                <Input
                  label="Owner name"
                  value={ownerName}
                  onChange={setOwnerName}
                  placeholder="Anil Sharma"
                />
              </>
            )}

            <Input
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@shop.com"
              required
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full h-10 rounded-lg border border-input bg-background px-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-11 rounded-lg bg-gradient-brand text-brand-foreground text-sm font-semibold shadow-glow hover:opacity-95"
            >
              {mode === "signin" ? "Sign in" : "Create account"}
            </button>

            <p className="text-[11px] text-muted-foreground text-center">
              UI demo — no real authentication.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
      />
    </label>
  );
}