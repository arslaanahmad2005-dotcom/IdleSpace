import type { ReactNode } from "react";
import { SiteNav } from "./site-nav";
import { SiteFooter } from "./site-footer";

export function SiteLayout({ children, hideFooter = false }: { children: ReactNode; hideFooter?: boolean }) {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteNav />
      <main className="flex-1 pt-24">{children}</main>
      {!hideFooter && <SiteFooter />}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 gradient-mesh opacity-70 -z-10" />
      <div className="mx-auto max-w-7xl px-4 py-16 md:py-24">
        {eyebrow && (
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3 animate-fade-up">
            {eyebrow}
          </p>
        )}
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl animate-fade-up">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl animate-fade-up">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
