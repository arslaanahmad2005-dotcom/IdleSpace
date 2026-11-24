import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  IndianRupee,
  Calendar,
  TrendingUp,
  Percent,
  Plus,
  Eye,
  Clock,
  CheckCircle2,
  XCircle,
  Building2,
  CalendarDays,
  Wallet,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Line,
  LineChart,
} from "recharts";
import { SiteLayout } from "@/components/site-layout";
import { ProtectedRoute } from "@/components/protected-route";
import { Button } from "@/components/ui/button";
import { REVENUE_DATA, DEMAND_DATA } from "@/lib/dummy-data";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useSpaces, useBookings } from "@/hooks/use-idle-store";
import { toast } from "sonner";

export const Route = createFileRoute("/host/dashboard")({
  head: () => ({
    meta: [
      { title: "Host dashboard — IdleSpace" },
      {
        name: "description",
        content: "Revenue, occupancy and bookings for your listed spaces.",
      },
      { property: "og:title", content: "Host dashboard — IdleSpace" },
      { property: "og:description", content: "Track your listings on IdleSpace." },
    ],
  }),
  component: HostDashboard,
});

function HostDashboard() {
  const { user } = useAuth();
  const { spaces } = useSpaces();
  const { hostBookings, updateStatus } = useBookings(undefined, user?.id);

  // Host spaces
  const mySpaces = useMemo(() => {
    // If demo host, shows spaces where hostId matches or default demo host
    return spaces.filter(
      (s) => s.hostId === user?.id || s.hostId === "usr_host_demo" || s.host === "Elena Ross",
    );
  }, [spaces, user]);

  const activeListingsCount = useMemo(() => {
    return mySpaces.filter((s) => s.status === "active").length;
  }, [mySpaces]);

  const pendingRequests = useMemo(() => {
    return hostBookings.filter((b) => b.status === "pending");
  }, [hostBookings]);

  const confirmedBookings = useMemo(() => {
    return hostBookings.filter((b) => b.status === "confirmed" || b.status === "upcoming");
  }, [hostBookings]);

  // Actual host earnings from confirmed and completed bookings
  const totalHostEarnings = useMemo(() => {
    return hostBookings
      .filter((b) => b.status === "confirmed" || b.status === "completed" || b.status === "upcoming")
      .reduce((sum, b) => sum + (b.subtotal || 0), 0);
  }, [hostBookings]);

  const handleQuickAccept = (bookingId: string) => {
    updateStatus(bookingId, "confirmed");
    toast.success("Booking request accepted and confirmed!");
  };

  const handleQuickReject = (bookingId: string) => {
    updateStatus(bookingId, "rejected", "Unavailable at requested time");
    toast.info("Booking request declined.");
  };

  return (
    <ProtectedRoute>
      <SiteLayout>
        <div className="mx-auto max-w-7xl px-4 py-8">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs uppercase tracking-wider font-bold gradient-primary text-white px-2.5 py-0.5 rounded-full">
                  Host Mode Active
                </span>
                <span className="text-xs text-muted-foreground">{mySpaces.length} Listings Managed</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Host Command Center</h1>
              <p className="text-muted-foreground mt-1 text-sm">
                Real-time booking requests, revenue analytics, and space availability.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to="/host/calendar">
                <Button variant="outline" className="rounded-xl">
                  <CalendarDays className="h-4 w-4 mr-1.5 text-primary" /> Calendar
                </Button>
              </Link>
              <Link to="/host/manage-bookings">
                <Button variant="outline" className="rounded-xl">
                  <Clock className="h-4 w-4 mr-1.5 text-warning" /> Requests ({pendingRequests.length})
                </Button>
              </Link>
              <Link to="/add-space">
                <Button className="gradient-primary text-white shadow-elegant rounded-xl">
                  <Plus className="h-4 w-4 mr-1" /> Add New Space
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: "Host Earnings",
                value: formatCurrency(totalHostEarnings),
                delta: "+18%",
                icon: IndianRupee,
                color: "text-success",
              },
              {
                label: "Pending Requests",
                value: pendingRequests.length,
                delta: pendingRequests.length > 0 ? "Action needed" : "All clear",
                icon: Clock,
                color: "text-warning",
              },
              {
                label: "Confirmed Reservations",
                value: confirmedBookings.length,
                delta: `${hostBookings.length} total`,
                icon: Calendar,
                color: "text-primary",
              },
              {
                label: "Active Listings",
                value: `${activeListingsCount} / ${mySpaces.length}`,
                delta: "Live",
                icon: Building2,
                color: "text-accent",
              },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl bg-card border border-border p-5 hover-lift shadow-soft">
                <div className="flex items-center justify-between">
                  <div className="h-9 w-9 rounded-xl gradient-primary grid place-items-center text-white">
                    <s.icon className="h-4 w-4" />
                  </div>
                  <span className="text-xs text-primary font-semibold">{s.delta}</span>
                </div>
                <div className="mt-4 text-2xl font-bold">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Pending Approval Alert Banner */}
          {pendingRequests.length > 0 && (
            <div className="mt-8 p-5 rounded-3xl bg-warning/10 border border-warning/30 shadow-soft">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-warning" />
                  <h3 className="font-bold text-base text-foreground">
                    Action Required: {pendingRequests.length} Pending Booking{" "}
                    {pendingRequests.length === 1 ? "Request" : "Requests"}
                  </h3>
                </div>
                <Link
                  to="/host/manage-bookings"
                  className="text-xs font-semibold text-warning hover:underline"
                >
                  View All →
                </Link>
              </div>

              <div className="space-y-3">
                {pendingRequests.slice(0, 2).map((b) => (
                  <div
                    key={b.id}
                    className="p-4 rounded-2xl bg-card border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <img src={b.spaceImage} alt="" className="h-12 w-12 rounded-xl object-cover" />
                      <div>
                        <div className="font-semibold text-sm">{b.spaceTitle}</div>
                        <div className="text-xs text-muted-foreground">
                          Guest: <b>{b.userName}</b> ({b.guests} guests) · {b.date} · {b.startTime} ({b.hours}h)
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <div className="font-bold text-sm mr-2">{formatCurrency(b.total)}</div>
                      <Button
                        size="sm"
                        onClick={() => handleQuickAccept(b.id)}
                        className="rounded-xl gradient-primary text-white text-xs h-8"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleQuickReject(b.id)}
                        className="rounded-xl text-xs h-8 text-destructive hover:bg-destructive/10"
                      >
                        <XCircle className="h-3.5 w-3.5 mr-1" /> Decline
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Visual Charts */}
          <div className="mt-8 grid lg:grid-cols-2 gap-6">
            <div className="rounded-3xl bg-card border border-border p-6 shadow-soft">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-base">Monthly Revenue Trend</h3>
                <span className="text-xs text-muted-foreground">2026 Season</span>
              </div>
              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={REVENUE_DATA}>
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
                    <Bar dataKey="revenue" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-3xl bg-card border border-border p-6 shadow-soft">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-base">Weekly Occupancy Demand</h3>
                <span className="text-xs text-muted-foreground">Hourly Peak Hours</span>
              </div>
              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={DEMAND_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                    <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={12} />
                    <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        background: "var(--color-card)",
                        border: "1px solid var(--color-border)",
                        borderRadius: 12,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="demand"
                      stroke="var(--color-primary)"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="occupancy"
                      stroke="var(--color-accent)"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Quick Actions Hub */}
          <div className="mt-8 rounded-3xl bg-card border border-border p-6 md:p-8 shadow-soft">
            <h3 className="font-bold text-lg mb-1">Host Workspace Navigation</h3>
            <p className="text-xs text-muted-foreground mb-4">
              All management tools to configure listings, block calendar dates, and inspect earnings.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                {
                  label: "My Space Listings",
                  sub: `${mySpaces.length} spaces listed`,
                  to: "/host/manage-listings" as const,
                  icon: Building2,
                },
                {
                  label: "Booking Requests",
                  sub: `${hostBookings.length} total reservations`,
                  to: "/host/manage-bookings" as const,
                  icon: Clock,
                },
                {
                  label: "Availability Calendar",
                  sub: "Block dates & schedule",
                  to: "/host/calendar" as const,
                  icon: CalendarDays,
                },
                {
                  label: "Payouts & Revenue",
                  sub: formatCurrency(totalHostEarnings),
                  to: "/host/earnings" as const,
                  icon: Wallet,
                },
              ].map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className="p-5 rounded-2xl bg-secondary/50 border border-border hover:border-primary hover-lift transition-all flex flex-col justify-between"
                >
                  <div className="h-10 w-10 rounded-xl gradient-primary text-white grid place-items-center mb-3">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{item.label}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.sub}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </SiteLayout>
    </ProtectedRoute>
  );
}
