import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BadgeCheck, FilePlus2, LineChart, Send, Wallet } from "lucide-react";
import { ActionButton, GlassCard, PageHeader, ProgressBar, Reveal, SectionHeading, StatusPill } from "@/components/Primitives";
import { formatINR, projects } from "@/data/mock";

export const Route = createFileRoute("/government")({
  head: () => ({
    meta: [
      { title: "Government Portal | JanSamarth Chain" },
      {
        name: "description",
        content:
          "Department-side interface concept for creating projects, approving milestones, releasing escrow funds and generating reports.",
      },
      { property: "og:title", content: "Government Portal — JanSamarth Chain" },
      { property: "og:description", content: "Create projects, approve milestones and release escrow funds." },
    ],
  }),
  component: GovernmentPage,
});

const tabs = [
  { key: "create", label: "Create Project", icon: FilePlus2 },
  { key: "approve", label: "Approve Milestone", icon: BadgeCheck },
  { key: "release", label: "Release Funds", icon: Wallet },
  { key: "reports", label: "Reports", icon: LineChart },
] as const;

const inputClass =
  "mt-2 w-full rounded-2xl border border-border bg-secondary/40 px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/60";

function GovernmentPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]["key"]>("create");

  return (
    <div>
      <PageHeader
        eyebrow="Government portal"
        title="Sanction, verify and settle — in one console"
        description="A department-side workspace concept. All forms here are interface-only demonstrations; nothing is submitted anywhere."
      />

      <section className="mx-auto max-w-7xl px-5 py-6">
        <SectionHeading center={false} eyebrow="Tracked projects" title="Your department portfolio" />
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {projects.slice(0, 6).map((p, i) => (
            <Reveal key={p.id} delay={i * 0.06}>
              <GlassCard className="flex h-full flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.id} · {p.department}</p>
                  </div>
                  <StatusPill status={p.status} />
                </div>
                <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-xs text-muted-foreground">Budget</dt>
                    <dd className="font-medium">{formatINR(p.budget)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Released</dt>
                    <dd className="font-medium text-info">{formatINR(p.released)}</dd>
                  </div>
                </dl>
                <div className="mt-5">
                  <ProgressBar value={p.progress} />
                  <p className="mt-2 text-xs text-muted-foreground">{p.progress}% complete · updated {p.updated}</p>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <ActionButton className="px-4 py-2 text-xs" variant="ghost">Track</ActionButton>
                  <ActionButton className="px-4 py-2 text-xs">Approve milestone</ActionButton>
                </div>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12">
        <SectionHeading center={false} eyebrow="Actions" title="Departmental workflows" />
        <div className="mt-8 flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm transition-colors ${
                tab === t.key
                  ? "border-primary/60 bg-primary/20 text-foreground"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </div>

        <GlassCard hover={false} className="mt-6">
          {tab === "create" && (
            <form className="grid gap-5 md:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
              <label className="text-sm md:col-span-2">
                Project name
                <input className={inputClass} placeholder="e.g. District Ring Road Phase III" />
              </label>
              <label className="text-sm">
                Department
                <input className={inputClass} placeholder="Public Works" />
              </label>
              <label className="text-sm">
                State / District
                <input className={inputClass} placeholder="Maharashtra / Pune" />
              </label>
              <label className="text-sm">
                Total budget (₹)
                <input className={inputClass} placeholder="42000000" />
              </label>
              <label className="text-sm">
                Number of milestones
                <input className={inputClass} placeholder="5" />
              </label>
              <label className="text-sm md:col-span-2">
                Scope summary
                <textarea rows={4} className={inputClass} placeholder="Describe deliverables and acceptance criteria" />
              </label>
              <div className="md:col-span-2">
                <ActionButton type="submit">
                  <Send className="h-4 w-4" /> Publish to escrow (demo)
                </ActionButton>
              </div>
            </form>
          )}

          {tab === "approve" && (
            <div className="grid gap-4">
              {["Earthwork and sub-base", "Drainage & culverts", "Bituminous surfacing"].map((m, i) => (
                <div key={m} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-2xl border border-border p-4">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{m}</p>
                    <p className="text-xs text-muted-foreground">JSC-1041 · evidence bundle #{2201 + i}</p>
                  </div>
                  <ActionButton className="px-4 py-2 text-xs">Verify</ActionButton>
                </div>
              ))}
            </div>
          )}

          {tab === "release" && (
            <form className="grid gap-5 md:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
              <label className="text-sm">
                Project ID
                <input className={inputClass} placeholder="JSC-1041" />
              </label>
              <label className="text-sm">
                Milestone
                <input className={inputClass} placeholder="Milestone 04" />
              </label>
              <label className="text-sm">
                Release amount (₹)
                <input className={inputClass} placeholder="7800000" />
              </label>
              <label className="text-sm">
                Beneficiary
                <input className={inputClass} placeholder="Sahyadri Infra Pvt Ltd" />
              </label>
              <div className="md:col-span-2">
                <ActionButton type="submit">
                  <Wallet className="h-4 w-4" /> Trigger release (demo)
                </ActionButton>
              </div>
            </form>
          )}

          {tab === "reports" && (
            <div className="grid gap-4 sm:grid-cols-3">
              {["Quarterly disbursement", "Milestone compliance", "Contractor performance"].map((r) => (
                <div key={r} className="rounded-2xl border border-border p-5">
                  <LineChart className="h-5 w-5 text-info" />
                  <p className="mt-4 font-medium">{r}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Generated from ledger events</p>
                  <ActionButton className="mt-4 px-4 py-2 text-xs" variant="ghost">Download</ActionButton>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </section>
    </div>
  );
}