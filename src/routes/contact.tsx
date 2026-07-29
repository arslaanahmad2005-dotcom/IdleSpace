import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { ActionButton, GlassCard, PageHeader, Reveal } from "@/components/Primitives";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact | JanSamarth Chain" },
      {
        name: "description",
        content: "Reach the JanSamarth Chain team for demonstrations, partnership discussions or documentation.",
      },
      { property: "og:title", content: "Contact — JanSamarth Chain" },
      { property: "og:description", content: "Get in touch for a walkthrough of the transparency platform." },
    ],
  }),
  component: ContactPage,
});

const inputClass =
  "mt-2 w-full rounded-2xl border border-border bg-secondary/40 px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/60";

function ContactPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Contact"
        title="Talk to the team"
        description="Request a walkthrough, discuss a departmental pilot, or ask for the technical documentation."
      />

      <section className="mx-auto max-w-7xl px-5 py-8">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <Reveal>
            <GlassCard hover={false}>
              <form className="grid gap-5 md:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
                <label className="text-sm">
                  Full name
                  <input className={inputClass} placeholder="Your name" />
                </label>
                <label className="text-sm">
                  Organisation
                  <input className={inputClass} placeholder="Department or company" />
                </label>
                <label className="text-sm">
                  Email
                  <input type="email" className={inputClass} placeholder="you@example.gov.in" />
                </label>
                <label className="text-sm">
                  Subject
                  <input className={inputClass} placeholder="Pilot enquiry" />
                </label>
                <label className="text-sm md:col-span-2">
                  Message
                  <textarea rows={5} className={inputClass} placeholder="How can we help?" />
                </label>
                <div className="md:col-span-2">
                  <ActionButton type="submit">Send message (demo)</ActionButton>
                </div>
              </form>
            </GlassCard>
          </Reveal>

          <Reveal delay={0.08}>
            <GlassCard hover={false} className="h-full">
              <h3 className="text-lg font-semibold">Reach us</h3>
              <ul className="mt-5 grid gap-4 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-info" /> contact@jansamarthchain.in
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-info" /> +91 11 4000 1200
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-info" /> Innovation Cell, New Delhi 110001
                </li>
              </ul>
              <p className="mt-6 text-xs text-muted-foreground">
                This is a prototype interface. Submissions are not stored or transmitted.
              </p>
            </GlassCard>
          </Reveal>
        </div>
      </section>
    </div>
  );
}