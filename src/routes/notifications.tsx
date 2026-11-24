import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  CheckCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/site-layout";
import { ProtectedRoute } from "@/components/protected-route";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useNotifications } from "@/hooks/use-idle-store";
import { toast } from "sonner";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — IdleSpace" },
      {
        name: "description",
        content: "Booking updates, reviews, payouts and price suggestions.",
      },
      { property: "og:title", content: "Notifications — IdleSpace" },
      { property: "og:description", content: "Stay up to date." },
    ],
  }),
  component: NotificationsPage,
});

const icons = {
  success: CheckCircle2,
  warning: AlertTriangle,
  info: Info,
  error: AlertTriangle,
} as const;

const colors = {
  success: "text-success bg-success/10",
  warning: "text-warning bg-warning/10",
  info: "text-primary bg-primary/10",
  error: "text-destructive bg-destructive/10",
} as const;

function NotificationsPage() {
  const { user } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications(user?.id);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const list = filter === "all" ? notifications : notifications.filter((n) => n.unread);

  const handleMarkAll = () => {
    markAllAsRead();
    toast.success("All notifications marked as read.");
  };

  return (
    <ProtectedRoute>
      <SiteLayout>
        <PageHeader
          eyebrow="Activity Feed"
          title="In-App Notifications"
          subtitle={`${unreadCount} unread ${unreadCount === 1 ? "update" : "updates"} requiring your attention.`}
        />

        <div className="mx-auto max-w-3xl px-4 pb-20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {(["all", "unread"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    filter === f
                      ? "gradient-primary text-white border-transparent shadow-sm"
                      : "border-border hover:bg-secondary text-foreground"
                  }`}
                >
                  {f === "all" ? "All Updates" : `Unread (${unreadCount})`}
                </button>
              ))}
            </div>

            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAll}
                className="text-xs text-primary hover:underline flex items-center gap-1.5"
              >
                <CheckCheck className="h-4 w-4" /> Mark all read
              </Button>
            )}
          </div>

          {list.length === 0 ? (
            <div className="rounded-3xl bg-card border border-border p-12 text-center shadow-soft">
              <div className="h-12 w-12 rounded-full bg-secondary grid place-items-center mx-auto mb-3">
                <Bell className="h-6 w-6 text-muted-foreground" />
              </div>
              <h4 className="font-semibold text-base">No notifications</h4>
              <p className="text-xs text-muted-foreground mt-1">
                You're all caught up! New reservation requests and updates will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {list.map((n, i) => {
                const Icon = icons[n.type as keyof typeof icons] ?? Bell;
                const colorStyle = colors[n.type as keyof typeof colors] ?? "text-primary bg-primary/10";

                return (
                  <div
                    key={n.id}
                    onClick={() => markAsRead(n.id)}
                    className={`p-4 md:p-5 rounded-3xl bg-card border transition-all cursor-pointer hover-lift shadow-soft flex items-start gap-4 ${
                      n.unread ? "border-primary/40 bg-primary/5" : "border-border"
                    }`}
                  >
                    <div className={`h-11 w-11 rounded-2xl grid place-items-center shrink-0 ${colorStyle}`}>
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-bold text-sm text-foreground truncate">{n.title}</div>
                        <div className="text-[11px] text-muted-foreground shrink-0">{n.time}</div>
                      </div>

                      <div className="text-sm text-muted-foreground mt-1 leading-relaxed">
                        {n.body}
                      </div>

                      {n.link && (
                        <Link
                          to={n.link}
                          className="mt-2 text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                        >
                          View Details <ArrowRight className="h-3 w-3" />
                        </Link>
                      )}
                    </div>

                    {n.unread && (
                      <span className="h-2.5 w-2.5 rounded-full bg-primary shrink-0 mt-2 shadow-glow" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </SiteLayout>
    </ProtectedRoute>
  );
}
