import { Link } from "@tanstack/react-router";
import { Sparkles, Twitter, Instagram, Linkedin, Github } from "lucide-react";

const cols = [
  {
    title: "Product",
    links: [
      { to: "/browse", label: "Browse spaces" },
      { to: "/ai-recommendations", label: "AI recommendations" },
      { to: "/ai-pricing", label: "Dynamic pricing" },
      { to: "/add-space", label: "List your space" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/about", label: "About" },
      { to: "/contact", label: "Contact" },
      { to: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "Legal",
    links: [
      { to: "/privacy", label: "Privacy" },
      { to: "/terms", label: "Terms" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,1fr))]">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl gradient-primary grid place-items-center shadow-glow">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight">IdleSpace</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground max-w-sm">
              The marketplace for unused business spaces. Book by the hour — restaurants, studios,
              classrooms, kitchens and more.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {[Twitter, Instagram, Linkedin, Github].map((Icon, i) => (
                <a key={i} href="#" className="p-2 rounded-lg hover:bg-secondary transition-colors">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="text-sm font-semibold mb-3">{c.title}</h4>
              <ul className="space-y-2">
                {c.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© 2026 IdleSpace, Inc. All rights reserved.</p>
          <p>Made with care in the cloud.</p>
        </div>
      </div>
    </footer>
  );
}
