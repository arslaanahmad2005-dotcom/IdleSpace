import { createFileRoute } from "@tanstack/react-router";
import { Mail, MessageSquare, Phone, MapPin, Send } from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/site-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — IdleSpace" },
      { name: "description", content: "Get in touch with the IdleSpace team." },
      { property: "og:title", content: "Contact — IdleSpace" },
      { property: "og:description", content: "We'd love to hear from you." },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <SiteLayout>
      <PageHeader eyebrow="Contact" title="We'd love to hear from you." subtitle="Questions, feedback, partnerships — send them our way." />
      <div className="mx-auto max-w-6xl px-4 pb-16 grid lg:grid-cols-[minmax(0,1fr)_360px] gap-8">
        <form className="rounded-3xl bg-card border border-border p-6 md:p-8" onSubmit={(e) => { e.preventDefault(); toast.success("Message sent!"); }}>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label>Name</Label><Input placeholder="Ada Lovelace" className="mt-1.5 rounded-xl" /></div>
            <div><Label>Email</Label><Input type="email" placeholder="you@company.com" className="mt-1.5 rounded-xl" /></div>
          </div>
          <div className="mt-4"><Label>Subject</Label><Input placeholder="How can we help?" className="mt-1.5 rounded-xl" /></div>
          <div className="mt-4"><Label>Message</Label><Textarea placeholder="Tell us more…" className="mt-1.5 rounded-xl min-h-32" /></div>
          <Button className="mt-6 gradient-primary text-white shadow-elegant rounded-xl"><Send className="h-4 w-4 mr-2" /> Send message</Button>
        </form>

        <aside className="space-y-4">
          <div className="rounded-3xl bg-card border border-border overflow-hidden">
            <div className="aspect-[4/3] relative overflow-hidden">
              <div className="absolute inset-0 gradient-mesh opacity-70" />
              <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(oklch(0 0 0 / 6%) 1px, transparent 1px), linear-gradient(90deg, oklch(0 0 0 / 6%) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="h-10 w-10 rounded-full gradient-primary grid place-items-center text-white shadow-elegant animate-float"><MapPin className="h-5 w-5" /></div>
              </div>
            </div>
            <div className="p-4">
              <div className="font-semibold">HQ</div>
              <div className="text-sm text-muted-foreground">123 Market St, Brooklyn NY</div>
            </div>
          </div>
          {[
            { icon: Mail, label: "Email", value: "hello@idlespace.co" },
            { icon: Phone, label: "Phone", value: "+1 (555) 010-2938" },
            { icon: MessageSquare, label: "Live chat", value: "Mon–Fri, 9am–6pm ET" },
          ].map((c) => (
            <div key={c.label} className="p-4 rounded-2xl bg-card border border-border flex items-center gap-3 hover-lift">
              <div className="h-10 w-10 rounded-xl gradient-primary grid place-items-center text-white"><c.icon className="h-4 w-4" /></div>
              <div>
                <div className="text-xs text-muted-foreground">{c.label}</div>
                <div className="font-semibold text-sm">{c.value}</div>
              </div>
            </div>
          ))}
        </aside>
      </div>
    </SiteLayout>
  );
}
