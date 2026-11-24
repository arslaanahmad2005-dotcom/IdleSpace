import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  Grid3x3,
  List,
  Map as MapIcon,
  Star,
  MapPin,
  X,
  Users,
  RotateCcw,
  Sparkles,
  Check,
} from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { SpaceCard } from "@/components/space-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { CATEGORIES } from "@/lib/dummy-data";
import { formatCurrency } from "@/lib/utils";
import { useSpaces } from "@/hooks/use-idle-store";

export const Route = createFileRoute("/browse")({
  head: () => ({
    meta: [
      { title: "Browse spaces — IdleSpace" },
      {
        name: "description",
        content: "Browse thousands of hourly spaces across categories, cities, and price points.",
      },
      { property: "og:title", content: "Browse spaces — IdleSpace" },
      { property: "og:description", content: "Filter, compare and book hourly spaces." },
    ],
  }),
  component: BrowsePage,
});

type View = "grid" | "list" | "map";
type SortOption = "recommended" | "price_asc" | "price_desc" | "rating" | "popular";

const ALL_AMENITIES = [
  "Wi-Fi",
  "AC",
  "Parking",
  "Projector",
  "Whiteboard",
  "Kitchen",
  "Commercial Oven",
  "Sound System",
  "TV",
  "AV System",
  "Coffee",
  "Bar",
];

const CAPACITY_OPTIONS = [
  { label: "Any size", min: 0 },
  { label: "1 - 10 guests", min: 1, max: 10 },
  { label: "10 - 30 guests", min: 10, max: 30 },
  { label: "30 - 100 guests", min: 30, max: 100 },
  { label: "100+ guests", min: 100, max: 9999 },
];

function BrowsePage() {
  const { spaces } = useSpaces();

  const [view, setView] = useState<View>("grid");
  const [q, setQ] = useState("");
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([25000]);
  const [minRating, setMinRating] = useState<number>(0);
  const [capacityFilter, setCapacityFilter] = useState<number>(0);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("recommended");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Derive unique cities
  const cities = useMemo(() => {
    const set = new Set<string>();
    spaces.forEach((s) => {
      const city = s.city.split(",")[0]?.trim();
      if (city) set.add(city);
    });
    return Array.from(set);
  }, [spaces]);

  // Filter and sort logic
  const filteredSpaces = useMemo(() => {
    return spaces
      .filter((s) => {
        // Only show active spaces
        if (s.status === "inactive" || s.status === "flagged") return false;

        // Search text (title, city, description, category)
        if (q.trim()) {
          const query = q.toLowerCase();
          const matchTitle = s.title.toLowerCase().includes(query);
          const matchCity = s.city.toLowerCase().includes(query);
          const matchCat = s.category.toLowerCase().includes(query);
          const matchDesc = s.description.toLowerCase().includes(query);
          if (!matchTitle && !matchCity && !matchCat && !matchDesc) return false;
        }

        // City filter
        if (selectedCity !== "all") {
          if (!s.city.toLowerCase().includes(selectedCity.toLowerCase())) return false;
        }

        // Category filter
        if (selectedCats.length > 0 && !selectedCats.includes(s.category)) {
          return false;
        }

        // Price filter
        if (s.price > priceRange[0]) {
          return false;
        }

        // Rating filter
        if (s.rating < minRating) {
          return false;
        }

        // Capacity filter
        if (capacityFilter > 0) {
          const capOpt = CAPACITY_OPTIONS[capacityFilter];
          if (capOpt) {
            if (s.capacity < capOpt.min) return false;
            if (capOpt.max && s.capacity > capOpt.max) return false;
          }
        }

        // Amenities filter
        if (selectedAmenities.length > 0) {
          const hasAll = selectedAmenities.every((amenity) =>
            s.amenities.some((a) => a.toLowerCase().includes(amenity.toLowerCase())),
          );
          if (!hasAll) return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "price_asc":
            return a.price - b.price;
          case "price_desc":
            return b.price - a.price;
          case "rating":
            return b.rating - a.rating;
          case "popular":
            return (b.reviews || 0) - (a.reviews || 0);
          case "recommended":
          default:
            // Score based on rating and reviews
            return b.rating * Math.log10((b.reviews || 1) + 2) - a.rating * Math.log10((a.reviews || 1) + 2);
        }
      });
  }, [
    spaces,
    q,
    selectedCity,
    selectedCats,
    priceRange,
    minRating,
    capacityFilter,
    selectedAmenities,
    sortBy,
  ]);

  const toggleCat = (c: string) => {
    setSelectedCats((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity],
    );
  };

  const clearAllFilters = () => {
    setQ("");
    setSelectedCats([]);
    setPriceRange([25000]);
    setMinRating(0);
    setCapacityFilter(0);
    setSelectedAmenities([]);
    setSelectedCity("all");
    setSortBy("recommended");
  };

  const hasActiveFilters =
    q ||
    selectedCats.length > 0 ||
    priceRange[0] < 25000 ||
    minRating > 0 ||
    capacityFilter > 0 ||
    selectedAmenities.length > 0 ||
    selectedCity !== "all";

  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Header / Search Controls */}
        <div className="glass-strong rounded-3xl p-4 md:p-6 shadow-elegant">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            <div className="flex items-center gap-3 px-4 py-2.5 bg-secondary/80 rounded-2xl flex-1 border border-border">
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by city, space name, or keywords (e.g. rooftop, kitchen, studio)"
                className="bg-transparent outline-none w-full text-sm"
              />
              {q && (
                <button onClick={() => setQ("")} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* City Quick Dropdown */}
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-secondary/80 border border-border rounded-2xl px-4 py-2.5 text-sm outline-none text-foreground cursor-pointer"
            >
              <option value="all">All Cities</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-secondary/80 border border-border rounded-2xl px-4 py-2.5 text-sm outline-none text-foreground cursor-pointer font-medium"
            >
              <option value="recommended">Sort: Recommended</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="popular">Most Popular</option>
            </select>

            {/* View Toggles */}
            <div className="flex items-center gap-1 p-1 rounded-2xl bg-secondary border border-border shrink-0">
              {(["grid", "list", "map"] as const).map((v) => {
                const Icon = v === "grid" ? Grid3x3 : v === "list" ? List : MapIcon;
                return (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      view === v ? "bg-card text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span className="capitalize">{v}</span>
                  </button>
                );
              })}
            </div>

            {/* Mobile Filters Trigger */}
            <Button
              variant="outline"
              className="lg:hidden rounded-2xl flex items-center gap-2"
              onClick={() => setShowMobileFilters((v) => !v)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters {hasActiveFilters && `(Active)`}</span>
            </Button>
          </div>

          {/* Category Chips Bar */}
          <div className="mt-4 pt-4 border-t border-border flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedCats([])}
              className={`text-xs px-3.5 py-1.5 rounded-full font-medium whitespace-nowrap border transition-all ${
                selectedCats.length === 0
                  ? "gradient-primary text-white border-transparent shadow-sm"
                  : "border-border hover:bg-secondary text-muted-foreground"
              }`}
            >
              All Spaces
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => toggleCat(c.id)}
                className={`text-xs px-3.5 py-1.5 rounded-full font-medium whitespace-nowrap border transition-all ${
                  selectedCats.includes(c.id)
                    ? "gradient-primary text-white border-transparent shadow-sm"
                    : "border-border hover:bg-secondary text-foreground"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="mt-3 flex flex-wrap items-center gap-2 pt-3 border-t border-border/60">
              <span className="text-xs text-muted-foreground font-medium">Active filters:</span>

              {selectedCity !== "all" && (
                <Badge variant="secondary" className="gap-1 rounded-lg">
                  City: {selectedCity}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedCity("all")} />
                </Badge>
              )}

              {selectedCats.map((cat) => (
                <Badge key={cat} variant="secondary" className="gap-1 rounded-lg capitalize">
                  {cat}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => toggleCat(cat)} />
                </Badge>
              ))}

              {priceRange[0] < 25000 && (
                <Badge variant="secondary" className="gap-1 rounded-lg">
                  Up to {formatCurrency(priceRange[0])}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setPriceRange([25000])} />
                </Badge>
              )}

              {minRating > 0 && (
                <Badge variant="secondary" className="gap-1 rounded-lg">
                  {minRating}+ Stars
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setMinRating(0)} />
                </Badge>
              )}

              {capacityFilter > 0 && (
                <Badge variant="secondary" className="gap-1 rounded-lg">
                  {CAPACITY_OPTIONS[capacityFilter].label}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setCapacityFilter(0)} />
                </Badge>
              )}

              {selectedAmenities.map((a) => (
                <Badge key={a} variant="secondary" className="gap-1 rounded-lg">
                  {a}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => toggleAmenity(a)} />
                </Badge>
              ))}

              <button
                onClick={clearAllFilters}
                className="text-xs text-primary hover:underline font-semibold ml-2 flex items-center gap-1"
              >
                <RotateCcw className="h-3 w-3" /> Clear all
              </button>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="mt-8 grid lg:grid-cols-[290px_minmax(0,1fr)] gap-8">
          {/* Sidebar Filters */}
          <aside
            className={`rounded-3xl bg-card border border-border p-6 h-fit lg:sticky lg:top-24 space-y-6 shadow-soft ${
              showMobileFilters ? "block" : "hidden lg:block"
            }`}
          >
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-base">Filter Spaces</h3>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Max Hourly Budget */}
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-medium">Max Hourly Rate</span>
                <span className="font-bold text-primary">{formatCurrency(priceRange[0])}</span>
              </div>
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                max={25000}
                min={1000}
                step={500}
                className="my-3"
              />
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>{formatCurrency(1000)}</span>
                <span>{formatCurrency(25000)}+</span>
              </div>
            </div>

            {/* Capacity Filter */}
            <div>
              <p className="text-sm font-medium mb-2.5">Capacity</p>
              <div className="space-y-1.5">
                {CAPACITY_OPTIONS.map((opt, idx) => (
                  <button
                    key={opt.label}
                    onClick={() => setCapacityFilter(idx)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      capacityFilter === idx
                        ? "bg-primary/10 text-primary font-semibold"
                        : "hover:bg-secondary text-muted-foreground"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {capacityFilter === idx && <Check className="h-3.5 w-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Star Rating Filter */}
            <div>
              <p className="text-sm font-medium mb-2.5">Minimum Rating</p>
              <div className="grid grid-cols-4 gap-1.5">
                {[0, 4.0, 4.5, 4.8].map((r) => (
                  <button
                    key={r}
                    onClick={() => setMinRating(r)}
                    className={`py-1.5 text-xs rounded-xl border flex items-center justify-center gap-1 transition-all ${
                      minRating === r
                        ? "gradient-primary text-white border-transparent font-bold shadow-sm"
                        : "border-border hover:bg-secondary text-foreground"
                    }`}
                  >
                    {r === 0 ? "All" : `${r}★`}
                  </button>
                ))}
              </div>
            </div>

            {/* Amenities Checklist */}
            <div>
              <p className="text-sm font-medium mb-2.5">Facilities & Amenities</p>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {ALL_AMENITIES.map((amenity) => {
                  const checked = selectedAmenities.includes(amenity);
                  return (
                    <label
                      key={amenity}
                      className="flex items-center gap-2.5 text-xs text-foreground cursor-pointer hover:text-primary transition-colors p-1 rounded-lg hover:bg-secondary/40"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleAmenity(amenity)}
                        className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                      />
                      <span>{amenity}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Results Grid / List / Map */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                Showing <b className="text-foreground">{filteredSpaces.length}</b>{" "}
                {filteredSpaces.length === 1 ? "space" : "spaces"} available
              </p>
            </div>

            {filteredSpaces.length === 0 ? (
              <div className="rounded-3xl bg-card border border-border p-12 text-center shadow-soft">
                <div className="mx-auto h-16 w-16 rounded-full bg-secondary grid place-items-center mb-4">
                  <Search className="h-7 w-7 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold">No spaces match your criteria</h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                  Try widening your price range, clearing some amenity filters, or searching in a different city.
                </p>
                <Button onClick={clearAllFilters} className="mt-6 gradient-primary text-white rounded-xl shadow-elegant">
                  <RotateCcw className="h-4 w-4 mr-2" /> Reset all filters
                </Button>
              </div>
            ) : view === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSpaces.map((s, idx) => (
                  <SpaceCard key={s.id} space={s} index={idx} />
                ))}
              </div>
            ) : view === "list" ? (
              <div className="space-y-4">
                {filteredSpaces.map((s, idx) => (
                  <Link
                    key={s.id}
                    to="/space/$id"
                    params={{ id: s.id }}
                    className="group block rounded-3xl bg-card border border-border p-4 hover-lift transition-all animate-fade-up"
                    style={{ animationDelay: `${idx * 40}ms` }}
                  >
                    <div className="grid sm:grid-cols-[220px_minmax(0,1fr)_180px] gap-5 items-center">
                      <div className="aspect-[4/3] rounded-2xl overflow-hidden relative">
                        <img
                          src={s.image}
                          alt={s.title}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute bottom-2 left-2 glass-strong text-[11px] px-2.5 py-0.5 rounded-full capitalize font-medium">
                          {s.category}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors truncate">
                            {s.title}
                          </h3>
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="h-3.5 w-3.5" /> {s.city}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-2 leading-relaxed">
                          {s.description}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {s.amenities.slice(0, 4).map((a) => (
                            <span
                              key={a}
                              className="text-[11px] px-2 py-0.5 rounded-md bg-secondary text-muted-foreground"
                            >
                              {a}
                            </span>
                          ))}
                          {s.amenities.length > 4 && (
                            <span className="text-[11px] px-1.5 py-0.5 text-muted-foreground">
                              +{s.amenities.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="sm:border-l sm:border-border sm:pl-5 flex flex-col justify-between h-full text-right sm:text-right">
                        <div>
                          <div className="flex items-center justify-end gap-1 text-sm font-semibold">
                            <Star className="h-4 w-4 fill-warning text-warning" />
                            <span>{s.rating}</span>
                            <span className="text-xs text-muted-foreground font-normal">
                              ({s.reviews})
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            Fits up to {s.capacity} people
                          </div>
                        </div>

                        <div className="mt-4 sm:mt-0">
                          <div className="text-2xl font-bold gradient-text">
                            {formatCurrency(s.price)}
                          </div>
                          <div className="text-xs text-muted-foreground">per hour</div>
                          <Button
                            size="sm"
                            className="mt-3 w-full rounded-xl gradient-primary text-white shadow-sm"
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              /* Map Mockup View */
              <div className="rounded-3xl bg-card border border-border overflow-hidden shadow-elegant grid lg:grid-cols-[1fr_360px] h-[680px]">
                <div className="relative bg-secondary/70 p-4 flex flex-col justify-between overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-40"
                    style={{
                      backgroundImage:
                        "radial-gradient(#94a3b8 1px, transparent 1px), radial-gradient(#cbd5e1 1px, transparent 1px)",
                      backgroundSize: "24px 24px",
                    }}
                  />
                  <div className="relative z-10 glass px-4 py-2 rounded-xl text-xs font-semibold w-fit">
                    Interactive Map · {filteredSpaces.length} locations plotted
                  </div>

                  {/* Mock Map Markers */}
                  <div className="relative h-full w-full">
                    {filteredSpaces.map((s, idx) => (
                      <div
                        key={s.id}
                        className="absolute cursor-pointer transition-transform hover:scale-110"
                        style={{
                          top: `${20 + (idx * 27) % 65}%`,
                          left: `${15 + (idx * 31) % 70}%`,
                        }}
                      >
                        <Link
                          to="/space/$id"
                          params={{ id: s.id }}
                          className="glass-strong px-2.5 py-1 rounded-full text-xs font-bold shadow-elegant border border-primary/30 flex items-center gap-1 hover:gradient-primary hover:text-white"
                        >
                          <MapPin className="h-3 w-3 text-primary" />
                          <span>{formatCurrency(s.price)}</span>
                        </Link>
                      </div>
                    ))}
                  </div>

                  <div className="relative z-10 glass-strong p-3 rounded-2xl text-xs text-muted-foreground flex items-center justify-between">
                    <span>Center: {selectedCity !== "all" ? selectedCity : "All regions"}</span>
                    <span className="text-primary font-medium">Click marker to inspect</span>
                  </div>
                </div>

                <div className="p-4 overflow-y-auto space-y-3 bg-card border-l border-border">
                  <h4 className="font-semibold text-sm mb-2">Spaces in this area</h4>
                  {filteredSpaces.map((s) => (
                    <Link
                      key={s.id}
                      to="/space/$id"
                      params={{ id: s.id }}
                      className="p-3 rounded-2xl bg-secondary/50 border border-border hover:border-primary flex gap-3 transition-all"
                    >
                      <img src={s.image} alt="" className="h-16 w-16 rounded-xl object-cover shrink-0" />
                      <div className="min-w-0">
                        <div className="font-semibold text-xs truncate">{s.title}</div>
                        <div className="text-[11px] text-muted-foreground">{s.city}</div>
                        <div className="mt-1 font-bold text-xs text-primary">{formatCurrency(s.price)}/hr</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
