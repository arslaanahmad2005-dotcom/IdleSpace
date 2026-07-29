import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, ShieldCheck } from "lucide-react";
import { ActionButton } from "./Primitives";

export const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/problem", label: "Problem" },
  { to: "/solution", label: "Solution" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/workflow", label: "Workflow" },
  { to: "/technology", label: "Technology" },
  { to: "/impact", label: "Impact" },
  { to: "/contact", label: "Contact" },
];

export const portalLinks = [
  { to: "/government", label: "Government Portal" },
  { to: "/contractor", label: "Contractor Portal" },
  { to: "/citizen", label: "Citizen Dashboard" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/70 backdrop-blur-xl">
      <nav className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3 lg:flex lg:justify-between">
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand shadow-[var(--shadow-glow)]">
            <ShieldCheck className="h-5 w-5 text-primary-foreground" />
          </span>
          <span className="min-w-0">
            <span className="block truncate font-display text-base font-bold">JanSamarth Chain</span>
            <span className="block truncate text-[11px] text-muted-foreground">Transparent Governance</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              activeProps={{ className: "text-foreground bg-secondary/60" }}
              inactiveProps={{ className: "text-muted-foreground" }}
              className="rounded-full px-3 py-2 text-sm font-medium transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:block">
          <ActionButton to="/citizen" className="px-5 py-2.5">
            Citizen Access
          </ActionButton>
        </div>

        <button
          aria-label="Toggle navigation"
          onClick={() => setOpen((v) => !v)}
          className="glass grid h-10 w-10 shrink-0 place-items-center rounded-xl lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-border/70 px-5 pb-5 pt-3 lg:hidden">
          <div className="grid gap-1">
            {[...navLinks, ...portalLinks].map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}