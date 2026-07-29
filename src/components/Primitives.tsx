import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function GlassCard({
  children,
  className,
  hover = true,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        "glass rounded-3xl p-6 transition-all duration-300",
        hover && "hover:-translate-y-1 hover:glow-ring hover:border-primary/40",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = true,
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl", center && "mx-auto text-center", className)}>
      {eyebrow && (
        <span className="inline-flex items-center rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
        <span className="text-gradient">{title}</span>
      </h2>
      {subtitle && <p className="mt-4 text-base leading-relaxed text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

type ButtonProps = {
  children: ReactNode;
  to?: string;
  variant?: "primary" | "ghost";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
};

export function ActionButton({ children, to, variant = "primary", className, onClick, type = "button" }: ButtonProps) {
  const styles = cn(
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300",
    variant === "primary"
      ? "bg-brand text-primary-foreground shadow-[var(--shadow-glow)] hover:brightness-110 hover:-translate-y-0.5"
      : "glass text-foreground hover:border-primary/50 hover:-translate-y-0.5",
    className,
  );
  if (to) {
    return (
      <Link to={to} className={styles}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} className={styles}>
      {children}
    </button>
  );
}

export function Counter({
  value,
  suffix = "",
  prefix = "",
  decimals = 0,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 60, damping: 18 });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (inView) mv.set(value);
  }, [inView, mv, value]);

  useEffect(() => spring.on("change", (v) => setDisplay(v.toFixed(decimals))), [spring, decimals]);

  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

export function StatusPill({ status }: { status: string }) {
  const tone =
    status === "Completed" || status === "Verified"
      ? "text-success border-success/40 bg-success/10"
      : status === "Delayed"
        ? "text-destructive border-destructive/40 bg-destructive/10"
        : status === "Pending Verification" || status === "Under review"
          ? "text-warning border-warning/40 bg-warning/10"
          : "text-info border-info/40 bg-info/10";
  return (
    <span className={cn("inline-flex whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium", tone)}>
      {status}
    </span>
  );
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary/70">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${value}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="h-full rounded-full bg-brand"
      />
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="mx-auto max-w-7xl px-5 pt-14 pb-10 sm:pt-20">
      <Reveal>
        <span className="inline-flex items-center rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {eyebrow}
        </span>
        <h1 className="mt-5 max-w-4xl text-4xl font-bold leading-tight sm:text-5xl">
          <span className="text-gradient">{title}</span>
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">{description}</p>
      </Reveal>
    </section>
  );
}