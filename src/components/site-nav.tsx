import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Menu,
  X,
  Search,
  Bell,
  Sparkles,
  Moon,
  Sun,
  LogOut,
  User,
  LayoutDashboard,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => setDropdownOpen(false), [pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = () => setDropdownOpen(false);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [dropdownOpen]);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  /** Initials from user metadata or email */
  const initials = user
    ? (user.user_metadata?.full_name as string | undefined)
        ?.split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() ??
      user.email?.slice(0, 2).toUpperCase() ??
      "U"
    : "";

  const displayName =
    (user?.user_metadata?.full_name as string | undefined) ??
    user?.email ??
    "User";

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

            {/* Auth-aware section */}
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground ml-2" />
            ) : user ? (
              /* --- Logged-in: avatar dropdown --- */
              <div className="relative ml-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDropdownOpen((v) => !v);
                  }}
                  className="h-9 w-9 rounded-full gradient-primary grid place-items-center text-white text-xs font-bold ring-2 ring-background hover:opacity-90 transition-opacity"
                  aria-label="Account menu"
                >
                  {initials}
                </button>

                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-xl bg-card border border-border shadow-elegant py-1 animate-fade-up z-50"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="px-3 py-2 border-b border-border">
                      <div className="text-sm font-semibold truncate">{displayName}</div>
                      <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                    </div>
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4" /> Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary transition-colors"
                    >
                      <User className="h-4 w-4" /> Profile
                    </Link>
                    <div className="h-px bg-border my-1" />
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-secondary transition-colors w-full text-left"
                    >
                      <LogOut className="h-4 w-4" /> Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* --- Logged-out: sign in / get started --- */
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Sign in</Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="gradient-primary text-white shadow-elegant hover:opacity-95">
                    Get started
                  </Button>
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden ml-auto flex items-center gap-1">
            {user ? (
              <Link to="/dashboard" className="p-2 rounded-lg hover:bg-secondary" aria-label="Account">
                <div className="h-7 w-7 rounded-full gradient-primary grid place-items-center text-white text-[10px] font-bold">
                  {initials}
                </div>
              </Link>
            ) : (
              <Link to="/login" className="p-2 rounded-lg hover:bg-secondary" aria-label="Sign in">
                <User className="h-5 w-5" />
              </Link>
            )}
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
              {user ? (
                <>
                  <Link to="/dashboard" className="px-3 py-2.5 rounded-lg hover:bg-secondary text-sm">Dashboard</Link>
                  <Link to="/profile" className="px-3 py-2.5 rounded-lg hover:bg-secondary text-sm">Profile</Link>
                  <button
                    onClick={handleSignOut}
                    className="px-3 py-2.5 rounded-lg hover:bg-secondary text-sm text-destructive text-left"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="px-3 py-2.5 rounded-lg hover:bg-secondary text-sm">Sign in</Link>
                  <Link to="/signup" className="px-3 py-2.5 rounded-lg text-sm gradient-primary text-white mt-1 text-center font-medium">
                    Get started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
