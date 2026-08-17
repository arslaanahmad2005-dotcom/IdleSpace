import { createFileRoute } from "@tanstack/react-router";
import { Download, ArrowUpRight } from "lucide-react";
import {
  Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { SiteLayout } from "@/components/site-layout";
import { ProtectedRoute } from "@/components/protected-route";
import { Button } from "@/components/ui/button";
import { REVENUE_DATA } from "@/lib/dummy-data";
import { formatCurrency } from "@/lib/utils";

export const Route = createFileRoute("/host/earnings")({
  head: () => ({
    meta: [
      { title: "Earnings — IdleSpace" },
      { name: "description", content: "Track revenue, transactions and payouts from your listings." },
      { property: "og:title", content: "Earnings — IdleSpace" },
      { property: "og:description", content: "Your host earnings." },
    ],
  }),
  component: Earnings,
});

const TX = [
  { id: "t1", label: "Payout to HDFC ••4421", amount: 103000, date: "Aug 22, 2026", type: "payout" },
  { id: "t2", label: "Skyline Rooftop Studio · 4 hrs", amount: 28400, date: "Aug 20, 2026", type: "revenue" },
  { id: "t3", label: "Trattoria Private Room · 3 hrs", amount: 23700, date: "Aug 18, 2026", type: "revenue" },
  { id: "t4", label: "Warehouse Event Space · 5 hrs", amount: 74500, date: "Aug 15, 2026", type: "revenue" },
  { id: "t5", label: "Payout to HDFC ••4421", amount: 199200, date: "Aug 08, 2026", type: "payout" },
];

function Earnings() {
  return (
    <ProtectedRoute>
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Earnings</h1>
            <p className="text-muted-foreground mt-1">{formatCurrency(756000)} available for payout</p>
          </div>
          <Button className="gradient-primary text-white shadow-elegant rounded-xl"><ArrowUpRight className="h-4 w-4 mr-1" /> Withdraw</Button>
        </div>

        <div className="mt-8 grid lg:grid-cols-3 gap-4">
          {[
            { label: "This month", value: formatCurrency(756000), sub: "+18% vs last" },
            { label: "This year", value: formatCurrency(3917000), sub: "192 bookings" },
            { label: "Lifetime", value: formatCurrency(15139000), sub: "Since 2024" },
          ].map((s) => (
            <div key={s.label} className="rounded-3xl p-6 bg-card border border-border hover-lift">
              <div className="text-xs text-muted-foreground">{s.label}</div>
              <div className="mt-2 text-3xl font-bold gradient-text">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.sub}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-3xl bg-card border border-border p-6">
          <h3 className="font-semibold">Monthly revenue</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
                <Area type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={2} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-6 rounded-3xl bg-card border border-border p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Transactions</h3>
            <Button variant="outline" size="sm" className="rounded-xl"><Download className="h-4 w-4 mr-1" /> Export</Button>
          </div>
          <div className="mt-4 divide-y divide-border">
            {TX.map((t) => (
              <div key={t.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{t.label}</div>
                  <div className="text-xs text-muted-foreground">{t.date}</div>
                </div>
                <div className={`text-sm font-semibold ${t.type === "payout" ? "text-muted-foreground" : "text-success"}`}>
                  {t.type === "payout" ? "-" : "+"}{formatCurrency(t.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SiteLayout>
    </ProtectedRoute>
  );
}
