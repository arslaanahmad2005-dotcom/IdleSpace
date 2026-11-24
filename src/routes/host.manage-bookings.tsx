import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { ProtectedRoute } from "@/components/protected-route";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
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
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useBookings } from "@/hooks/use-idle-store";
import type { Booking } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/host/manage-bookings")({
  head: () => ({
    meta: [
      { title: "Manage bookings — IdleSpace" },
      { name: "description", content: "Track incoming, upcoming and past bookings." },
      { property: "og:title", content: "Manage bookings — IdleSpace" },
      { property: "og:description", content: "Manage bookings." },
    ],
  }),
  component: ManageBookings,
});

function ManageBookings() {
  const { user } = useAuth();
  const { hostBookings, updateStatus } = useBookings(undefined, user?.id);

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  // Messaging guest modal
  const [msgTarget, setMsgTarget] = useState<Booking | null>(null);
  const [msgText, setMsgText] = useState("");

  const groups = useMemo(() => {
    return {
      all: hostBookings,
      pending: hostBookings.filter((b) => b.status === "pending"),
      upcoming: hostBookings.filter((b) => b.status === "upcoming" || b.status === "confirmed"),
      completed: hostBookings.filter((b) => b.status === "completed"),
      cancelled: hostBookings.filter((b) => b.status === "cancelled"),
      rejected: hostBookings.filter((b) => b.status === "rejected"),
    };
  }, [hostBookings]);

  const handleAccept = (booking: Booking) => {
    updateStatus(booking.id, "confirmed");
    toast.success(`Booking #${booking.id} confirmed! Guest has been notified.`);
    if (selectedBooking?.id === booking.id) {
      setSelectedBooking(null);
    }
  };

  const handleReject = (booking: Booking) => {
    updateStatus(booking.id, "rejected", "Host unavailable for requested slot");
    toast.info(`Booking #${booking.id} declined.`);
    if (selectedBooking?.id === booking.id) {
      setSelectedBooking(null);
    }
  };

  const handleMarkCompleted = (booking: Booking) => {
    updateStatus(booking.id, "completed");
    toast.success(`Booking #${booking.id} marked as completed.`);
    if (selectedBooking?.id === booking.id) {
      setSelectedBooking(null);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgText.trim()) return;
    toast.success(`Message dispatched to ${msgTarget?.userName}!`);
    setMsgTarget(null);
    setMsgText("");
  };

  return (
    <ProtectedRoute>
      <SiteLayout>
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs uppercase tracking-wider font-bold gradient-primary text-white px-2.5 py-0.5 rounded-full">
                  Host Bookings Hub
                </span>
                <span className="text-xs text-muted-foreground">{hostBookings.length} total</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Booking Reservations</h1>
              <p className="text-muted-foreground mt-1 text-sm">
                Approve pending requests, inspect customer details, and track completed visits.
              </p>
            </div>
          </div>

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mt-8">
            <TabsList className="rounded-2xl p-1 bg-secondary/80 border border-border flex flex-wrap">
              <TabsTrigger value="all" className="rounded-xl text-xs font-semibold">
                All ({groups.all.length})
              </TabsTrigger>
              <TabsTrigger value="pending" className="rounded-xl text-xs font-semibold text-warning">
                Pending ({groups.pending.length})
              </TabsTrigger>
              <TabsTrigger value="upcoming" className="rounded-xl text-xs font-semibold">
                Confirmed ({groups.upcoming.length})
              </TabsTrigger>
              <TabsTrigger value="completed" className="rounded-xl text-xs font-semibold">
                Completed ({groups.completed.length})
              </TabsTrigger>
              <TabsTrigger value="cancelled" className="rounded-xl text-xs font-semibold">
                Cancelled ({groups.cancelled.length})
              </TabsTrigger>
              <TabsTrigger value="rejected" className="rounded-xl text-xs font-semibold">
                Declined ({groups.rejected.length})
              </TabsTrigger>
            </TabsList>

            {(["all", "pending", "upcoming", "completed", "cancelled", "rejected"] as const).map((k) => (
              <TabsContent key={k} value={k} className="mt-6">
                <div className="space-y-3">
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
                        className="p-5 rounded-3xl bg-card border border-border hover-lift shadow-soft flex flex-col md:flex-row gap-5 items-start md:items-center justify-between transition-all"
                      >
                        <div className="flex gap-4 items-center min-w-0">
                          <img
                            src={b.spaceImage}
                            alt=""
                            className="h-16 w-16 md:h-20 md:w-20 rounded-2xl object-cover shrink-0 border border-border"
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
                            <h3 className="font-bold text-base mt-1 truncate">{b.spaceTitle}</h3>
                            <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-2 mt-1">
                              <span className="font-medium text-foreground">
                                Booker: {b.userName}
                              </span>
                              <span>·</span>
                              <span>
                                {b.date} · {b.startTime} ({b.hours}h)
                              </span>
                              <span>·</span>
                              <span>{b.guests} Guests</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap md:flex-col items-end gap-2.5 shrink-0 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-border">
                          <div>
                            <span className="text-lg font-bold gradient-text">
                              {formatCurrency(b.total)}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {b.status === "pending" && (
                              <>
                                <Button
                                  size="sm"
                                  className="h-8 rounded-xl text-xs gradient-primary text-white shadow-sm"
                                  onClick={() => handleAccept(b)}
                                >
                                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Accept
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 rounded-xl text-xs text-destructive hover:bg-destructive/10"
                                  onClick={() => handleReject(b)}
                                >
                                  <XCircle className="h-3.5 w-3.5 mr-1" /> Decline
                                </Button>
                              </>
                            )}

                            {(b.status === "confirmed" || b.status === "upcoming") && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 rounded-xl text-xs text-primary hover:bg-primary/10"
                                onClick={() => handleMarkCompleted(b)}
                              >
                                Mark Completed
                              </Button>
                            )}

                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 rounded-xl text-xs"
                              onClick={() => setSelectedBooking(b)}
                            >
                              Inspect Details
                            </Button>

                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 rounded-xl text-xs"
                              onClick={() => setMsgTarget(b)}
                            >
                              <MessageSquare className="h-3.5 w-3.5 mr-1" /> Message
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {groups[k].length === 0 && (
                    <div className="text-center py-16 text-muted-foreground text-sm rounded-3xl bg-card border border-border shadow-soft">
                      No {k} booking requests found.
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {/* Detailed Slide-Over Sheet */}
          <Sheet open={!!selectedBooking} onOpenChange={(o) => !o && setSelectedBooking(null)}>
            <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
              {selectedBooking && (
                <>
                  <SheetHeader>
                    <SheetTitle>Reservation #{selectedBooking.id}</SheetTitle>
                  </SheetHeader>
                  <img
                    src={selectedBooking.spaceImage}
                    alt=""
                    className="mt-4 h-48 w-full rounded-2xl object-cover border border-border"
                  />

                  <div className="mt-4 space-y-4">
                    <div>
                      <div className="text-xs text-muted-foreground uppercase font-semibold">
                        Space
                      </div>
                      <div className="font-bold text-lg">{selectedBooking.spaceTitle}</div>
                      <div className="text-xs text-muted-foreground">{selectedBooking.spaceCity}</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-secondary/50 border border-border text-xs space-y-2">
                      <div className="text-xs font-semibold text-foreground uppercase tracking-wider mb-1">
                        Booker Information
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Guest Name:</span>
                        <span className="font-semibold text-foreground">
                          {selectedBooking.userName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Email:</span>
                        <span className="font-semibold text-foreground">
                          {selectedBooking.userEmail}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Group Size:</span>
                        <span className="font-semibold text-foreground">
                          {selectedBooking.guests} People
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs bg-secondary/40 p-4 rounded-2xl border border-border">
                      <div>
                        <div className="text-muted-foreground">Date</div>
                        <div className="font-semibold text-sm mt-0.5">{selectedBooking.date}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Time Slot</div>
                        <div className="font-semibold text-sm mt-0.5">
                          {selectedBooking.startTime} ({selectedBooking.hours}h)
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Status</div>
                        <div className="font-semibold capitalize text-sm mt-0.5">
                          {selectedBooking.status}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Payout Due</div>
                        <div className="font-bold text-sm text-success mt-0.5">
                          {formatCurrency(selectedBooking.subtotal)}
                        </div>
                      </div>
                    </div>

                    {selectedBooking.cancellationReason && (
                      <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-xs">
                        <b>Cancellation note:</b> {selectedBooking.cancellationReason}
                      </div>
                    )}

                    {selectedBooking.status === "pending" && (
                      <div className="pt-4 flex gap-2">
                        <Button
                          onClick={() => handleAccept(selectedBooking)}
                          className="flex-1 gradient-primary text-white rounded-xl shadow-elegant"
                        >
                          Approve Request
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleReject(selectedBooking)}
                          className="flex-1 text-destructive hover:bg-destructive/10 rounded-xl"
                        >
                          Decline
                        </Button>
                      </div>
                    )}

                    {selectedBooking.status === "confirmed" && (
                      <div className="pt-4">
                        <Button
                          onClick={() => handleMarkCompleted(selectedBooking)}
                          className="w-full gradient-primary text-white rounded-xl shadow-elegant"
                        >
                          Mark as Completed
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </SheetContent>
          </Sheet>

          {/* Contact Guest Dialog */}
          <Dialog open={!!msgTarget} onOpenChange={(open) => !open && setMsgTarget(null)}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Message Guest: {msgTarget?.userName}</DialogTitle>
                <DialogDescription>
                  Send check-in instructions, door codes, or arrival details.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSendMessage} className="space-y-4 mt-2">
                <div className="p-3 rounded-2xl bg-secondary/50 border border-border text-xs space-y-1">
                  <div className="font-medium text-foreground">
                    Guest Email: {msgTarget?.userEmail}
                  </div>
                  <div className="text-muted-foreground">
                    Reservation: {msgTarget?.spaceTitle} on {msgTarget?.date}
                  </div>
                </div>

                <div>
                  <Label htmlFor="host-guest-msg">Message</Label>
                  <Textarea
                    id="host-guest-msg"
                    value={msgText}
                    onChange={(e) => setMsgText(e.target.value)}
                    placeholder="Hi! Looking forward to hosting you. Access code is #4820 at the front gate."
                    className="rounded-xl min-h-24 mt-1"
                    required
                  />
                </div>

                <DialogFooter>
                  <Button type="submit" className="w-full gradient-primary text-white rounded-xl shadow-elegant">
                    Send to Guest
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </SiteLayout>
    </ProtectedRoute>
  );
}
