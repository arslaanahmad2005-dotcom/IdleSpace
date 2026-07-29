import { createFileRoute } from "@tanstack/react-router";
import { Boxes, Cloud, Cpu, Fingerprint, Layers, Server } from "lucide-react";
import { GlassCard, PageHeader, Reveal, SectionHeading } from "@/components/Primitives";

export const Route = createFileRoute("/technology")({
  head: () => ({
    meta: [
      { title: "Technology Stack | JanSamarth Chain" },
      {
        name: "description",
        content:
          "The proposed stack: React and Tailwind, Node.js and Express, Solidity on EVM, IPFS with Pinata, Aadhaar e-KYC with Bhashini, GitHub and Vercel.",
      },
      { property: "og:title", content: "Technology Stack — JanSamarth Chain" },
      { property: "og:description", content: "Frontend, backend, blockchain, storage, identity and deployment." },
    ],
  }),
  component: TechnologyPage,
});

const groups = [
  { icon: Cpu, title: "Frontend", items: ["React", "Tailwind CSS"], note: "Responsive, accessible government-grade UI." },
  { icon: Server, title: "Backend", items: ["Node.js", "Express"], note: "Orchestration and indexing services." },
  { icon: Layers, title: "Blockchain", items: ["Solidity", "Ethereum EVM"], note: "Escrow contracts and milestone events." },
  { icon: Boxes, title: "Storage", items: ["IPFS", "Pinata"], note: "Content-addressed milestone evidence." },
  { icon: Fingerprint, title: "Authentication", items: ["Aadhaar e-KYC", "Bhashini"], note: "Verified identities and multilingual access." },
  { icon: Cloud, title: "Deployment", items: ["GitHub", "Vercel"], note: "Continuous delivery with preview builds." },
];

function TechnologyPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Technology"
        title="An auditable stack, end to end"
        description="Each layer is chosen so that a third party can independently reproduce and verify what the platform claims. This prototype implements the frontend layer only."
      />

      <section className="mx-auto max-w-7xl px-5 py-8">
        <SectionHeading eyebrow="Layers" title="Six building blocks" />
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((g, i) => (
            <Reveal key={g.title} delay={i * 0.06}>
              <GlassCard className="group h-full">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand transition-transform duration-300 group-hover:scale-110">
                  <g.icon className="h-5 w-5 text-primary-foreground" />
                </span>
                <h3 className="mt-5 text-lg font-semibold">{g.title}</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {g.items.map((it) => (
                    <span key={it} className="rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs">
                      {it}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{g.note}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}