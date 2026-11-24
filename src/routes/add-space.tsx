import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ImagePlus,
  MapPin,
  Trash2,
  Sparkles,
  Building2,
  Users,
  IndianRupee,
  Clock,
  ShieldAlert,
  ArrowRight,
  Star,
} from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { ProtectedRoute } from "@/components/protected-route";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORIES } from "@/lib/dummy-data";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useSpaces } from "@/hooks/use-idle-store";
import { toast } from "sonner";

export const Route = createFileRoute("/add-space")({
  head: () => ({
    meta: [
      { title: "List your space — IdleSpace" },
      {
        name: "description",
        content: "Turn idle hours into income. List your business space in minutes.",
      },
      { property: "og:title", content: "List your space — IdleSpace" },
      { property: "og:description", content: "Earn from your unused space." },
    ],
  }),
  component: AddSpace,
});

const steps = [
  "Basics",
  "Capacity & Facilities",
  "Photos",
  "Pricing",
  "Availability",
  "Rules",
  "Review & Publish",
];

const DEFAULT_SAMPLE_IMAGES = [
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
];

const ALL_AMENITIES = [
  "Wi-Fi",
  "AC",
  "Parking",
  "Projector",
  "Sound system",
  "Kitchen",
  "Commercial Oven",
  "Whiteboard",
  "TV",
  "Coffee",
  "Bar",
  "Loading dock",
  "Stage",
  "AV System",
];

function AddSpace() {
  const { user } = useAuth();
  const { addSpace } = useSpaces();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);

  // Step 1: Basics
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("studio");
  const [description, setDescription] = useState("");
  const [spaceType, setSpaceType] = useState("Commercial Studio");
  const [city, setCity] = useState("Mumbai, Maharashtra");
  const [area, setArea] = useState("Bandra West");
  const [address, setAddress] = useState("Hill Road, Near Bandra Station, Mumbai");

  // Step 2: Capacity & Facilities
  const [capacity, setCapacity] = useState(20);
  const [sizeSqFt, setSizeSqFt] = useState(600);
  const [suitableFor, setSuitableFor] = useState("Photoshoots, workshops, executive offsites");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    "Wi-Fi",
    "AC",
    "Parking",
    "Whiteboard",
  ]);

  // Step 3: Photos
  const [images, setImages] = useState<string[]>(DEFAULT_SAMPLE_IMAGES);
  const [newImageUrl, setNewImageUrl] = useState("");

  // Step 4: Pricing
  const [hourlyPrice, setHourlyPrice] = useState(5500);
  const [dailyPrice, setDailyPrice] = useState(35000);
  const [minHours, setMinHours] = useState(2);
  const [maxHours, setMaxHours] = useState(12);

  // Step 5: Availability
  const [openTime, setOpenTime] = useState("08:00");
  const [closeTime, setCloseTime] = useState("22:00");
  const [selectedDays, setSelectedDays] = useState<string[]>([
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
  ]);

  // Step 6: Rules
  const [cancellationPolicy, setCancellationPolicy] = useState<"flexible" | "moderate" | "strict">(
    "flexible",
  );
  const [rules, setRules] = useState<string[]>([
    "No smoking or open flames indoors",
    "Return furniture to original setup before departure",
    "Respect noise curfews after 10:00 PM",
  ]);
  const [newRule, setNewRule] = useState("");

  const toggleAmenity = (a: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a],
    );
  };

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const handleAddImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl.trim()) return;
    setImages((prev) => [...prev, newImageUrl.trim()]);
    setNewImageUrl("");
    toast.success("Photo added to gallery.");
  };

  const handleRemoveImage = (index: number) => {
    if (images.length <= 1) {
      toast.error("Please keep at least 1 image.");
      return;
    }
    setImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRule.trim()) return;
    setRules((prev) => [...prev, newRule.trim()]);
    setNewRule("");
  };

  const handleRemoveRule = (index: number) => {
    setRules((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleNext = () => {
    if (step === 0) {
      if (!title.trim()) {
        toast.error("Please enter a space title.");
        return;
      }
      if (!description.trim()) {
        toast.error("Please enter a space description.");
        return;
      }
      if (!city.trim()) {
        toast.error("Please specify a city.");
        return;
      }
    }
    if (step === 3) {
      if (hourlyPrice <= 0) {
        toast.error("Please specify a valid hourly price.");
        return;
      }
    }
    setStep((s) => Math.min(steps.length - 1, s + 1));
  };

  const handlePublish = () => {
    const newSpace = addSpace({
      title: title.trim(),
      category,
      city: city.trim(),
      area: area.trim(),
      address: address.trim(),
      price: hourlyPrice,
      dailyPrice,
      host: user?.user_metadata?.full_name || "Elena Ross",
      hostId: user?.id || "usr_host_demo",
      hostAvatar:
        user?.user_metadata?.avatar_url ||
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
      image: images[0] || DEFAULT_SAMPLE_IMAGES[0],
      gallery: images,
      amenities: selectedAmenities,
      capacity,
      sizeSqFt,
      description: description.trim(),
      rules,
      cancellationPolicy,
      minDuration: minHours,
      maxDuration: maxHours,
      operatingHours: {
        open: openTime,
        close: closeTime,
        days: selectedDays,
      },
      status: "active",
      blockedDates: [],
    });

    toast.success(`"${newSpace.title}" is now published and live on IdleSpace!`);
    navigate({ to: "/space/$id", params: { id: newSpace.id } });
  };

  return (
    <ProtectedRoute>
      <SiteLayout>
        <div className="mx-auto max-w-4xl px-4 py-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase tracking-wider font-bold gradient-primary text-white px-2.5 py-0.5 rounded-full">
                Listing Creator
              </span>
              <span className="text-xs text-muted-foreground">Step {step + 1} of 7</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">List Your Space</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Takes just a few minutes. Turn underutilized hours into steady earnings.
            </p>
          </div>

          {/* Stepper Progress Bar */}
          <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {steps.map((s, i) => (
              <div key={s} className="flex-1 min-w-20 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => i < step && setStep(i)}
                  disabled={i > step}
                  className={`h-8 w-8 rounded-full grid place-items-center text-xs font-semibold shrink-0 transition-all ${
                    i <= step
                      ? "gradient-primary text-white shadow-sm"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {i < step ? <Check className="h-4 w-4" /> : i + 1}
                </button>
                <span className="text-xs font-medium truncate hidden md:inline text-foreground">
                  {s}
                </span>
                {i < steps.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 rounded transition-colors ${
                      i < step ? "gradient-primary" : "bg-secondary"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Form Step Body */}
          <div className="mt-6 rounded-3xl bg-card border border-border p-6 md:p-8 min-h-[460px] shadow-soft">
            {/* Step 1: Basics */}
            {step === 0 && (
              <div className="space-y-5 animate-fade-up">
                <h3 className="font-bold text-lg">Step 1 — Basic Information</h3>
                <div>
                  <Label htmlFor="sp-title">Space Title</Label>
                  <Input
                    id="sp-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Skyline Rooftop Studio & Sun Deck"
                    className="mt-1.5 rounded-xl h-11"
                    required
                  />
                </div>

                <div>
                  <Label>Category</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {CATEGORIES.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setCategory(c.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                          category === c.id
                            ? "gradient-primary text-white border-transparent shadow-sm"
                            : "border-border hover:bg-secondary text-foreground"
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="sp-desc">Description</Label>
                  <Textarea
                    id="sp-desc"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what makes this space unique, natural lighting, audio acoustics, or special appliances..."
                    className="mt-1.5 rounded-xl min-h-28"
                    required
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sp-city">City, State</Label>
                    <Input
                      id="sp-city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Mumbai, Maharashtra"
                      className="mt-1.5 rounded-xl"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="sp-area">Neighborhood / Area</Label>
                    <Input
                      id="sp-area"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      placeholder="e.g. Bandra West / Indiranagar"
                      className="mt-1.5 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="sp-addr">Approximate Street Address / Landmark</Label>
                  <Input
                    id="sp-addr"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. 14th Road, Opposite City Park"
                    className="mt-1.5 rounded-xl"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Capacity & Facilities */}
            {step === 1 && (
              <div className="space-y-5 animate-fade-up">
                <h3 className="font-bold text-lg">Step 2 — Capacity & Facilities</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sp-cap">Maximum Guest Capacity</Label>
                    <Input
                      id="sp-cap"
                      type="number"
                      value={capacity}
                      onChange={(e) => setCapacity(Number(e.target.value))}
                      className="mt-1.5 rounded-xl"
                      min={1}
                      max={500}
                    />
                  </div>
                  <div>
                    <Label htmlFor="sp-size">Approx Floor Size (Sq Ft)</Label>
                    <Input
                      id="sp-size"
                      type="number"
                      value={sizeSqFt}
                      onChange={(e) => setSizeSqFt(Number(e.target.value))}
                      className="mt-1.5 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="sp-suit">Suitable Activities</Label>
                  <Input
                    id="sp-suit"
                    value={suitableFor}
                    onChange={(e) => setSuitableFor(e.target.value)}
                    placeholder="e.g. Photography, culinary classes, offsite brainstorming"
                    className="mt-1.5 rounded-xl"
                  />
                </div>

                <div>
                  <Label className="block mb-2">Available Amenities & Equipment</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {ALL_AMENITIES.map((a) => {
                      const checked = selectedAmenities.includes(a);
                      return (
                        <label
                          key={a}
                          className={`flex items-center gap-2.5 p-3 rounded-2xl border cursor-pointer transition-all ${
                            checked
                              ? "border-primary bg-primary/5 font-semibold text-primary"
                              : "border-border hover:bg-secondary text-foreground"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleAmenity(a)}
                            className="rounded border-border text-primary h-4 w-4"
                          />
                          <span className="text-xs">{a}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Photos */}
            {step === 2 && (
              <div className="space-y-5 animate-fade-up">
                <div>
                  <h3 className="font-bold text-lg">Step 3 — Space Photos</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Add high-resolution photos of your space. The first photo will be used as the main cover card.
                  </p>
                </div>

                {/* Add Image URL bar */}
                <div className="flex gap-2">
                  <Input
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Paste public image URL (e.g. https://images.unsplash.com/...)"
                    className="rounded-xl text-xs"
                  />
                  <Button
                    type="button"
                    onClick={handleAddImage}
                    variant="outline"
                    className="rounded-xl text-xs shrink-0"
                  >
                    <ImagePlus className="h-4 w-4 mr-1.5" /> Add Photo
                  </Button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-border shadow-sm"
                    >
                      <img src={img} alt="" className="h-full w-full object-cover" />
                      {idx === 0 && (
                        <span className="absolute top-2 left-2 gradient-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                          Cover
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-destructive transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Pricing */}
            {step === 3 && (
              <div className="space-y-5 animate-fade-up">
                <h3 className="font-bold text-lg">Step 4 — Hourly & Daily Pricing</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sp-price">Hourly Rate (₹)</Label>
                    <Input
                      id="sp-price"
                      type="number"
                      value={hourlyPrice}
                      onChange={(e) => setHourlyPrice(Number(e.target.value))}
                      className="mt-1.5 rounded-xl text-base font-bold"
                      min={100}
                      required
                    />
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Platform fee is paid by guests. You receive 100% of this subtotal.
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="sp-daily">Full Day Rate (Optional) (₹)</Label>
                    <Input
                      id="sp-daily"
                      type="number"
                      value={dailyPrice}
                      onChange={(e) => setDailyPrice(Number(e.target.value))}
                      className="mt-1.5 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sp-min">Minimum Duration (Hours)</Label>
                    <Input
                      id="sp-min"
                      type="number"
                      value={minHours}
                      onChange={(e) => setMinHours(Number(e.target.value))}
                      className="mt-1.5 rounded-xl"
                      min={1}
                    />
                  </div>
                  <div>
                    <Label htmlFor="sp-max">Maximum Duration (Hours)</Label>
                    <Input
                      id="sp-max"
                      type="number"
                      value={maxHours}
                      onChange={(e) => setMaxHours(Number(e.target.value))}
                      className="mt-1.5 rounded-xl"
                      max={24}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Availability */}
            {step === 4 && (
              <div className="space-y-5 animate-fade-up">
                <h3 className="font-bold text-lg">Step 5 — Operating Schedule</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sp-open">Earliest Opening Time</Label>
                    <Input
                      id="sp-open"
                      type="time"
                      value={openTime}
                      onChange={(e) => setOpenTime(e.target.value)}
                      className="mt-1.5 rounded-xl"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sp-close">Latest Closing Time</Label>
                    <Input
                      id="sp-close"
                      type="time"
                      value={closeTime}
                      onChange={(e) => setCloseTime(e.target.value)}
                      className="mt-1.5 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <Label className="block mb-2">Available Days of the Week</Label>
                  <div className="flex flex-wrap gap-2">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => {
                      const active = selectedDays.includes(d);
                      return (
                        <button
                          key={d}
                          type="button"
                          onClick={() => toggleDay(d)}
                          className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                            active
                              ? "gradient-primary text-white border-transparent shadow-sm"
                              : "border-border hover:bg-secondary text-muted-foreground"
                          }`}
                        >
                          {d}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Rules & Policies */}
            {step === 5 && (
              <div className="space-y-5 animate-fade-up">
                <h3 className="font-bold text-lg">Step 6 — House Rules & Policies</h3>
                <div>
                  <Label>Cancellation Policy</Label>
                  <div className="mt-2 grid grid-cols-3 gap-3">
                    {(["flexible", "moderate", "strict"] as const).map((policy) => (
                      <button
                        key={policy}
                        type="button"
                        onClick={() => setCancellationPolicy(policy)}
                        className={`p-3.5 rounded-2xl border text-left capitalize transition-all ${
                          cancellationPolicy === policy
                            ? "border-primary bg-primary/5 ring-1 ring-primary font-bold text-primary"
                            : "border-border hover:bg-secondary text-muted-foreground"
                        }`}
                      >
                        <div className="font-semibold text-sm">{policy}</div>
                        <div className="text-[11px] font-normal text-muted-foreground mt-0.5">
                          {policy === "flexible"
                            ? "Free cancel up to 24h"
                            : policy === "moderate"
                            ? "Free cancel up to 48h"
                            : "50% refund after 7d"}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Space Rules</Label>
                  <div className="space-y-2 mt-2">
                    {rules.map((r, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 border border-border text-xs"
                      >
                        <span>{r}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveRule(idx)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 mt-3">
                    <Input
                      value={newRule}
                      onChange={(e) => setNewRule(e.target.value)}
                      placeholder="Add another rule (e.g. No outside catering allowed)"
                      className="rounded-xl text-xs"
                    />
                    <Button
                      type="button"
                      onClick={handleAddRule}
                      variant="outline"
                      className="rounded-xl text-xs shrink-0"
                    >
                      Add Rule
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 7: Review & Publish */}
            {step === 6 && (
              <div className="space-y-6 animate-fade-up">
                <div>
                  <h3 className="font-bold text-lg">Step 7 — Review Your Listing</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Preview how your listing will appear to guests across IdleSpace.
                  </p>
                </div>

                <div className="grid md:grid-cols-[280px_minmax(0,1fr)] gap-6 p-5 rounded-3xl bg-secondary/40 border border-border">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden relative border border-border">
                    <img
                      src={images[0]}
                      alt={title}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute bottom-2 left-2 glass-strong text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
                      {category}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xl text-foreground">{title || "Untitled Space"}</h4>
                      <span className="font-bold text-lg gradient-text">
                        {formatCurrency(hourlyPrice)}/hr
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-primary" /> {address || city}
                    </p>

                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mt-2">
                      {description || "No description provided."}
                    </p>

                    <div className="pt-2 flex flex-wrap gap-1.5">
                      {selectedAmenities.map((a) => (
                        <span
                          key={a}
                          className="text-[11px] px-2.5 py-0.5 rounded-md bg-card border border-border text-foreground font-medium"
                        >
                          {a}
                        </span>
                      ))}
                    </div>

                    <div className="pt-2 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                      <div>Capacity: <b>{capacity} guests</b></div>
                      <div>Min: <b>{minHours}h</b></div>
                      <div>Policy: <b className="capitalize">{cancellationPolicy}</b></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Stepper Navigation Buttons */}
          <div className="mt-6 flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              disabled={step === 0}
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              className="rounded-xl"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>

            {step < steps.length - 1 ? (
              <Button
                type="button"
                onClick={handleNext}
                className="gradient-primary text-white shadow-elegant rounded-xl px-6"
              >
                Next Step <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handlePublish}
                className="gradient-primary text-white shadow-glow rounded-xl px-8 font-bold text-sm"
              >
                Publish Listing Now <Sparkles className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </SiteLayout>
    </ProtectedRoute>
  );
}
