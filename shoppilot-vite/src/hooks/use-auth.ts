import { useEffect } from "react";
import { useStore, store } from "@/lib/mock-store";
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

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
    API.get("/auth/profile")
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
        // Token invalid/expired — clear it and let user log in again
        localStorage.removeItem("token");
        store.setUser(null);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { user, session: user ? { user } : null, loading: authLoading };
}