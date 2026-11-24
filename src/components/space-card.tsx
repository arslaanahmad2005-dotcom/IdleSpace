import { Link } from "@tanstack/react-router";
import { Heart, Star, MapPin, Users } from "lucide-react";
import type { SpaceListing } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { useFavourites } from "@/hooks/use-idle-store";
import { toast } from "sonner";

export function SpaceCard({
  space,
  index = 0,
}: {
  space: SpaceListing;
  index?: number;
}) {
  const { isFav, toggle } = useFavourites();
  const saved = isFav(space.id);

  const handleToggleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const active = toggle(space.id);
    if (active) {
      toast.success(`Saved "${space.title}" to wishlist!`);
    } else {
      toast.info(`Removed "${space.title}" from wishlist.`);
    }
  };

  return (
    <Link
      to="/space/$id"
      params={{ id: space.id }}
      className="group block animate-fade-up"
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
    >
      <div className="rounded-3xl overflow-hidden bg-card border border-border hover-lift transition-all">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={space.image}
            alt={space.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <button
            onClick={handleToggleFav}
            className={`absolute top-3 right-3 p-2.5 rounded-full glass-strong transition-all ${
              saved ? "text-destructive scale-110 shadow-glow" : "text-muted-foreground hover:scale-110"
            }`}
            aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
          >
            <Heart className={`h-4 w-4 ${saved ? "fill-destructive text-destructive" : ""}`} />
          </button>
          <div className="absolute bottom-3 left-3 glass-strong text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5 capitalize">
            <span>{space.category}</span>
            {space.capacity && (
              <>
                <span className="opacity-40">·</span>
                <span className="flex items-center gap-0.5"><Users className="h-3 w-3" /> {space.capacity}</span>
              </>
            )}
          </div>
          {space.status === "paused" && (
            <div className="absolute top-3 left-3 bg-black/70 backdrop-blur text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md">
              Paused
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold truncate text-foreground group-hover:text-primary transition-colors">
              {space.title}
            </h3>
            <div className="flex items-center gap-1 text-sm shrink-0">
              <Star className="h-3.5 w-3.5 fill-warning text-warning" />
              <span className="font-medium">{space.rating || 5.0}</span>
            </div>
          </div>
          <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1 truncate">
            <MapPin className="h-3 w-3 shrink-0" /> {space.city}
          </p>
          <div className="mt-3 flex items-end justify-between border-t border-border/60 pt-2.5">
            <div>
              <span className="text-lg font-bold">{formatCurrency(space.price)}</span>
              <span className="text-xs text-muted-foreground"> / hour</span>
            </div>
            <span className="text-xs text-muted-foreground">{space.reviews ?? 0} reviews</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
