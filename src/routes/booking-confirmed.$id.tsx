import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Check, Download, MapPin, Share2, Calendar as CalIcon } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { ProtectedRoute } from "@/components/protected-route";
import { Button } from "@/components/ui/button";
import { SPACES } from "@/lib/dummy-data";
import { formatCurrency } from "@/lib/utils";

export const Route = createFileRoute("/booking-confirmed/$id")({
  head: () => ({
    meta: [
      { title: "Booking confirmed — IdleSpace" },
      { name: "description", content: "Your IdleSpace booking is confirmed." },
      { property: "og:title", content: "Booking confirmed — IdleSpace" },
      { property: "og:description", content: "See you soon." },
    ],
  }),
  loader: ({ params }) => {
    const space = SPACES.find((s) => s.id === params.id);
    if (!space) throw notFound();
    return { space };
  },
  component: Confirmed,
});

function Confirmed() {
  const { space } = Route.useLoaderData();
  return (
    <ProtectedRoute>
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="text-center animate-scale-in">
          <div className="mx-auto h-20 w-20 rounded-full gradient-primary grid place-items-center shadow-glow animate-float">
            <Check className="h-10 w-10 text-white" />
          </div>
          <h1 className="mt-6 text-3xl md:text-5xl font-bold tracking-tight">You're booked!</h1>
          <p className="mt-2 text-muted-foreground">A confirmation email is on its way.</p>
        </div>

        <div className="mt-10 rounded-3xl bg-card border border-border overflow-hidden shadow-elegant animate-fade-up">
          <div className="p-6 md:p-8 grid md:grid-cols-[1fr_180px] gap-6 items-center">
            <div>
              <div className="text-xs text-muted-foreground">BOOKING #IS-4820</div>
              <h2 className="mt-1 text-2xl font-bold">{space.title}</h2>
              <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-3.5 w-3.5" /> {space.city}</div>
              <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
                <div><div className="text-xs text-muted-foreground">Date</div><div className="font-semibold">Sep 24, 2026</div></div>
                <div><div className="text-xs text-muted-foreground">Time</div><div className="font-semibold">2:00 – 6:00 PM</div></div>
                <div><div className="text-xs text-muted-foreground">Guests</div><div className="font-semibold">6</div></div>
                <div><div className="text-xs text-muted-foreground">Total</div><div className="font-semibold">{formatCurrency(space.price * 4 + Math.round(space.price * 4 * 0.09))}</div></div>
              </div>
            </div>
            <div className="mx-auto">
              <div className="h-40 w-40 rounded-2xl grid place-items-center relative overflow-hidden" style={{
                backgroundImage: "conic-gradient(from 0deg, #000 25%, transparent 0), conic-gradient(from 90deg, #000 25%, transparent 0)",
                backgroundSize: "8px 8px", backgroundColor: "white",
              }}>
                <div className="absolute inset-3 bg-white grid place-items-center">
                  <div className="h-10 w-10 gradient-primary rounded-lg" />
                </div>
              </div>
              <p className="mt-2 text-center text-xs text-muted-foreground">Scan on arrival</p>
            </div>
          </div>
          <div className="border-t border-border p-4 flex flex-wrap gap-2 justify-center bg-secondary/50">
            <Button variant="outline" className="rounded-xl"><Download className="h-4 w-4 mr-2" /> Receipt</Button>
            <Button variant="outline" className="rounded-xl"><MapPin className="h-4 w-4 mr-2" /> Directions</Button>
            <Button variant="outline" className="rounded-xl"><CalIcon className="h-4 w-4 mr-2" /> Add to calendar</Button>
            <Button variant="outline" className="rounded-xl"><Share2 className="h-4 w-4 mr-2" /> Share</Button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link to="/dashboard" className="text-sm text-primary hover:underline">Go to my dashboard →</Link>
        </div>
      </div>
    </SiteLayout>
    </ProtectedRoute>
  );
}
