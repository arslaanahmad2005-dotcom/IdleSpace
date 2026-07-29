import { Link } from "@tanstack/react-router";
import { Github, Linkedin, ShieldCheck } from "lucide-react";
import { navLinks, portalLinks } from "./Navbar";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-border/70 bg-background/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand">
              <ShieldCheck className="h-5 w-5 text-primary-foreground" />
            </span>
            <span className="font-display text-base font-bold">JanSamarth Chain</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Building Trust Through Transparent Governance. A conceptual blockchain-escrow platform for public
            infrastructure funding.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Platform</h4>
          <ul className="mt-4 grid gap-2">
            {navLinks.slice(1, 6).map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Portals</h4>
          <ul className="mt-4 grid gap-2">
            {portalLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Connect</h4>
          <div className="mt-4 flex gap-3">
            <span className="glass grid h-10 w-10 place-items-center rounded-xl text-muted-foreground">
              <Github className="h-4 w-4" />
            </span>
            <span className="glass grid h-10 w-10 place-items-center rounded-xl text-muted-foreground">
              <Linkedin className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Demonstration interface with mock data only. No live ledger connection.
          </p>
        </div>
      </div>

      <div className="border-t border-border/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 JanSamarth Chain. Concept prototype.</p>
          <div className="flex flex-wrap gap-5">
            <span>Privacy Policy</span>
            <span>Terms of Use</span>
            <span>GitHub</span>
            <span>LinkedIn</span>
          </div>
        </div>
      </div>
    </footer>
  );
}