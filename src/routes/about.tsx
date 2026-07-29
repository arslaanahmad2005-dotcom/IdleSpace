import { createFileRoute } from "@tanstack/react-router";
import { Compass, Flag, Layers, Target, Sparkles } from "lucide-react";
import { GlassCard, PageHeader, Reveal, SectionHeading } from "@/components/Primitives";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About JanSamarth Chain — Vision, Mission & Objectives" },
      {
        name: "description",
        content:
          "What JanSamarth Chain is, why transparent public fund escrow is needed, and the vision, mission and objectives behind the platform.",
      },
      { property: "og:title", content: "About JanSamarth Chain" },
      { property: "og:description", content: "Vision, mission and objectives of a transparent governance ledger." },
    ],
  }),
  component: About,
});

const objectives = [
  "Publish every sanctioned project with budget, milestones and timelines in a public record.",
  "Lock funds in escrow so no disbursement happens without verified proof of work.",
  "Reduce payment cycles for contractors from months to minutes after verification.",
  "Give every citizen a searchable, district-level view of public spending.",
  "Create an immutable audit trail for CAG-style review and RTI responses.",
  "Standardise milestone evidence formats across departments and states.",
];

function About() {
  return (
    <div>
      <PageHeader
        eyebrow="About the project"
        title="A public ledger for public money"
        description="JanSamarth Chain is a concept platform that re-imagines how government infrastructure funds move — from sanction to settlement — with verifiable evidence at every step."
      />

      <section className="mx-auto max-w-7xl px-5 py-10">
        <div className="grid gap-5 lg:grid-cols-2">
          <Reveal>
            <GlassCard className="h-full">
              <Sparkles className="h-6 w-6 text-accent" />
              <h2 className="mt-5 text-2xl font-semibold">What is JanSamarth Chain?</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                It is a milestone-based escrow layer for public projects. A department creates a project, the sanctioned
                budget is locked in a smart contract, and the contractor is paid automatically as each milestone is
                proven and verified. Every action writes to a shared ledger that citizens can read without asking
                anyone's permission.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                This interface is a design prototype: all figures, projects and ledger entries shown are mock data.
              </p>
            </GlassCard>
          </Reveal>
          <Reveal delay={0.08}>
            <GlassCard className="h-full">
              <Layers className="h-6 w-6 text-info" />
              <h2 className="mt-5 text-2xl font-semibold">Why it is needed</h2>
              <ul className="mt-3 grid gap-3 text-sm leading-relaxed text-muted-foreground">
                <li>Public works records are fragmented across files, portals and departments.</li>
                <li>Milestone sign-off depends on manual inspection notes that are hard to audit later.</li>
                <li>Contractors wait months for payments already sanctioned on paper.</li>
                <li>Citizens rarely learn whether the project outside their home was funded or finished.</li>
              </ul>
            </GlassCard>
          </Reveal>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <Reveal>
            <GlassCard className="h-full">
              <Compass className="h-6 w-6 text-accent" />
              <h3 className="mt-5 text-xl font-semibold">Vision</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                A country where any citizen can verify the status of any publicly funded project in under thirty
                seconds — without an application, an intermediary, or a favour.
              </p>
            </GlassCard>
          </Reveal>
          <Reveal delay={0.08}>
            <GlassCard className="h-full">
              <Flag className="h-6 w-6 text-info" />
              <h3 className="mt-5 text-xl font-semibold">Mission</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                To make verified proof — not paperwork — the only trigger for releasing public money, and to publish
                that proof openly by default.
              </p>
            </GlassCard>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12">
        <SectionHeading eyebrow="Objectives" title="What the platform sets out to achieve" />
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {objectives.map((o, i) => (
            <Reveal key={o} delay={i * 0.06}>
              <div className="glass grid grid-cols-[auto_minmax(0,1fr)] items-start gap-4 rounded-2xl p-5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand text-sm font-semibold text-primary-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="min-w-0 text-sm leading-relaxed text-muted-foreground">{o}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-8">
        <Reveal>
          <GlassCard className="grid gap-6 md:grid-cols-[auto_minmax(0,1fr)] md:items-center">
            <Target className="h-10 w-10 text-accent" />
            <p className="text-base leading-relaxed text-muted-foreground">
              Transparency is not a report published at the end of a financial year. It is a live, shared state that
              every stakeholder reads from the same place, at the same moment.
            </p>
          </GlassCard>
        </Reveal>
      </section>
    </div>
  );
}