import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

export interface TimelineStep {
  title: string;
  description: string;
  icon: LucideIcon;
}

export default function Timeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <div className="relative mx-auto max-w-3xl">
      <div className="absolute left-6 top-2 bottom-2 w-px bg-linear-to-b from-primary via-accent to-transparent sm:left-8" />
      <div className="grid gap-6">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="relative grid grid-cols-[auto_minmax(0,1fr)] items-start gap-4 sm:gap-6"
          >
            <span className="relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand shadow-[var(--shadow-glow)] sm:h-16 sm:w-16">
              <step.icon className="h-5 w-5 text-primary-foreground sm:h-6 sm:w-6" />
            </span>
            <div className="glass rounded-3xl p-5 transition-colors hover:border-primary/40">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-muted-foreground">STEP {String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="mt-1 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}