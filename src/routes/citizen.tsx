import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarClock, MapPin, Search } from "lucide-react";
import { Counter, GlassCard, PageHeader, ProgressBar, Reveal, SectionHeading, StatusPill } from "@/components/Primitives";
import { MonthlyReleaseChart } from "@/components/Charts";
import { formatINR, milestones, projects } from "@/data/mock";

export const Route = createFileRoute("/citizen")({
  head: () => ({
    meta: [
      { title: "Citizen Dashboard | JanSamarth Chain" },
      {
        name: "description",
        content:
          "Search any public project and view its progress, budget, timeline, milestones, released funds and current status.",
      },
      { property: "og:title", content: "Citizen Dashboard — JanSamarth Chain" },
      { property: "og:description", content: "Track any public project in your district in seconds." },
    ],
  }),
  component: CitizenPage,
});

function CitizenPage() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(projects[0].id);
  const results = projects.filter((p) =>
    `${p.name} ${p.state} ${p.department} ${p.id}`.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const selected = projects.find((p) => p.id === selectedId) ?? projects[0];

  return (
    <div>
      <PageHeader
        eyebrow="Citizen dashboard"
        title="Look up any project near you"
        description="Search by project name, department, state or ID and read the same ledger the department reads."
      />

      <section className="mx-auto max-w-7xl px-5 py-6">
        <GlassCard hover={false}>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search e.g. 'water', 'Kerala', 'JSC-1044'"
              className="w-full rounded-full border border-border bg-secondary/40 py-3.5 pl-11 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/60"
            />
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {results.slice(0, 6).map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedId(p.id)}
                className={`rounded-2xl border px-4 py-3 text-left transition-colors ${
                  p.id === selectedId ? "border-primary/60 bg-primary/15" : "border-border hover:border-primary/40"
                }`}
              >
                <p className="truncate text-sm font-medium">{p.name}</p>
                <p className="truncate text-xs text-muted-foreground">{p.state} · {p.department}</p>
              </button>
            ))}
            {results.length === 0 && (
              <p className="py-4 text-sm text-muted-foreground">No project matches that search.</p>
            )}
          </div>
        </GlassCard>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8">
        <SectionHeading center={false} eyebrow="Project detail" title={selected.name} />
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          <Reveal className="lg:col-span-2">
            <GlassCard hover={false} className="h-full">
              <div className="flex flex-wrap items-center gap-3">
                <StatusPill status={selected.status} />
                <span className="text-xs text-muted-foreground">{selected.id} · updated {selected.updated}</span>
              </div>
              <dl className="mt-6 grid gap-5 sm:grid-cols-3">
                <div>
                  <dt className="text-xs text-muted-foreground">Sanctioned budget</dt>
                  <dd className="mt-1 font-display text-xl font-bold">{formatINR(selected.budget)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Funds released</dt>
                  <dd className="mt-1 font-display text-xl font-bold text-info">{formatINR(selected.released)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Completion</dt>
                  <dd className="mt-1 font-display text-xl font-bold">
                    <Counter value={selected.progress} suffix="%" />
                  </dd>
                </div>
              </dl>
              <div className="mt-6">
                <ProgressBar value={selected.progress} />
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Executing agency: {selected.contractor} · Department: {selected.department}
              </p>
            </GlassCard>
          </Reveal>

          <Reveal delay={0.08}>
            <GlassCard hover={false} className="h-full">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <MapPin className="h-4 w-4 text-accent" /> Site location
              </div>
              <div className="mt-4 grid h-48 place-items-center overflow-hidden rounded-2xl border border-border bg-secondary/30">
                <svg viewBox="0 0 200 140" className="h-full w-full opacity-70" role="img" aria-label="Map placeholder">
                  <rect width="200" height="140" fill="none" />
                  <g stroke="oklch(1 0 0 / 14%)" strokeWidth="1">
                    {[20, 50, 80, 110].map((y) => (
                      <line key={y} x1="0" y1={y} x2="200" y2={y} />
                    ))}
                    {[40, 80, 120, 160].map((x) => (
                      <line key={x} x1={x} y1="0" x2={x} y2="140" />
                    ))}
                  </g>
                  <path d="M10 110 C60 90 90 60 190 40" stroke="oklch(0.65 0.2 275)" strokeWidth="3" fill="none" />
                  <circle cx="120" cy="62" r="6" fill="oklch(0.66 0.21 305)" />
                </svg>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">{selected.state} · map placeholder (no live map service)</p>
            </GlassCard>
          </Reveal>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <Reveal>
            <GlassCard hover={false}>
              <div className="flex items-center gap-2 text-sm font-semibold">
                <CalendarClock className="h-4 w-4 text-accent" /> Milestone timeline
              </div>
              <ol className="mt-5 grid gap-4">
                {milestones.map((m) => (
                  <li key={m.title} className="grid grid-cols-[auto_minmax(0,1fr)] gap-4">
                    <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-brand" />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium">{m.title}</p>
                        <StatusPill status={m.status} />
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{m.date} · {formatINR(m.amount)}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </GlassCard>
          </Reveal>
          <Reveal delay={0.08}>
            <GlassCard hover={false}>
              <h3 className="text-base font-semibold">Fund release trend (₹ Cr)</h3>
              <p className="mb-4 text-xs text-muted-foreground">Released vs escrowed across recent months</p>
              <MonthlyReleaseChart />
            </GlassCard>
          </Reveal>
        </div>
      </section>
    </div>
  );
}