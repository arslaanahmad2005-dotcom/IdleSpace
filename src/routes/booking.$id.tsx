import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Ticket, Users, Calendar as CalIcon, Clock } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { SPACES } from "@/lib/dummy-data";
import { formatCurrency } from "@/lib/utils";

export const Route = createFileRoute("/booking/$id")({
  head: () => ({
    meta: [
      { title: "Complete your booking — IdleSpace" },
      { name: "description", content: "Complete your booking on IdleSpace." },
      { property: "og:title", content: "Complete your booking — IdleSpace" },
      { property: "og:description", content: "Review details and proceed to payment." },
    ],
  }),
  loader: ({ params }) => {
    const space = SPACES.find((s) => s.id === params.id);
    if (!space) throw notFound();
    return { space };
  },
  component: BookingPage,
});

function BookingPage() {
  const { space } = Route.useLoaderData();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [hours, setHours] = useState(4);
  const [guests, setGuests] = useState(6);
  const [coupon, setCoupon] = useState("");

  const subtotal = space.price * hours;
  const fee = Math.round(subtotal * 0.09);
  const discount = coupon.toLowerCase() === "welcome" ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + fee - discount;

  return (
    <SiteLayout>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Complete your booking</h1>
        <p className="text-muted-foreground mt-1">A few final details before you confirm.</p>

        <div className="mt-8 grid lg:grid-cols-[minmax(0,1fr)_400px] gap-8">
          <div className="space-y-6">
            <section className="rounded-3xl bg-card border border-border p-6">
              <h2 className="text-lg font-semibold flex items-center gap-2"><CalIcon className="h-4 w-4" /> Date</h2>
              <Calendar mode="single" selected={date} onSelect={setDate} className="mt-3 rounded-2xl border border-border" />
            </section>

            <section className="rounded-3xl bg-card border border-border p-6">
              <h2 className="text-lg font-semibold flex items-center gap-2"><Clock className="h-4 w-4" /> Time</h2>
              <div className="mt-3 grid grid-cols-3 sm:grid-cols-6 gap-2">
                {["9 AM", "11 AM", "1 PM", "2 PM", "4 PM", "6 PM"].map((t) => (
                  <button key={t} className="px-3 py-2 rounded-xl border border-border text-sm hover:gradient-primary hover:text-white transition-all">
                    {t}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-3">
                <span className="text-sm text-muted-foreground">Hours</span>
                <div className="flex items-center gap-2">
                  <Button size="icon" variant="outline" onClick={() => setHours((h) => Math.max(1, h - 1))}>-</Button>
                  <span className="w-8 text-center font-semibold">{hours}</span>
                  <Button size="icon" variant="outline" onClick={() => setHours((h) => h + 1)}>+</Button>
                </div>
              </div>
            </section>

            <section className="rounded-3xl bg-card border border-border p-6">
              <h2 className="text-lg font-semibold flex items-center gap-2"><Users className="h-4 w-4" /> Guests</h2>
              <div className="mt-3 flex items-center gap-3">
                <Button size="icon" variant="outline" onClick={() => setGuests((g) => Math.max(1, g - 1))}>-</Button>
                <span className="w-10 text-center font-semibold">{guests}</span>
                <Button size="icon" variant="outline" onClick={() => setGuests((g) => Math.min(space.capacity, g + 1))}>+</Button>
                <span className="text-xs text-muted-foreground">Max {space.capacity}</span>
              </div>
            </section>

            <section className="rounded-3xl bg-card border border-border p-6">
              <h2 className="text-lg font-semibold flex items-center gap-2"><Ticket className="h-4 w-4" /> Coupon</h2>
              <div className="mt-3 flex gap-2">
                <Input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="Try WELCOME" className="rounded-xl" />
                <Button variant="outline" className="rounded-xl">Apply</Button>
              </div>
              {discount > 0 && <p className="mt-2 text-xs text-success">Coupon applied — 10% off</p>}
            </section>
          </div>

          <aside className="lg:sticky lg:top-24 h-fit">
            <div className="rounded-3xl bg-card border border-border overflow-hidden shadow-elegant">
              <img src={space.image} alt="" className="h-40 w-full object-cover" />
              <div className="p-5">
                <div className="font-semibold">{space.title}</div>
                <div className="text-xs text-muted-foreground">{space.city}</div>
                <div className="h-px bg-border my-4" />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">{formatCurrency(space.price)} × {hours} hr</span><span>{formatCurrency(subtotal)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Service fee</span><span>{formatCurrency(fee)}</span></div>
                  {discount > 0 && <div className="flex justify-between text-success"><span>Coupon (WELCOME)</span><span>-{formatCurrency(discount)}</span></div>}
                  <div className="h-px bg-border my-2" />
                  <div className="flex justify-between font-semibold text-base"><span>Total</span><span>{formatCurrency(total)}</span></div>
                </div>
                <Link to="/booking-confirmed/$id" params={{ id: space.id }}>
                  <Button className="w-full mt-5 h-12 rounded-xl gradient-primary text-white shadow-elegant">
                    Proceed to payment <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </SiteLayout>
  );
}
