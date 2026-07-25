import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/site-layout";
import { NOTIFICATIONS } from "@/lib/dummy-data";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — IdleSpace" },
      { name: "description", content: "Booking updates, reviews, payouts and price suggestions." },
      { property: "og:title", content: "Notifications — IdleSpace" },
      { property: "og:description", content: "Stay up to date." },
    ],
  }),
  component: NotificationsPage,
});

const ALL = [
  ...NOTIFICATIONS,
  { id: "n5", title: "Reminder: Booking tomorrow", body: "Modern Meeting Loft · 10 AM", time: "3d", unread: false, type: "info" },
  { id: "n6", title: "New host tip", body: "Add 3 photos to increase bookings by 40%.", time: "4d", unread: false, type: "info" },
];

const icons = { success: CheckCircle2, warning: AlertTriangle, info: Info } as const;
const colors = { success: "text-success", warning: "text-warning", info: "text-primary" } as const;

function NotificationsPage() {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const list = filter === "all" ? ALL : ALL.filter((n) => n.unread);
  const unread = ALL.filter((n) => n.unread).length;

  return (
    <SiteLayout>
      <PageHeader eyebrow="Notifications" title="Your activity" subtitle={`${unread} unread updates.`} />
      <div className="mx-auto max-w-3xl px-4 pb-16">
        <div className="flex items-center gap-2 mb-4">
          {(["all", "unread"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${filter === f ? "gradient-primary text-white border-transparent" : "border-border hover:bg-secondary"}`}>
              {f === "all" ? "All" : `Unread (${unread})`}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          {list.map((n, i) => {
            const Icon = icons[n.type as keyof typeof icons] ?? Bell;
            return (
              <div key={n.id} className="p-4 rounded-2xl bg-card border border-border flex gap-3 hover-lift animate-fade-up" style={{ animationDelay: `${i * 30}ms` }}>
                <div className={`h-10 w-10 rounded-xl bg-secondary grid place-items-center ${colors[n.type as keyof typeof colors]}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-semibold truncate">{n.title}</div>
                    <div className="text-xs text-muted-foreground shrink-0">{n.time}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">{n.body}</div>
                </div>
                {n.unread && <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-2" />}
              </div>
            );
          })}
        </div>
      </div>
    </SiteLayout>
  );
}
