import { createFileRoute, Link } from "@tanstack/react-router";
import { IndianRupee, Calendar, TrendingUp, Percent, Plus, Eye, Bell } from "lucide-react";
import {
  Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid,
  Line, LineChart,
} from "recharts";
import { SiteLayout } from "@/components/site-layout";
import { Button } from "@/components/ui/button";
import { REVENUE_DATA, DEMAND_DATA, NOTIFICATIONS } from "@/lib/dummy-data";
import { formatCurrency } from "@/lib/utils";

export const Route = createFileRoute("/host/dashboard")({
  head: () => ({
    meta: [
      { title: "Host dashboard — IdleSpace" },
      { name: "description", content: "Revenue, occupancy and bookings for your listed spaces." },
      { property: "og:title", content: "Host dashboard — IdleSpace" },
      { property: "og:description", content: "Track your listings on IdleSpace." },
    ],
  }),
  component: HostDashboard,
});

function HostDashboard() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Host command center</h1>
            <p className="text-muted-foreground mt-1">A live look at your business.</p>
          </div>
          <div className="flex gap-2">
            <Link to="/host/manage-bookings"><Button variant="outline" className="rounded-xl">Bookings</Button></Link>
            <Link to="/add-space"><Button className="gradient-primary text-white shadow-elegant rounded-xl"><Plus className="h-4 w-4 mr-1" /> Add space</Button></Link>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Revenue this month", value: formatCurrency(756000), delta: "+18%", icon: IndianRupee },
            { label: "Bookings", value: 71, delta: "+12", icon: Calendar },
            { label: "Occupancy rate", value: "82%", delta: "+4%", icon: Percent },
            { label: "Views", value: "12.4k", delta: "+9%", icon: Eye },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl bg-card border border-border p-5 hover-lift">
              <div className="flex items-center justify-between">
                <div className="h-9 w-9 rounded-xl gradient-primary grid place-items-center text-white"><s.icon className="h-4 w-4" /></div>
                <span className="text-xs text-success flex items-center gap-1"><TrendingUp className="h-3 w-3" /> {s.delta}</span>
              </div>
              <div className="mt-4 text-2xl font-bold">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid lg:grid-cols-2 gap-6">
          <div className="rounded-3xl bg-card border border-border p-6">
            <h3 className="font-semibold">Revenue trend</h3>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={REVENUE_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                  <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
                  <Bar dataKey="revenue" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-3xl bg-card border border-border p-6">
            <h3 className="font-semibold">Weekly demand</h3>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={DEMAND_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                  <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
                  <Line type="monotone" dataKey="demand" stroke="var(--color-primary)" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="occupancy" stroke="var(--color-accent)" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="mt-8 grid lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-6">
          <div className="rounded-3xl bg-card border border-border p-6">
            <h3 className="font-semibold">Quick actions</h3>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "New listing", to: "/add-space" as const },
                { label: "Manage listings", to: "/host/manage-listings" as const },
                { label: "Bookings", to: "/host/manage-bookings" as const },
                { label: "Earnings", to: "/host/earnings" as const },
              ].map((q) => (
                <Link key={q.to} to={q.to} className="rounded-2xl border border-border p-4 hover-lift">
                  <div className="text-sm font-semibold">{q.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">Open →</div>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-card border border-border p-6">
            <h3 className="font-semibold flex items-center gap-2"><Bell className="h-4 w-4" /> Notifications</h3>
            <div className="mt-3 space-y-2">
              {NOTIFICATIONS.map((n) => (
                <div key={n.id} className="p-3 rounded-xl bg-secondary/50">
                  <div className="text-sm font-semibold">{n.title}</div>
                  <div className="text-xs text-muted-foreground">{n.body}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
