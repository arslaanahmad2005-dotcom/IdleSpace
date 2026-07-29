import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Blocks,
  Boxes,
  Building2,
  Clock,
  Cpu,
  Eye,
  FileCheck2,
  Landmark,
  Lock,
  ScrollText,
  ShieldCheck,
  TriangleAlert,
  Users,
  Wallet,
} from "lucide-react";
import { ActionButton, Counter, GlassCard, Reveal, SectionHeading } from "@/components/Primitives";
import Timeline from "@/components/Timeline";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "JanSamarth Chain — Transparent Public Fund Governance" },
      {
        name: "description",
        content:
          "A blockchain escrow concept that locks public project funds and releases them only on verified milestones, with a public ledger citizens can audit.",
      },
      { property: "og:title", content: "JanSamarth Chain — Transparent Public Fund Governance" },
      {
        property: "og:description",
        content: "Milestone-verified fund release, real-time citizen visibility, zero manual tampering.",
      },
    ],
  }),
  component: Index,
});

const problems = [
  { icon: Eye, title: "No public visibility", text: "Citizens cannot see where sanctioned money actually goes." },
  { icon: FileCheck2, title: "Manual verification", text: "Paper-based milestone sign-offs are slow and disputable." },
  { icon: TriangleAlert, title: "Fraud & leakage", text: "Duplicate bills and ghost milestones drain budgets." },
];

const benefits = [
  { icon: Lock, title: "Escrow-locked budgets", text: "Funds sit in a smart contract until proof is verified." },
  { icon: BadgeCheck, title: "Verified milestones", text: "Officers approve geo-tagged, hashed evidence." },
  { icon: Wallet, title: "Instant settlement", text: "Approved milestones auto-release payment to contractors." },
  { icon: ScrollText, title: "Immutable ledger", text: "Every rupee movement is permanently traceable." },
];

const workflow = [
  { icon: Landmark, title: "Government creates project", description: "Budget, milestones and timelines are published on-chain." },
  { icon: Lock, title: "Funds locked in escrow", description: "The sanctioned amount is held by the smart contract." },
  { icon: FileCheck2, title: "Proof & verification", description: "Contractor uploads evidence; officer verifies it." },
  { icon: Wallet, title: "Automatic release", description: "Payment settles the moment verification succeeds." },
  { icon: Users, title: "Citizens monitor", description: "The public dashboard updates in real time." },
];

const stack = [
  { icon: Cpu, label: "React + Tailwind" },
  { icon: Blocks, label: "Solidity / EVM" },
  { icon: Boxes, label: "IPFS + Pinata" },
  { icon: ShieldCheck, label: "Aadhaar e-KYC" },
];

function Index() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-16 lg:grid-cols-2 lg:pt-24">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-3 py-1.5 text-xs font-medium text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                Digital India · Public Infrastructure Ledger
              </span>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="mt-6 text-4xl font-bold leading-[1.08] sm:text-6xl">
                <span className="text-gradient">JanSamarth Chain</span>
              </h1>
              <p className="mt-4 font-display text-xl text-foreground/90 sm:text-2xl">
                Building Trust Through Transparent Governance
              </p>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Public project funds are locked in a blockchain escrow and released only when a milestone is proven and
                verified — while every citizen watches the same ledger in real time.
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-8 flex flex-wrap gap-3">
                <ActionButton to="/dashboard">
                  Explore Public Dashboard <ArrowRight className="h-4 w-4" />
                </ActionButton>
                <ActionButton to="/solution" variant="ghost">
                  See how it works
                </ActionButton>
              </div>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="mt-10 grid max-w-lg grid-cols-3 gap-4">
                {[
                  { label: "Projects tracked", value: 1284, suffix: "+" },
                  { label: "Funds escrowed", value: 4820, prefix: "₹", suffix: " Cr" },
                  { label: "Traceability", value: 100, suffix: "%" },
                ].map((s) => (
                  <div key={s.label} className="glass rounded-2xl px-4 py-4">
                    <p className="font-display text-xl font-bold sm:text-2xl">
                      <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} />
                    </p>
                    <p className="mt-1 text-[11px] text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.2}>
            <HeroIllustration />
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16">
        <SectionHeading
          eyebrow="Introduction"
          title="A single source of truth for public money"
          subtitle="JanSamarth Chain connects departments, contractors, verifying officers and citizens to one tamper-proof record of every sanction, milestone and payment."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[
            { icon: Landmark, title: "For Government", text: "Sanction projects, define milestones and monitor real disbursement health." },
            { icon: Building2, title: "For Contractors", text: "Submit proof once, get paid automatically — no follow-ups, no delays." },
            { icon: Users, title: "For Citizens", text: "Track any project in your district down to the last released instalment." },
          ].map((c, i) => (
            <Reveal key={c.title} delay={i * 0.08}>
              <GlassCard className="h-full">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand">
                  <c.icon className="h-5 w-5 text-primary-foreground" />
                </span>
                <h3 className="mt-5 text-lg font-semibold">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.text}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading
              center={false}
              eyebrow="Problem"
              title="Public funds lose their paper trail"
              subtitle="Between sanction and delivery, money passes through layers where records are manual, private and easy to distort."
            />
            <div className="mt-8 grid gap-4">
              {problems.map((p, i) => (
                <Reveal key={p.title} delay={i * 0.08}>
                  <div className="glass grid grid-cols-[auto_minmax(0,1fr)] gap-4 rounded-2xl p-5">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-destructive/40 bg-destructive/10">
                      <p.icon className="h-5 w-5 text-destructive" />
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold">{p.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{p.text}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
            <div className="mt-6">
              <ActionButton to="/problem" variant="ghost">
                View full problem breakdown <ArrowRight className="h-4 w-4" />
              </ActionButton>
            </div>
          </div>

          <div>
            <SectionHeading
              center={false}
              eyebrow="Solution"
              title="Escrow, proof, automatic release"
              subtitle="Smart contracts hold the budget. Verified milestones — not paperwork — trigger payment."
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {benefits.map((b, i) => (
                <Reveal key={b.title} delay={i * 0.08}>
                  <GlassCard className="h-full">
                    <b.icon className="h-6 w-6 text-info" />
                    <p className="mt-4 font-semibold">{b.title}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{b.text}</p>
                  </GlassCard>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16">
        <SectionHeading eyebrow="Workflow" title="From sanction to citizen dashboard" />
        <div className="mt-12">
          <Timeline steps={workflow} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16">
        <SectionHeading eyebrow="Technology" title="Built on proven, auditable infrastructure" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stack.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06}>
              <GlassCard className="flex h-full items-center gap-4">
                <s.icon className="h-6 w-6 shrink-0 text-accent" />
                <span className="text-sm font-medium">{s.label}</span>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="glass relative overflow-hidden rounded-[2rem] px-6 py-14 text-center">
          <div className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(30rem_18rem_at_50%_0%,oklch(0.55_0.24_285/35%),transparent_70%)]" />
          <div className="relative">
            <h2 className="text-3xl font-bold sm:text-4xl">
              <span className="text-gradient">Governance you can verify, not just trust</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Explore the public transparency dashboard, or step into the government, contractor and citizen portals.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <ActionButton to="/dashboard">
                Open dashboard <ArrowRight className="h-4 w-4" />
              </ActionButton>
              <ActionButton to="/impact" variant="ghost">
                Expected impact
              </ActionButton>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-4">
              {[
                { label: "Transparency", value: 95, suffix: "%" },
                { label: "Faster payments", value: 60, suffix: "%" },
                { label: "Traceability", value: 100, suffix: "%" },
                { label: "Manual tampering", value: 0, suffix: "" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="font-display text-3xl font-bold text-gradient">
                    <Counter value={s.value} suffix={s.suffix} />
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function HeroIllustration() {
  return (
    <div className="relative">
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="glass rounded-[2rem] p-6"
      >
        <svg viewBox="0 0 420 320" className="w-full" role="img" aria-label="Blockchain escrow flow illustration">
          <defs>
            <linearGradient id="hero-g" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="oklch(0.65 0.2 258)" />
              <stop offset="50%" stopColor="oklch(0.63 0.22 288)" />
              <stop offset="100%" stopColor="oklch(0.66 0.22 318)" />
            </linearGradient>
          </defs>
          <g fill="none" stroke="url(#hero-g)" strokeWidth="2">
            <rect x="24" y="30" width="120" height="70" rx="16" />
            <rect x="276" y="30" width="120" height="70" rx="16" />
            <rect x="150" y="130" width="120" height="70" rx="16" />
            <rect x="24" y="230" width="120" height="60" rx="16" />
            <rect x="276" y="230" width="120" height="60" rx="16" />
            <path d="M84 100 L210 130 M336 100 L210 130 M210 200 L84 230 M210 200 L336 230" strokeDasharray="6 8">
              <animate attributeName="stroke-dashoffset" from="56" to="0" dur="1.6s" repeatCount="indefinite" />
            </path>
          </g>
          <g fill="oklch(0.98 0.005 260)" fontSize="12" fontFamily="DM Sans, sans-serif" textAnchor="middle">
            <text x="84" y="70">Government</text>
            <text x="336" y="70">Department</text>
            <text x="210" y="168">Smart Escrow</text>
            <text x="84" y="265">Contractor</text>
            <text x="336" y="265">Citizens</text>
          </g>
          <g fill="url(#hero-g)">
            <circle cx="210" cy="130" r="5">
              <animate attributeName="r" values="4;8;4" dur="2.4s" repeatCount="indefinite" />
            </circle>
          </g>
        </svg>
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="glass absolute -bottom-6 -left-2 flex items-center gap-3 rounded-2xl px-4 py-3 sm:left-6"
      >
        <Clock className="h-4 w-4 text-success" />
        <span className="text-xs">Milestone verified · payment released in 2.4s</span>
      </motion.div>
    </div>
  );
}
