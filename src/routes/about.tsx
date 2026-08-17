import { createFileRoute } from "@tanstack/react-router";
import { Rocket, Target, Compass } from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/site-layout";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — IdleSpace" },
      { name: "description", content: "The story, mission and vision behind IdleSpace." },
      { property: "og:title", content: "About — IdleSpace" },
      { property: "og:description", content: "The story behind IdleSpace." },
    ],
  }),
  component: About,
});

const timeline = [
  { year: "2023", title: "Founded", body: "IdleSpace was born from a napkin sketch in a Brooklyn café." },
  { year: "2024", title: "1,000 hosts", body: "Our first cohort of hosts joined across NYC and SF." },
  { year: "2025", title: "AI matching", body: "We launched AI-powered matching and dynamic pricing." },
  { year: "2026", title: "84 cities", body: "IdleSpace is now live in 84 cities worldwide." },
];

function About() {
  return (
    <SiteLayout>
      <PageHeader eyebrow="About" title="Every space has a second life." subtitle="We're building the marketplace that unlocks the world's underused business spaces." />
      <div className="mx-auto max-w-4xl px-4 pb-16">
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: Rocket, title: "Story", body: "Founded in 2023 to give small businesses a new revenue stream." },
            { icon: Target, title: "Mission", body: "Make every unused hour productive — for hosts and guests." },
            { icon: Compass, title: "Vision", body: "A world where no square foot goes to waste." },
          ].map((c) => (
            <div key={c.title} className="rounded-3xl bg-card border border-border p-6 hover-lift">
              <div className="h-10 w-10 rounded-xl gradient-primary grid place-items-center text-white"><c.icon className="h-4 w-4" /></div>
              <h3 className="mt-4 font-semibold">{c.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{c.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold tracking-tight">Timeline</h2>
          <div className="mt-6 relative pl-6">
            <div className="absolute left-2 top-1 bottom-1 w-0.5 gradient-primary rounded-full" />
            {timeline.map((t, i) => (
              <div key={t.year} className="relative mb-6 animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="absolute -left-6 top-1 h-3 w-3 rounded-full gradient-primary shadow-glow" />
                <div className="text-xs uppercase tracking-widest text-primary font-semibold">{t.year}</div>
                <div className="font-semibold mt-1">{t.title}</div>
                <div className="text-sm text-muted-foreground">{t.body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
