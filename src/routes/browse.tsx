import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, Grid3x3, List, Map as MapIcon, Star, MapPin } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { SpaceCard } from "@/components/space-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { CATEGORIES, SPACES } from "@/lib/dummy-data";
import { Link } from "@tanstack/react-router";
import { formatCurrency } from "@/lib/utils";

export const Route = createFileRoute("/browse")({
  head: () => ({
    meta: [
      { title: "Browse spaces — IdleSpace" },
      { name: "description", content: "Browse thousands of hourly spaces across categories, cities, and price points." },
      { property: "og:title", content: "Browse spaces — IdleSpace" },
      { property: "og:description", content: "Filter, compare and book hourly spaces." },
    ],
  }),
  component: BrowsePage,
});

type View = "grid" | "list" | "map";

function BrowsePage() {
  const [view, setView] = useState<View>("grid");
  const [q, setQ] = useState("");
  const [cats, setCats] = useState<string[]>([]);
  const [price, setPrice] = useState<number[]>([20000]);
  const [rating, setRating] = useState(0);

  const filtered = useMemo(
    () =>
      SPACES.filter((s) => {
        if (q && !s.title.toLowerCase().includes(q.toLowerCase()) && !s.city.toLowerCase().includes(q.toLowerCase())) return false;
        if (cats.length && !cats.includes(s.category)) return false;
        if (s.price > price[0]) return false;
        if (s.rating < rating) return false;
        return true;
      }),
    [q, cats, price, rating],
  );

  const toggleCat = (c: string) => setCats((v) => (v.includes(c) ? v.filter((x) => x !== c) : [...v, c]));

  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="glass-strong rounded-2xl p-3 md:p-4 flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="flex items-center gap-3 px-3 py-2 bg-secondary rounded-xl flex-1">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by city or space name"
              className="bg-transparent outline-none w-full text-sm"
            />
          </div>
          <div className="flex items-center gap-1 p-1 rounded-xl bg-secondary">
            {(["grid", "list", "map"] as const).map((v) => {
              const Icon = v === "grid" ? Grid3x3 : v === "list" ? List : MapIcon;
              return (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                    view === v ? "bg-card shadow-soft" : "text-muted-foreground"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" /> {v[0].toUpperCase() + v.slice(1)}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 grid lg:grid-cols-[280px_minmax(0,1fr)] gap-6">
          <aside className="rounded-2xl bg-card border border-border p-5 h-fit lg:sticky lg:top-24">
            <div className="flex items-center gap-2 mb-4">
              <SlidersHorizontal className="h-4 w-4" />
              <h3 className="font-semibold">Filters</h3>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Category</p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => toggleCat(c.id)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                      cats.includes(c.id) ? "gradient-primary text-white border-transparent" : "border-border hover:bg-secondary"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">Max price</p>
                  <span className="text-sm font-semibold">{formatCurrency(price[0])}/hr</span>
                </div>
                <Slider value={price} onValueChange={setPrice} min={1500} max={25000} step={500} />
              </div>
            <div className="mt-6">
              <p className="text-sm font-medium mb-2">Rating</p>
              <div className="flex gap-1">
                {[0, 3, 4, 4.5].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRating(r)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border transition-all ${
                      rating === r ? "gradient-primary text-white border-transparent" : "border-border hover:bg-secondary"
                    }`}
                  >
                    <Star className="h-3 w-3" /> {r === 0 ? "Any" : `${r}+`}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-6">
              <p className="text-sm font-medium mb-2">Availability</p>
              <Input type="date" className="rounded-xl" />
            </div>
            <Button variant="ghost" className="w-full mt-6" onClick={() => { setCats([]); setPrice([200]); setRating(0); setQ(""); }}>
              Reset filters
            </Button>
          </aside>

          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">{filtered.length} spaces</p>
              <div className="flex gap-2">
                <Badge variant="secondary" className="rounded-full">Best match</Badge>
              </div>
            </div>

            {view === "grid" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((s, i) => <SpaceCard key={s.id} space={s} index={i} />)}
              </div>
            )}

            {view === "list" && (
              <div className="space-y-3">
                {filtered.map((s, i) => (
                  <Link to="/space/$id" params={{ id: s.id }} key={s.id}
                    className="grid grid-cols-[120px_minmax(0,1fr)] sm:grid-cols-[220px_minmax(0,1fr)] gap-4 rounded-2xl bg-card border border-border overflow-hidden hover-lift animate-fade-up"
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <img src={s.image} alt="" className="h-full w-full object-cover aspect-[4/3]" />
                    <div className="p-4 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold truncate">{s.title}</h3>
                        <div className="flex items-center gap-1 text-sm shrink-0"><Star className="h-3.5 w-3.5 fill-warning text-warning" /> {s.rating}</div>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="h-3 w-3" /> {s.city}</p>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{s.description}</p>
                      <div className="mt-3 flex items-end justify-between">
                        <span><span className="text-lg font-bold">{formatCurrency(s.price)}</span><span className="text-xs text-muted-foreground"> / hour</span></span>
                        <span className="text-xs text-muted-foreground">Fits {s.capacity}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {view === "map" && (
              <div className="rounded-3xl overflow-hidden border border-border relative h-[600px]">
                <div className="absolute inset-0 gradient-mesh opacity-70" />
                <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(oklch(0 0 0 / 6%) 1px, transparent 1px), linear-gradient(90deg, oklch(0 0 0 / 6%) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
                {filtered.slice(0, 6).map((s, i) => (
                  <div key={s.id} className="absolute glass-strong rounded-full px-3 py-1.5 shadow-elegant text-xs font-semibold animate-float"
                    style={{ top: `${20 + i * 10}%`, left: `${15 + (i % 3) * 25}%`, animationDelay: `${i * 300}ms` }}>
                    ₹{s.price.toLocaleString("en-IN")}/hr
                  </div>
                ))}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 glass-strong rounded-2xl px-4 py-2 text-sm font-medium">
                  Interactive map coming soon
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
