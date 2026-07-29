import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { formatINR, projects, type ProjectStatus } from "@/data/mock";
import { ProgressBar, StatusPill } from "./Primitives";

const statuses: (ProjectStatus | "All")[] = ["All", "Active", "Completed", "Pending Verification", "Delayed"];
const PAGE_SIZE = 5;

export default function ProjectTable() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<(typeof statuses)[number]>("All");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter(
      (p) =>
        (status === "All" || p.status === status) &&
        (q === "" || `${p.name} ${p.department} ${p.state} ${p.id}`.toLowerCase().includes(q)),
    );
  }, [query, status]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  return (
    <div className="glass rounded-3xl p-5 sm:p-6">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search project, department or state"
            className="w-full rounded-full border border-border bg-secondary/40 py-3 pl-11 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/60"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatus(s);
                setPage(1);
              }}
              className={`rounded-full border px-3.5 py-2 text-xs font-medium transition-colors ${
                status === s
                  ? "border-primary/60 bg-primary/20 text-foreground"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[860px] border-collapse text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-3 py-3 font-medium">Project</th>
              <th className="px-3 py-3 font-medium">Department</th>
              <th className="px-3 py-3 font-medium">Budget</th>
              <th className="px-3 py-3 font-medium">Released</th>
              <th className="px-3 py-3 font-medium">Status</th>
              <th className="px-3 py-3 font-medium">Progress</th>
              <th className="px-3 py-3 font-medium">Updated</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="border-t border-border/70 transition-colors hover:bg-secondary/30">
                <td className="px-3 py-4">
                  <p className="font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {p.id} · {p.state}
                  </p>
                </td>
                <td className="px-3 py-4 text-muted-foreground">{p.department}</td>
                <td className="px-3 py-4">{formatINR(p.budget)}</td>
                <td className="px-3 py-4 text-info">{formatINR(p.released)}</td>
                <td className="px-3 py-4">
                  <StatusPill status={p.status} />
                </td>
                <td className="w-40 px-3 py-4">
                  <ProgressBar value={p.progress} />
                  <span className="mt-1 block text-xs text-muted-foreground">{p.progress}%</span>
                </td>
                <td className="px-3 py-4 text-muted-foreground">{p.updated}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-3 py-10 text-center text-muted-foreground">
                  No projects match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          Showing {rows.length} of {filtered.length} projects
        </p>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`h-9 w-9 rounded-xl border text-sm transition-colors ${
                n === current
                  ? "border-primary/60 bg-primary/20 text-foreground"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}