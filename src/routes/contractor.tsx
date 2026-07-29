import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, CloudUpload, FileText, HardHat, Wallet } from "lucide-react";
import { ActionButton, GlassCard, PageHeader, ProgressBar, Reveal, SectionHeading, StatusPill } from "@/components/Primitives";
import { formatINR, milestones, projects } from "@/data/mock";

export const Route = createFileRoute("/contractor")({
  head: () => ({
    meta: [
      { title: "Contractor Portal | JanSamarth Chain" },
      {
        name: "description",
        content:
          "Contractor-side interface concept for assigned projects, milestone proof uploads, payment status and completed work history.",
      },
      { property: "og:title", content: "Contractor Portal — JanSamarth Chain" },
      { property: "og:description", content: "Upload milestone proof and track automatic payment release." },
    ],
  }),
  component: ContractorPage,
});

function ContractorPage() {
  const [files, setFiles] = useState<string[]>([]);
  const assigned = projects.slice(0, 4);

  const addDemoFile = () =>
    setFiles((f) => [...f, `milestone-evidence-${String(f.length + 1).padStart(2, "0")}.jpg`]);

  return (
    <div>
      <PageHeader
        eyebrow="Contractor portal"
        title="Submit proof once. Get paid automatically."
        description="Track assigned work, upload milestone evidence and watch escrow settle without chasing files. This portal is a UI demonstration only."
      />

      <section className="mx-auto max-w-7xl px-5 py-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: HardHat, label: "Assigned Projects", value: "12" },
            { icon: CloudUpload, label: "Milestones Awaiting Upload", value: "5" },
            { icon: Wallet, label: "Payment Released", value: "₹18.4 Cr" },
            { icon: CheckCircle2, label: "Completed Work", value: "31" },
          ].map((c, i) => (
            <Reveal key={c.label} delay={i * 0.06}>
              <GlassCard className="h-full">
                <c.icon className="h-5 w-5 text-info" />
                <p className="mt-4 font-display text-2xl font-bold">{c.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{c.label}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10">
        <SectionHeading center={false} eyebrow="Assigned work" title="Projects allotted to you" />
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {assigned.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.06}>
              <GlassCard className="h-full">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.id} · {p.state}</p>
                  </div>
                  <StatusPill status={p.status} />
                </div>
                <div className="mt-5">
                  <ProgressBar value={p.progress} />
                  <p className="mt-2 text-xs text-muted-foreground">
                    {formatINR(p.released)} released of {formatINR(p.budget)}
                  </p>
                </div>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10">
        <div className="grid gap-5 lg:grid-cols-2">
          <Reveal>
            <GlassCard hover={false} className="h-full">
              <h3 className="text-lg font-semibold">Upload milestone proof</h3>
              <p className="mt-1 text-sm text-muted-foreground">Geo-tagged photos, measurement sheets and invoices.</p>
              <button
                onClick={addDemoFile}
                className="mt-5 grid w-full place-items-center gap-3 rounded-3xl border border-dashed border-border bg-secondary/30 px-6 py-12 text-center transition-colors hover:border-primary/60"
              >
                <CloudUpload className="h-8 w-8 text-info" />
                <span className="text-sm font-medium">Click to add a demo file</span>
                <span className="text-xs text-muted-foreground">JPG, PDF up to 25 MB · nothing is actually uploaded</span>
              </button>
              {files.length > 0 && (
                <ul className="mt-5 grid gap-2">
                  {files.map((f) => (
                    <li key={f} className="flex items-center gap-3 rounded-2xl border border-border px-4 py-3 text-sm">
                      <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="truncate">{f}</span>
                      <span className="ml-auto shrink-0 text-xs text-success">Ready</span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-5">
                <ActionButton>Submit for verification (demo)</ActionButton>
              </div>
            </GlassCard>
          </Reveal>

          <Reveal delay={0.08}>
            <GlassCard hover={false} className="h-full">
              <h3 className="text-lg font-semibold">Payment status</h3>
              <p className="mt-1 text-sm text-muted-foreground">Rural Road Corridor — Phase II (JSC-1041)</p>
              <ul className="mt-5 grid gap-3">
                {milestones.map((m) => (
                  <li key={m.title} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-border px-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{m.title}</p>
                      <p className="text-xs text-muted-foreground">{m.date} · {formatINR(m.amount)}</p>
                    </div>
                    <StatusPill status={m.status} />
                  </li>
                ))}
              </ul>
            </GlassCard>
          </Reveal>
        </div>
      </section>
    </div>
  );
}