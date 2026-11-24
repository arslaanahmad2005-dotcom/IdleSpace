import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Edit,
  Trash2,
  Eye,
  IndianRupee,
  MoreVertical,
  Plus,
  Users,
  MapPin,
  ExternalLink,
  Pause,
  Play,
  Star,
} from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { ProtectedRoute } from "@/components/protected-route";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useSpaces } from "@/hooks/use-idle-store";
import type { SpaceListing } from "@/lib/store";
import { toast } from "sonner";

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
  const { user } = useAuth();
  const { spaces, toggleStatus, deleteSpace } = useSpaces();
  const navigate = useNavigate();

  // Spaces belonging to host or demo host
  const mySpaces = useMemo(() => {
    return spaces.filter(
      (s) => s.hostId === user?.id || s.hostId === "usr_host_demo" || s.host === "Elena Ross" || true, // show all in demo host view for rich experience
    );
  }, [spaces, user]);

  const activeCount = mySpaces.filter((s) => s.status === "active").length;

  const handleToggleActive = (spaceId: string) => {
    const updated = toggleStatus(spaceId);
    if (updated) {
      toast.success(`Space is now ${updated.status}.`);
    }
  };

  const handleDelete = (spaceId: string, title: string) => {
    deleteSpace(spaceId);
    toast.success(`"${title}" has been deleted.`);
  };

  return (
    <ProtectedRoute>
      <SiteLayout>
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs uppercase tracking-wider font-bold gradient-primary text-white px-2.5 py-0.5 rounded-full">
                  Inventory
                </span>
                <span className="text-xs text-muted-foreground">{mySpaces.length} Listings</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Your Space Listings</h1>
              <p className="text-muted-foreground mt-1 text-sm">
                Control pricing, availability, paused status, and edit listing information.
              </p>
            </div>
            <Link to="/add-space">
              <Button className="gradient-primary text-white shadow-elegant rounded-xl">
                <Plus className="h-4 w-4 mr-1.5" /> Add New Space
              </Button>
            </Link>
          </div>

          <div className="mt-8 grid gap-4">
            {mySpaces.map((s, i) => {
              const isActive = s.status === "active";

              return (
                <div
                  key={s.id}
                  className="grid grid-cols-1 md:grid-cols-[180px_minmax(0,1fr)_auto] gap-5 items-center p-5 rounded-3xl bg-card border border-border hover-lift shadow-soft transition-all animate-fade-up"
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  <div className="h-32 w-full md:w-44 rounded-2xl overflow-hidden relative border border-border shrink-0">
                    <img src={s.image} alt={s.title} className="h-full w-full object-cover" />
                    <span className="absolute bottom-2 left-2 glass-strong text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
                      {s.category}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2.5">
                      <h3 className="font-bold text-lg truncate">{s.title}</h3>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider border shrink-0 ${
                          isActive
                            ? "bg-success/10 text-success border-success/30"
                            : "bg-muted text-muted-foreground border-border"
                        }`}
                      >
                        {isActive ? "Active" : "Paused"}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-primary" /> {s.address || s.city}
                    </p>

                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs max-w-lg">
                      <div className="p-2 rounded-xl bg-secondary/50">
                        <div className="text-muted-foreground">Hourly Rate</div>
                        <div className="font-bold text-sm text-foreground">
                          {formatCurrency(s.price)}
                        </div>
                      </div>
                      <div className="p-2 rounded-xl bg-secondary/50">
                        <div className="text-muted-foreground">Rating</div>
                        <div className="font-bold text-sm text-foreground flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-warning text-warning" /> {s.rating} ({s.reviews})
                        </div>
                      </div>
                      <div className="p-2 rounded-xl bg-secondary/50">
                        <div className="text-muted-foreground">Capacity</div>
                        <div className="font-bold text-sm text-foreground">{s.capacity} People</div>
                      </div>
                      <div className="p-2 rounded-xl bg-secondary/50">
                        <div className="text-muted-foreground">Size</div>
                        <div className="font-bold text-sm text-foreground">{s.sizeSqFt || 400} sq ft</div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="flex flex-wrap md:flex-col items-end gap-2.5 justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-border">
                    <div className="flex items-center gap-2 bg-secondary/60 px-3 py-1.5 rounded-xl border border-border">
                      <span className="text-xs font-medium text-foreground">
                        {isActive ? "Live" : "Paused"}
                      </span>
                      <Switch checked={isActive} onCheckedChange={() => handleToggleActive(s.id)} />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Link to="/space/$id" params={{ id: s.id }}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl text-xs h-8"
                          title="View live page"
                        >
                          <ExternalLink className="h-3.5 w-3.5 mr-1" /> View
                        </Button>
                      </Link>

                      <Link to="/edit-space/$id" params={{ id: s.id }}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl text-xs h-8"
                          title="Edit space details"
                        >
                          <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                        </Button>
                      </Link>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-xl text-destructive hover:bg-destructive/10"
                            title="Delete space"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete "{s.title}"?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action will permanently delete this space listing from IdleSpace. Any existing bookings will remain recorded in your ledger.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(s.id, s.title)}
                              className="rounded-xl bg-destructive text-white hover:bg-destructive/90"
                            >
                              Delete Listing
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </SiteLayout>
    </ProtectedRoute>
  );
}
