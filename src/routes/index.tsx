import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Search, MapPin, Sparkles, Building2, Camera, Users, GraduationCap,
  ChefHat, Coffee, Presentation, PartyPopper, UtensilsCrossed,
  Shield, Zap, Wallet, ArrowRight, Star, TrendingUp, Clock,
} from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { SpaceCard } from "@/components/space-card";
import { Button } from "@/components/ui/button";
import { SPACES, TESTIMONIALS, CATEGORIES } from "@/lib/dummy-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "IdleSpace — Book unused business spaces by the hour" },
      { name: "description", content: "Rent restaurants, studios, kitchens, classrooms and more by the hour. The premium marketplace for underused spaces." },
      { property: "og:title", content: "IdleSpace — Book unused business spaces by the hour" },
      { property: "og:description", content: "Rent restaurants, studios, kitchens, classrooms and more by the hour. The premium marketplace for underused spaces." },
    ],
  }),
  component: Landing,
});

const iconMap = { UtensilsCrossed, Users, Camera, GraduationCap, ChefHat, Coffee, Presentation, PartyPopper } as const;

function Counter({ end, suffix = "", duration = 1400 }: { end: number; suffix?: string; duration?: number }) {
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
  return <span>{n.toLocaleString()}{suffix}</span>;
}

function Landing() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh animate-gradient -z-10" />
        <div className="absolute top-40 -left-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl animate-float -z-10" />
        <div className="absolute top-20 right-0 h-96 w-96 rounded-full bg-accent/20 blur-3xl animate-float -z-10" style={{ animationDelay: "2s" }} />

        <div className="mx-auto max-w-7xl px-4 pt-16 pb-24 md:pt-24 md:pb-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 text-xs font-medium animate-fade-up">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              AI-powered space matching · Now in beta
            </div>
            <h1 className="mt-6 text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight animate-fade-up" style={{ animationDelay: "80ms" }}>
              Book <span className="gradient-text">unused spaces</span><br />by the hour.
            </h1>
            <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: "160ms" }}>
              Rooftops at 3 PM. Kitchens at 5 AM. Meeting rooms whenever you need them. IdleSpace unlocks the world's underused business spaces.
            </p>
          </div>

          {/* Search */}
          <div className="mt-10 max-w-3xl mx-auto glass-strong rounded-2xl p-2 shadow-elegant animate-fade-up" style={{ animationDelay: "240ms" }}>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-2">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-secondary/50 transition-colors">
                <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                <input placeholder="Where to?" className="bg-transparent outline-none w-full text-sm" />
              </div>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-secondary/50 transition-colors border-t md:border-t-0 md:border-l border-border">
                <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                <input placeholder="When?" className="bg-transparent outline-none w-full text-sm" />
              </div>
              <Link to="/browse">
                <Button size="lg" className="w-full md:w-auto h-full gradient-primary text-white shadow-elegant hover:opacity-95 rounded-xl">
                  <Search className="h-4 w-4 mr-2" /> Search
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto animate-fade-up" style={{ animationDelay: "320ms" }}>
            {[
              { label: "Spaces", value: 12400, suffix: "+" },
              { label: "Cities", value: 84 },
              { label: "Hours booked", value: 480000, suffix: "+" },
              { label: "Avg rating", value: 5, suffix: ".0★" },
            ].map((s) => (
              <div key={s.label} className="glass rounded-2xl p-5 text-center">
                <div className="text-2xl md:text-3xl font-bold gradient-text">
                  {s.suffix === ".0★" ? "5.0★" : <Counter end={s.value} suffix={s.suffix} />}
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
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Popular categories</h2>
            <p className="text-muted-foreground mt-1">From cozy cafés to cinematic warehouses.</p>
          </div>
          <Link to="/browse" className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {CATEGORIES.map((c, i) => {
            const Icon = iconMap[c.icon as keyof typeof iconMap];
            return (
              <Link key={c.id} to="/browse" className="group animate-fade-up" style={{ animationDelay: `${i * 40}ms` }}>
                <div className="rounded-2xl p-5 bg-card border border-border hover-lift">
                  <div className="h-10 w-10 rounded-xl gradient-primary grid place-items-center text-white shadow-elegant group-hover:scale-110 transition-transform">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="mt-4 font-semibold">{c.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">Explore →</div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured spaces */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Featured spaces</h2>
            <p className="text-muted-foreground mt-1">Hand-picked, ready to book.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SPACES.slice(0, 8).map((s, i) => (
            <SpaceCard key={s.id} space={s} index={i} />
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { icon: Zap, title: "Book in seconds", body: "Instant confirmation. No back-and-forth." },
            { icon: Shield, title: "Insured by default", body: "₹8.3 Cr host protection on every booking." },
            { icon: Wallet, title: "Fair pricing", body: "Transparent hourly rates. No hidden fees." },
          ].map((b, i) => (
            <div key={b.title} className="glass rounded-3xl p-8 hover-lift animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="h-12 w-12 rounded-2xl gradient-primary grid place-items-center text-white shadow-glow">
                <b.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-xl font-semibold">{b.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold">How it works</p>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">Three steps. That's it.</h2>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-6 relative">
          {[
            { n: "01", title: "Search", body: "Filter by space type, city, time and price." },
            { n: "02", title: "Book", body: "Confirm instantly with secure payment." },
            { n: "03", title: "Show up", body: "Check in with a QR code and enjoy." },
          ].map((s, i) => (
            <div key={s.n} className="relative rounded-3xl p-8 bg-card border border-border hover-lift animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="text-6xl font-bold gradient-text opacity-80">{s.n}</div>
              <h3 className="mt-3 text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AI preview */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="rounded-[2rem] overflow-hidden border border-border relative">
          <div className="absolute inset-0 gradient-mesh opacity-90 -z-10" />
          <div className="grid md:grid-cols-2 gap-8 p-8 md:p-14 items-center">
            <div>
              <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 text-xs font-medium">
                <Sparkles className="h-3.5 w-3.5 text-accent" /> AI recommendations
              </div>
              <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">
                Spaces that <span className="gradient-text">match your intent.</span>
              </h2>
              <p className="mt-3 text-muted-foreground">
                Tell us what you're planning. Our AI matches you with the perfect space, time, and price.
              </p>
              <Link to="/ai-recommendations" className="inline-block mt-6">
                <Button className="gradient-primary text-white shadow-elegant hover:opacity-95">
                  Try AI picks <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {SPACES.slice(0, 4).map((s, i) => (
                <div key={s.id} className="glass-strong rounded-2xl p-3 hover-lift animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
                  <div className="aspect-square rounded-xl overflow-hidden">
                    <img src={s.image} alt="" className="h-full w-full object-cover" loading="lazy" />
                  </div>
                  <div className="mt-2 text-xs font-medium truncate">{s.title}</div>
                  <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-success" /> 92% match
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Loved by teams and hosts.</h2>
        </div>
        <div className="mt-10 grid md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <div key={t.name} className="rounded-3xl p-7 bg-card border border-border hover-lift animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="flex items-center gap-1 text-warning">
                {Array.from({ length: 5 }).map((_, k) => <Star key={k} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="mt-4 text-sm leading-relaxed">"{t.quote}"</p>
              <div className="mt-5 flex items-center gap-3">
                <img src={t.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="rounded-[2rem] p-10 md:p-16 gradient-primary text-white text-center relative overflow-hidden shadow-elegant">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white, transparent 40%), radial-gradient(circle at 80% 80%, white, transparent 40%)" }} />
          <Building2 className="h-10 w-10 mx-auto opacity-80" />
          <h2 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight">Have a space sitting empty?</h2>
          <p className="mt-3 text-white/80 max-w-xl mx-auto">Turn idle hours into income. List in under 5 minutes.</p>
          <Link to="/add-space" className="inline-block mt-6">
            <Button size="lg" variant="secondary" className="rounded-xl">
              List your space <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
