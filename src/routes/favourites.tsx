import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Search, ArrowRight, Building2, MapPin } from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/site-layout";
import { SpaceCard } from "@/components/space-card";
import { Button } from "@/components/ui/button";
import { useFavourites, useSpaces } from "@/hooks/use-idle-store";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/favourites")({
  head: () => ({
    meta: [
      { title: "Your wishlist — IdleSpace" },
      { name: "description", content: "Saved spaces and favourite venues on IdleSpace." },
      { property: "og:title", content: "Your wishlist — IdleSpace" },
      { property: "og:description", content: "Saved spaces." },
    ],
  }),
  component: FavouritesPage,
});

function FavouritesPage() {
  const { user } = useAuth();
  const { favourites } = useFavourites(user?.id);
  const { spaces } = useSpaces();

  const savedList = spaces.filter((s) => favourites.includes(s.id));

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Wishlist"
        title="Saved Spaces"
        subtitle={`You have saved ${savedList.length} ${savedList.length === 1 ? "space" : "spaces"} to your collection.`}
      />

      <div className="mx-auto max-w-7xl px-4 pb-20">
        {savedList.length === 0 ? (
          <div className="rounded-3xl bg-card border border-border p-16 text-center max-w-xl mx-auto shadow-soft">
            <div className="h-16 w-16 rounded-full bg-secondary grid place-items-center mx-auto mb-4">
              <Heart className="h-7 w-7 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold">No saved spaces yet</h3>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              Browse meeting rooms, professional kitchens, studios, and event venues and tap the heart icon to save them here for quick booking.
            </p>
            <Link to="/browse">
              <Button className="mt-6 gradient-primary text-white rounded-xl shadow-elegant">
                Explore Available Spaces <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedList.map((space, idx) => (
              <SpaceCard key={space.id} space={space} index={idx} />
            ))}
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
