import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Star, MapPin, Users, Wifi, Heart, Share2, Shield, Clock, Check } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { SpaceCard } from "@/components/space-card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { SPACES, REVIEWS } from "@/lib/dummy-data";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";

export const Route = createFileRoute("/space/$id")({
  head: ({ params }) => {
    const s = SPACES.find((x) => x.id === params.id);
    return {
      meta: [
        { title: s ? `${s.title} — IdleSpace` : "Space — IdleSpace" },
        { name: "description", content: s?.description ?? "Space details on IdleSpace." },
        { property: "og:title", content: s ? `${s.title} — IdleSpace` : "Space" },
        { property: "og:description", content: s?.description ?? "" },
        ...(s?.image ? [{ property: "og:image" as const, content: s.image }, { name: "twitter:image" as const, content: s.image }] : []),
      ],
    };
  },
  loader: ({ params }) => {
    const space = SPACES.find((s) => s.id === params.id);
    if (!space) throw notFound();
    return { space };
  },
  component: SpaceDetail,
});

function SpaceDetail() {
  const { space } = Route.useLoaderData();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [slot, setSlot] = useState("2:00 PM");
  const similar = SPACES.filter((s) => s.id !== space.id).slice(0, 4);

  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight">{space.title}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-warning text-warning" /> <b className="text-foreground">{space.rating}</b> ({space.reviews})</span>
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {space.city}</span>
              <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> Fits {space.capacity}</span>
            </div>
          </div>
          <div className="hidden md:flex gap-2">
            <Button variant="outline" size="sm" className="rounded-xl"><Share2 className="h-4 w-4 mr-1" /> Share</Button>
            <Button variant="outline" size="sm" className="rounded-xl"><Heart className="h-4 w-4 mr-1" /> Save</Button>
          </div>
        </div>

        {/* Gallery */}
        <div className="grid grid-cols-4 grid-rows-2 gap-2 rounded-3xl overflow-hidden h-[280px] md:h-[480px]">
          <img src={space.gallery[0]} alt="" className="col-span-4 md:col-span-2 md:row-span-2 h-full w-full object-cover" />
          {[1, 2, 3].map((i) => (
            <img key={i} src={space.gallery[i % space.gallery.length]} alt="" className="hidden md:block h-full w-full object-cover" />
          ))}
          <img src={space.image} alt="" className="hidden md:block h-full w-full object-cover" />
        </div>

        <div className="mt-8 grid lg:grid-cols-[minmax(0,1fr)_380px] gap-8">
          <div>
            <div className="flex items-center gap-3 pb-6 border-b border-border">
              <img src={space.hostAvatar} alt="" className="h-12 w-12 rounded-full object-cover" />
              <div>
                <div className="font-semibold">Hosted by {space.host}</div>
                <div className="text-xs text-muted-foreground">Superhost · 4 years hosting</div>
              </div>
            </div>

            <section className="py-6 border-b border-border">
              <h2 className="text-xl font-semibold">About this space</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">{space.description}</p>
            </section>

            <section className="py-6 border-b border-border">
              <h2 className="text-xl font-semibold">Amenities</h2>
              <div className="mt-4 grid sm:grid-cols-2 gap-3">
                {space.amenities.map((a: string) => (
                  <div key={a} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
                    <div className="h-8 w-8 rounded-lg bg-card grid place-items-center"><Wifi className="h-4 w-4" /></div>
                    <span className="text-sm">{a}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="py-6 border-b border-border">
              <h2 className="text-xl font-semibold">Availability</h2>
              <div className="mt-4 flex flex-col md:flex-row gap-6">
                <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-2xl border border-border" />
                <div className="flex-1">
                  <p className="text-sm font-medium mb-2">Available slots</p>
                  <div className="grid grid-cols-3 gap-2">
                    {["9:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "4:00 PM", "6:00 PM"].map((t) => (
                      <button key={t} onClick={() => setSlot(t)}
                        className={`px-3 py-2 rounded-xl text-sm border transition-all ${
                          slot === t ? "gradient-primary text-white border-transparent" : "border-border hover:bg-secondary"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="py-6">
              <h2 className="text-xl font-semibold">Reviews</h2>
              <div className="mt-4 space-y-3">
                {REVIEWS.map((r) => (
                  <div key={r.id} className="p-4 rounded-2xl bg-card border border-border">
                    <div className="flex items-center gap-3">
                      <img src={r.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold">{r.author}</span>
                          <span className="text-xs text-muted-foreground">{r.date}</span>
                        </div>
                        <div className="flex gap-0.5 text-warning">
                          {Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="h-3 w-3 fill-current" />)}
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{r.body}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-24 h-fit">
            <div className="rounded-3xl bg-card border border-border p-6 shadow-elegant">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-3xl font-bold">{formatCurrency(space.price)}</span>
                  <span className="text-muted-foreground"> / hour</span>
                </div>
                <span className="flex items-center gap-1 text-sm"><Star className="h-3.5 w-3.5 fill-warning text-warning" /> {space.rating}</span>
              </div>
              <div className="mt-5 space-y-2 text-sm">
                <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
                  <span className="flex items-center gap-2"><Clock className="h-4 w-4" /> {slot}</span>
                  <span className="text-muted-foreground">{date?.toLocaleDateString() ?? "Pick a date"}</span>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">{formatCurrency(space.price)} × 4 hours</span><span>{formatCurrency(space.price * 4)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Service fee</span><span>{formatCurrency(Math.round(space.price * 4 * 0.09))}</span></div>
                <div className="h-px bg-border my-2" />
                <div className="flex justify-between font-semibold"><span>Total</span><span>{formatCurrency(Math.round(space.price * 4 * 1.09))}</span></div>
              </div>
              <Link to="/booking/$id" params={{ id: space.id }}>
                <Button className="w-full mt-5 h-12 rounded-xl gradient-primary text-white shadow-elegant">Book now</Button>
              </Link>
              <p className="mt-3 text-xs text-muted-foreground flex items-center gap-1.5 justify-center"><Shield className="h-3.5 w-3.5" /> Free cancellation up to 24 hours before</p>
            </div>
            <div className="mt-4 rounded-3xl bg-card border border-border p-5">
              <div className="text-sm font-semibold">What's included</div>
              <div className="mt-2 space-y-1.5">
                {["Instant confirmation", "Host protection", "24/7 support"].map((x) => (
                  <div key={x} className="flex items-center gap-2 text-sm text-muted-foreground"><Check className="h-4 w-4 text-success" /> {x}</div>
                ))}
              </div>
            </div>
          </aside>
        </div>

        <section className="mt-16">
          <h2 className="text-2xl font-bold tracking-tight mb-6">Similar spaces</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {similar.map((s, i) => <SpaceCard key={s.id} space={s} index={i} />)}
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
