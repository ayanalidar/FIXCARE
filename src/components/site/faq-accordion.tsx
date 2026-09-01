"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export interface FAQItem {
  question: string;
  answer: string;
}

export function FAQAccordion({
  items,
  groupLabel,
}: {
  items: FAQItem[];
  groupLabel?: string;
}) {
  return (
    <div className="w-full">
      {groupLabel && (
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-accent">
          {groupLabel}
        </h3>
      )}
      <Accordion type="single" collapsible className="w-full">
        {items.map((item, idx) => (
          <AccordionItem
            key={idx}
            value={`item-${idx}`}
            className="border-b border-border"
          >
            <AccordionTrigger className="text-left text-base font-semibold text-primary hover:text-accent">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
