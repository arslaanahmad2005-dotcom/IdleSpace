import { createFileRoute, Link, useNavigate, notFound } from "@tanstack/react-router";
import {
  Star,
  MapPin,
  Users,
  Wifi,
  Heart,
  Share2,
  Shield,
  Clock,
  Check,
  Calendar as CalIcon,
  AlertCircle,
  Flag,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  MessageSquare,
} from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { SpaceCard } from "@/components/space-card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { IdleSpaceStore, type SpaceListing, type Review } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { useState, useMemo } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useFavourites, useReviews, useBookings, useReports } from "@/hooks/use-idle-store";
import { toast } from "sonner";

export const Route = createFileRoute("/space/$id")({
  head: ({ params }) => {
    const s = IdleSpaceStore.getSpaceById(params.id);
    return {
      meta: [
        { title: s ? `${s.title} — IdleSpace` : "Space — IdleSpace" },
        { name: "description", content: s?.description ?? "Space details on IdleSpace." },
        { property: "og:title", content: s ? `${s.title} — IdleSpace` : "Space" },
        { property: "og:description", content: s?.description ?? "" },
        ...(s?.image
          ? [
              { property: "og:image" as const, content: s.image },
              { name: "twitter:image" as const, content: s.image },
            ]
          : []),
      ],
    };
  },
  loader: ({ params }) => {
    const space = IdleSpaceStore.getSpaceById(params.id);
    if (!space) throw notFound();
    return { spaceId: params.id };
  },
  component: SpaceDetail,
});

const TIME_SLOTS = [
  "08:00 AM",
  "10:00 AM",
  "12:00 PM",
  "02:00 PM",
  "04:00 PM",
  "06:00 PM",
  "08:00 PM",
];

function SpaceDetail() {
  const { id: spaceId } = Route.useParams();
  const space: SpaceListing = IdleSpaceStore.getSpaceById(spaceId) || IdleSpaceStore.getSpaces()[0];

  const { user } = useAuth();
  const { isFav, toggle } = useFavourites();
  const { reviews, addReview } = useReviews(space.id);
  const { allBookings, userBookings } = useBookings(user?.id);
  const { addReport } = useReports();
  const navigate = useNavigate();

  // Booking widget states
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1); // default tomorrow
    return d;
  });
  const [selectedSlot, setSelectedSlot] = useState("02:00 PM");
  const [durationHours, setDurationHours] = useState(space.minDuration || 2);
  const [guestCount, setGuestCount] = useState(Math.min(6, space.capacity || 10));

  // Gallery view state
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);

  // Review modal state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);

  // Report dialog
  const [reportReason, setReportReason] = useState("");
  const [reportDialogOpen, setReportDialogOpen] = useState(false);

  const images = useMemo(() => {
    return space.gallery && space.gallery.length > 0 ? space.gallery : [space.image];
  }, [space]);

  const saved = isFav(space.id);

  const handleToggleFav = () => {
    const active = toggle(space.id);
    if (active) toast.success("Added to your wishlist!");
    else toast.info("Removed from your wishlist.");
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Listing link copied to clipboard!");
    }
  };

  // Check if date is blocked by host
  const selectedDateStr = selectedDate ? selectedDate.toISOString().split("T")[0] : "";
  const isDateBlocked = useMemo(() => {
    if (!selectedDateStr || !space.blockedDates) return false;
    return space.blockedDates.includes(selectedDateStr);
  }, [selectedDateStr, space.blockedDates]);

  // Check if selected time slot has conflicting booking
  const hasTimeConflict = useMemo(() => {
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

  // Pricing calculation
  const safeHours = Math.max(1, durationHours);
  const subtotal = space.price * safeHours;
  const platformFee = Math.round(subtotal * 0.09);
  const totalAmount = subtotal + platformFee;

  // Check if user has an unreviewed completed booking for this space
  const completedBooking = useMemo(() => {
    return userBookings.find(
      (b) => b.spaceId === space.id && b.status === "completed" && !b.reviewed,
    );
  }, [userBookings, space.id]);

  const handleProceedBooking = () => {
    if (!selectedDate) {
      toast.error("Please pick a booking date.");
      return;
    }
    if (isDateBlocked) {
      toast.error("The space owner has marked this date as unavailable.");
      return;
    }
    if (hasTimeConflict) {
      toast.error("This time slot is already reserved. Please choose another slot.");
      return;
    }

    // Pass parameters via URL state or navigate to booking page
    navigate({
      to: "/booking/$id",
      params: { id: space.id },
      search: () => ({
        date: selectedDateStr,
        slot: selectedSlot,
        hours: safeHours,
        guests: guestCount,
      }),
    });
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      toast.error("Please write a few words about your experience.");
      return;
    }
    addReview({
      spaceId: space.id,
      bookingId: completedBooking?.id,
      userId: user?.id || "guest",
      author: user?.user_metadata?.full_name || "Verified Booker",
      avatar:
        user?.user_metadata?.avatar_url ||
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      rating: reviewRating,
      body: reviewComment.trim(),
    });

    toast.success("Thank you! Your review has been published.");
    setReviewDialogOpen(false);
    setReviewComment("");
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportReason.trim()) {
      toast.error("Please provide a reason for reporting.");
      return;
    }
    addReport(space.id, reportReason.trim(), user?.email || "Anonymous user");
    toast.success("Thank you. Our moderation team will review this listing.");
    setReportDialogOpen(false);
    setReportReason("");
  };

  const similarSpaces = useMemo(() => {
    return IdleSpaceStore.getSpaces()
      .filter((s) => s.id !== space.id && s.category === space.category)
      .slice(0, 3);
  }, [space]);

  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Title & Action Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase tracking-wider font-bold gradient-primary text-white px-2.5 py-0.5 rounded-full capitalize">
                {space.category}
              </span>
              <span className="text-xs text-muted-foreground">ID: #{space.id}</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-foreground">
              {space.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1 font-semibold text-foreground">
                <Star className="h-4 w-4 fill-warning text-warning" /> {space.rating}
                <span className="font-normal text-muted-foreground">({space.reviews} reviews)</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-primary" /> {space.address || space.city}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4 text-accent" /> Up to {space.capacity} guests
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="rounded-xl flex items-center gap-1.5"
            >
              <Share2 className="h-4 w-4" /> Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleFav}
              className={`rounded-xl flex items-center gap-1.5 transition-all ${
                saved ? "text-destructive border-destructive/40 bg-destructive/10" : ""
              }`}
            >
              <Heart className={`h-4 w-4 ${saved ? "fill-destructive" : ""}`} />
              {saved ? "Saved" : "Save"}
            </Button>
            <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-xl text-muted-foreground" title="Report listing">
                  <Flag className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Report listing</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleReportSubmit} className="space-y-4 mt-2">
                  <p className="text-sm text-muted-foreground">
                    Help us keep IdleSpace safe and accurate. Let us know if this listing has misleading photos, incorrect pricing, or policy violations.
                  </p>
                  <div>
                    <Label htmlFor="reason">Reason for report</Label>
                    <Textarea
                      id="reason"
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      placeholder="Describe what's wrong with this listing..."
                      className="mt-1.5 rounded-xl min-h-24"
                      required
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit" variant="destructive" className="rounded-xl w-full">
                      Submit Report
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="relative grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-3 rounded-3xl overflow-hidden h-[320px] md:h-[500px] shadow-soft">
          <div
            className="md:col-span-2 md:row-span-2 relative group cursor-pointer overflow-hidden"
            onClick={() => {
              setActiveImageIdx(0);
              setGalleryModalOpen(true);
            }}
          >
            <img
              src={images[0]}
              alt={space.title}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="glass px-3 py-1.5 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5">
                <Maximize2 className="h-3.5 w-3.5" /> View Photo
              </span>
            </div>
          </div>

          {[1, 2, 3, 4].map((i) => {
            const imgUrl = images[i % images.length];
            return (
              <div
                key={i}
                className="hidden md:block relative group cursor-pointer overflow-hidden"
                onClick={() => {
                  setActiveImageIdx(i % images.length);
                  setGalleryModalOpen(true);
                }}
              >
                <img
                  src={imgUrl}
                  alt=""
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="glass px-2.5 py-1 rounded-xl text-xs font-semibold text-white">
                    View
                  </span>
                </div>
              </div>
            );
          })}

          <button
            onClick={() => setGalleryModalOpen(true)}
            className="absolute bottom-4 right-4 glass-strong px-4 py-2 rounded-2xl text-xs font-semibold shadow-elegant hover:scale-105 transition-all flex items-center gap-2"
          >
            <Maximize2 className="h-4 w-4" /> View All Photos ({images.length})
          </button>
        </div>

        {/* Fullscreen Gallery Modal */}
        <Dialog open={galleryModalOpen} onOpenChange={setGalleryModalOpen}>
          <DialogContent className="max-w-4xl p-2 bg-card/95 backdrop-blur-xl border border-border">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/80 flex items-center justify-center">
              <img
                src={images[activeImageIdx]}
                alt=""
                className="max-h-full max-w-full object-contain"
              />
              <button
                onClick={() =>
                  setActiveImageIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1))
                }
                className="absolute left-3 p-2 rounded-full glass hover:scale-110 text-white"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={() =>
                  setActiveImageIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0))
                }
                className="absolute right-3 p-2 rounded-full glass hover:scale-110 text-white"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
            {/* Thumbnails row */}
            <div className="flex gap-2 p-2 overflow-x-auto">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`h-16 w-24 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                    activeImageIdx === idx ? "border-primary scale-105" : "border-transparent opacity-60"
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Space Body & Booking Widget Grid */}
        <div className="mt-10 grid lg:grid-cols-[minmax(0,1fr)_400px] gap-10 items-start">
          {/* Main Info Column */}
          <div className="space-y-8">
            {/* Host Section */}
            <div className="flex items-center gap-4 pb-6 border-b border-border">
              <img
                src={space.hostAvatar}
                alt={space.host}
                className="h-14 w-14 rounded-full object-cover ring-2 ring-primary/20"
              />
              <div>
                <h3 className="font-semibold text-lg">Hosted by {space.host}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Superhost · Identity verified · 99% Response rate
                </p>
              </div>
            </div>

            {/* Space Overview Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-secondary/50 border border-border">
                <div className="text-xs text-muted-foreground">Capacity</div>
                <div className="text-lg font-bold mt-1">{space.capacity} People</div>
              </div>
              <div className="p-4 rounded-2xl bg-secondary/50 border border-border">
                <div className="text-xs text-muted-foreground">Area Size</div>
                <div className="text-lg font-bold mt-1">{space.sizeSqFt || 450} sq ft</div>
              </div>
              <div className="p-4 rounded-2xl bg-secondary/50 border border-border">
                <div className="text-xs text-muted-foreground">Min Duration</div>
                <div className="text-lg font-bold mt-1">{space.minDuration || 1} Hour</div>
              </div>
              <div className="p-4 rounded-2xl bg-secondary/50 border border-border">
                <div className="text-xs text-muted-foreground">Cancellation</div>
                <div className="text-lg font-bold mt-1 capitalize">
                  {space.cancellationPolicy || "Flexible"}
                </div>
              </div>
            </div>

            {/* Description */}
            <section className="py-4 border-b border-border">
              <h2 className="text-xl font-bold tracking-tight mb-3">About this space</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-base">
                {space.description}
              </p>
            </section>

            {/* Amenities Grid */}
            <section className="py-4 border-b border-border">
              <h2 className="text-xl font-bold tracking-tight mb-4">Amenities & Features</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {space.amenities.map((a: string) => (
                  <div
                    key={a}
                    className="flex items-center gap-3 p-3.5 rounded-2xl bg-secondary/40 border border-border/70"
                  >
                    <div className="h-9 w-9 rounded-xl bg-card border border-border grid place-items-center text-primary shadow-sm shrink-0">
                      <Check className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium">{a}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Space Rules */}
            <section className="py-4 border-b border-border">
              <h2 className="text-xl font-bold tracking-tight mb-3">Space Rules & Guidelines</h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {(space.rules && space.rules.length > 0
                  ? space.rules
                  : [
                      "No smoking or vaping on premises",
                      "Ensure venue is left clean and in original condition",
                      "Noise curfews must be strictly adhered to",
                    ]
                ).map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Reviews Section */}
            <section className="py-4">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                    <Star className="h-5 w-5 fill-warning text-warning" />
                    <span>{space.rating}</span>
                    <span className="text-muted-foreground font-normal text-base">
                      · {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                    </span>
                  </h2>
                </div>

                {completedBooking && (
                  <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="gradient-primary text-white rounded-xl shadow-elegant">
                        <MessageSquare className="h-4 w-4 mr-2" /> Write a Review
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Leave a review for {space.title}</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleSubmitReview} className="space-y-4 mt-2">
                        <div>
                          <Label>Your Rating</Label>
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
                            <span className="ml-2 font-bold text-sm">{reviewRating} Stars</span>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="review-body">Your Feedback</Label>
                          <Textarea
                            id="review-body"
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            placeholder="Share how the space worked for your booking..."
                            className="mt-1.5 rounded-xl min-h-28"
                            required
                          />
                        </div>

                        <DialogFooter>
                          <Button
                            type="submit"
                            className="w-full gradient-primary text-white rounded-xl shadow-elegant"
                          >
                            Submit Review
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                )}
              </div>

              {reviews.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No written reviews yet. Be the first to book and review!
                </p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {reviews.map((r: Review) => (
                    <div
                      key={r.id}
                      className="p-5 rounded-2xl bg-card border border-border shadow-soft flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <img
                            src={r.avatar}
                            alt=""
                            className="h-10 w-10 rounded-full object-cover ring-1 ring-border"
                          />
                          <div>
                            <div className="font-semibold text-sm">{r.author}</div>
                            <div className="text-xs text-muted-foreground">{r.date}</div>
                          </div>
                          <div className="ml-auto flex items-center gap-0.5 text-xs font-semibold">
                            <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                            <span>{r.rating}.0</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{r.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sticky Booking Widget */}
          <aside className="lg:sticky lg:top-24 w-full">
            <div className="rounded-3xl bg-card border border-border p-6 shadow-elegant space-y-6">
              {/* Price header */}
              <div className="flex items-baseline justify-between border-b border-border pb-4">
                <div>
                  <span className="text-3xl font-extrabold gradient-text">
                    {formatCurrency(space.price)}
                  </span>
                  <span className="text-sm text-muted-foreground font-medium"> / hour</span>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm font-semibold">
                    <Star className="h-4 w-4 fill-warning text-warning" />
                    <span>{space.rating}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{space.reviews} reviews</span>
                </div>
              </div>

              {/* Date selection */}
              <div>
                <Label className="flex items-center gap-1.5 text-xs font-semibold uppercase text-muted-foreground mb-2">
                  <CalIcon className="h-3.5 w-3.5" /> 1. Select Date
                </Label>
                <div className="border border-border rounded-2xl overflow-hidden p-1 bg-secondary/30">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    className="w-full flex justify-center"
                  />
                </div>
                {isDateBlocked && (
                  <div className="mt-2 text-xs text-destructive flex items-center gap-1.5 p-2 rounded-xl bg-destructive/10">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>Host has marked this date as blocked / unavailable.</span>
                  </div>
                )}
              </div>

              {/* Time slot selection */}
              <div>
                <Label className="flex items-center gap-1.5 text-xs font-semibold uppercase text-muted-foreground mb-2">
                  <Clock className="h-3.5 w-3.5" /> 2. Start Time Slot
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {TIME_SLOTS.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedSlot(t)}
                      className={`py-2 text-xs rounded-xl font-medium border transition-all ${
                        selectedSlot === t
                          ? "gradient-primary text-white border-transparent shadow-sm"
                          : "border-border hover:bg-secondary text-foreground"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                {hasTimeConflict && (
                  <div className="mt-2 text-xs text-warning flex items-center gap-1.5 p-2 rounded-xl bg-warning/10">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>Slot already booked on this date. Choose another time.</span>
                  </div>
                )}
              </div>

              {/* Hours Duration & Guests */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-semibold text-muted-foreground">Duration (Hours)</Label>
                  <div className="mt-1.5 flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-9 w-9 rounded-xl"
                      onClick={() => setDurationHours((h) => Math.max(space.minDuration || 1, h - 1))}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center font-bold text-sm">{safeHours}h</span>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-9 w-9 rounded-xl"
                      onClick={() => setDurationHours((h) => Math.min(space.maxDuration || 12, h + 1))}
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-semibold text-muted-foreground">Guests Count</Label>
                  <div className="mt-1.5 flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-9 w-9 rounded-xl"
                      onClick={() => setGuestCount((g) => Math.max(1, g - 1))}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center font-bold text-sm">{guestCount}</span>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-9 w-9 rounded-xl"
                      onClick={() => setGuestCount((g) => Math.min(space.capacity, g + 1))}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>

              {/* Price Calculation breakdown */}
              <div className="space-y-2 pt-3 border-t border-border text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>
                    {formatCurrency(space.price)} × {safeHours} hrs
                  </span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Platform fee (9%)</span>
                  <span>{formatCurrency(platformFee)}</span>
                </div>
                <div className="flex justify-between font-bold text-base pt-2 border-t border-border/60">
                  <span>Total Amount</span>
                  <span className="gradient-text">{formatCurrency(totalAmount)}</span>
                </div>
              </div>

              {/* Book Button */}
              <Button
                onClick={handleProceedBooking}
                disabled={isDateBlocked || hasTimeConflict}
                className="w-full h-12 gradient-primary text-white shadow-elegant rounded-2xl font-bold text-base hover:opacity-95"
              >
                Book Now ({formatCurrency(totalAmount)})
              </Button>

              <div className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-success" />
                <span>Simulated payment · Instant confirmation available</span>
              </div>
            </div>
          </aside>
        </div>

        {/* Similar Spaces Carousel */}
        {similarSpaces.length > 0 && (
          <section className="mt-20 pt-10 border-t border-border">
            <h2 className="text-2xl font-bold tracking-tight mb-6">Similar Spaces You May Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarSpaces.map((s, idx) => (
                <SpaceCard key={s.id} space={s} index={idx} />
              ))}
            </div>
          </section>
        )}
      </div>
    </SiteLayout>
  );
}
