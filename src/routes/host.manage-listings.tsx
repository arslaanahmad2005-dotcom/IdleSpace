import { createFileRoute, Link } from "@tanstack/react-router";
import { Edit, Trash2, Eye, IndianRupee, MoreVertical, Plus } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { SPACES } from "@/lib/dummy-data";
import { formatCurrency } from "@/lib/utils";

export const Route = createFileRoute("/host/manage-listings")({
  head: () => ({
    meta: [
      { title: "Manage listings — IdleSpace" },
      { name: "description", content: "Edit, publish and manage your IdleSpace listings." },
      { property: "og:title", content: "Manage listings — IdleSpace" },
      { property: "og:description", content: "Manage your listings." },
    ],
  }),
  component: ManageListings,
});

function ManageListings() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Your listings</h1>
            <p className="text-muted-foreground mt-1">{SPACES.length} spaces · 3 active</p>
          </div>
          <Link to="/add-space"><Button className="gradient-primary text-white shadow-elegant rounded-xl"><Plus className="h-4 w-4 mr-1" /> Add listing</Button></Link>
        </div>

        <div className="mt-8 grid gap-4">
          {SPACES.slice(0, 5).map((s, i) => (
            <div key={s.id} className="grid grid-cols-[100px_minmax(0,1fr)] md:grid-cols-[160px_minmax(0,1fr)_auto] gap-4 items-center p-4 rounded-3xl bg-card border border-border hover-lift animate-fade-up" style={{ animationDelay: `${i * 40}ms` }}>
              <img src={s.image} alt="" className="h-24 md:h-28 w-full rounded-2xl object-cover" />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold truncate">{s.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${i % 3 === 0 ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                    {i % 3 === 0 ? "Active" : "Paused"}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">{s.city}</div>
                <div className="mt-3 grid grid-cols-3 gap-4 text-xs max-w-md">
                  <div><div className="text-muted-foreground flex items-center gap-1"><Eye className="h-3 w-3" /> Views</div><div className="font-semibold text-sm">{(1200 + i * 340).toLocaleString()}</div></div>
                  <div><div className="text-muted-foreground">Occupancy</div><div className="font-semibold text-sm">{60 + i * 5}%</div></div>
                  <div><div className="text-muted-foreground flex items-center gap-1"><IndianRupee className="h-3 w-3" /> Revenue</div><div className="font-semibold text-sm">{formatCurrency((1200 + i * 500) * 83)}</div></div>
                </div>
              </div>
              <div className="col-span-2 md:col-span-1 flex items-center gap-2 justify-end">
                <div className="flex items-center gap-2 mr-2">
                  <span className="text-xs text-muted-foreground">Available</span>
                  <Switch defaultChecked={i % 3 === 0} />
                </div>
                <Button variant="outline" size="icon" className="rounded-xl"><Edit className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon" className="rounded-xl"><Trash2 className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SiteLayout>
  );
}
