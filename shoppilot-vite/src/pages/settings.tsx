import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { Save } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { store } from "@/lib/mock-store";
import { updateProfile } from "@/api/auth";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user } = useAuth();
  const [shopName, setShopName] = useState(user?.shop_name ?? "");
  const [ownerName, setOwnerName] = useState(user?.owner_name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");

  const save = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    await updateProfile({
      shop_name: shopName,
      owner_name: ownerName,
      phone,
    });

    toast.success("Profile updated successfully");
  } catch (err: any) {
  console.log(err);
  console.log(err.response?.data);

  toast.error(
    err.response?.data?.message || "Unable to update profile"
  );
}
};

  return (
    <AppShell title="Settings" subtitle="Manage your shop profile">
      <div className="max-w-xl space-y-4">
        <div className="rounded-2xl border border-border bg-card shadow-soft p-6">
          <h2 className="font-semibold mb-1">Shop profile</h2>
          <p className="text-sm text-muted-foreground mb-5">Displayed on invoices and the dashboard.</p>
          <form onSubmit={save} className="space-y-3">
            <Field label="Shop name" value={shopName} onChange={setShopName} required />
            <Field label="Owner name" value={ownerName} onChange={setOwnerName} />
            <Field label="Phone" value={phone} onChange={setPhone} />
            <Field label="Email" value={user?.email ?? ""} onChange={() => {}} disabled />
            <button type="submit"
              className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-gradient-brand text-brand-foreground text-sm font-medium shadow-glow hover:opacity-95">
              <Save className="h-4 w-4" /> Save changes
            </button>
          </form>
        </div>
      </div>
    </AppShell>
  );
}

function Field({ label, value, onChange, required, disabled }: { label: string; value: string; onChange: (v: string) => void; required?: boolean; disabled?: boolean }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} required={required} disabled={disabled}
        className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-ring/40" />
    </label>
  );
}
