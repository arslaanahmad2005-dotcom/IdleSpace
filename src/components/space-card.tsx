import { Link } from "@tanstack/react-router";
import { Heart, Star, MapPin } from "lucide-react";
import type { Space } from "@/lib/dummy-data";
import { formatCurrency } from "@/lib/utils";

export function SpaceCard({ space, index = 0 }: { space: Space; index?: number }) {
  return (
    <Link
      to="/space/$id"
      params={{ id: space.id }}
      className="group block animate-fade-up"
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
    >
      <div className="rounded-3xl overflow-hidden bg-card border border-border hover-lift">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={space.image}
            alt={space.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="absolute top-3 right-3 p-2 rounded-full glass-strong hover:scale-110 transition-transform"
            aria-label="Save"
          >
            <Heart className="h-4 w-4" />
          </button>
          <div className="absolute bottom-3 left-3 glass-strong text-xs px-2.5 py-1 rounded-full font-medium">
            {space.category}
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold truncate">{space.title}</h3>
            <div className="flex items-center gap-1 text-sm shrink-0">
              <Star className="h-3.5 w-3.5 fill-warning text-warning" />
              <span className="font-medium">{space.rating}</span>
            </div>
          </div>
          <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {space.city}
          </p>
          <div className="mt-3 flex items-end justify-between">
            <div>
              <span className="text-lg font-bold">{formatCurrency(space.price)}</span>
              <span className="text-xs text-muted-foreground"> / hour</span>
            </div>
            <span className="text-xs text-muted-foreground">{space.reviews} reviews</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
