import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Check, Download, MapPin, Share2, Calendar as CalIcon, ArrowRight, ShieldCheck, QrCode } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { ProtectedRoute } from "@/components/protected-route";
import { Button } from "@/components/ui/button";
import { IdleSpaceStore, type SpaceListing, type Booking } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/booking-confirmed/$id")({
  head: () => ({
    meta: [
      { title: "Booking confirmed — IdleSpace" },
      { name: "description", content: "Your IdleSpace booking is confirmed." },
      { property: "og:title", content: "Booking confirmed — IdleSpace" },
      { property: "og:description", content: "See you soon." },
    ],
  }),
  loader: ({ params }) => {
    const space = IdleSpaceStore.getSpaceById(params.id);
    if (!space) throw notFound();
    return { spaceId: params.id };
  },
  validateSearch: (search: Record<string, unknown>): {
    bookingId?: string;
  } => ({
    bookingId: (search.bookingId as string) || undefined,
  }),
  component: Confirmed,
});

function Confirmed() {
  const { id: spaceId } = Route.useParams();
  const { bookingId } = Route.useSearch();
  const space: SpaceListing = IdleSpaceStore.getSpaceById(spaceId) || IdleSpaceStore.getSpaces()[0];

  // Look up actual created booking
  const booking: Booking | undefined = bookingId
    ? IdleSpaceStore.getBookingById(bookingId)
    : IdleSpaceStore.getBookings().find((b) => b.spaceId === space.id);

  const displayBookingId = booking?.id || `IS-${Math.floor(1000 + Math.random() * 9000)}`;
  const displayDate = booking?.date || "Nov 26, 2026";
  const displayTime = booking ? `${booking.startTime} (${booking.hours} hrs)` : "2:00 PM – 6:00 PM";
  const displayGuests = booking?.guests || 4;
  const displayTotal = booking?.total || space.price * 2;

  const handleDownloadReceipt = () => {
    const receiptContent = `
==============================================
             IDLESPACE RECEIPT
==============================================
Booking Reference: ${displayBookingId}
Date of Issue:     ${new Date().toLocaleDateString()}
Status:            CONFIRMED (SIMULATED)

SPACE DETAILS:
Venue:             ${space.title}
Category:          ${space.category.toUpperCase()}
Location:          ${space.address || space.city}
Host:              ${space.host}

RESERVATION DETAILS:
Date:              ${displayDate}
Time Slot:         ${displayTime}
Party Size:        ${displayGuests} People

PAYMENT BREAKDOWN:
Space Rental:      ${formatCurrency(booking?.subtotal || space.price * 2)}
Platform Fee:      ${formatCurrency(booking?.platformFee || Math.round(space.price * 0.18))}
Discount:          -${formatCurrency(booking?.discount || 0)}
----------------------------------------------
TOTAL PAID:        ${formatCurrency(displayTotal)}
Payment Method:    ${booking?.paymentMethod?.toUpperCase() || "UPI SIMULATED"}
==============================================
Thank you for using IdleSpace!
Support: help@idlespace.demo
    `.trim();

    const blob = new Blob([receiptContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `IdleSpace-Receipt-${displayBookingId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Receipt downloaded successfully!");
  };

  const handleAddToCalendar = () => {
    // Generate an .ics calendar file
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//IdleSpace//Booking//EN
BEGIN:VEVENT
SUMMARY:IdleSpace Booking: ${space.title}
DESCRIPTION:Reservation at ${space.title} (${space.address || space.city}). Reference: ${displayBookingId}
LOCATION:${space.address || space.city}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `idlespace-${displayBookingId}.ics`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Event added to calendar download!");
  };

  const handleDirections = () => {
    toast.info(`Directions to ${space.address || space.city} opened!`);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Booking details link copied!");
  };

  return (
    <ProtectedRoute>
      <SiteLayout>
        <div className="mx-auto max-w-3xl px-4 py-12">
          {/* Animated check badge */}
          <div className="text-center animate-scale-in">
            <div className="mx-auto h-20 w-20 rounded-full gradient-primary grid place-items-center shadow-glow animate-float">
              <Check className="h-10 w-10 text-white" />
            </div>
            <h1 className="mt-6 text-3xl md:text-5xl font-bold tracking-tight">You're All Set!</h1>
            <p className="mt-2 text-muted-foreground">
              Your reservation request has been processed and saved to your dashboard.
            </p>
          </div>

          {/* Ticket Card */}
          <div className="mt-10 rounded-3xl bg-card border border-border overflow-hidden shadow-elegant animate-fade-up">
            <div className="p-6 md:p-8 grid md:grid-cols-[1fr_200px] gap-6 items-center">
              <div>
                <div className="text-xs font-bold text-primary tracking-wider uppercase">
                  BOOKING REFERENCE #{displayBookingId}
                </div>
                <h2 className="mt-1 text-2xl font-bold text-foreground">{space.title}</h2>
                <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary shrink-0" /> {space.address || space.city}
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4 text-sm bg-secondary/40 p-4 rounded-2xl border border-border/80">
                  <div>
                    <div className="text-xs text-muted-foreground">Date</div>
                    <div className="font-semibold text-foreground mt-0.5">{displayDate}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Time Slot</div>
                    <div className="font-semibold text-foreground mt-0.5">{displayTime}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Guests</div>
                    <div className="font-semibold text-foreground mt-0.5">{displayGuests} People</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Total Paid</div>
                    <div className="font-bold gradient-text mt-0.5">
                      {formatCurrency(displayTotal)}
                    </div>
                  </div>
                </div>
              </div>

              {/* QR Code simulation */}
              <div className="text-center p-4 bg-secondary/50 rounded-2xl border border-border flex flex-col items-center justify-center">
                <div className="h-32 w-32 bg-white rounded-xl p-2 shadow-inner grid place-items-center">
                  <QrCode className="h-28 w-28 text-slate-900" />
                </div>
                <p className="mt-2 text-center text-[11px] font-semibold text-muted-foreground">
                  Scan on arrival
                </p>
                <span className="text-[10px] text-success font-medium mt-0.5 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" /> Pass Active
                </span>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="border-t border-border p-4 flex flex-wrap gap-2.5 justify-center bg-secondary/40">
              <Button variant="outline" onClick={handleDownloadReceipt} className="rounded-xl text-xs">
                <Download className="h-4 w-4 mr-1.5" /> Download Receipt
              </Button>
              <Button variant="outline" onClick={handleAddToCalendar} className="rounded-xl text-xs">
                <CalIcon className="h-4 w-4 mr-1.5" /> Add to Calendar
              </Button>
              <Button variant="outline" onClick={handleDirections} className="rounded-xl text-xs">
                <MapPin className="h-4 w-4 mr-1.5" /> Get Directions
              </Button>
              <Button variant="outline" onClick={handleShare} className="rounded-xl text-xs">
                <Share2 className="h-4 w-4 mr-1.5" /> Share
              </Button>
            </div>
          </div>

          {/* Links */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/dashboard">
              <Button className="gradient-primary text-white shadow-elegant rounded-xl px-6">
                Go to Booker Dashboard <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link to="/browse">
              <Button variant="ghost" className="rounded-xl">
                Browse More Spaces
              </Button>
            </Link>
          </div>
        </div>
      </SiteLayout>
    </ProtectedRoute>
  );
}
