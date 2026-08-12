import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Store, Sparkles, Eye, EyeOff } from "lucide-react";
import { store } from "@/lib/mock-store";
import { toast } from "sonner";
import { registerUser, loginUser, forgotPasswordUser, resetPasswordUser, verifySignupUser } from "@/api/auth.ts";
import { useAuth } from "@/hooks/use-auth";

export default function AuthPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup" | "forgot_email" | "forgot_otp" | "signup_otp">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [shopName, setShopName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === "signup") {
        const res = await registerUser({
          email,
          password,
          shop_name: shopName,
          owner_name: ownerName,
          phone: "",
        });

        if (res.data.needsVerification) {
          toast.success(res.data.message || "Verification OTP sent to your email");
          setMode("signup_otp");
        } else {
          localStorage.setItem("token", res.data.token);
          store.setUser(res.data.user);
          toast.success("Account created successfully");
          navigate("/dashboard");
        }
      } else if (mode === "signup_otp") {
        const res = await verifySignupUser({ email, otp });
        localStorage.setItem("token", res.data.token);
        store.setUser(res.data.user);
        toast.success("Email verified and account activated successfully!");
        navigate("/dashboard");
      } else if (mode === "signin") {
        try {
          const res = await loginUser({
            email,
            password,
          });

          localStorage.setItem("token", res.data.token);
          store.setUser(res.data.user);
          toast.success("Login Successful");
          navigate("/dashboard");
        } catch (err: any) {
          if (err.response?.data?.needsVerification) {
            toast.error("Please verify your email address. OTP sent.");
            setMode("signup_otp");
          } else {
            throw err;
          }
        }
      } else if (mode === "forgot_email") {
        const res = await forgotPasswordUser({ email });
        toast.success(res.data?.message || "OTP sent to your email");
        setMode("forgot_otp");
      } else if (mode === "forgot_otp") {
        if (newPassword !== confirmPassword) {
          toast.error("Passwords do not match");
          setIsLoading(false);
          return;
        }
        if (newPassword.length < 6) {
          toast.error("Password must be at least 6 characters");
          setIsLoading(false);
          return;
        }
        const res = await resetPasswordUser({ email, otp, newPassword });
        toast.success(res.data?.message || "Password reset successfully. Please sign in with your new password.");
        setPassword("");
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");
        setMode("signin");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
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
        <div>
          <img src="/analytics.png" alt="" className="w-80  mx-auto" />
        </div>

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
            {mode === "signin" && "Welcome back"}
            {mode === "signup" && "Create your shop"}
            {mode === "forgot_email" && "Reset Password"}
            {mode === "forgot_otp" && "Verify OTP"}
            {mode === "signup_otp" && "Verify Your Email"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === "signin" && "Sign in to continue to your dashboard."}
            {mode === "signup" && "Get started — no credit card required."}
            {mode === "forgot_email" && "Enter your email to receive a password reset OTP."}
            {mode === "forgot_otp" && "Enter the OTP sent to your email to set a new password."}
            {mode === "signup_otp" && "Enter the verification OTP sent to your email."}
          </p>

          {(mode === "signin" || mode === "signup") && (
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
          )}

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

            {mode !== "forgot_otp" && mode !== "signup_otp" ? (
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="you@shop.com"
                required
              />
            ) : (
              <div className="p-3 bg-muted/50 border border-border rounded-lg text-xs space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Sending OTP to</span>
                <div className="font-semibold text-foreground">{email}</div>
              </div>
            )}

            {(mode === "signin" || mode === "signup") && (
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
            )}

            {(mode === "forgot_otp" || mode === "signup_otp") && (
              <>
                <Input
                  label="6-Digit OTP"
                  value={otp}
                  onChange={setOtp}
                  placeholder="123456"
                  required
                />
              </>
            )}

            {mode === "forgot_otp" && (
              <>
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full h-10 rounded-lg border border-input bg-background px-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
                      aria-label={showNewPassword ? "Hide password" : "Show password"}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Input
                  label="Confirm New Password"
                  type="password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  placeholder="••••••••"
                  required
                />
              </>
            )}

            {mode === "signin" && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setMode("forgot_email")}
                  className="text-xs text-brand hover:underline font-medium"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-lg bg-gradient-brand text-brand-foreground text-sm font-semibold shadow-glow hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
              ) : null}
              {mode === "signin" && "Sign in"}
              {mode === "signup" && "Create account"}
              {mode === "forgot_email" && "Send OTP"}
              {mode === "forgot_otp" && "Reset Password"}
              {mode === "signup_otp" && "Verify Email"}
            </button>

            {(mode === "forgot_email" || mode === "forgot_otp" || mode === "signup_otp") && (
              <button
                type="button"
                onClick={() => setMode("signin")}
                className="w-full text-xs text-muted-foreground hover:text-foreground font-medium text-center mt-2 bg-transparent border-0 outline-none"
              >
                Back to Sign in
              </button>
            )}

            <p className="text-[11px] text-muted-foreground text-center pt-2">
              Your connection is secure.
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