import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BadgeCheck, Landmark, Lock, ScrollText, Users, Wallet } from "lucide-react";
import { PageHeader, Reveal, SectionHeading } from "@/components/Primitives";

export const Route = createFileRoute("/workflow")({
  head: () => ({
    meta: [
      { title: "Workflow — Sanction to Citizen Ledger | JanSamarth Chain" },
      {
        name: "description",
        content:
          "The end-to-end flow: government, escrow contract, verification, automatic release, blockchain ledger and citizen dashboard.",
      },
      { property: "og:title", content: "Workflow — JanSamarth Chain" },
      { property: "og:description", content: "Six connected stages from sanction to public visibility." },
    ],
  }),
  component: WorkflowPage,
});

const stages = [
  { icon: Landmark, title: "Government", text: "Project sanctioned with milestones and budget." },
  { icon: Lock, title: "Escrow Contract", text: "Funds locked; no manual withdrawal possible." },
  { icon: BadgeCheck, title: "Verification", text: "Officer signs off on submitted milestone proof." },
  { icon: Wallet, title: "Automatic Release", text: "Contract settles the milestone amount instantly." },
  { icon: ScrollText, title: "Blockchain Ledger", text: "Transaction and evidence hash recorded permanently." },
  { icon: Users, title: "Citizen Dashboard", text: "Public view refreshes for everyone simultaneously." },
];

function WorkflowPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Workflow"
        title="One continuous, glowing chain of custody"
        description="Each stage hands off to the next with a signed, timestamped event — so the trail never breaks between sanction and citizen."
      />

      <section className="mx-auto max-w-6xl px-5 py-10">
        <SectionHeading eyebrow="Process" title="Six stages, fully connected" />
        <div className="mt-14 grid gap-0 lg:grid-cols-[repeat(6,minmax(0,1fr))] lg:items-start">
          {stages.map((s, i) => (
            <div key={s.title} className="grid gap-0 lg:contents">
              <Reveal delay={i * 0.1} className="lg:col-auto">
                <div className="glass relative h-full rounded-3xl p-5 text-center transition-colors hover:border-primary/50 hover:glow-ring">
                  <motion.span
                    animate={{ boxShadow: ["0 0 0 rgba(0,0,0,0)", "0 0 32px oklch(0.6 0.22 290 / 55%)", "0 0 0 rgba(0,0,0,0)"] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
                    className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand"
                  >
                    <s.icon className="h-6 w-6 text-primary-foreground" />
                  </motion.span>
                  <p className="mt-4 text-sm font-semibold">{s.title}</p>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{s.text}</p>
                </div>
              </Reveal>
              {i < stages.length - 1 && (
                <div className="flex justify-center py-3 lg:hidden">
                  <motion.span
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                    className="h-8 w-0.5 rounded-full bg-linear-to-b from-primary to-accent"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 hidden lg:block">
          <motion.div
            animate={{ backgroundPositionX: ["0%", "200%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="h-1 rounded-full bg-[linear-gradient(90deg,transparent,oklch(0.65_0.2_265),oklch(0.66_0.22_305),transparent)] bg-[length:50%_100%]"
          />
        </div>
      </section>
    </div>
  );
}