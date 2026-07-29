import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, FileCheck2, Landmark, Lock, ScrollText, Users, Wallet } from "lucide-react";
import { GlassCard, PageHeader, Reveal, SectionHeading } from "@/components/Primitives";
import Timeline from "@/components/Timeline";

export const Route = createFileRoute("/solution")({
  head: () => ({
    meta: [
      { title: "The Solution — Blockchain Escrow for Public Projects | JanSamarth Chain" },
      {
        name: "description",
        content:
          "How smart-contract escrow, milestone proof and automatic release replace manual approvals in public infrastructure funding.",
      },
      { property: "og:title", content: "Blockchain escrow for public projects" },
      { property: "og:description", content: "Locked budgets, verified proof, automatic settlement, public ledger." },
    ],
  }),
  component: SolutionPage,
});

const steps = [
  { icon: Landmark, title: "Government creates the project", description: "Department publishes scope, budget, milestone schedule and the assigned contractor to the chain." },
  { icon: Lock, title: "Funds locked in a smart contract", description: "The full sanctioned amount moves into escrow. No official can move it manually." },
  { icon: FileCheck2, title: "Contractor uploads milestone proof", description: "Geo-tagged photos, measurement sheets and invoices are hashed and pinned to decentralised storage." },
  { icon: BadgeCheck, title: "Officer verifies the milestone", description: "The verifying officer signs the milestone; the signature and timestamp are recorded permanently." },
  { icon: Wallet, title: "Automatic payment release", description: "The contract releases exactly the milestone amount — no file movement, no follow-up." },
  { icon: ScrollText, title: "Public ledger updated", description: "The transaction hash, amount and evidence reference become publicly readable instantly." },
  { icon: Users, title: "Citizens monitor progress", description: "The transparency dashboard reflects the new state for everyone at the same moment." },
];

const pillars = [
  { title: "Escrow by default", text: "Money cannot leave the contract without a verified milestone event." },
  { title: "Evidence-linked payments", text: "Every release points to the exact proof bundle that justified it." },
  { title: "Role separation", text: "Uploader, verifier and beneficiary are always distinct signed identities." },
  { title: "Open by construction", text: "Publishing is not an extra step — the ledger is the system of record." },
];

function SolutionPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Solution"
        title="Escrow the budget. Pay the proof."
        description="JanSamarth Chain replaces discretionary disbursement with a deterministic one: funds are locked up front and released the instant a milestone is independently verified."
      />

      <section className="mx-auto max-w-7xl px-5 py-8">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.07}>
              <GlassCard className="h-full">
                <h3 className="text-base font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14">
        <SectionHeading eyebrow="Animated workflow" title="Seven steps, zero manual disbursement" />
        <div className="mt-12">
          <Timeline steps={steps} />
        </div>
      </section>
    </div>
  );
}