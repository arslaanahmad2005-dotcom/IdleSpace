import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  ShieldCheck,
  Building2,
  Users,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  Trash2,
  TrendingUp,
  Search,
  Filter,
  BarChart3,
  ExternalLink,
} from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { ProtectedRoute } from "@/components/protected-route";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useSpaces, useBookings, useReports } from "@/hooks/use-idle-store";
import { DEMO_USERS, type UserRole, type SpaceListing } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Portal — IdleSpace" },
      { name: "description", content: "Platform governance and operations." },
      { property: "og:title", content: "Admin Portal — IdleSpace" },
      { property: "og:description", content: "Platform administration." },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { user, appUser, switchRole } = useAuth();
  const { spaces, updateSpace, deleteSpace } = useSpaces();
  const { allBookings, updateStatus } = useBookings();
  const { reports, updateReportStatus } = useReports();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("listings");
  const [usersList, setUsersList] = useState(DEMO_USERS);

  // Compute platform metrics
  const totalGMV = useMemo(() => {
    return allBookings
      .filter((b) => b.status !== "cancelled" && b.status !== "rejected")
      .reduce((sum, b) => sum + (b.total || 0), 0);
  }, [allBookings]);

  const platformRevenue = useMemo(() => {
    return allBookings
      .filter((b) => b.status !== "cancelled" && b.status !== "rejected")
      .reduce((sum, b) => sum + (b.platformFee || 0), 0);
  }, [allBookings]);

  const pendingApprovalCount = useMemo(() => {
    return spaces.filter((s) => s.status === "pending_approval" || s.status === "flagged").length;
  }, [spaces]);

  const handleToggleListingStatus = (spaceId: string, currentStatus?: string) => {
    const nextStatus = currentStatus === "active" ? "paused" : "active";
    updateSpace(spaceId, { status: nextStatus });
    toast.success(`Space status set to ${nextStatus}.`);
  };

  const handleApproveListing = (spaceId: string) => {
    updateSpace(spaceId, { status: "active" });
    toast.success("Space listing approved and made live!");
  };

  const handleFlagListing = (spaceId: string) => {
    updateSpace(spaceId, { status: "flagged" });
    toast.warning("Space flagged for administrative review.");
  };

  const handleDeleteListing = (spaceId: string, title: string) => {
    deleteSpace(spaceId);
    toast.success(`"${title}" deleted from platform.`);
  };

  const handleResolveReport = (reportId: string) => {
    updateReportStatus(reportId, "resolved");
    toast.success("Report marked as resolved.");
  };

  const handleToggleUserRole = (userId: string) => {
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextRole: UserRole = u.role === "booker" ? "host" : u.role === "host" ? "admin" : "booker";
          toast.success(`User ${u.fullName} role changed to ${nextRole.toUpperCase()}`);
          return { ...u, role: nextRole };
        }
        return u;
      }),
    );
  };

  const filteredSpaces = useMemo(() => {
    if (!searchQuery.trim()) return spaces;
    const q = searchQuery.toLowerCase();
    return spaces.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q),
    );
  }, [spaces, searchQuery]);

  return (
    <ProtectedRoute>
      <SiteLayout>
        <div className="mx-auto max-w-7xl px-4 py-8">
          {/* Admin Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs uppercase tracking-wider font-bold bg-emerald-500/10 text-emerald-500 px-2.5 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" /> Platform Governance
                </span>
                <span className="text-xs text-muted-foreground">Admin Mode Active</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Admin Operations Command</h1>
              <p className="text-muted-foreground mt-1 text-sm">
                Monitor market health, verify space listings, audit bookings, and resolve reports.
              </p>
            </div>

            {/* Admin Switcher indicator */}
            <div className="flex items-center gap-2">
              {appUser.role !== "admin" && (
                <Button
                  size="sm"
                  onClick={() => switchRole("admin")}
                  className="rounded-xl gradient-primary text-white text-xs"
                >
                  Activate Admin Permissions
                </Button>
              )}
            </div>
          </div>

          {/* Core Platform KPIs */}
          <div className="mt-8 grid grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              {
                label: "Gross Bookings (GMV)",
                value: formatCurrency(totalGMV),
                icon: TrendingUp,
                color: "text-emerald-500",
              },
              {
                label: "Platform Net Fees",
                value: formatCurrency(platformRevenue),
                icon: ShieldCheck,
                color: "text-primary",
              },
              {
                label: "Total Space Listings",
                value: spaces.length,
                icon: Building2,
                color: "text-accent",
              },
              {
                label: "Total Reservations",
                value: allBookings.length,
                icon: Calendar,
                color: "text-amber-500",
              },
              {
                label: "Pending Reports",
                value: reports.filter((r) => r.status === "pending").length,
                icon: AlertTriangle,
                color: "text-rose-500",
              },
            ].map((kpi) => (
              <div key={kpi.label} className="p-5 rounded-2xl bg-card border border-border shadow-soft">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{kpi.label}</span>
                  <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                </div>
                <div className="mt-3 text-2xl font-extrabold">{kpi.value}</div>
              </div>
            ))}
          </div>

          {/* Admin Workspace Tabs */}
          <div className="mt-10">
            <Tabs defaultValue="listings" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="rounded-2xl p-1 bg-secondary/80 border border-border">
                <TabsTrigger value="listings" className="rounded-xl text-xs font-semibold">
                  Listings ({spaces.length})
                </TabsTrigger>
                <TabsTrigger value="bookings" className="rounded-xl text-xs font-semibold">
                  Bookings Monitor ({allBookings.length})
                </TabsTrigger>
                <TabsTrigger value="users" className="rounded-xl text-xs font-semibold">
                  User Accounts ({usersList.length})
                </TabsTrigger>
                <TabsTrigger value="reports" className="rounded-xl text-xs font-semibold text-rose-500">
                  Reports & Flags ({reports.length})
                </TabsTrigger>
              </TabsList>

              {/* Tab 1: Listings Management */}
              <TabsContent value="listings" className="mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary border border-border flex-1 max-w-md">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search listings by title, city, category..."
                      className="bg-transparent text-xs outline-none w-full"
                    />
                  </div>
                </div>

                <div className="rounded-3xl bg-card border border-border overflow-hidden shadow-soft">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Space</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>City</TableHead>
                        <TableHead>Rate</TableHead>
                        <TableHead>Capacity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSpaces.map((s) => (
                        <TableRow key={s.id}>
                          <TableCell className="font-semibold">
                            <div className="flex items-center gap-2.5">
                              <img src={s.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                              <div>
                                <div>{s.title}</div>
                                <div className="text-[11px] text-muted-foreground font-normal">
                                  Host: {s.host}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="capitalize text-xs">{s.category}</TableCell>
                          <TableCell className="text-xs">{s.city}</TableCell>
                          <TableCell className="font-bold text-xs">{formatCurrency(s.price)}/h</TableCell>
                          <TableCell className="text-xs">{s.capacity} guests</TableCell>
                          <TableCell>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                s.status === "active"
                                  ? "bg-success/10 text-success"
                                  : s.status === "flagged"
                                  ? "bg-destructive/10 text-destructive"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {s.status || "active"}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <Link to="/space/$id" params={{ id: s.id }} target="_blank">
                                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg" title="Open listing">
                                  <ExternalLink className="h-3.5 w-3.5" />
                                </Button>
                              </Link>

                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs rounded-lg"
                                onClick={() => handleToggleListingStatus(s.id, s.status)}
                              >
                                {s.status === "active" ? "Pause" : "Activate"}
                              </Button>

                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs rounded-lg text-amber-500 hover:bg-amber-500/10"
                                onClick={() => handleFlagListing(s.id)}
                              >
                                Flag
                              </Button>

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-destructive hover:bg-destructive/10 rounded-lg"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete space listing?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to permanently delete "{s.title}" from the platform?
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteListing(s.id, s.title)}
                                      className="rounded-xl bg-destructive text-white"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              {/* Tab 2: Bookings Monitor */}
              <TabsContent value="bookings" className="mt-6">
                <div className="rounded-3xl bg-card border border-border overflow-hidden shadow-soft">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Booking Ref</TableHead>
                        <TableHead>Space Venue</TableHead>
                        <TableHead>Booker</TableHead>
                        <TableHead>Schedule</TableHead>
                        <TableHead>Total Paid</TableHead>
                        <TableHead>Platform Fee</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allBookings.map((b) => (
                        <TableRow key={b.id}>
                          <TableCell className="font-mono text-xs font-bold">#{b.id}</TableCell>
                          <TableCell className="font-medium text-xs truncate max-w-44">
                            {b.spaceTitle}
                          </TableCell>
                          <TableCell className="text-xs">
                            <div>{b.userName}</div>
                            <div className="text-[10px] text-muted-foreground">{b.userEmail}</div>
                          </TableCell>
                          <TableCell className="text-xs">
                            {b.date} · {b.startTime}
                          </TableCell>
                          <TableCell className="font-bold text-xs">{formatCurrency(b.total)}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {formatCurrency(b.platformFee)}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                b.status === "confirmed" || b.status === "upcoming"
                                  ? "bg-success/10 text-success"
                                  : b.status === "pending"
                                  ? "bg-warning/10 text-warning"
                                  : b.status === "completed"
                                  ? "bg-primary/10 text-primary"
                                  : "bg-destructive/10 text-destructive"
                              }`}
                            >
                              {b.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              {b.status === "pending" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 text-xs rounded-lg"
                                  onClick={() => {
                                    updateStatus(b.id, "confirmed");
                                    toast.success(`Booking #${b.id} confirmed by admin.`);
                                  }}
                                >
                                  Approve
                                </Button>
                              )}
                              {b.status !== "cancelled" && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 text-xs rounded-lg text-destructive hover:bg-destructive/10"
                                  onClick={() => {
                                    updateStatus(b.id, "cancelled", "Cancelled by admin safety team");
                                    toast.info(`Booking #${b.id} cancelled by admin.`);
                                  }}
                                >
                                  Cancel
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              {/* Tab 3: Users Management */}
              <TabsContent value="users" className="mt-6">
                <div className="rounded-3xl bg-card border border-border overflow-hidden shadow-soft">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>City</TableHead>
                        <TableHead>Current Role</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {usersList.map((u) => (
                        <TableRow key={u.id}>
                          <TableCell className="font-semibold text-xs flex items-center gap-2">
                            <img src={u.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                            <span>{u.fullName}</span>
                          </TableCell>
                          <TableCell className="text-xs">{u.email}</TableCell>
                          <TableCell className="text-xs">{u.phone || "—"}</TableCell>
                          <TableCell className="text-xs">{u.city || "Mumbai"}</TableCell>
                          <TableCell>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase gradient-primary text-white">
                              {u.role}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs rounded-lg"
                              onClick={() => handleToggleUserRole(u.id)}
                            >
                              Toggle Role
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              {/* Tab 4: Reports & Flags */}
              <TabsContent value="reports" className="mt-6">
                <div className="space-y-3">
                  {reports.map((rep) => (
                    <div
                      key={rep.id}
                      className="p-5 rounded-2xl bg-card border border-border shadow-soft flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-destructive flex items-center gap-1">
                            <AlertTriangle className="h-3.5 w-3.5" /> Flagged Space:
                          </span>
                          <span className="font-bold text-sm">{rep.spaceTitle}</span>
                          <span className="text-xs text-muted-foreground">· Date: {rep.date}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          <b>Reported by:</b> {rep.reportedBy}
                        </p>
                        <p className="text-sm text-foreground mt-1 bg-secondary/50 p-2.5 rounded-xl border border-border">
                          "{rep.reason}"
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {rep.status === "pending" ? (
                          <>
                            <Button
                              size="sm"
                              className="h-8 text-xs rounded-xl gradient-primary text-white"
                              onClick={() => handleResolveReport(rep.id)}
                            >
                              Resolve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 text-xs text-destructive hover:bg-destructive/10 rounded-xl"
                              onClick={() => {
                                handleFlagListing(rep.spaceId);
                                handleResolveReport(rep.id);
                              }}
                            >
                              Suspend Space
                            </Button>
                          </>
                        ) : (
                          <span className="text-xs text-success font-semibold flex items-center gap-1">
                            <CheckCircle2 className="h-4 w-4" /> Resolved
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </SiteLayout>
    </ProtectedRoute>
  );
}
