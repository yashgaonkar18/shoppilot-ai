import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { getNotifications } from "@/api/notification";
import type { Notification } from "@/types/notification";
import { timeAgo } from "@/lib/format";

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const load = async () => {
    try {
      const res = await getNotifications();
      setNotifications(res.data.notifications);
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter((n) => n.status === "unread").length;
  const recent = notifications.slice(0, 5);

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center h-4 min-w-4 px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold leading-none">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-w-[90vw] rounded-xl border border-border bg-card shadow-lg z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="text-sm font-semibold">Notifications</span>
            {unreadCount > 0 && (
              <span className="text-xs text-muted-foreground">{unreadCount} unread</span>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {recent.length === 0 ? (
              <div className="py-10 text-center">
                <Bell className="h-7 w-7 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {recent.map((n) => (
                  <div
                    key={n._id}
                    className="flex gap-3 items-start px-4 py-3 hover:bg-accent/30 transition-colors"
                  >
                    <div className="mt-1.5 shrink-0 relative">
                      {n.status === "unread" ? (
                        <>
                          <span className="absolute inline-flex h-2 w-2 rounded-full bg-success opacity-75 animate-ping" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                        </>
                      ) : (
                        <span className="inline-flex h-2 w-2 rounded-full bg-muted-foreground/30" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs ${n.status === "unread" ? "font-semibold" : "font-medium text-muted-foreground"}`}>
                        {n.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{timeAgo(n.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}