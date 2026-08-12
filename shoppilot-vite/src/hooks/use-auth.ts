import { useEffect } from "react";
import { useStore, store } from "@/lib/mock-store";
import api from "@/api/axios";

export function useAuth() {
  const user = useStore((s) => s.user);
  const authLoading = useStore((s) => s.authLoading);

  useEffect(() => {
    // Only attempt rehydration once, when no user is in memory yet
    if (user) return;

    const token = localStorage.getItem("token");
    if (!token) {
      store.setAuthLoading(false);
      return;
    }

    // Token exists — verify it and rehydrate the user from the server
    api.get("/auth/profile")
      .then(({ data }) => {
        const u = data.user;
        store.setUser({
          id: u._id,
          email: u.email,
          shop_name: u.shop_name,
          owner_name: u.owner_name,
          phone: u.phone,
          plan: u.plan,
          plan_expires_at: u.plan_expires_at,
        });
      })
      .catch(() => {
        localStorage.removeItem("token");
        store.setUser(null);
      });
  }, []);

  return { user, session: user ? { user } : null, loading: authLoading };
}