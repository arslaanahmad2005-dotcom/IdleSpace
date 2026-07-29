import { createFileRoute } from "@tanstack/react-router";
import { Activity, CheckCircle2, ClipboardList, Hourglass, Lock, Wallet } from "lucide-react";
import { Counter, GlassCard, PageHeader, Reveal, SectionHeading } from "@/components/Primitives";
import ProjectTable from "@/components/ProjectTable";
import { CompletionChart, DepartmentChart, MonthlyReleaseChart, StateSpendChart } from "@/components/Charts";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Public Transparency Dashboard | JanSamarth Chain" },
      {
        name: "description",
        content:
          "Live-style analytics on public project budgets, released funds, department distribution and completion rates using demonstration data.",
      },
      { property: "og:title", content: "Public Transparency Dashboard" },
      { property: "og:description", content: "Funds locked, funds released and project progress at a glance." },
    ],
  }),
  component: DashboardPage,
});

const widgets = [
  { icon: ClipboardList, label: "Total Projects", value: 1284, suffix: "" },
  { icon: Activity, label: "Active Projects", value: 526, suffix: "" },
  { icon: Wallet, label: "Funds Released", value: 2984, prefix: "₹", suffix: " Cr" },
  { icon: Lock, label: "Funds Locked", value: 1836, prefix: "₹", suffix: " Cr" },
  { icon: CheckCircle2, label: "Completed Projects", value: 488, suffix: "" },
  { icon: Hourglass, label: "Pending Verification", value: 174, suffix: "" },
];

function DashboardPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Public dashboard"
        title="Every rupee, visible to everyone"
        description="A department-agnostic view of sanctioned budgets, escrow balances and verified disbursements. All values shown are demonstration data."
      />

      <section className="mx-auto max-w-7xl px-5 py-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {widgets.map((w, i) => (
            <Reveal key={w.label} delay={i * 0.05}>
              <GlassCard className="h-full">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-muted-foreground">{w.label}</span>
                  <w.icon className="h-5 w-5 shrink-0 text-info" />
                </div>
                <p className="mt-4 font-display text-3xl font-bold">
                  <Counter value={w.value} prefix={w.prefix} suffix={w.suffix} />
                </p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8">
        <div className="grid gap-5 lg:grid-cols-2">
          <Reveal>
            <GlassCard hover={false}>
              <h3 className="text-base font-semibold">Monthly fund release (₹ Cr)</h3>
              <p className="mb-4 text-xs text-muted-foreground">Released vs still locked in escrow</p>
              <MonthlyReleaseChart />
            </GlassCard>
          </Reveal>
          <Reveal delay={0.08}>
            <GlassCard hover={false}>
              <h3 className="text-base font-semibold">Department-wise projects</h3>
              <p className="mb-4 text-xs text-muted-foreground">Active engagements per department</p>
              <DepartmentChart />
            </GlassCard>
          </Reveal>
          <Reveal>
            <GlassCard hover={false}>
              <h3 className="text-base font-semibold">Completion rate</h3>
              <p className="mb-4 text-xs text-muted-foreground">Share of projects by lifecycle status</p>
              <CompletionChart />
            </GlassCard>
          </Reveal>
          <Reveal delay={0.08}>
            <GlassCard hover={false}>
              <h3 className="text-base font-semibold">State-wise spending (₹ Cr)</h3>
              <p className="mb-4 text-xs text-muted-foreground">Top seven states by disbursement</p>
              <StateSpendChart />
            </GlassCard>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10">
        <SectionHeading center={false} eyebrow="Project register" title="Search the public project ledger" />
        <div className="mt-8">
          <ProjectTable />
        </div>
      </section>
    </div>
  );
}