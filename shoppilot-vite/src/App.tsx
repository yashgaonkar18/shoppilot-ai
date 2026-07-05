import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/hooks/use-auth";
import Landing from "@/pages/landing";
import Auth from "@/pages/auth";
import Dashboard from "@/pages/dashboard";
import Inventory from "@/pages/inventory";
import Sales from "@/pages/sales";
import Invoices from "@/pages/invoices";
import Copilot from "@/pages/copilot";
import Billing from "@/pages/billing";
import Reports from "@/pages/reports";
import Settings from "@/pages/settings";

function FullScreenLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 rounded-full border-2 border-brand border-t-transparent animate-spin" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  // Still checking localStorage token — don't redirect yet
  if (loading) return <FullScreenLoader />;

  if (!user) return <Navigate to="/auth" replace />;

  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster richColors position="top-right" />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/inventory" element={<RequireAuth><Inventory /></RequireAuth>} />
        <Route path="/sales" element={<RequireAuth><Sales /></RequireAuth>} />
        <Route path="/invoices" element={<RequireAuth><Invoices /></RequireAuth>} />
        <Route path="/copilot" element={<RequireAuth><Copilot /></RequireAuth>} />
        <Route path="/billing" element={<RequireAuth><Billing /></RequireAuth>} />
        <Route path="/reports" element={<RequireAuth><Reports /></RequireAuth>} />
        <Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>} />
      </Routes>
    </BrowserRouter>
  );
}