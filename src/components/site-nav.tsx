import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Search, Bell, User, Sparkles, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

const links = [
  { to: "/browse", label: "Browse" },
  { to: "/ai-recommendations", label: "AI Picks" },
  { to: "/host/dashboard", label: "For Hosts" },
  { to: "/about", label: "About" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4">
        <div
          className={`glass-strong rounded-2xl px-4 sm:px-6 py-3 flex items-center gap-4 transition-shadow ${
            scrolled ? "shadow-elegant" : ""
          }`}
        >
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="h-9 w-9 rounded-xl gradient-primary grid place-items-center shadow-glow">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">IdleSpace</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 ml-4">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                activeProps={{ className: "px-3 py-2 rounded-lg text-sm text-foreground bg-secondary" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2 ml-auto">
            <Link to="/browse" className="p-2 rounded-lg hover:bg-secondary transition-colors" aria-label="Search">
              <Search className="h-4 w-4" />
            </Link>
            <Link to="/notifications" className="p-2 rounded-lg hover:bg-secondary transition-colors relative" aria-label="Notifications">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
            </Link>
            <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-secondary transition-colors" aria-label="Toggle theme">
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="gradient-primary text-white shadow-elegant hover:opacity-95">
                Get started
              </Button>
            </Link>
          </div>

          <div className="md:hidden ml-auto flex items-center gap-1">
            <Link to="/dashboard" className="p-2 rounded-lg hover:bg-secondary" aria-label="Account">
              <User className="h-5 w-5" />
            </Link>
            <button className="p-2 rounded-lg hover:bg-secondary" onClick={() => setOpen((v) => !v)} aria-label="Menu">
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden mt-2 glass-strong rounded-2xl p-3 animate-fade-up">
            <div className="flex flex-col">
              {links.map((l) => (
                <Link key={l.to} to={l.to} className="px-3 py-2.5 rounded-lg hover:bg-secondary text-sm">
                  {l.label}
                </Link>
              ))}
              <div className="h-px bg-border my-2" />
              <Link to="/login" className="px-3 py-2.5 rounded-lg hover:bg-secondary text-sm">Sign in</Link>
              <Link to="/signup" className="px-3 py-2.5 rounded-lg text-sm gradient-primary text-white mt-1 text-center font-medium">
                Get started
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
