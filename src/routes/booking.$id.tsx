import { createFileRoute, Link, useNavigate, notFound } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  ArrowRight,
  Ticket,
  Users,
  Calendar as CalIcon,
  Clock,
  ShieldCheck,
  CreditCard,
  QrCode,
  Building,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  MapPin,
} from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { ProtectedRoute } from "@/components/protected-route";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { IdleSpaceStore, type SpaceListing } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useBookings } from "@/hooks/use-idle-store";
import { toast } from "sonner";

export const Route = createFileRoute("/booking/$id")({
  head: () => ({
    meta: [
      { title: "Complete your booking — IdleSpace" },
      { name: "description", content: "Complete your booking on IdleSpace." },
      { property: "og:title", content: "Complete your booking — IdleSpace" },
      { property: "og:description", content: "Review details and proceed to payment." },
    ],
  }),
  loader: ({ params }) => {
    const space = IdleSpaceStore.getSpaceById(params.id);
    if (!space) throw notFound();
    return { spaceId: params.id };
  },
  validateSearch: (search: Record<string, unknown>): {
    date?: string;
    slot?: string;
    hours?: number;
    guests?: number;
  } => ({
    date: (search.date as string) || undefined,
    slot: (search.slot as string) || undefined,
    hours: search.hours ? Number(search.hours) : undefined,
    guests: search.guests ? Number(search.guests) : undefined,
  }),
  component: BookingPage,
});

function BookingPage() {
  const { id: spaceId } = Route.useParams();
  const searchParams = Route.useSearch();
  const space: SpaceListing = IdleSpaceStore.getSpaceById(spaceId) || IdleSpaceStore.getSpaces()[0];

  const { user } = useAuth();
  const { createBooking, allBookings } = useBookings();
  const navigate = useNavigate();

  // Booking details state initialized from URL params if available
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(() => {
    if (searchParams.date) {
      const parsed = new Date(searchParams.date);
      if (!isNaN(parsed.getTime())) return parsed;
    }
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  });

  const [selectedSlot, setSelectedSlot] = useState<string>(searchParams.slot || "02:00 PM");
  const [hours, setHours] = useState<number>(searchParams.hours || 2);
  const [guests, setGuests] = useState<number>(searchParams.guests || 4);
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  // Guest details form state
  const [guestName, setGuestName] = useState(user?.user_metadata?.full_name || "Ada Lovelace");
  const [guestEmail, setGuestEmail] = useState(user?.email || "ada@idlespace.demo");
  const [guestPhone, setGuestPhone] = useState(user?.user_metadata?.phone || "+91 98765 43210");
  const [guestNotes, setGuestNotes] = useState("");

  // Payment method selection
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "venue">("upi");
  const [upiId, setUpiId] = useState("idlespace@okaxis");
  const [cardNumber, setCardNumber] = useState("4532 •••• •••• 8821");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvv, setCardCvv] = useState("321");

  const [processing, setProcessing] = useState(false);

  // Calculations
  const safeHours = Math.max(space.minDuration || 1, Math.min(space.maxDuration || 12, hours));
  const safeGuests = Math.max(1, Math.min(space.capacity, guests));
  const subtotal = space.price * safeHours;
  const platformFee = Math.round(subtotal * 0.09);

  const discount =
    appliedCoupon === "WELCOME" || appliedCoupon === "IDLE10"
      ? Math.round(subtotal * 0.1)
      : appliedCoupon === "FLAT500"
      ? 500
      : 0;

  const total = Math.max(0, subtotal + platformFee - discount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = coupon.trim().toUpperCase();
    if (code === "WELCOME" || code === "IDLE10" || code === "FLAT500") {
      setAppliedCoupon(code);
      toast.success(`Coupon "${code}" applied!`);
    } else {
      toast.error("Invalid coupon code. Try WELCOME or IDLE10.");
    }
  };

  const selectedDateStr = selectedDate ? selectedDate.toISOString().split("T")[0] : "";

  // Check overlap validation
  const hasConflict = useMemo(() => {
    if (!selectedDateStr) return false;
    return allBookings.some(
      (b) =>
        b.spaceId === space.id &&
        b.date === selectedDateStr &&
        b.startTime === selectedSlot &&
        b.status !== "cancelled" &&
        b.status !== "rejected",
    );
  }, [allBookings, space.id, selectedDateStr, selectedSlot]);

  const isBlocked = useMemo(() => {
    if (!selectedDateStr || !space.blockedDates) return false;
    return space.blockedDates.includes(selectedDateStr);
  }, [selectedDateStr, space.blockedDates]);

  // Submit booking
  const handleConfirmReservation = async () => {
    if (!selectedDate) {
      toast.error("Please pick a reservation date.");
      return;
    }
    if (isBlocked) {
      toast.error("Selected date is blocked by the host.");
      return;
    }
    if (hasConflict) {
      toast.error("This slot is already booked. Please choose another time.");
      return;
    }
    if (!guestName.trim() || !guestEmail.trim()) {
      toast.error("Please provide your contact name and email.");
      return;
    }

    setProcessing(true);

    try {
      // Simulate realistic payment gateway processing
      await new Promise((res) => setTimeout(res, 1200));

      const endTimeCalculated = (() => {
        // Simple end time display
        return `${safeHours} hours after ${selectedSlot}`;
      })();

      const created = createBooking({
        spaceId: space.id,
        userId: user?.id || "usr_booker_demo",
        userName: guestName.trim(),
        userEmail: guestEmail.trim(),
        date: selectedDateStr,
        startTime: selectedSlot,
        endTime: endTimeCalculated,
        hours: safeHours,
        guests: safeGuests,
        hourlyPrice: space.price,
        subtotal,
        platformFee,
        discount,
        couponCode: appliedCoupon || undefined,
        total,
        paymentMethod,
      });

      setProcessing(false);
      toast.success("Reservation confirmed successfully!");
      navigate({
        to: "/booking-confirmed/$id",
        params: { id: space.id },
        search: () => ({ bookingId: created.id }),
      });
    } catch (err: unknown) {
      setProcessing(false);
      const msg = err instanceof Error ? err.message : "Booking failed. Please try again.";
      toast.error(msg);
    }
  };

  return (
    <ProtectedRoute>
      <SiteLayout>
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider mb-1">
              <Link to="/space/$id" params={{ id: space.id }} className="hover:text-primary">
                {space.title}
              </Link>
              <span>/</span>
              <span>Checkout</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Review & Reserve</h1>
            <p className="text-muted-foreground mt-1">
              Verify your reservation details, apply coupons, and complete simulated checkout.
            </p>
          </div>

          <div className="mt-8 grid lg:grid-cols-[minmax(0,1fr)_420px] gap-8 items-start">
            <div className="space-y-6">
              {/* Step 1: Date & Time Verification */}
              <section className="rounded-3xl bg-card border border-border p-6 shadow-soft space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <CalIcon className="h-4 w-4 text-primary" /> 1. Reservation Schedule
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">Pick Date</Label>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      className="rounded-2xl border border-border w-full flex justify-center bg-secondary/30"
                    />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">Start Time</Label>
                      <div className="grid grid-cols-2 gap-1.5">
                        {["08:00 AM", "10:00 AM", "12:00 PM", "02:00 PM", "04:00 PM", "06:00 PM"].map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setSelectedSlot(t)}
                            className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                              selectedSlot === t
                                ? "gradient-primary text-white border-transparent shadow-sm"
                                : "border-border hover:bg-secondary text-foreground"
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">Duration</Label>
                      <div className="flex items-center gap-3">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => setHours((h) => Math.max(space.minDuration || 1, h - 1))}
                        >
                          -
                        </Button>
                        <span className="w-12 text-center font-bold text-base">{safeHours} hrs</span>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => setHours((h) => Math.min(space.maxDuration || 12, h + 1))}
                        >
                          +
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">
                        Guests (Max: {space.capacity})
                      </Label>
                      <div className="flex items-center gap-3">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => setGuests((g) => Math.max(1, g - 1))}
                        >
                          -
                        </Button>
                        <span className="w-12 text-center font-bold text-base">{safeGuests}</span>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => setGuests((g) => Math.min(space.capacity, g + 1))}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {hasConflict && (
                  <div className="p-3 rounded-2xl bg-warning/10 text-warning text-xs flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span>This time slot has already been booked. Please pick a different slot.</span>
                  </div>
                )}
                {isBlocked && (
                  <div className="p-3 rounded-2xl bg-destructive/10 text-destructive text-xs flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span>Host has blocked this date for private maintenance.</span>
                  </div>
                )}
              </section>

              {/* Step 2: Booker Contact Information */}
              <section className="rounded-3xl bg-card border border-border p-6 shadow-soft space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Users className="h-4 w-4 text-accent" /> 2. Guest Information
                </h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="b-name">Full Name</Label>
                    <Input
                      id="b-name"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="mt-1.5 rounded-xl"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="b-phone">Phone Number</Label>
                    <Input
                      id="b-phone"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      className="mt-1.5 rounded-xl"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="b-email">Email Address</Label>
                  <Input
                    id="b-email"
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="mt-1.5 rounded-xl"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="b-notes">Purpose & Special Requests (Optional)</Label>
                  <Input
                    id="b-notes"
                    value={guestNotes}
                    onChange={(e) => setGuestNotes(e.target.value)}
                    placeholder="e.g. Photography team of 5, bringing 2 light stands"
                    className="mt-1.5 rounded-xl"
                  />
                </div>
              </section>

              {/* Step 3: Demo Payment Method */}
              <section className="rounded-3xl bg-card border border-border p-6 shadow-soft space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-emerald-500" /> 3. Payment Method
                  </h2>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold uppercase tracking-wider">
                    Simulated Sandbox
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-secondary/60 border border-border text-xs text-muted-foreground">
                  <p>
                    🔒 <b>Demo Mode:</b> No actual financial charges will occur. Select any demo option below to simulate the instant reservation flow.
                  </p>
                </div>

                <div className="grid sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("upi")}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      paymentMethod === "upi"
                        ? "border-primary bg-primary/5 ring-1 ring-primary shadow-sm"
                        : "border-border hover:bg-secondary"
                    }`}
                  >
                    <QrCode className="h-5 w-5 text-primary mb-2" />
                    <div className="font-semibold text-sm">UPI Demo</div>
                    <div className="text-[11px] text-muted-foreground">GPay / PhonePe / Paytm</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      paymentMethod === "card"
                        ? "border-primary bg-primary/5 ring-1 ring-primary shadow-sm"
                        : "border-border hover:bg-secondary"
                    }`}
                  >
                    <CreditCard className="h-5 w-5 text-primary mb-2" />
                    <div className="font-semibold text-sm">Card Demo</div>
                    <div className="text-[11px] text-muted-foreground">Credit / Debit card</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("venue")}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      paymentMethod === "venue"
                        ? "border-primary bg-primary/5 ring-1 ring-primary shadow-sm"
                        : "border-border hover:bg-secondary"
                    }`}
                  >
                    <Building className="h-5 w-5 text-primary mb-2" />
                    <div className="font-semibold text-sm">Pay at Venue</div>
                    <div className="text-[11px] text-muted-foreground">Cash / Direct Host</div>
                  </button>
                </div>

                {paymentMethod === "upi" && (
                  <div className="p-4 rounded-2xl bg-secondary/40 border border-border space-y-2 animate-fade-up">
                    <Label className="text-xs">Simulated UPI ID</Label>
                    <Input
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="username@upi"
                      className="rounded-xl bg-card"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      An instant simulated authorization request will be approved automatically.
                    </p>
                  </div>
                )}

                {paymentMethod === "card" && (
                  <div className="p-4 rounded-2xl bg-secondary/40 border border-border space-y-3 animate-fade-up">
                    <div>
                      <Label className="text-xs">Demo Card Number</Label>
                      <Input
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="rounded-xl bg-card font-mono text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Expiry</Label>
                        <Input
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="rounded-xl bg-card font-mono text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">CVV</Label>
                        <Input
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="rounded-xl bg-card font-mono text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </section>
            </div>

            {/* Price Summary Sticky Sidebar */}
            <aside className="lg:sticky lg:top-24 h-fit">
              <div className="rounded-3xl bg-card border border-border overflow-hidden shadow-elegant">
                <img src={space.image} alt={space.title} className="h-44 w-full object-cover" />
                <div className="p-6 space-y-5">
                  <div>
                    <h3 className="font-bold text-lg">{space.title}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" /> {space.city}
                    </p>
                  </div>

                  {/* Booking snippet */}
                  <div className="p-3 rounded-2xl bg-secondary/50 text-xs space-y-1.5 border border-border/70">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span className="font-semibold text-foreground">{selectedDateStr}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time Slot:</span>
                      <span className="font-semibold text-foreground">{selectedSlot}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-semibold text-foreground">{safeHours} Hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Party Size:</span>
                      <span className="font-semibold text-foreground">{safeGuests} People</span>
                    </div>
                  </div>

                  {/* Coupon section */}
                  <div>
                    <Label className="text-xs flex items-center gap-1.5 mb-1.5 font-medium">
                      <Ticket className="h-3.5 w-3.5 text-primary" /> Promo / Coupon Code
                    </Label>
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <Input
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                        placeholder="Try WELCOME or IDLE10"
                        className="rounded-xl text-xs uppercase font-mono"
                      />
                      <Button type="submit" variant="outline" className="rounded-xl text-xs">
                        Apply
                      </Button>
                    </form>
                    {discount > 0 && (
                      <p className="mt-1.5 text-xs text-success font-medium flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> {appliedCoupon} applied (-{formatCurrency(discount)})
                      </p>
                    )}
                  </div>

                  {/* Transparent itemized cost */}
                  <div className="border-t border-border pt-4 space-y-2 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>
                        Space Fee ({formatCurrency(space.price)} × {safeHours}h)
                      </span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Platform Service Fee (9%)</span>
                      <span>{formatCurrency(platformFee)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-success font-medium">
                        <span>Discount ({appliedCoupon})</span>
                        <span>-{formatCurrency(discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-base font-bold pt-2 border-t border-border/80">
                      <span>Total Amount</span>
                      <span className="gradient-text text-xl">{formatCurrency(total)}</span>
                    </div>
                  </div>

                  {/* Confirm Button */}
                  <Button
                    onClick={handleConfirmReservation}
                    disabled={processing || hasConflict || isBlocked}
                    className="w-full h-12 gradient-primary text-white shadow-elegant rounded-2xl font-bold text-sm hover:opacity-95"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" /> Processing Reservation…
                      </>
                    ) : (
                      <>
                        Pay & Confirm {formatCurrency(total)} <ArrowRight className="h-4 w-4 ml-1.5" />
                      </>
                    )}
                  </Button>

                  <div className="text-center text-[11px] text-muted-foreground flex items-center justify-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-success" />
                    <span>Free cancellation up to 24h prior to reservation.</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </SiteLayout>
    </ProtectedRoute>
  );
}
