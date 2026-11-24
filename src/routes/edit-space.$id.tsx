import { createFileRoute, useNavigate, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Save, Building2, MapPin, IndianRupee, Users } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { ProtectedRoute } from "@/components/protected-route";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { IdleSpaceStore, type SpaceListing } from "@/lib/store";
import { CATEGORIES } from "@/lib/dummy-data";
import { toast } from "sonner";

export const Route = createFileRoute("/edit-space/$id")({
  head: () => ({
    meta: [
      { title: "Edit space — IdleSpace" },
      { name: "description", content: "Edit space listing details on IdleSpace." },
    ],
  }),
  loader: ({ params }) => {
    const space = IdleSpaceStore.getSpaceById(params.id);
    if (!space) throw notFound();
    return { spaceId: params.id };
  },
  component: EditSpacePage,
});

const ALL_AMENITIES = [
  "Wi-Fi",
  "AC",
  "Parking",
  "Projector",
  "Sound system",
  "Kitchen",
  "Commercial Oven",
  "Cold Storage",
  "Whiteboard",
  "TV",
  "Coffee",
  "Bar",
  "Stage",
  "AV System",
];

function EditSpacePage() {
  const { id: spaceId } = Route.useParams();
  const space = IdleSpaceStore.getSpaceById(spaceId) || IdleSpaceStore.getSpaces()[0];
  const navigate = useNavigate();

  const [title, setTitle] = useState(space.title);
  const [description, setDescription] = useState(space.description);
  const [category, setCategory] = useState(space.category);
  const [city, setCity] = useState(space.city);
  const [address, setAddress] = useState(space.address || "");
  const [price, setPrice] = useState(space.price);
  const [capacity, setCapacity] = useState(space.capacity);
  const [sizeSqFt, setSizeSqFt] = useState(space.sizeSqFt || 400);
  const [minDuration, setMinDuration] = useState(space.minDuration || 1);
  const [amenities, setAmenities] = useState<string[]>(space.amenities || []);
  const [cancellationPolicy, setCancellationPolicy] = useState<"flexible" | "moderate" | "strict">(
    space.cancellationPolicy || "flexible",
  );

  const toggleAmenity = (a: string) => {
    setAmenities((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !city.trim() || price <= 0) {
      toast.error("Please fill in required fields.");
      return;
    }

    IdleSpaceStore.updateSpace(space.id, {
      title: title.trim(),
      description: description.trim(),
      category,
      city: city.trim(),
      address: address.trim(),
      price: Number(price),
      capacity: Number(capacity),
      sizeSqFt: Number(sizeSqFt),
      minDuration: Number(minDuration),
      amenities,
      cancellationPolicy,
    });

    toast.success("Listing updated successfully!");
    navigate({ to: "/host/manage-listings" });
  };

  return (
    <ProtectedRoute>
      <SiteLayout>
        <div className="mx-auto max-w-4xl px-4 py-8">
          <Link
            to="/host/manage-listings"
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 mb-4"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to listings
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Edit Space: {space.title}</h1>
              <p className="text-muted-foreground text-sm mt-1">
                Update prices, descriptions, amenities and capacity rules.
              </p>
            </div>
            <Link to="/space/$id" params={{ id: space.id }}>
              <Button variant="outline" className="rounded-xl text-xs">
                View Public Page
              </Button>
            </Link>
          </div>

          <form onSubmit={handleSave} className="mt-8 space-y-6">
            <div className="rounded-3xl bg-card border border-border p-6 shadow-soft space-y-4">
              <h3 className="font-semibold text-base">Basic Details</h3>
              <div>
                <Label htmlFor="title">Space Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1.5 rounded-xl"
                  required
                />
              </div>

              <div>
                <Label htmlFor="desc">Description</Label>
                <Textarea
                  id="desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1.5 rounded-xl min-h-28"
                  required
                />
              </div>

              <div>
                <Label>Category</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCategory(c.id)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                        category === c.id
                          ? "gradient-primary text-white border-transparent shadow-sm font-semibold"
                          : "border-border hover:bg-secondary text-foreground"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City / State</Label>
                  <Input
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="mt-1.5 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="addr">Full Address / Landmark</Label>
                  <Input
                    id="addr"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="mt-1.5 rounded-xl"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-card border border-border p-6 shadow-soft space-y-4">
              <h3 className="font-semibold text-base">Pricing & Specs</h3>
              <div className="grid sm:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="rate">Hourly Rate (₹)</Label>
                  <Input
                    id="rate"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="mt-1.5 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cap">Capacity</Label>
                  <Input
                    id="cap"
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="mt-1.5 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="sqft">Area (Sq Ft)</Label>
                  <Input
                    id="sqft"
                    type="number"
                    value={sizeSqFt}
                    onChange={(e) => setSizeSqFt(Number(e.target.value))}
                    className="mt-1.5 rounded-xl"
                  />
                </div>
                <div>
                  <Label htmlFor="minh">Min Hours</Label>
                  <Input
                    id="minh"
                    type="number"
                    value={minDuration}
                    onChange={(e) => setMinDuration(Number(e.target.value))}
                    className="mt-1.5 rounded-xl"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-card border border-border p-6 shadow-soft space-y-4">
              <h3 className="font-semibold text-base">Amenities & Policy</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {ALL_AMENITIES.map((a) => (
                  <label
                    key={a}
                    className="flex items-center gap-2.5 p-3 rounded-xl border border-border hover:bg-secondary cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={amenities.includes(a)}
                      onChange={() => toggleAmenity(a)}
                      className="rounded border-border text-primary h-4 w-4"
                    />
                    <span className="text-xs font-medium">{a}</span>
                  </label>
                ))}
              </div>

              <div className="pt-2">
                <Label>Cancellation Policy</Label>
                <div className="mt-2 grid grid-cols-3 gap-3">
                  {(["flexible", "moderate", "strict"] as const).map((policy) => (
                    <button
                      key={policy}
                      type="button"
                      onClick={() => setCancellationPolicy(policy)}
                      className={`p-3 rounded-xl border text-left capitalize transition-all ${
                        cancellationPolicy === policy
                          ? "border-primary bg-primary/5 ring-1 ring-primary font-semibold"
                          : "border-border hover:bg-secondary text-muted-foreground"
                      }`}
                    >
                      {policy}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Link to="/host/manage-listings">
                <Button type="button" variant="outline" className="rounded-xl">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                className="gradient-primary text-white shadow-elegant rounded-xl px-6"
              >
                <Save className="h-4 w-4 mr-2" /> Save Changes
              </Button>
            </div>
          </form>
        </div>
      </SiteLayout>
    </ProtectedRoute>
  );
}
