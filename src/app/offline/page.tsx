import type { Metadata } from "next";
import { Phone, MessageCircle, MapPin, Wrench } from "lucide-react";
import { SITE } from "@/lib/site";
import { PageHero } from "@/components/site/page-hero";

export const metadata: Metadata = {
  title: "You're Offline - FixCare Service Center",
  description: "You're offline. Our website is cached for offline browsing, but you can still call or WhatsApp us at +91-70515-87802.",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <div>
      <PageHero
        eyebrow="Connection Status"
        title="You're Offline"
        subtitle="You don't seem to have an active internet connection right now. You can still reach us by phone or WhatsApp - and the cached pages of this site will keep working."
      />

      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-primary">
            <Wrench className="size-5 text-accent" aria-hidden="true" />
            Reach FixCare right now
          </h2>
          <ul className="mt-4 space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
              <div>
                <p className="font-medium text-primary">Call us - 24/7, even offline</p>
                <a
                  href={SITE.phoneHref}
                  className="text-accent hover:text-primary"
                >
                  {SITE.phone}
                </a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <MessageCircle className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
              <div>
                <p className="font-medium text-primary">WhatsApp</p>
                <a
                  href={SITE.whatsappLink("Hi FixCare, I need appliance repair")}
                  className="text-accent hover:text-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {SITE.phone}
                </a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
              <div>
                <p className="font-medium text-primary">Service area</p>
                <p className="text-muted-foreground">
                  Jammu city, Kathua, Samba, Udhampur, Reasi, Rajouri, Poonch, Doda
                </p>
              </div>
            </li>
          </ul>
        </div>

        <div className="mt-6 rounded-lg border border-border bg-background p-6">
          <h2 className="text-lg font-semibold text-primary">Try these offline</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The cached pages below should still load from your device storage:
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><a href="/" className="text-accent hover:text-primary">→ Homepage</a></li>
            <li><a href="/book-repair" className="text-accent hover:text-primary">→ Book a Repair</a></li>
            <li><a href="/services" className="text-accent hover:text-primary">→ Services overview</a></li>
            <li><a href="/locations" className="text-accent hover:text-primary">→ Service areas</a></li>
            <li><a href="/contact" className="text-accent hover:text-primary">→ Contact details</a></li>
          </ul>
          <p className="mt-4 text-xs text-muted-foreground">
            When your connection returns, all pages will refresh automatically with the latest content.
          </p>
        </div>
      </section>
    </div>
  );
}
