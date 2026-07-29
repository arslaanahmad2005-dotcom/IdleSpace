import { createFileRoute } from "@tanstack/react-router";
import { Building2, Landmark, Users } from "lucide-react";
import { Counter, GlassCard, PageHeader, Reveal, SectionHeading } from "@/components/Primitives";

export const Route = createFileRoute("/impact")({
  head: () => ({
    meta: [
      { title: "Expected Impact | JanSamarth Chain" },
      {
        name: "description",
        content:
          "Expected outcomes for government, citizens and contractors: higher transparency, faster payments, full traceability and no manual tampering.",
      },
      { property: "og:title", content: "Expected Impact — JanSamarth Chain" },
      { property: "og:description", content: "95% transparency, 60% faster payments, 100% traceability." },
    ],
  }),
  component: ImpactPage,
});

const groups = [
  { icon: Landmark, title: "Government", items: ["Higher transparency", "Reduced corruption", "Faster payments"] },
  { icon: Users, title: "Citizens", items: ["Real-time visibility", "Trust in delivery", "Easy verification"] },
  { icon: Building2, title: "Contractors", items: ["Automatic payments", "No delays", "Fair, rule-based process"] },
];

const stats = [
  { label: "Transparency", value: 95, suffix: "%" },
  { label: "Faster payments", value: 60, suffix: "%" },
  { label: "Traceability", value: 100, suffix: "%" },
  { label: "Manual tampering", value: 0, suffix: "" },
];

function ImpactPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Expected impact"
        title="What changes when proof replaces paperwork"
        description="Projected outcomes across the three groups that touch every public project."
      />

      <section className="mx-auto max-w-7xl px-5 py-8">
        <div className="grid gap-5 md:grid-cols-3">
          {groups.map((g, i) => (
            <Reveal key={g.title} delay={i * 0.08}>
              <GlassCard className="h-full">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand">
                  <g.icon className="h-5 w-5 text-primary-foreground" />
                </span>
                <h3 className="mt-5 text-lg font-semibold">{g.title}</h3>
                <ul className="mt-4 grid gap-3">
                  {g.items.map((it) => (
                    <li key={it} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      {it}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12">
        <SectionHeading eyebrow="Projected numbers" title="Measurable governance outcomes" />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.07}>
              <GlassCard className="h-full text-center">
                <p className="font-display text-4xl font-bold text-gradient">
                  <Counter value={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}