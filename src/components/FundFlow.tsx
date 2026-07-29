import { motion } from "framer-motion";
import { Building2, Landmark, HardHat, Users, AlertTriangle } from "lucide-react";

const nodes = [
  { label: "Government", sub: "Budget sanctioned", icon: Landmark },
  { label: "Department", sub: "Allocation routed", icon: Building2, leak: "Manual approvals, missing records" },
  { label: "Contractor", sub: "Work executed", icon: HardHat, leak: "Inflated bills, delayed payouts" },
  { label: "Beneficiary", sub: "Public service delivered", icon: Users, leak: "Partial delivery, no visibility" },
];

export default function FundFlow({ leaks = true }: { leaks?: boolean }) {
  return (
    <div className="grid gap-4">
      {nodes.map((node, i) => (
        <motion.div
          key={node.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.12 }}
          className="grid gap-4"
        >
          <div className="glass grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4 rounded-3xl p-5 sm:flex sm:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand">
                <node.icon className="h-5 w-5 text-primary-foreground" />
              </span>
              <div className="min-w-0">
                <p className="truncate font-semibold">{node.label}</p>
                <p className="truncate text-sm text-muted-foreground">{node.sub}</p>
              </div>
            </div>
            {leaks && node.leak && (
              <span className="col-span-2 inline-flex items-center gap-2 rounded-full border border-destructive/40 bg-destructive/10 px-3 py-1.5 text-xs text-destructive sm:col-auto">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                Leak point: {node.leak}
              </span>
            )}
          </div>

          {i < nodes.length - 1 && (
            <div className="flex justify-center">
              <motion.span
                animate={{ opacity: [0.25, 1, 0.25] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                className="h-10 w-0.5 rounded-full bg-linear-to-b from-primary to-accent"
              />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}