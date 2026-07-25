import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, Wallet, Heart, TrendingUp, Calendar, MoreHorizontal } from "lucide-react";
import {
  Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { SiteLayout } from "@/components/site-layout";
import { Button } from "@/components/ui/button";
import { BOOKINGS, NOTIFICATIONS, REVENUE_DATA, SPACES } from "@/lib/dummy-data";
import { formatCurrency } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Your dashboard — IdleSpace" },
      { name: "description", content: "Manage your bookings, wishlists and notifications on IdleSpace." },
      { property: "og:title", content: "Your dashboard — IdleSpace" },
      { property: "og:description", content: "Bookings, wishlists and more." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const upcoming = BOOKINGS.filter((b) => b.status === "upcoming");
  const past = BOOKINGS.filter((b) => b.status !== "upcoming");
  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Welcome back, Ada</h1>
            <p className="text-muted-foreground mt-1">Here's what's happening with your bookings.</p>
          </div>
          <Link to="/browse"><Button className="gradient-primary text-white shadow-elegant">Find a space</Button></Link>
        </div>

        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Upcoming", value: upcoming.length, icon: Calendar, color: "text-primary" },
            { label: "Saved", value: 12, icon: Heart, color: "text-destructive" },
            { label: "Wallet", value: formatCurrency(20000), icon: Wallet, color: "text-success" },
            { label: "Hours booked", value: 48, icon: TrendingUp, color: "text-accent" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl bg-card border border-border p-5 hover-lift">
              <div className="flex items-center justify-between">
                <s.icon className={`h-5 w-5 ${s.color}`} />
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="mt-4 text-2xl font-bold">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid lg:grid-cols-[minmax(0,1fr)_360px] gap-6">
          <div>
            <div className="rounded-3xl bg-card border border-border p-6">
              <h2 className="text-lg font-semibold">Activity</h2>
              <div className="mt-4 h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={REVENUE_DATA}>
                    <defs>
                      <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                    <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
                    <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                    <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
                    <Area type="monotone" dataKey="bookings" stroke="var(--color-primary)" strokeWidth={2} fill="url(#g1)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-6 rounded-3xl bg-card border border-border p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Upcoming bookings</h2>
                <Link to="/dashboard" className="text-sm text-primary">View all</Link>
              </div>
              <div className="mt-4 space-y-3">
                {upcoming.map((b) => (
                  <div key={b.id} className="grid grid-cols-[64px_minmax(0,1fr)_auto] gap-4 items-center p-3 rounded-2xl bg-secondary/50">
                    <img src={b.image} alt="" className="h-16 w-16 rounded-xl object-cover" />
                    <div className="min-w-0">
                      <div className="font-semibold truncate">{b.space}</div>
                      <div className="text-xs text-muted-foreground">{b.date} · {b.time}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-semibold">{formatCurrency(b.total)}</div>
                      <div className="text-xs text-success">Confirmed</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-3xl bg-card border border-border p-6">
              <h2 className="text-lg font-semibold">Booking history</h2>
              <div className="mt-4 space-y-3">
                {past.map((b) => (
                  <div key={b.id} className="grid grid-cols-[64px_minmax(0,1fr)_auto] gap-4 items-center p-3 rounded-2xl">
                    <img src={b.image} alt="" className="h-16 w-16 rounded-xl object-cover" />
                    <div className="min-w-0">
                      <div className="font-semibold truncate">{b.space}</div>
                      <div className="text-xs text-muted-foreground">{b.date} · {b.time}</div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full shrink-0 ${b.status === "completed" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                      {b.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl bg-card border border-border p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2"><Bell className="h-4 w-4" /> Notifications</h3>
                <Link to="/notifications" className="text-xs text-primary">All</Link>
              </div>
              <div className="mt-3 space-y-2">
                {NOTIFICATIONS.slice(0, 3).map((n) => (
                  <div key={n.id} className="p-3 rounded-xl bg-secondary/50">
                    <div className="text-sm font-semibold">{n.title}</div>
                    <div className="text-xs text-muted-foreground">{n.body}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-card border border-border p-6">
              <h3 className="font-semibold flex items-center gap-2"><Heart className="h-4 w-4" /> Saved spaces</h3>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {SPACES.slice(0, 4).map((s) => (
                  <Link to="/space/$id" params={{ id: s.id }} key={s.id} className="block">
                    <img src={s.image} alt="" className="aspect-square rounded-xl object-cover w-full" />
                    <div className="mt-1 text-xs truncate font-medium">{s.title}</div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </SiteLayout>
  );
}
