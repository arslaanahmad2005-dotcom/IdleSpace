import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHeader } from "@/components/site-layout";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — IdleSpace" },
      { name: "description", content: "The terms that govern your use of IdleSpace." },
      { property: "og:title", content: "Terms & Conditions — IdleSpace" },
      { property: "og:description", content: "Our terms of service." },
    ],
  }),
  component: Terms,
});

const sections = [
  { h: "1. Acceptance", p: "By using IdleSpace, you agree to these Terms. If you do not agree, please do not use the service." },
  { h: "2. Bookings", p: "All bookings are subject to the host's availability, house rules, and cancellation policy shown on each listing." },
  { h: "3. Payments", p: "We collect payment at booking. Payouts to hosts occur 24 hours after successful completion." },
  { h: "4. Conduct", p: "Users must treat spaces respectfully. Damages may be charged to your payment method." },
  { h: "5. Liability", p: "IdleSpace's liability is limited as described in Section 12 of the full agreement." },
  { h: "6. Changes", p: "We may update these Terms from time to time. Continued use constitutes acceptance." },
];

function Terms() {
  return (
    <SiteLayout>
      <PageHeader eyebrow="Legal" title="Terms & Conditions" subtitle="Last updated: August 1, 2026." />
      <article className="mx-auto max-w-3xl px-4 pb-16 space-y-6">
        {sections.map((s) => (
          <section key={s.h}>
            <h2 className="text-xl font-semibold">{s.h}</h2>
            <p className="mt-2 text-muted-foreground leading-relaxed">{s.p}</p>
          </section>
        ))}
      </article>
    </SiteLayout>
  );
}
