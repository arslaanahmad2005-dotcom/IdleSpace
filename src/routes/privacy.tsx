import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHeader } from "@/components/site-layout";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — IdleSpace" },
      { name: "description", content: "How we collect, use, and protect your data." },
      { property: "og:title", content: "Privacy Policy — IdleSpace" },
      { property: "og:description", content: "Our privacy commitments." },
    ],
  }),
  component: Privacy,
});

const sections = [
  { h: "1. Overview", p: "IdleSpace ('we', 'us') respects your privacy. This policy describes what we collect and how we use it." },
  { h: "2. Data we collect", p: "Account details, booking activity, payment information, device signals and communications with our support team." },
  { h: "3. How we use data", p: "To operate the marketplace, verify bookings, prevent fraud, personalize recommendations and improve the product." },
  { h: "4. Sharing", p: "We share data with hosts you book with, payment processors, and service providers under strict contracts." },
  { h: "5. Your rights", p: "You can access, correct, export or delete your personal data at any time from your profile settings." },
  { h: "6. Contact", p: "Questions? Email privacy@idlespace.co." },
];

function Privacy() {
  return (
    <SiteLayout>
      <PageHeader eyebrow="Legal" title="Privacy Policy" subtitle="Last updated: August 1, 2026." />
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
