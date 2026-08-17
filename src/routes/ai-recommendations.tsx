import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, TrendingUp, Clock, MapPin } from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/site-layout";
import { SpaceCard } from "@/components/space-card";
import { SPACES } from "@/lib/dummy-data";

export const Route = createFileRoute("/ai-recommendations")({
  head: () => ({
    meta: [
      { title: "AI recommendations — IdleSpace" },
      { name: "description", content: "Spaces personalized for you — trending, nearby, and recently viewed." },
      { property: "og:title", content: "AI recommendations — IdleSpace" },
      { property: "og:description", content: "Personalized space picks." },
    ],
  }),
  component: AIRecs,
});

const groups = [
  { title: "Recommended for you", icon: Sparkles, spaces: SPACES.slice(0, 4) },
  { title: "Trending this week", icon: TrendingUp, spaces: SPACES.slice(2, 6) },
  { title: "Nearby", icon: MapPin, spaces: SPACES.slice(4, 8) },
  { title: "Recently viewed", icon: Clock, spaces: SPACES.slice(1, 5) },
];

function AIRecs() {
  return (
    <SiteLayout>
      <PageHeader eyebrow="AI · Personalized" title="Spaces made for you." subtitle="Our AI learns your patterns to surface the perfect place at the perfect price." />
      <div className="mx-auto max-w-7xl px-4 pb-16 space-y-16">
        {groups.map((g, gi) => (
          <section key={g.title}>
            <div className="flex items-center gap-2 mb-6">
              <div className="h-9 w-9 rounded-xl gradient-primary grid place-items-center text-white"><g.icon className="h-4 w-4" /></div>
              <h2 className="text-2xl font-bold tracking-tight">{g.title}</h2>
              {gi === 0 && <span className="ml-2 text-xs px-2 py-0.5 rounded-full gradient-primary text-white">AI</span>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {g.spaces.map((s, i) => <SpaceCard key={s.id} space={s} index={i} />)}
            </div>
          </section>
        ))}
      </div>
    </SiteLayout>
  );
}
