import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ChevronLeft, ChevronRight, ImagePlus, MapPin } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { ProtectedRoute } from "@/components/protected-route";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORIES } from "@/lib/dummy-data";
import { formatCurrency } from "@/lib/utils";

export const Route = createFileRoute("/add-space")({
  head: () => ({
    meta: [
      { title: "List your space — IdleSpace" },
      { name: "description", content: "Turn idle hours into income. List your business space in minutes." },
      { property: "og:title", content: "List your space — IdleSpace" },
      { property: "og:description", content: "Earn from your unused space." },
    ],
  }),
  component: AddSpace,
});

const steps = ["Basics", "Photos", "Amenities", "Pricing", "Location", "Preview"];

function AddSpace() {
  const [step, setStep] = useState(0);
  const [cat, setCat] = useState<string | null>(null);

  return (
    <ProtectedRoute>
    <SiteLayout>
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">List a space</h1>
        <p className="text-muted-foreground mt-1">Takes about 5 minutes. Save and finish later anytime.</p>

        <div className="mt-6 flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={s} className="flex-1 flex items-center gap-2">
              <div className={`h-8 w-8 rounded-full grid place-items-center text-xs font-semibold shrink-0 ${i <= step ? "gradient-primary text-white" : "bg-secondary text-muted-foreground"}`}>
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              {i < steps.length - 1 && <div className={`h-0.5 flex-1 rounded ${i < step ? "gradient-primary" : "bg-secondary"}`} />}
            </div>
          ))}
        </div>
        <div className="mt-2 text-sm font-medium">{steps[step]}</div>

        <div className="mt-6 rounded-3xl bg-card border border-border p-6 md:p-8 min-h-[420px]">
          {step === 0 && (
            <div className="space-y-4 animate-fade-up">
              <div><Label>Space title</Label><Input placeholder="e.g. Skyline Rooftop Studio" className="mt-1.5 rounded-xl" /></div>
              <div><Label>Description</Label><Textarea placeholder="Tell guests what makes it special" className="mt-1.5 rounded-xl min-h-28" /></div>
              <div>
                <Label>Category</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {CATEGORIES.map((c) => (
                    <button key={c.id} onClick={() => setCat(c.id)}
                      className={`px-3 py-1.5 rounded-full text-xs border transition-all ${cat === c.id ? "gradient-primary text-white border-transparent" : "border-border hover:bg-secondary"}`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          {step === 1 && (
            <div className="animate-fade-up">
              <p className="text-sm text-muted-foreground mb-3">Add at least 5 photos. High quality helps you get booked.</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="aspect-square rounded-2xl border-2 border-dashed border-border grid place-items-center hover:bg-secondary/50 cursor-pointer">
                    <ImagePlus className="h-6 w-6 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="animate-fade-up">
              <p className="text-sm text-muted-foreground mb-3">Select all amenities available to guests.</p>
              <div className="grid sm:grid-cols-2 gap-2">
                {["Wi-Fi", "Projector", "Sound system", "Kitchen", "Parking", "AC", "Whiteboard", "TV", "Coffee", "Bar", "Loading dock", "Stage"].map((a) => (
                  <label key={a} className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-secondary/50 cursor-pointer">
                    <input type="checkbox" className="h-4 w-4" />
                    <span className="text-sm">{a}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-4 animate-fade-up">
              <div><Label>Hourly price (INR)</Label><Input type="number" defaultValue={5400} className="mt-1.5 rounded-xl" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Minimum hours</Label><Input type="number" defaultValue={2} className="mt-1.5 rounded-xl" /></div>
                <div><Label>Max capacity</Label><Input type="number" defaultValue={20} className="mt-1.5 rounded-xl" /></div>
              </div>
              <div className="p-4 rounded-2xl gradient-mesh">
                <div className="text-xs uppercase tracking-widest text-primary font-semibold">AI Suggestion</div>
                <div className="text-sm mt-1">Similar spaces in your area earn <b>₹6,500/hr</b> on Fri–Sun evenings.</div>
              </div>
            </div>
          )}
          {step === 4 && (
            <div className="animate-fade-up">
              <div><Label>Address</Label><Input placeholder="123 Market St, Brooklyn NY" className="mt-1.5 rounded-xl" /></div>
              <div className="mt-4 aspect-[16/9] rounded-2xl relative overflow-hidden border border-border">
                <div className="absolute inset-0 gradient-mesh opacity-60" />
                <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(oklch(0 0 0 / 6%) 1px, transparent 1px), linear-gradient(90deg, oklch(0 0 0 / 6%) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="h-10 w-10 rounded-full gradient-primary grid place-items-center text-white shadow-elegant animate-float"><MapPin className="h-5 w-5" /></div>
                </div>
              </div>
            </div>
          )}
          {step === 5 && (
            <div className="animate-fade-up">
              <div className="rounded-2xl border border-border overflow-hidden">
                <div className="aspect-[16/9] bg-secondary/50 grid place-items-center text-muted-foreground text-sm">Photo preview</div>
                <div className="p-5">
                  <div className="font-semibold">Your space title</div>
                  <div className="text-sm text-muted-foreground">Category · City · Fits N</div>
                  <div className="mt-2 text-xl font-bold">₹5,400 <span className="text-xs font-normal text-muted-foreground">/ hour</span></div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between">
            <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
              <ChevronLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            {step < steps.length - 1 ? (
              <Button className="gradient-primary text-white" onClick={() => setStep((s) => s + 1)}>
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Link to="/host/manage-listings"><Button className="gradient-primary text-white">Publish listing</Button></Link>
            )}
          </div>
        </div>
      </div>
    </SiteLayout>
    </ProtectedRoute>
  );
}
