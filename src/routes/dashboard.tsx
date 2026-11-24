import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Wallet,
  Heart,
  TrendingUp,
  Calendar,
  MoreHorizontal,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MessageSquare,
  Sparkles,
  Phone,
  Mail,
  RotateCcw,
  Star,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SpaceCard } from "@/components/space-card";
import { REVENUE_DATA } from "@/lib/dummy-data";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useBookings, useFavourites, useSpaces, useReviews } from "@/hooks/use-idle-store";
import type { Booking } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Your dashboard — IdleSpace" },
      {
        name: "description",
        content: "Manage your bookings, wishlists and activity on IdleSpace.",
      },
      { property: "og:title", content: "Your dashboard — IdleSpace" },
      { property: "og:description", content: "Bookings, wishlists and more." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuth();
  const { userBookings, updateStatus } = useBookings(user?.id);
  const { favourites } = useFavourites(user?.id);
  const { spaces } = useSpaces();
  const { addReview } = useReviews();

  const [activeTab, setActiveTab] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Cancel dialog state
  const [cancelBookingTarget, setCancelBookingTarget] = useState<Booking | null>(null);
  const [cancelReason, setCancelReason] = useState("");

  // Contact host dialog state
  const [contactBookingTarget, setContactBookingTarget] = useState<Booking | null>(null);
  const [contactMessage, setContactMessage] = useState("");

  // Review dialog state
  const [reviewBookingTarget, setReviewBookingTarget] = useState<Booking | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewBody, setReviewBody] = useState("");

  const displayName =
    (user?.user_metadata?.full_name as string | undefined)?.split(" ")[0] ??
    user?.email?.split("@")[0] ??
    "there";

  // Group bookings
  const groups = useMemo(() => {
    return {
      all: userBookings,
      upcoming: userBookings.filter((b) => b.status === "upcoming" || b.status === "confirmed"),
      pending: userBookings.filter((b) => b.status === "pending"),
      completed: userBookings.filter((b) => b.status === "completed"),
      cancelled: userBookings.filter((b) => b.status === "cancelled" || b.status === "rejected"),
    };
  }, [userBookings]);

  // Wishlisted spaces objects
  const savedSpaces = useMemo(() => {
    return spaces.filter((s) => favourites.includes(s.id));
  }, [spaces, favourites]);

  // Total hours & spend
  const totalHoursBooked = useMemo(() => {
    return userBookings
      .filter((b) => b.status !== "cancelled" && b.status !== "rejected")
      .reduce((sum, b) => sum + (b.hours || 0), 0);
  }, [userBookings]);

  const totalSpent = useMemo(() => {
    return userBookings
      .filter((b) => b.status !== "cancelled" && b.status !== "rejected")
      .reduce((sum, b) => sum + (b.total || 0), 0);
  }, [userBookings]);

  const handleConfirmCancel = () => {
    if (!cancelBookingTarget) return;
    updateStatus(cancelBookingTarget.id, "cancelled", cancelReason || "Cancelled by user");
    toast.success("Booking cancelled successfully.");
    setCancelBookingTarget(null);
    setCancelReason("");
  };

  const handleSendMessageToHost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactMessage.trim()) return;
    toast.success(`Message dispatched to host ${contactBookingTarget?.hostName || "Host"}!`);
    setContactBookingTarget(null);
    setContactMessage("");
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewBookingTarget) return;
    if (!reviewBody.trim()) {
      toast.error("Please add your feedback comment.");
      return;
    }

    addReview({
      spaceId: reviewBookingTarget.spaceId,
      bookingId: reviewBookingTarget.id,
      userId: user?.id || "usr_booker_demo",
      author: user?.user_metadata?.full_name || "Verified Booker",
      avatar:
        user?.user_metadata?.avatar_url ||
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      rating: reviewRating,
      body: reviewBody.trim(),
    });

    toast.success("Your review was posted and updated the listing rating!");
    setReviewBookingTarget(null);
    setReviewBody("");
  };

  return (
    <ProtectedRoute>
      <SiteLayout>
        <div className="mx-auto max-w-7xl px-4 py-8">
          {/* Welcome Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs uppercase tracking-wider font-bold gradient-primary text-white px-2.5 py-0.5 rounded-full">
                  Booker Dashboard
                </span>
                <span className="text-xs text-muted-foreground">Active Account</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Welcome back, {displayName}
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">
                Track your active reservations, saved spaces, and booking history.
              </p>
            </div>
            <div className="flex gap-2">
              <Link to="/favourites">
                <Button variant="outline" className="rounded-xl">
                  <Heart className="h-4 w-4 mr-1.5 text-destructive" /> Saved ({favourites.length})
                </Button>
              </Link>
              <Link to="/browse">
                <Button className="gradient-primary text-white shadow-elegant rounded-xl">
                  Find a Space
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: "Upcoming Bookings",
                value: groups.upcoming.length,
                icon: Calendar,
                color: "text-primary",
              },
              {
                label: "Pending Approval",
                value: groups.pending.length,
                icon: Clock,
                color: "text-warning",
              },
              {
                label: "Hours Booked",
                value: `${totalHoursBooked} hrs`,
                icon: TrendingUp,
                color: "text-accent",
              },
              {
                label: "Total Invested",
                value: formatCurrency(totalSpent),
                icon: Wallet,
                color: "text-success",
              },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl bg-card border border-border p-5 hover-lift shadow-soft">
                <div className="flex items-center justify-between">
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                  <span className="text-xs text-muted-foreground font-medium">Lifetime</span>
                </div>
                <div className="mt-4 text-2xl font-bold">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Booking Management Section */}
          <div className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold tracking-tight">My Reservations</h2>
              <span className="text-xs text-muted-foreground">
                Total: {userBookings.length} bookings
              </span>
            </div>

            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="rounded-2xl p-1 bg-secondary/80 border border-border">
                <TabsTrigger value="all" className="rounded-xl text-xs font-semibold">
                  All ({groups.all.length})
                </TabsTrigger>
                <TabsTrigger value="upcoming" className="rounded-xl text-xs font-semibold">
                  Upcoming ({groups.upcoming.length})
                </TabsTrigger>
                <TabsTrigger value="pending" className="rounded-xl text-xs font-semibold">
                  Pending ({groups.pending.length})
                </TabsTrigger>
                <TabsTrigger value="completed" className="rounded-xl text-xs font-semibold">
                  Completed ({groups.completed.length})
                </TabsTrigger>
                <TabsTrigger value="cancelled" className="rounded-xl text-xs font-semibold">
                  Cancelled ({groups.cancelled.length})
                </TabsTrigger>
                <TabsTrigger value="wishlist" className="rounded-xl text-xs font-semibold text-rose-500">
                  Wishlist ({savedSpaces.length})
                </TabsTrigger>
              </TabsList>

              {/* Booking Lists for each tab */}
              {(["all", "upcoming", "pending", "completed", "cancelled"] as const).map((k) => (
                <TabsContent key={k} value={k} className="mt-6">
                  {groups[k].length === 0 ? (
                    <div className="rounded-3xl bg-card border border-border p-12 text-center shadow-soft">
                      <div className="mx-auto h-12 w-12 rounded-full bg-secondary grid place-items-center mb-3">
                        <Calendar className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h4 className="font-semibold text-base capitalize">No {k} reservations</h4>
                      <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                        Looking for a unique studio, kitchen, or conference room?
                      </p>
                      <Link to="/browse">
                        <Button className="mt-4 gradient-primary text-white rounded-xl text-xs shadow-elegant">
                          Explore Spaces
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {groups[k].map((b) => {
                        const statusColor =
                          b.status === "confirmed" || b.status === "upcoming"
                            ? "bg-success/10 text-success border-success/30"
                            : b.status === "pending"
                            ? "bg-warning/10 text-warning border-warning/30"
                            : b.status === "completed"
                            ? "bg-primary/10 text-primary border-primary/30"
                            : "bg-destructive/10 text-destructive border-destructive/30";

                        return (
                          <div
                            key={b.id}
                            className="p-5 rounded-3xl bg-card border border-border shadow-soft flex flex-col md:flex-row gap-5 items-start md:items-center justify-between hover-lift transition-all"
                          >
                            <div className="flex gap-4 items-center min-w-0">
                              <img
                                src={b.spaceImage}
                                alt={b.spaceTitle}
                                className="h-20 w-20 rounded-2xl object-cover shrink-0 border border-border"
                              />
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-[11px] font-mono text-muted-foreground">
                                    #{b.id}
                                  </span>
                                  <span
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${statusColor}`}
                                  >
                                    {b.status}
                                  </span>
                                </div>
                                <h3 className="font-bold text-base mt-1 truncate">
                                  <Link
                                    to="/space/$id"
                                    params={{ id: b.spaceId }}
                                    className="hover:text-primary transition-colors"
                                  >
                                    {b.spaceTitle}
                                  </Link>
                                </h3>
                                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                  <MapPin className="h-3 w-3" /> {b.spaceCity} ·{" "}
                                  <Calendar className="h-3 w-3 ml-1" /> {b.date} · {b.startTime} ({b.hours}h)
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-wrap md:flex-col items-end gap-2 shrink-0 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-border">
                              <div>
                                <span className="text-lg font-extrabold gradient-text">
                                  {formatCurrency(b.total)}
                                </span>
                                <span className="text-xs text-muted-foreground ml-1">
                                  ({b.paymentStatus})
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5 mt-1">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="rounded-xl text-xs h-8"
                                  onClick={() => setSelectedBooking(b)}
                                >
                                  Details
                                </Button>

                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="rounded-xl text-xs h-8"
                                  onClick={() => setContactBookingTarget(b)}
                                >
                                  Contact Host
                                </Button>

                                {(b.status === "pending" || b.status === "upcoming" || b.status === "confirmed") && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="rounded-xl text-xs h-8 text-destructive hover:bg-destructive/10"
                                    onClick={() => setCancelBookingTarget(b)}
                                  >
                                    Cancel
                                  </Button>
                                )}

                                {b.status === "completed" && !b.reviewed && (
                                  <Button
                                    size="sm"
                                    className="rounded-xl text-xs h-8 gradient-primary text-white shadow-sm"
                                    onClick={() => {
                                      setReviewBookingTarget(b);
                                      setReviewRating(5);
                                    }}
                                  >
                                    <Star className="h-3.5 w-3.5 mr-1 fill-white" /> Review
                                  </Button>
                                )}

                                {b.status === "completed" && b.reviewed && (
                                  <span className="text-[11px] text-success font-medium flex items-center gap-1">
                                    <CheckCircle2 className="h-3.5 w-3.5" /> Reviewed
                                  </span>
                                )}

                                <Link to="/space/$id" params={{ id: b.spaceId }}>
                                  <Button variant="ghost" size="sm" className="rounded-xl text-xs h-8">
                                    Book Again
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </TabsContent>
              ))}

              {/* Wishlist Tab Content */}
              <TabsContent value="wishlist" className="mt-6">
                {savedSpaces.length === 0 ? (
                  <div className="rounded-3xl bg-card border border-border p-12 text-center shadow-soft">
                    <Heart className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <h4 className="font-semibold text-base">Your wishlist is empty</h4>
                    <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                      Click the heart icon on any space card or detail page to save it for later.
                    </p>
                    <Link to="/browse">
                      <Button className="mt-4 gradient-primary text-white rounded-xl text-xs shadow-elegant">
                        Explore Spaces
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedSpaces.map((s, idx) => (
                      <SpaceCard key={s.id} space={s} index={idx} />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Activity Chart Section */}
          <div className="mt-12 rounded-3xl bg-card border border-border p-6 md:p-8 shadow-soft">
            <h3 className="font-bold text-lg">Booking & Activity Trend</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Monthly utilization overview across your platform account.
            </p>
            <div className="mt-6 h-64">
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
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="bookings"
                    stroke="var(--color-primary)"
                    strokeWidth={2}
                    fill="url(#g1)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Booking Details Dialog */}
        <Dialog open={!!selectedBooking} onOpenChange={(open) => !open && setSelectedBooking(null)}>
          <DialogContent className="sm:max-w-md">
            {selectedBooking && (
              <>
                <DialogHeader>
                  <DialogTitle>Booking Details #{selectedBooking.id}</DialogTitle>
                  <DialogDescription>
                    Complete reservation breakdown and host details.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 text-sm mt-2">
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-secondary/50 border border-border">
                    <img
                      src={selectedBooking.spaceImage}
                      alt=""
                      className="h-14 w-14 rounded-xl object-cover"
                    />
                    <div>
                      <div className="font-bold">{selectedBooking.spaceTitle}</div>
                      <div className="text-xs text-muted-foreground">{selectedBooking.spaceCity}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs bg-secondary/30 p-3 rounded-2xl border border-border">
                    <div>
                      <span className="text-muted-foreground">Date:</span>
                      <p className="font-semibold mt-0.5">{selectedBooking.date}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Time Slot:</span>
                      <p className="font-semibold mt-0.5">{selectedBooking.startTime}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Duration:</span>
                      <p className="font-semibold mt-0.5">{selectedBooking.hours} Hours</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Guests:</span>
                      <p className="font-semibold mt-0.5">{selectedBooking.guests} People</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Status:</span>
                      <p className="font-semibold capitalize mt-0.5">{selectedBooking.status}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Host:</span>
                      <p className="font-semibold mt-0.5">{selectedBooking.hostName}</p>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-border text-xs">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Space Rental Subtotal</span>
                      <span>{formatCurrency(selectedBooking.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Platform Service Fee</span>
                      <span>{formatCurrency(selectedBooking.platformFee)}</span>
                    </div>
                    {selectedBooking.discount > 0 && (
                      <div className="flex justify-between text-success">
                        <span>Coupon Discount ({selectedBooking.couponCode})</span>
                        <span>-{formatCurrency(selectedBooking.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-sm pt-1 border-t border-border/80">
                      <span>Total Paid</span>
                      <span className="gradient-text">{formatCurrency(selectedBooking.total)}</span>
                    </div>
                  </div>
                </div>

                <DialogFooter className="mt-4">
                  <Button
                    variant="outline"
                    className="w-full rounded-xl"
                    onClick={() => setSelectedBooking(null)}
                  >
                    Close
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Cancellation Confirmation Dialog */}
        <Dialog open={!!cancelBookingTarget} onOpenChange={(open) => !open && setCancelBookingTarget(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-destructive flex items-center gap-2">
                <AlertCircle className="h-5 w-5" /> Cancel Reservation?
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel your booking for {cancelBookingTarget?.spaceTitle}?
                Free cancellation applies up to 24h prior.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 mt-2">
              <Label htmlFor="cancel-reason">Reason for cancellation (Optional)</Label>
              <Textarea
                id="cancel-reason"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g. Change of event schedule, relocated meeting"
                className="rounded-xl min-h-20"
              />
            </div>

            <DialogFooter className="mt-4 gap-2">
              <Button variant="outline" className="rounded-xl" onClick={() => setCancelBookingTarget(null)}>
                Keep Booking
              </Button>
              <Button variant="destructive" className="rounded-xl" onClick={handleConfirmCancel}>
                Confirm Cancellation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Contact Host Dialog */}
        <Dialog
          open={!!contactBookingTarget}
          onOpenChange={(open) => !open && setContactBookingTarget(null)}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Contact Host: {contactBookingTarget?.hostName}</DialogTitle>
              <DialogDescription>
                Ask questions regarding directions, equipment setup, or parking.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSendMessageToHost} className="space-y-4 mt-2">
              <div className="p-3 rounded-2xl bg-secondary/50 border border-border text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-medium">
                  <Phone className="h-3.5 w-3.5 text-primary" /> Host Phone: +91 98111 22334
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" /> Host Email: host@{contactBookingTarget?.hostName?.toLowerCase().replace(/\s+/g, "")}.demo
                </div>
              </div>

              <div>
                <Label htmlFor="host-msg">Your Message</Label>
                <Textarea
                  id="host-msg"
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Hi, what is the best gate for guest parking?"
                  className="rounded-xl min-h-24 mt-1"
                  required
                />
              </div>

              <DialogFooter>
                <Button type="submit" className="w-full gradient-primary text-white rounded-xl shadow-elegant">
                  Send Message
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Review Dialog */}
        <Dialog
          open={!!reviewBookingTarget}
          onOpenChange={(open) => !open && setReviewBookingTarget(null)}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Review {reviewBookingTarget?.spaceTitle}</DialogTitle>
              <DialogDescription>
                Share your experience to help future bookers and support the host.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmitReview} className="space-y-4 mt-2">
              <div>
                <Label>Rating</Label>
                <div className="flex items-center gap-2 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 hover:scale-125 transition-transform"
                    >
                      <Star
                        className={`h-7 w-7 ${
                          star <= reviewRating
                            ? "fill-warning text-warning"
                            : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="font-bold text-sm ml-2">{reviewRating} Stars</span>
                </div>
              </div>

              <div>
                <Label htmlFor="rev-text">Written Feedback</Label>
                <Textarea
                  id="rev-text"
                  value={reviewBody}
                  onChange={(e) => setReviewBody(e.target.value)}
                  placeholder="Was the space clean, easy to access, and well-equipped?"
                  className="rounded-xl min-h-24 mt-1"
                  required
                />
              </div>

              <DialogFooter>
                <Button
                  type="submit"
                  className="w-full gradient-primary text-white rounded-xl shadow-elegant"
                >
                  Post Review
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </SiteLayout>
    </ProtectedRoute>
  );
}
