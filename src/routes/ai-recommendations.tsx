import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Sparkles,
  TrendingUp,
  Clock,
  MapPin,
  SlidersHorizontal,
  Users,
  IndianRupee,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/site-layout";
import { SpaceCard } from "@/components/space-card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useSpaces } from "@/hooks/use-idle-store";
import { formatCurrency } from "@/lib/utils";
import type { SpaceListing } from "@/lib/store";

export const Route = createFileRoute("/ai-recommendations")({
  head: () => ({
    meta: [
      { title: "AI Space Matcher — IdleSpace" },
      {
        name: "description",
        content: "Spaces personalized for you — weighted by location, category, budget, and capacity.",
      },
      { property: "og:title", content: "AI Space Matcher — IdleSpace" },
      { property: "og:description", content: "Personalized space picks." },
    ],
  }),
  component: AIRecs,
});

interface ScoredSpace {
  space: SpaceListing;
  score: number;
  matchReasons: string[];
}

function AIRecs() {
  const { spaces } = useSpaces();

  // User preference controls for recommendation engine
  const [preferredCity, setPreferredCity] = useState("Mumbai");
  const [targetCategory, setTargetCategory] = useState("all");
  const [maxBudget, setMaxBudget] = useState<number[]>([10000]);
  const [partySize, setPartySize] = useState(12);

  // Derive unique cities
  const cities = useMemo(() => {
    const set = new Set<string>();
    spaces.forEach((s) => {
      const c = s.city.split(",")[0]?.trim();
      if (c) set.add(c);
    });
    return Array.from(set);
  }, [spaces]);

  // Transparent weighted scoring logic
  // Location: 30%, Category: 25%, Price fit: 20%, Availability: 15%, Amenities/Capacity: 10%
  const rankedSpaces = useMemo<ScoredSpace[]>(() => {
    return spaces
      .filter((s) => s.status !== "inactive" && s.status !== "flagged")
      .map((s) => {
        let score = 0;
        const reasons: string[] = [];

        // 1. Location relevance (30 points)
        if (s.city.toLowerCase().includes(preferredCity.toLowerCase())) {
          score += 30;
          reasons.push(`In your preferred area (${preferredCity})`);
        } else {
          score += 10;
        }

        // 2. Category match (25 points)
        if (targetCategory === "all") {
          score += 20;
        } else if (s.category === targetCategory) {
          score += 25;
          reasons.push(`Exact category match: ${s.category}`);
        }

        // 3. Price fit (20 points)
        const budgetCap = maxBudget[0];
        if (s.price <= budgetCap) {
          const ratio = (budgetCap - s.price) / budgetCap;
          const priceScore = Math.round(12 + ratio * 8);
          score += priceScore;
          reasons.push(`Fits your budget (${formatCurrency(s.price)}/h ≤ ${formatCurrency(budgetCap)}/h)`);
        } else {
          score += 5;
        }

        // 4. Availability & status (15 points)
        if (s.status === "active") {
          score += 15;
          reasons.push("Immediately open for reservation");
        }

        // 5. Capacity fit (10 points)
        if (s.capacity >= partySize && s.capacity <= partySize * 2.5) {
          score += 10;
          reasons.push(`Ideal capacity (${s.capacity} spots for ${partySize} guests)`);
        } else if (s.capacity >= partySize) {
          score += 6;
        }

        // Bonus for high host rating
        if (s.rating >= 4.8) {
          score += 5;
          reasons.push(`Superhost rated (${s.rating}★)`);
        }

        return {
          space: s,
          score,
          matchReasons: reasons.slice(0, 3), // top 3 reasons
        };
      })
      .sort((a, b) => b.score - a.score);
  }, [spaces, preferredCity, targetCategory, maxBudget, partySize]);

  const topMatch = rankedSpaces[0];
  const otherMatches = rankedSpaces.slice(1, 7);

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Explainable AI Matcher"
        title="Spaces Personalized For Your Event."
        subtitle="Transparent algorithmic scoring based on your location (30%), category (25%), budget (20%), availability (15%), and group capacity (10%)."
      />

      <div className="mx-auto max-w-7xl px-4 pb-20 space-y-12">
        {/* Interactive Matcher Preference Panel */}
        <div className="rounded-3xl bg-card border border-border p-6 md:p-8 shadow-soft">
          <div className="flex items-center gap-2 mb-6">
            <SlidersHorizontal className="h-5 w-5 text-primary" />
            <h3 className="font-bold text-lg">Tune Matching Weights & Criteria</h3>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <Label className="text-xs text-muted-foreground uppercase font-semibold">
                Target Location (30%)
              </Label>
              <select
                value={preferredCity}
                onChange={(e) => setPreferredCity(e.target.value)}
                className="mt-2 w-full p-2.5 rounded-xl bg-secondary/80 border border-border text-xs font-semibold outline-none cursor-pointer"
              >
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground uppercase font-semibold">
                Activity Category (25%)
              </Label>
              <select
                value={targetCategory}
                onChange={(e) => setTargetCategory(e.target.value)}
                className="mt-2 w-full p-2.5 rounded-xl bg-secondary/80 border border-border text-xs font-semibold outline-none cursor-pointer capitalize"
              >
                <option value="all">All Categories</option>
                <option value="studio">Studios</option>
                <option value="meeting">Meeting Rooms</option>
                <option value="kitchen">Commercial Kitchens</option>
                <option value="cafe">Cafes & Lounges</option>
                <option value="conference">Conference Halls</option>
                <option value="event">Event Spaces</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center">
                <Label className="text-xs text-muted-foreground uppercase font-semibold">
                  Budget Cap (20%)
                </Label>
                <span className="text-xs font-bold text-primary">
                  {formatCurrency(maxBudget[0])}/h
                </span>
              </div>
              <Slider
                value={maxBudget}
                onValueChange={setMaxBudget}
                min={2000}
                max={20000}
                step={500}
                className="mt-4"
              />
            </div>

            <div>
              <Label className="text-xs text-muted-foreground uppercase font-semibold">
                Group Size (10%)
              </Label>
              <div className="mt-2 flex items-center gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-9 w-9 rounded-xl"
                  onClick={() => setPartySize((p) => Math.max(1, p - 2))}
                >
                  -
                </Button>
                <span className="flex-1 text-center font-bold text-sm">{partySize} People</span>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-9 w-9 rounded-xl"
                  onClick={() => setPartySize((p) => Math.min(200, p + 2))}
                >
                  +
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Highlighted #1 Top Match with Explainable Reasons */}
        {topMatch && (
          <section className="rounded-3xl gradient-primary p-1 shadow-glow animate-fade-up">
            <div className="rounded-[22px] bg-card p-6 md:p-8 grid md:grid-cols-[1fr_360px] gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full gradient-primary text-white text-xs font-bold shadow-sm mb-3">
                  <Sparkles className="h-3.5 w-3.5" /> Best Overall Match · {Math.min(99, topMatch.score + 10)}% Compatibility
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">
                  {topMatch.space.title}
                </h2>
                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-primary" /> {topMatch.space.city}
                </p>

                {/* Explainable Matching Reasons Badges */}
                <div className="mt-5 space-y-2">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Why this was recommended:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {topMatch.matchReasons.map((r, i) => (
                      <span
                        key={i}
                        className="text-xs px-3 py-1 rounded-xl bg-success/10 text-success border border-success/30 font-semibold flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" /> {r}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="mt-4 text-sm text-muted-foreground leading-relaxed line-clamp-2">
                  {topMatch.space.description}
                </p>

                <div className="mt-6 flex items-center gap-4">
                  <Link to="/space/$id" params={{ id: topMatch.space.id }}>
                    <Button className="gradient-primary text-white shadow-elegant rounded-xl px-6">
                      View Best Match ({formatCurrency(topMatch.space.price)}/h)
                    </Button>
                  </Link>
                  <Link to="/booking/$id" params={{ id: topMatch.space.id }}>
                    <Button variant="outline" className="rounded-xl">
                      Book Instantly
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-border shadow-md">
                <img
                  src={topMatch.space.image}
                  alt={topMatch.space.title}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </section>
        )}

        {/* Other Highly Ranked Matches */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <div className="h-9 w-9 rounded-xl gradient-primary grid place-items-center text-white">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Top Ranked Alternatives</h2>
              <p className="text-xs text-muted-foreground">
                Ranked by proximity, budget fitness, and customer satisfaction ratings.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherMatches.map((item, idx) => (
              <div key={item.space.id} className="relative">
                <SpaceCard space={item.space} index={idx} />
                {/* Explainable match pill overlay */}
                <div className="mt-2 flex flex-wrap gap-1">
                  {item.matchReasons.slice(0, 2).map((r, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-secondary text-muted-foreground font-medium"
                    >
                      ✓ {r}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
