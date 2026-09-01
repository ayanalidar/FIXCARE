import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, MessageCircle, CalendarCheck } from "lucide-react";
import { SITE } from "@/lib/site";

export function CTASection({
  title = "Ready to Get Your Appliance Fixed?",
  subtitle = "Don't let a broken appliance disrupt your home. Book a repair now and a certified FixCare technician will be at your door the same day in Jammu city, the next day across the rest of the Jammu region.",
  variant = "default",
}: {
  title?: string;
  subtitle?: string;
  variant?: "default" | "narrow";
}) {
  return (
    <section
      className={
        variant === "narrow"
          ? "mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8"
          : "mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
      }
    >
      <Card className="bg-gradient-to-br from-primary to-accent text-primary-foreground border-0">
        <CardContent className="flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:p-10">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {title}
            </h2>
            <p className="mt-3 text-primary-foreground/85">{subtitle}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            >
              <Link href="/book-repair">
                <CalendarCheck className="size-4" aria-hidden="true" />
                Book a Repair Online
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <a
                href={SITE.whatsappLink(
                  "Hi FixCare, I need appliance repair"
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="size-4" aria-hidden="true" />
                WhatsApp Us
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <a href={SITE.phoneHref}>
                <Phone className="size-4" aria-hidden="true" />
                Call Now
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
