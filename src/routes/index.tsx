import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Search,
  MapPin,
  Sparkles,
  Building2,
  Camera,
  Users,
  GraduationCap,
  ChefHat,
  Coffee,
  Presentation,
  PartyPopper,
  UtensilsCrossed,
  Shield,
  Zap,
  Wallet,
  ArrowRight,
  Star,
  TrendingUp,
  Clock,
  UserCheck,
  ShieldCheck,
} from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { SpaceCard } from "@/components/space-card";
import { Button } from "@/components/ui/button";
import { TESTIMONIALS, CATEGORIES } from "@/lib/dummy-data";
import { useSpaces } from "@/hooks/use-idle-store";
import { useAuth } from "@/hooks/use-auth";
import type { UserRole } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "IdleSpace — Book unused business spaces by the hour" },
      {
        name: "description",
        content:
          "Rent restaurants, studios, kitchens, classrooms and more by the hour. The premium marketplace for underused spaces.",
      },
      { property: "og:title", content: "IdleSpace — Book unused business spaces by the hour" },
      {
        property: "og:description",
        content:
          "Rent restaurants, studios, kitchens, classrooms and more by the hour. The premium marketplace for underused spaces.",
      },
    ],
  }),
  component: Landing,
});

const iconMap = {
  UtensilsCrossed,
  Users,
  Camera,
  GraduationCap,
  ChefHat,
  Coffee,
  Presentation,
  PartyPopper,
} as const;

function Counter({
  end,
  suffix = "",
  duration = 1400,
}: {
  end: number;
  suffix?: string;
  duration?: number;
}) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setN(Math.floor(end * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [end, duration]);
  return (
    <span>
      {n.toLocaleString()}
      {suffix}
    </span>
  );
}

function Landing() {
  const { spaces } = useSpaces();
  const { switchRole } = useAuth();
  const navigate = useNavigate();

  const [where, setWhere] = useState("");
  const [when, setWhen] = useState("");

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/browse" });
  };

  const handleRoleLaunch = (role: UserRole) => {
    switchRole(role);
    if (role === "host") navigate({ to: "/host/dashboard" });
    else if (role === "admin") navigate({ to: "/admin" });
    else navigate({ to: "/browse" });
  };

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh animate-gradient -z-10" />
        <div className="absolute top-40 -left-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl animate-float -z-10" />
        <div
          className="absolute top-20 right-0 h-96 w-96 rounded-full bg-accent/20 blur-3xl animate-float -z-10"
          style={{ animationDelay: "2s" }}
        />

        <div className="mx-auto max-w-7xl px-4 pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-semibold animate-fade-up shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              AI-Powered Hourly Venue Marketplace
            </div>
            <h1
              className="mt-6 text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight animate-fade-up"
              style={{ animationDelay: "80ms" }}
            >
              Book <span className="gradient-text">unused spaces</span>
              <br />
              by the hour.
            </h1>
            <p
              className="mt-5 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-up leading-relaxed"
              style={{ animationDelay: "160ms" }}
            >
              Rooftops at 3 PM. Commercial kitchens at 5 AM. Modern meeting lofts whenever you need them.
              IdleSpace unlocks the world's underutilized business spaces.
            </p>
          </div>

          {/* Search Bar */}
          <form
            onSubmit={handleHeroSearch}
            className="mt-10 max-w-3xl mx-auto glass-strong rounded-2xl p-2 shadow-elegant animate-fade-up"
            style={{ animationDelay: "240ms" }}
          >
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-2">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-secondary/50 transition-colors">
                <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                <input
                  value={where}
                  onChange={(e) => setWhere(e.target.value)}
                  placeholder="Where? (e.g. Mumbai, Bangalore, Pune)"
                  className="bg-transparent outline-none w-full text-sm"
                />
              </div>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-secondary/50 transition-colors border-t md:border-t-0 md:border-l border-border">
                <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                <input
                  value={when}
                  onChange={(e) => setWhen(e.target.value)}
                  placeholder="When? (e.g. Tomorrow 2 PM)"
                  className="bg-transparent outline-none w-full text-sm"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full md:w-auto h-full gradient-primary text-white shadow-elegant hover:opacity-95 rounded-xl font-semibold"
              >
                <Search className="h-4 w-4 mr-2" /> Search Spaces
              </Button>
            </div>
          </form>

          {/* Quick Demo Switcher Hub for Presentation Evaluation */}
          <div className="mt-8 max-w-xl mx-auto p-3.5 rounded-2xl glass-strong border border-border shadow-soft animate-fade-up text-center">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
              ⚡ College Demo Quick Tour (1-Click Explore):
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button
                size="sm"
                variant="outline"
                className="rounded-xl text-xs h-8"
                onClick={() => handleRoleLaunch("booker")}
              >
                <UserCheck className="h-3.5 w-3.5 mr-1 text-primary" /> Test as Booker
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="rounded-xl text-xs h-8"
                onClick={() => handleRoleLaunch("host")}
              >
                <Building2 className="h-3.5 w-3.5 mr-1 text-accent" /> Test as Host
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="rounded-xl text-xs h-8"
                onClick={() => handleRoleLaunch("admin")}
              >
                <ShieldCheck className="h-3.5 w-3.5 mr-1 text-emerald-500" /> Test as Admin
              </Button>
            </div>
          </div>

          {/* Stats Bar */}
          <div
            className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto animate-fade-up"
            style={{ animationDelay: "320ms" }}
          >
            {[
              { label: "Listed Spaces", value: spaces.length || 12, suffix: "+" },
              { label: "Active Cities", value: 8, suffix: " Metro hubs" },
              { label: "Total Bookings", value: 480, suffix: "+" },
              { label: "Customer Rating", value: 5, suffix: ".0★" },
            ].map((s) => (
              <div key={s.label} className="glass rounded-2xl p-5 text-center shadow-soft">
                <div className="text-2xl md:text-3xl font-bold gradient-text">
                  {s.suffix === ".0★" ? "4.9★" : <Counter end={s.value} suffix={s.suffix} />}
                </div>
                <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Popular Space Categories</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              From commercial bakeries and photo studios to high-floor boardrooms.
            </p>
          </div>
          <Link
            to="/browse"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all"
          >
            Browse all categories <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {CATEGORIES.map((c, i) => {
            const Icon = iconMap[c.icon as keyof typeof iconMap] || Building2;
            return (
              <Link
                key={c.id}
                to="/browse"
                className="group animate-fade-up"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="rounded-3xl p-5 bg-card border border-border hover-lift shadow-soft transition-all">
                  <div className="h-11 w-11 rounded-2xl gradient-primary grid place-items-center text-white shadow-elegant group-hover:scale-110 transition-transform">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="mt-4 font-bold text-base text-foreground">{c.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">Explore spaces →</div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Spaces */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Featured Spaces</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Hand-picked, identity-verified, and ready for instant booking.
            </p>
          </div>
          <Link
            to="/browse"
            className="text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1"
          >
            View all ({spaces.length}) <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {spaces.slice(0, 8).map((s, i) => (
            <SpaceCard key={s.id} space={s} index={i} />
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Zap,
              title: "Instant Reservations",
              body: "Pick your exact hours and guests, review transparent breakdowns, and reserve seamlessly.",
            },
            {
              icon: Shield,
              title: "Verified Protection",
              body: "Identity-checked hosts, PCI-compliant payment simulation, and ₹8.3 Cr coverage.",
            },
            {
              icon: Wallet,
              title: "No Subscriptions Needed",
              body: "Only pay for the exact hours you use. Zero commitments, no annual lock-ins.",
            },
          ].map((b, i) => (
            <div
              key={b.title}
              className="glass-strong rounded-3xl p-8 hover-lift animate-fade-up shadow-soft"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="h-12 w-12 rounded-2xl gradient-primary grid place-items-center text-white shadow-glow">
                <b.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-xl font-bold">{b.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-primary font-bold">How It Works</p>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">Three Simple Steps</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Whether you want to rent a space or monetize your unused business square footage.
          </p>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-6 relative">
          {[
            {
              n: "01",
              title: "Discover & Filter",
              body: "Search by city, budget, capacity, date availability, and equipment amenities.",
            },
            {
              n: "02",
              title: "Reserve & Confirm",
              body: "Select custom time slots, apply coupons, and checkout with instant simulated payment.",
            },
            {
              n: "03",
              title: "Access with QR",
              body: "Arrive at your confirmed venue, present your digital arrival pass, and enjoy.",
            },
          ].map((s, i) => (
            <div
              key={s.n}
              className="relative rounded-3xl p-8 bg-card border border-border hover-lift shadow-soft animate-fade-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="text-6xl font-black gradient-text opacity-70">{s.n}</div>
              <h3 className="mt-4 text-xl font-bold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs uppercase tracking-widest text-primary font-bold">Real Stories</p>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">Loved by Hosts & Bookers</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.name}
              className="rounded-3xl p-6 bg-card border border-border hover-lift shadow-soft flex flex-col justify-between"
            >
              <p className="text-sm text-muted-foreground italic leading-relaxed">"{t.quote}"</p>
              <div className="mt-6 flex items-center gap-3 pt-4 border-t border-border">
                <img src={t.avatar} alt={t.name} className="h-10 w-10 rounded-full object-cover" />
                <div>
                  <div className="font-bold text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Host CTA Banner */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="rounded-3xl gradient-primary p-8 md:p-14 text-white shadow-glow relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Have unused space sitting empty?
            </h2>
            <p className="mt-4 text-white/80 text-base md:text-lg leading-relaxed">
              Restaurants outside peak hours, event halls, photo studios, and classrooms can generate thousands in monthly revenue.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/add-space">
                <Button size="lg" className="bg-white text-slate-900 hover:bg-white/90 rounded-2xl font-bold shadow-lg">
                  List Your Space Now <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link to="/host/dashboard">
                <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 rounded-2xl font-semibold">
                  Visit Host Center
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
