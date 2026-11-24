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
  Building2,
  Heart,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useNotifications } from "@/hooks/use-idle-store";
import type { UserRole } from "@/lib/store";

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
  const { user, appUser, switchRole, signOut } = useAuth();
  const { unreadCount } = useNotifications(user?.id);
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

  const handleRoleChange = (role: UserRole) => {
    switchRole(role);
    setDropdownOpen(false);
    if (role === "host") {
      navigate({ to: "/host/dashboard" });
    } else if (role === "admin") {
      navigate({ to: "/admin" });
    } else {
      navigate({ to: "/dashboard" });
    }
  };

  const currentRole = appUser?.role || "booker";

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
                activeProps={{ className: "px-3 py-2 rounded-lg text-sm text-foreground bg-secondary font-medium" }}
              >
                {l.label}
              </Link>
            ))}
            {currentRole === "admin" && (
              <Link
                to="/admin"
                className="px-3 py-2 rounded-lg text-sm text-primary font-medium hover:bg-primary/10 transition-colors flex items-center gap-1"
                activeProps={{ className: "px-3 py-2 rounded-lg text-sm bg-primary/15 font-semibold text-primary" }}
              >
                <ShieldCheck className="h-3.5 w-3.5" /> Admin
              </Link>
            )}
          </nav>

          <div className="hidden md:flex items-center gap-2 ml-auto">
            {/* Quick Role Switcher Pill for Demo Evaluators */}
            <div className="flex items-center bg-secondary/80 rounded-xl p-0.5 border border-border text-xs">
              <button
                onClick={() => handleRoleChange("booker")}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  currentRole === "booker" ? "bg-card text-foreground shadow-sm font-semibold" : "text-muted-foreground hover:text-foreground"
                }`}
                title="Explore as Booker / Guest"
              >
                Booker
              </button>
              <button
                onClick={() => handleRoleChange("host")}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  currentRole === "host" ? "bg-card text-primary shadow-sm font-semibold" : "text-muted-foreground hover:text-foreground"
                }`}
                title="Manage listings and bookings as Host"
              >
                Host
              </button>
              <button
                onClick={() => handleRoleChange("admin")}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  currentRole === "admin" ? "bg-card text-accent shadow-sm font-semibold" : "text-muted-foreground hover:text-foreground"
                }`}
                title="Manage platform and listings as Admin"
              >
                Admin
              </button>
            </div>

            <Link to="/browse" className="p-2 rounded-lg hover:bg-secondary transition-colors" aria-label="Search">
              <Search className="h-4 w-4" />
            </Link>

            <Link to="/favourites" className="p-2 rounded-lg hover:bg-secondary transition-colors" aria-label="Saved spaces">
              <Heart className="h-4 w-4 text-muted-foreground hover:text-destructive" />
            </Link>

            <Link to="/notifications" className="p-2 rounded-lg hover:bg-secondary transition-colors relative" aria-label="Notifications">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-4 h-4 px-1 rounded-full bg-destructive text-[10px] font-bold text-white flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Link>

            <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-secondary transition-colors" aria-label="Toggle theme">
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Auth-aware avatar & menu */}
            {user ? (
              <div className="relative ml-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDropdownOpen((v) => !v);
                  }}
                  className="h-9 px-2 rounded-xl gradient-primary text-white flex items-center gap-1.5 ring-2 ring-background hover:opacity-90 transition-opacity shadow-sm"
                  aria-label="Account menu"
                >
                  <span className="text-xs font-bold">{initials}</span>
                  <ChevronDown className="h-3 w-3 opacity-80" />
                </button>

                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 rounded-2xl bg-card border border-border shadow-elegant py-2 animate-fade-up z-50 text-foreground"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="px-4 py-2.5 border-b border-border">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold truncate">{displayName}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider gradient-primary text-white">
                          {currentRole}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground truncate mt-0.5">{user.email}</div>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-secondary transition-colors"
                      >
                        <LayoutDashboard className="h-4 w-4 text-primary" /> Booker Dashboard
                      </Link>
                      <Link
                        to="/host/dashboard"
                        className="flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-secondary transition-colors"
                      >
                        <Building2 className="h-4 w-4 text-accent" /> Host Command Center
                      </Link>
                      <Link
                        to="/admin"
                        className="flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-secondary transition-colors"
                      >
                        <ShieldCheck className="h-4 w-4 text-emerald-500" /> Platform Admin
                      </Link>
                      <Link
                        to="/favourites"
                        className="flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-secondary transition-colors"
                      >
                        <Heart className="h-4 w-4 text-rose-500" /> Wishlist / Saved
                      </Link>
                      <Link
                        to="/profile"
                        className="flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-secondary transition-colors"
                      >
                        <User className="h-4 w-4 text-muted-foreground" /> Profile & Settings
                      </Link>
                    </div>

                    <div className="h-px bg-border my-1" />

                    <div className="px-4 py-2">
                      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                        Switch Role Persona:
                      </p>
                      <div className="grid grid-cols-3 gap-1.5">
                        <Button
                          size="sm"
                          variant={currentRole === "booker" ? "default" : "outline"}
                          className="h-7 text-xs rounded-lg"
                          onClick={() => handleRoleChange("booker")}
                        >
                          Booker
                        </Button>
                        <Button
                          size="sm"
                          variant={currentRole === "host" ? "default" : "outline"}
                          className="h-7 text-xs rounded-lg"
                          onClick={() => handleRoleChange("host")}
                        >
                          Host
                        </Button>
                        <Button
                          size="sm"
                          variant={currentRole === "admin" ? "default" : "outline"}
                          className="h-7 text-xs rounded-lg"
                          onClick={() => handleRoleChange("admin")}
                        >
                          Admin
                        </Button>
                      </div>
                    </div>

                    <div className="h-px bg-border my-1" />

                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-destructive hover:bg-secondary transition-colors w-full text-left font-medium"
                    >
                      <LogOut className="h-4 w-4" /> Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
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
            <Link to="/notifications" className="p-2 rounded-lg hover:bg-secondary relative" aria-label="Notifications">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
              )}
            </Link>
            {user ? (
              <Link to="/dashboard" className="p-1 rounded-lg hover:bg-secondary" aria-label="Account">
                <div className="h-8 w-8 rounded-full gradient-primary grid place-items-center text-white text-xs font-bold">
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
          <div className="lg:hidden mt-2 glass-strong rounded-2xl p-4 animate-fade-up shadow-elegant">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-border">
                <span className="text-xs font-semibold text-muted-foreground uppercase">Current Role:</span>
                <div className="flex gap-1">
                  {(["booker", "host", "admin"] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => handleRoleChange(r)}
                      className={`text-xs px-2.5 py-1 rounded-lg capitalize font-medium ${
                        currentRole === r ? "gradient-primary text-white" : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {links.map((l) => (
                <Link key={l.to} to={l.to} className="px-3 py-2 rounded-lg hover:bg-secondary text-sm">
                  {l.label}
                </Link>
              ))}
              <Link to="/favourites" className="px-3 py-2 rounded-lg hover:bg-secondary text-sm flex items-center justify-between">
                <span>Wishlist</span>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </Link>
              {currentRole === "admin" && (
                <Link to="/admin" className="px-3 py-2 rounded-lg hover:bg-secondary text-sm font-semibold text-primary">
                  Admin Portal
                </Link>
              )}

              <div className="h-px bg-border my-2" />

              {user ? (
                <>
                  <Link to="/dashboard" className="px-3 py-2 rounded-lg hover:bg-secondary text-sm font-medium">Booker Dashboard</Link>
                  <Link to="/host/dashboard" className="px-3 py-2 rounded-lg hover:bg-secondary text-sm font-medium">Host Dashboard</Link>
                  <Link to="/profile" className="px-3 py-2 rounded-lg hover:bg-secondary text-sm">Profile & Settings</Link>
                  <button
                    onClick={handleSignOut}
                    className="px-3 py-2 rounded-lg hover:bg-secondary text-sm text-destructive text-left font-medium"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="px-3 py-2 rounded-lg hover:bg-secondary text-sm">Sign in</Link>
                  <Link to="/signup" className="px-3 py-2 rounded-lg text-sm gradient-primary text-white mt-1 text-center font-medium">
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
