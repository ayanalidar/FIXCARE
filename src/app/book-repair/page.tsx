import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { BookingForm } from "@/components/site/booking-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, Clock, ShieldCheck, Wrench, CheckCircle2 } from "lucide-react";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Book a Repair Online — Same-Day Appliance Repair in Kashmir",
  description:
    "Book a certified WeCare appliance repair in under 60 seconds. Choose your appliance, describe the issue, pick a time slot and get an instant SMS confirmation with your booking reference.",
  keywords: [
    "book appliance repair",
    "same-day repair booking Kashmir",
    "online appliance repair form",
  ],
  alternates: { canonical: "/book-repair" },
  openGraph: {
    title: "Book a Repair Online — WeCare Home Solutions",
    description:
      "Same-day appliance repair in Srinagar, next-day across the Valley. Certified technicians, genuine parts, written warranty.",
    url: `${SITE.domain}/book-repair`,
    type: "website",
  },
};

const WHAT_HAPPENS_NEXT = [
  {
    icon: "MessageCircle",
    title: "Instant SMS confirmation",
    desc: "You'll receive a booking reference and assigned technician's name within seconds of submitting.",
  },
  {
    icon: "Wrench",
    title: "Technician arrives prepared",
    desc: "Our certified technician arrives in a WeCare-branded van with common spare parts on board.",
  },
  {
    icon: "ShieldCheck",
    title: "Transparent quote, then repair",
    desc: "You approve a written quote before any work begins. Most repairs are completed same-visit.",
  },
];

export default function BookRepairPage() {
  return (
    <div>
      <PageHero
        eyebrow="Book a Repair"
        title="Book a Repair Online in Under 60 Seconds"
        subtitle="Choose your appliance, describe the issue, pick a convenient time slot and get an instant SMS confirmation. Same-day service in Srinagar, next-day across the rest of the Kashmir Valley."
      />

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
          <BookingForm />

          <aside className="space-y-6">
            <Card className="bg-card">
              <CardContent className="space-y-4 p-6">
                <h2 className="flex items-center gap-2 text-base font-semibold text-primary">
                  <Clock className="size-5 text-accent" aria-hidden="true" />
                  What happens next
                </h2>
                <ul className="space-y-3">
                  {WHAT_HAPPENS_NEXT.map((s) => (
                    <li key={s.title} className="flex gap-3">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent">
                        {s.icon === "MessageCircle" ? (
                          <MessageCircle className="size-4" aria-hidden="true" />
                        ) : s.icon === "Wrench" ? (
                          <Wrench className="size-4" aria-hidden="true" />
                        ) : (
                          <ShieldCheck className="size-4" aria-hidden="true" />
                        )}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-primary">
                          {s.title}
                        </p>
                        <p className="text-xs text-muted-foreground">{s.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardContent className="space-y-4 p-6">
                <h2 className="text-base font-semibold text-primary">
                  Prefer to talk?
                </h2>
                <p className="text-sm text-muted-foreground">
                  Some issues are easier to describe on the phone. Our team is
                  available 24/7, including holidays.
                </p>
                <div className="flex flex-col gap-2">
                  <Button asChild>
                    <a href={SITE.phoneHref}>
                      <Phone className="size-4" aria-hidden="true" />
                      Call {SITE.phone}
                    </a>
                  </Button>
                  <Button asChild variant="outline">
                    <a
                      href={SITE.whatsappLink(
                        "Hi WeCare, I need to book an appliance repair"
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="size-4" aria-hidden="true" />
                      WhatsApp Us
                    </a>
                  </Button>
                </div>
                <div className="rounded-md border border-accent/30 bg-accent/5 p-3 text-xs text-muted-foreground">
                  <CheckCircle2 className="mb-1 inline size-4 text-accent" aria-hidden="true" />{" "}
                  No payment is taken until the repair is complete and you are
                  satisfied with the work.
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>
    </div>
  );
}
