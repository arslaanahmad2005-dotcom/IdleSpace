import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { BOOKINGS } from "@/lib/dummy-data";
import { formatCurrency } from "@/lib/utils";

export const Route = createFileRoute("/host/manage-bookings")({
  head: () => ({
    meta: [
      { title: "Manage bookings — IdleSpace" },
      { name: "description", content: "Track incoming, upcoming and past bookings." },
      { property: "og:title", content: "Manage bookings — IdleSpace" },
      { property: "og:description", content: "Manage bookings." },
    ],
  }),
  component: ManageBookings,
});

const ALL = [
  ...BOOKINGS,
  { id: "b6", space: "Trattoria Private Room", date: "Sep 30, 2026", time: "7:00 PM – 10:00 PM", status: "pending", total: 23700, image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80" },
];

function ManageBookings() {
  const [selected, setSelected] = useState<(typeof ALL)[number] | null>(null);
  const groups: Record<string, typeof ALL> = {
    upcoming: ALL.filter((b) => b.status === "upcoming"),
    pending: ALL.filter((b) => b.status === "pending"),
    completed: ALL.filter((b) => b.status === "completed"),
    cancelled: ALL.filter((b) => b.status === "cancelled"),
  };

  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Bookings</h1>
        <p className="text-muted-foreground mt-1">All the reservations across your listings.</p>

        <Tabs defaultValue="upcoming" className="mt-6">
          <TabsList className="rounded-xl">
            {(["upcoming", "pending", "completed", "cancelled"] as const).map((k) => (
              <TabsTrigger key={k} value={k} className="capitalize">{k} ({groups[k].length})</TabsTrigger>
            ))}
          </TabsList>
          {(Object.keys(groups) as Array<keyof typeof groups>).map((k) => (
            <TabsContent key={k} value={k} className="mt-4">
              <div className="grid gap-3">
                {groups[k].map((b) => (
                  <button key={b.id} onClick={() => setSelected(b)} className="text-left grid grid-cols-[80px_minmax(0,1fr)_auto] gap-4 items-center p-4 rounded-2xl bg-card border border-border hover-lift">
                    <img src={b.image} alt="" className="h-16 w-16 md:h-20 md:w-20 rounded-xl object-cover" />
                    <div className="min-w-0">
                      <div className="font-semibold truncate">{b.space}</div>
                      <div className="text-xs text-muted-foreground">{b.date} · {b.time}</div>
                    </div>
                    <div className="text-right shrink-0"><div className="font-semibold">{formatCurrency(b.total)}</div><div className="text-xs text-muted-foreground capitalize">{b.status}</div></div>
                  </button>
                ))}
                {groups[k].length === 0 && <div className="text-center py-16 text-muted-foreground text-sm">No {k} bookings.</div>}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
          <SheetContent className="w-full sm:max-w-lg">
            {selected && (
              <>
                <SheetHeader><SheetTitle>Booking details</SheetTitle></SheetHeader>
                <img src={selected.image} alt="" className="mt-4 h-48 w-full rounded-2xl object-cover" />
                <div className="mt-4 space-y-3">
                  <div><div className="text-xs text-muted-foreground">Space</div><div className="font-semibold">{selected.space}</div></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><div className="text-xs text-muted-foreground">Date</div><div className="font-semibold">{selected.date}</div></div>
                    <div><div className="text-xs text-muted-foreground">Time</div><div className="font-semibold">{selected.time}</div></div>
                    <div><div className="text-xs text-muted-foreground">Status</div><div className="font-semibold capitalize">{selected.status}</div></div>
                    <div><div className="text-xs text-muted-foreground">Total</div><div className="font-semibold">{formatCurrency(selected.total)}</div></div>
                  </div>
                  <div className="pt-4 flex gap-2">
                    <Button className="flex-1 gradient-primary text-white">Message guest</Button>
                    <Button variant="outline" className="flex-1">Cancel</Button>
                  </div>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </SiteLayout>
  );
}
