import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/site-layout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FAQS } from "@/lib/dummy-data";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — IdleSpace" },
      { name: "description", content: "Answers to common questions about IdleSpace." },
      { property: "og:title", content: "FAQ — IdleSpace" },
      { property: "og:description", content: "Frequently asked questions." },
    ],
  }),
  component: FAQPage,
});

function FAQPage() {
  const [q, setQ] = useState("");
  const list = useMemo(() => FAQS.filter((f) => f.q.toLowerCase().includes(q.toLowerCase()) || f.a.toLowerCase().includes(q.toLowerCase())), [q]);
  return (
    <SiteLayout>
      <PageHeader eyebrow="Support" title="Frequently asked questions" subtitle="Can't find what you need? Reach out anytime." />
      <div className="mx-auto max-w-3xl px-4 pb-16">
        <div className="glass-strong rounded-2xl p-2 flex items-center gap-3 px-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search FAQs" className="bg-transparent outline-none w-full py-2 text-sm" />
        </div>
        <Accordion type="single" collapsible className="mt-6">
          {list.map((f, i) => (
            <AccordionItem key={f.q} value={`i-${i}`} className="rounded-2xl bg-card border border-border mb-2 px-4">
              <AccordionTrigger className="hover:no-underline text-left">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </SiteLayout>
  );
}
