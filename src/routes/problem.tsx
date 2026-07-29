import { createFileRoute } from "@tanstack/react-router";
import { Clock8, EyeOff, FileWarning, HandCoins, ShieldAlert, Wallet } from "lucide-react";
import { GlassCard, PageHeader, Reveal, SectionHeading } from "@/components/Primitives";
import FundFlow from "@/components/FundFlow";

export const Route = createFileRoute("/problem")({
  head: () => ({
    meta: [
      { title: "The Problem — Where Public Funds Leak | JanSamarth Chain" },
      {
        name: "description",
        content:
          "Lack of transparency, manual verification, corruption, payment delays and fraud risk in public project funding, visualised as a fund-flow leak map.",
      },
      { property: "og:title", content: "Where public funds leak" },
      { property: "og:description", content: "Six structural failures in how public infrastructure money moves." },
    ],
  }),
  component: ProblemPage,
});

const cards = [
  { icon: EyeOff, title: "Lack of transparency", text: "Sanction letters, revisions and payments live in silos nobody outside the department can read." },
  { icon: FileWarning, title: "Manual verification", text: "Site inspections produce paper notes that cannot be independently re-checked later." },
  { icon: HandCoins, title: "Corruption", text: "Discretion at each approval layer creates room for rent-seeking and inflated claims." },
  { icon: Clock8, title: "Payment delays", text: "Contractors wait 90–180 days for money already sanctioned, raising project costs." },
  { icon: Wallet, title: "No public visibility", text: "Citizens cannot correlate a stalled road outside their home with its funding status." },
  { icon: ShieldAlert, title: "Fraud risk", text: "Duplicate invoices and ghost milestones are detected only during post-facto audits." },
];

function ProblemPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Problem statement"
        title="The money is sanctioned. The trail is not."
        description="Every rupee of a public project passes through several hands. Today, each handover is recorded privately — which is exactly where transparency, speed and accountability are lost."
      />

      <section className="mx-auto max-w-7xl px-5 py-10">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.07}>
              <GlassCard className="h-full">
                <span className="grid h-12 w-12 place-items-center rounded-2xl border border-destructive/40 bg-destructive/10">
                  <c.icon className="h-5 w-5 text-destructive" />
                </span>
                <h3 className="mt-5 text-lg font-semibold">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.text}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-14">
        <SectionHeading
          eyebrow="Fund flow"
          title="Four handovers, three leak points"
          subtitle="Follow a sanctioned budget from the treasury to the beneficiary and see where visibility disappears."
        />
        <div className="mt-12">
          <FundFlow />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-6">
        <Reveal>
          <GlassCard className="text-center">
            <p className="text-base leading-relaxed text-muted-foreground">
              Fixing this does not require more inspections. It requires a shared record that no single participant can
              quietly edit.
            </p>
          </GlassCard>
        </Reveal>
      </section>
    </div>
  );
}