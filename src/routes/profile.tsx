import { createFileRoute } from "@tanstack/react-router";
import { CreditCard, Mail, Phone, MapPin, Camera, Star } from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/site-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { REVIEWS } from "@/lib/dummy-data";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your profile — IdleSpace" },
      { name: "description", content: "Manage your personal info, payment methods and reviews." },
      { property: "og:title", content: "Your profile — IdleSpace" },
      { property: "og:description", content: "Your IdleSpace profile." },
    ],
  }),
  component: Profile,
});

function Profile() {
  return (
    <SiteLayout>
      <PageHeader eyebrow="Profile" title="Your profile" subtitle="Personal info, payment methods and reviews." />
      <div className="mx-auto max-w-5xl px-4 pb-16">
        <div className="grid lg:grid-cols-[280px_minmax(0,1fr)] gap-8">
          <div className="rounded-3xl bg-card border border-border p-6 text-center h-fit">
            <div className="relative mx-auto w-28 h-28">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80" alt="" className="h-28 w-28 rounded-full object-cover" />
              <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full gradient-primary grid place-items-center text-white shadow-elegant">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <h2 className="mt-4 text-lg font-semibold">Ada Lovelace</h2>
            <p className="text-sm text-muted-foreground">Member since 2024</p>
            <div className="mt-4 flex items-center justify-center gap-1 text-sm">
              <Star className="h-4 w-4 fill-warning text-warning" /> 4.9 · 23 reviews
            </div>
          </div>

          <div className="space-y-6">
            <section className="rounded-3xl bg-card border border-border p-6">
              <h3 className="font-semibold">Personal information</h3>
              <div className="mt-4 grid sm:grid-cols-2 gap-4">
                <div><Label>Full name</Label><Input defaultValue="Ada Lovelace" className="mt-1.5 rounded-xl" /></div>
                <div><Label>Email</Label><Input defaultValue="ada@company.com" className="mt-1.5 rounded-xl" /></div>
                <div><Label>Phone</Label><Input defaultValue="+1 (555) 010-2938" className="mt-1.5 rounded-xl" /></div>
                <div><Label>City</Label><Input defaultValue="New York, NY" className="mt-1.5 rounded-xl" /></div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button className="gradient-primary text-white">Save</Button>
                <Button variant="outline">Cancel</Button>
              </div>
            </section>

            <section className="rounded-3xl bg-card border border-border p-6">
              <h3 className="font-semibold">Payment methods</h3>
              <div className="mt-4 space-y-2">
                {[
                  { brand: "Visa", last4: "4421", exp: "12/28" },
                  { brand: "Mastercard", last4: "1187", exp: "09/27" },
                ].map((c) => (
                  <div key={c.last4} className="flex items-center justify-between p-4 rounded-2xl bg-secondary/50">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-14 rounded-lg gradient-primary grid place-items-center text-white text-xs font-bold">{c.brand[0]}</div>
                      <div>
                        <div className="text-sm font-semibold">{c.brand} •••• {c.last4}</div>
                        <div className="text-xs text-muted-foreground">Expires {c.exp}</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">Remove</Button>
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-2"><CreditCard className="h-4 w-4 mr-2" /> Add card</Button>
              </div>
            </section>

            <section className="rounded-3xl bg-card border border-border p-6">
              <h3 className="font-semibold">Your reviews</h3>
              <div className="mt-4 space-y-3">
                {REVIEWS.map((r) => (
                  <div key={r.id} className="p-4 rounded-2xl bg-secondary/50">
                    <div className="text-sm font-semibold">{r.author}</div>
                    <div className="flex gap-0.5 text-warning mt-1">{Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="h-3 w-3 fill-current" />)}</div>
                    <p className="mt-2 text-sm text-muted-foreground">{r.body}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl bg-card border border-border p-6">
              <h3 className="font-semibold">Settings</h3>
              <div className="mt-4 space-y-3 text-sm">
                {[
                  { icon: Mail, label: "Email notifications", desc: "Booking updates and receipts" },
                  { icon: Phone, label: "SMS alerts", desc: "Reminders and confirmations" },
                  { icon: MapPin, label: "Location services", desc: "Get better recommendations" },
                ].map((s) => (
                  <div key={s.label} className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary/50">
                    <div className="flex items-center gap-3">
                      <s.icon className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{s.label}</div>
                        <div className="text-xs text-muted-foreground">{s.desc}</div>
                      </div>
                    </div>
                    <div className="h-6 w-10 rounded-full gradient-primary p-0.5 flex items-center">
                      <div className="h-5 w-5 rounded-full bg-white ml-auto" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
