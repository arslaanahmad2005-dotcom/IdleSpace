import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Download,
  ArrowUpRight,
  IndianRupee,
  Calendar,
  Wallet,
  CheckCircle2,
  TrendingUp,
  CreditCard,
  Building,
} from "lucide-react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { SiteLayout } from "@/components/site-layout";
import { ProtectedRoute } from "@/components/protected-route";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { REVENUE_DATA } from "@/lib/dummy-data";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useBookings } from "@/hooks/use-idle-store";
import { toast } from "sonner";

export const Route = createFileRoute("/host/earnings")({
  head: () => ({
    meta: [
      { title: "Earnings — IdleSpace" },
      {
        name: "description",
        content: "Track revenue, transactions and payouts from your listings.",
      },
      { property: "og:title", content: "Earnings — IdleSpace" },
      { property: "og:description", content: "Your host earnings." },
    ],
  }),
  component: Earnings,
});

function Earnings() {
  const { user } = useAuth();
  const { hostBookings } = useBookings(undefined, user?.id);

  const [payoutOpen, setPayoutOpen] = useState(false);
  const [bankAccount, setBankAccount] = useState("HDFC Bank •••• 4421");
  const [ifsc, setIfsc] = useState("HDFC0001244");
  const [payoutAmount, setPayoutAmount] = useState<number>(0);
  const [payoutDone, setPayoutDone] = useState(false);

  // Compute actual earnings from host's confirmed or completed bookings
  const confirmedOrDone = useMemo(() => {
    return hostBookings.filter(
      (b) => b.status === "confirmed" || b.status === "completed" || b.status === "upcoming",
    );
  }, [hostBookings]);

  const grossBookings = useMemo(() => {
    return confirmedOrDone.reduce((sum, b) => sum + (b.total || 0), 0);
  }, [confirmedOrDone]);

  const platformFees = useMemo(() => {
    return confirmedOrDone.reduce((sum, b) => sum + (b.platformFee || 0), 0);
  }, [confirmedOrDone]);

  const netHostEarnings = useMemo(() => {
    return confirmedOrDone.reduce((sum, b) => sum + (b.subtotal || 0), 0);
  }, [confirmedOrDone]);

  // Generate transaction list dynamically from bookings
  const dynamicTransactions = useMemo(() => {
    return confirmedOrDone.map((b) => ({
      id: b.id,
      label: `${b.spaceTitle} · ${b.hours} hrs (${b.userName})`,
      amount: b.subtotal,
      date: b.date,
      type: "revenue",
      method: b.paymentMethod,
    }));
  }, [confirmedOrDone]);

  const handleSimulatePayout = (e: React.FormEvent) => {
    e.preventDefault();
    setPayoutDone(true);
    toast.success(`Payout of ${formatCurrency(payoutAmount || netHostEarnings)} initiated to ${bankAccount}!`);
    setTimeout(() => {
      setPayoutOpen(false);
      setPayoutDone(false);
    }, 2000);
  };

  const handleExportCSV = () => {
    const csvRows = [
      ["Transaction ID", "Space", "Date", "Gross Amount", "Platform Fee", "Net Earnings"],
      ...confirmedOrDone.map((b) => [
        b.id,
        `"${b.spaceTitle}"`,
        b.date,
        b.total,
        b.platformFee,
        b.subtotal,
      ]),
    ];
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `IdleSpace_Earnings_Report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Earnings report exported as CSV!");
  };

  return (
    <ProtectedRoute>
      <SiteLayout>
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs uppercase tracking-wider font-bold gradient-primary text-white px-2.5 py-0.5 rounded-full">
                  Financial Ledger
                </span>
                <span className="text-xs text-muted-foreground">Direct Bank Payouts</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Host Earnings & Revenue</h1>
              <p className="text-muted-foreground mt-1 text-sm">
                Transparent revenue accounting calculated from live verified customer reservations.
              </p>
            </div>

            <Dialog open={payoutOpen} onOpenChange={setPayoutOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => setPayoutAmount(netHostEarnings)}
                  className="gradient-primary text-white shadow-elegant rounded-xl"
                >
                  <ArrowUpRight className="h-4 w-4 mr-1.5" /> Request Payout
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Request Payout to Bank</DialogTitle>
                  <DialogDescription>
                    Simulated fast payout transfer directly to your connected business checking account.
                  </DialogDescription>
                </DialogHeader>

                {payoutDone ? (
                  <div className="p-6 rounded-2xl bg-success/10 text-success text-center space-y-2">
                    <CheckCircle2 className="h-10 w-10 mx-auto" />
                    <div className="font-bold text-base">Transfer Initiated!</div>
                    <p className="text-xs">
                      {formatCurrency(payoutAmount || netHostEarnings)} will arrive in your bank account in 1 business day.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSimulatePayout} className="space-y-4 mt-2">
                    <div>
                      <Label htmlFor="pay-amt">Withdrawal Amount (₹)</Label>
                      <Input
                        id="pay-amt"
                        type="number"
                        value={payoutAmount || netHostEarnings}
                        onChange={(e) => setPayoutAmount(Number(e.target.value))}
                        className="rounded-xl mt-1.5 text-base font-bold"
                        max={netHostEarnings || 100000}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="bank">Bank Account</Label>
                      <Input
                        id="bank"
                        value={bankAccount}
                        onChange={(e) => setBankAccount(e.target.value)}
                        className="rounded-xl mt-1.5"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="ifsc">IFSC Code</Label>
                      <Input
                        id="ifsc"
                        value={ifsc}
                        onChange={(e) => setIfsc(e.target.value)}
                        className="rounded-xl mt-1.5 uppercase font-mono"
                        required
                      />
                    </div>
                    <DialogFooter>
                      <Button
                        type="submit"
                        className="w-full gradient-primary text-white rounded-xl shadow-elegant"
                      >
                        Confirm Payout Request
                      </Button>
                    </DialogFooter>
                  </form>
                )}
              </DialogContent>
            </Dialog>
          </div>

          {/* Metric Cards */}
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-3xl p-6 bg-card border border-border hover-lift shadow-soft">
              <div className="text-xs text-muted-foreground uppercase font-semibold">
                Available for Payout
              </div>
              <div className="mt-2 text-3xl font-extrabold gradient-text">
                {formatCurrency(netHostEarnings)}
              </div>
              <div className="text-xs text-success font-medium mt-1 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Ready for withdrawal
              </div>
            </div>

            <div className="rounded-3xl p-6 bg-card border border-border hover-lift shadow-soft">
              <div className="text-xs text-muted-foreground uppercase font-semibold">
                Gross Reservation Volume
              </div>
              <div className="mt-2 text-3xl font-extrabold text-foreground">
                {formatCurrency(grossBookings)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {confirmedOrDone.length} paid bookings
              </div>
            </div>

            <div className="rounded-3xl p-6 bg-card border border-border hover-lift shadow-soft">
              <div className="text-xs text-muted-foreground uppercase font-semibold">
                Platform Fees (9%)
              </div>
              <div className="mt-2 text-3xl font-extrabold text-muted-foreground">
                {formatCurrency(platformFees)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">IdleSpace platform share</div>
            </div>

            <div className="rounded-3xl p-6 bg-card border border-border hover-lift shadow-soft">
              <div className="text-xs text-muted-foreground uppercase font-semibold">
                Projected Annual Run-rate
              </div>
              <div className="mt-2 text-3xl font-extrabold text-accent">
                {formatCurrency(netHostEarnings * 12 || 120000)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Based on current occupancy</div>
            </div>
          </div>

          {/* Monthly Revenue Chart */}
          <div className="mt-8 rounded-3xl bg-card border border-border p-6 md:p-8 shadow-soft">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-bold text-lg">Revenue History & Projections</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Aggregate historical and projected monthly earnings.
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-semibold">
                +18% Monthly Growth
              </span>
            </div>

            <div className="mt-6 h-72">
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
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--color-primary)"
                    strokeWidth={2}
                    fill="url(#rev)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Ledger / Transactions List */}
          <div className="mt-8 rounded-3xl bg-card border border-border p-6 md:p-8 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-lg">Booking Ledger Transactions</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Itemized payouts and revenue entries directly matched with customer reservations.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCSV}
                className="rounded-xl text-xs"
              >
                <Download className="h-4 w-4 mr-1.5" /> Export CSV
              </Button>
            </div>

            {dynamicTransactions.length === 0 ? (
              <div className="text-center py-12 text-sm text-muted-foreground">
                No confirmed booking transactions recorded yet.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {dynamicTransactions.map((t) => (
                  <div key={t.id} className="py-4 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-foreground">{t.label}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                        <span>{t.date}</span>
                        <span>·</span>
                        <span className="uppercase font-mono">Ref: #{t.id}</span>
                        <span>·</span>
                        <span className="capitalize">{t.method} payment</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-bold text-success">
                        +{formatCurrency(t.amount)}
                      </div>
                      <span className="text-[10px] text-muted-foreground">Net Payout</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </SiteLayout>
    </ProtectedRoute>
  );
}
