import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, TrendingUp, ArrowUp, ArrowDown } from "lucide-react";
import {
  Line, LineChart, Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Area, AreaChart,
} from "recharts";
import { SiteLayout, PageHeader } from "@/components/site-layout";
import { DEMAND_DATA, REVENUE_DATA } from "@/lib/dummy-data";
import { formatCurrency } from "@/lib/utils";

export const Route = createFileRoute("/ai-pricing")({
  head: () => ({
    meta: [
      { title: "AI dynamic pricing — IdleSpace" },
      { name: "description", content: "AI-suggested pricing based on demand, seasonality and comps." },
      { property: "og:title", content: "AI dynamic pricing — IdleSpace" },
      { property: "og:description", content: "Dynamic pricing insights." },
    ],
  }),
  component: AIPricing,
});

function AIPricing() {
  return (
    <SiteLayout>
      <PageHeader eyebrow="AI · Pricing" title="Price smarter, earn more." subtitle="Our AI reads demand signals in real time and suggests optimal hourly rates." />
      <div className="mx-auto max-w-7xl px-4 pb-16 space-y-6">
        <div className="grid lg:grid-cols-3 gap-4">
          {[
            { label: "Suggested rate", value: "₹6,500/hr", delta: "+12%", up: true },
            { label: "Peak time", value: "Fri 6–9 PM", delta: "94% demand", up: true },
            { label: "Slow time", value: "Mon 9–11 AM", delta: "-18%", up: false },
          ].map((s) => (
            <div key={s.label} className="rounded-3xl p-6 bg-card border border-border hover-lift">
              <div className="flex items-center gap-2 text-xs text-muted-foreground"><Sparkles className="h-3.5 w-3.5 text-accent" /> {s.label}</div>
              <div className="mt-2 text-3xl font-bold gradient-text">{s.value}</div>
              <div className={`text-xs mt-1 flex items-center gap-1 ${s.up ? "text-success" : "text-destructive"}`}>
                {s.up ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />} {s.delta}
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="rounded-3xl bg-card border border-border p-6">
            <h3 className="font-semibold flex items-center gap-2"><TrendingUp className="h-4 w-4" /> Weekly demand</h3>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={DEMAND_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                  <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
                  <Line type="monotone" dataKey="demand" stroke="var(--color-primary)" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-3xl bg-card border border-border p-6">
            <h3 className="font-semibold">Occupancy</h3>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DEMAND_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                  <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
                  <Bar dataKey="occupancy" fill="var(--color-accent)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-card border border-border p-6">
          <h3 className="font-semibold">Revenue trend</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA}>
                <defs>
                  <linearGradient id="ap" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
                <Area type="monotone" dataKey="revenue" stroke="var(--color-accent)" strokeWidth={2} fill="url(#ap)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
