import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHero } from "@/components/site/page-hero";
import { CTASection } from "@/components/site/cta-section";
import { ServiceCard } from "@/components/site/service-card";
import { LocationCard } from "@/components/site/location-card";
import { TestimonialCard } from "@/components/site/testimonial-card";
import { FAQAccordion } from "@/components/site/faq-accordion";
import { TrustStats } from "@/components/site/trust-stats";
import { PincodeChecker } from "@/components/site/pincode-checker";
import { Icon } from "@/components/site/icon";
import { SERVICES, LOCATIONS, SITE } from "@/lib/site";
import {
  Phone,
  MessageCircle,
  Wrench,
  ShieldCheck,
  Clock,
  CheckCircle2,
  CalendarCheck,
  Star,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Same-Day Appliance Repair Across Jammu Region - Certified Technicians You Can Trust",
  description:
    "Jammu region's trusted multi-brand appliance repair service. Same-day washing machine, fridge, AC, microwave, dishwasher & water dispenser repair across 8 cities. Certified technicians, genuine parts, warranty. Call now.",
  keywords: [
    "appliance repair Jammu",
    "same-day appliance repair",
    "certified technician Jammu",
    "multi-brand repair service",
    "FixCare Service Center",
  ],
  alternates: { canonical: "/" },
};

const TRUST_BADGES = [
  { icon: "Clock", label: "24/7 Service" },
  { icon: "CheckCircle2", label: "Same-Day" },
  { icon: "ShieldCheck", label: "Certified" },
  { icon: "Wrench", label: "Genuine Parts" },
  { icon: "Star", label: "Warranty" },
];

const PROMISES = [
  {
    icon: "Clock",
    title: "Same-day service",
    desc: "In Jammu city and next-day across the rest of the Jammu region.",
  },
  {
    icon: "Phone",
    title: "24/7 availability",
    desc: "Call us any time, including weekends and holidays.",
  },
  {
    icon: "ShieldCheck",
    title: "Certified technicians",
    desc: "Trained on the latest appliance models and error codes.",
  },
  {
    icon: "Wrench",
    title: "Genuine spare parts",
    desc: "Directly sourced from brand-authorized distributors.",
  },
  {
    icon: "CheckCircle2",
    title: "Transparent pricing",
    desc: "You approve the quote before any work begins.",
  },
  {
    icon: "Star",
    title: "Written warranty",
    desc: "3 to 12 months depending on the part replaced.",
  },
];

const STEPS = [
  {
    icon: "Phone",
    title: "1. Book Your Repair",
    desc: "Call us, WhatsApp us, or fill out our 60-second online booking form. Tell us the appliance, the problem, and a convenient time slot. You will receive an immediate SMS confirmation with your booking reference number and the assigned technician's name.",
  },
  {
    icon: "Wrench",
    title: "2. Technician Arrives & Diagnoses",
    desc: "Our certified technician arrives at the scheduled time slot in a FixCare-branded service van carrying common spare parts. After a thorough diagnosis, you receive a transparent quote with the cost of parts and labor broken down separately. No work begins until you approve the quote.",
  },
  {
    icon: "ShieldCheck",
    title: "3. Repair Completed & Warranty Issued",
    desc: "Most repairs are completed in the same visit. After the repair, you receive a written warranty card, a digital invoice via SMS/WhatsApp, and a feedback call 24 hours later. If the problem recurs within the warranty period, we return and fix it free.",
  },
];

const HOMEPAGE_FAQS = [
  {
    question: "How quickly can a technician reach my home in Jammu city?",
    answer:
      "For Jammu city, our standard response time is same-day - usually within 2-4 hours of booking during business hours. For other Jammu region cities, we typically reach next-day, with 2-day service for remote areas like Rajouri, Poonch and Doda. Emergency visits within 1 hour are available for an additional charge in Jammu city.",
  },
  {
    question: "Do you charge a visit/diagnostic fee?",
    answer:
      "We charge a nominal ₹200-300 visit fee which is fully adjusted against the repair cost if you proceed with the repair. The diagnostic itself is free - you receive a transparent quote before any work begins.",
  },
  {
    question: "Are your technicians certified?",
    answer:
      "Yes. Every FixCare technician is formally trained on the appliance categories they service, carries an ID card, and is background-verified. For high-end brands like Bosch and Samsung, we have brand-specific trained specialists on the team.",
  },
  {
    question: "Do you use genuine spare parts?",
    answer:
      "Always. We source spare parts directly from brand-authorized distributors in J&K. Every part we install comes with the manufacturer's warranty plus our own written warranty on top. We never use duplicate or refurbished parts without your explicit consent.",
  },
  {
    question: "What is your warranty period?",
    answer:
      "Warranty ranges from 3 months (for minor parts like belts, switches) to 12 months (for major parts like compressors, motors). The exact warranty is mentioned on your written warranty card at the time of repair. If the same problem recurs within the warranty period, we return and fix it free of charge.",
  },
  {
    question: "How do I pay?",
    answer:
      "We accept cash, UPI (Google Pay, PhonePe, Paytm), and bank transfer. For larger repairs above ₹5,000 we also accept card payments. An invoice with GST breakdown is provided on request.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "My Samsung washing machine stopped mid-cycle on a Sunday afternoon. I called FixCare at 2pm and a technician arrived by 5pm the same day. He diagnosed a motorbrush issue, replaced the part from his van, and had it running by 6pm. Genuine parts, fair price, polite technician. Highly recommend.",
    name: "Arjun S.",
    location: "Gandhinagar, Jammu",
  },
  {
    quote:
      "We had three different repair guys look at our LG fridge before FixCare. They were the first ones to actually diagnose the real problem (a faulty freezer thermostat) instead of just refilling gas every few months. Fridge has been running perfectly for 8 months since. Honest and competent.",
    name: "Meena D.",
    location: "Nanak Nagar, Jammu",
  },
  {
    quote:
      "Booked an AC gas refill through their online form on a Tuesday morning. Got a confirmation SMS in 2 minutes, technician arrived the next day from Jammu to Kathua, refilled genuine R32 gas, and the AC is cooling better than when it was new. Will use again.",
    name: "Rajesh K.",
    location: "Kathua",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: HOMEPAGE_FAQS.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "ApplianceRepair",
  "@id": `${SITE.domain}/#business`,
  name: "FixCare Service Center",
  description:
    "Same-day appliance repair service across the Jammu region. Certified technicians for washing machine, refrigerator, AC, microwave, water dispenser, and dishwasher repair. Genuine parts, written warranty, 24/7 service.",
  url: SITE.domain,
  telephone: "+91-70515-87802",
  email: SITE.email,
  priceRange: "₹₹",
  currenciesAccepted: "INR",
  paymentAccepted: "Cash, UPI, Credit Card, Debit Card, Bank Transfer",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Jammu",
    addressRegion: "Jammu & Kashmir",
    postalCode: "180001",
    addressCountry: "IN",
  },
  geo: { "@type": "GeoCoordinates", latitude: "32.7266", longitude: "74.8570" },
  areaServed: LOCATIONS.map((l) => ({ "@type": "City", name: l.name })),
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Appliance Repair Services",
    itemListElement: SERVICES.map((s) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: s.name,
        url: `${SITE.domain}${s.href}`,
      },
    })),
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "9",
    bestRating: "5",
    worstRating: "1",
  },
  sameAs: [
    "https://www.facebook.com/fixcareservicecenter",
    "https://www.instagram.com/fixcareservicecenter",
    "https://twitter.com/fixcaresvc",
  ],
};

export default function HomePage() {
  return (
    <div>
      {/* 1. Hero */}
      <PageHero
        eyebrow="Locally owned in the Jammu region · 24/7 service"
        title="Same-Day Appliance Repair Across Jammu Region - Certified Technicians You Can Trust"
        subtitle="When your washing machine stops mid-cycle, your refrigerator stops cooling, or your AC gives up on a humid Jammu afternoon, you need a repair service that arrives the same day, fixes the problem with genuine parts, and stands behind their work with a written warranty."
      >
        <div className="flex flex-wrap gap-3">
          <Button
            asChild
            size="lg"
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
          >
            <Link href="/book-repair">
              <CalendarCheck className="size-4" aria-hidden="true" />
              Book a Repair
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
          >
            <a
              href={SITE.whatsappLink("Hi FixCare, I need appliance repair")}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              WhatsApp Us
            </a>
          </Button>
        </div>
        <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-primary-foreground/85 sm:text-sm">
          {TRUST_BADGES.map((b) => (
            <li key={b.label} className="flex items-center gap-1.5">
              <Icon name={b.icon} className="size-4" aria-hidden="true" />
              <span>{b.label}</span>
            </li>
          ))}
        </ul>
      </PageHero>

      {/* 2. Trust stats */}
      <TrustStats />

      {/* 3. Intro / Why FixCare */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-primary sm:text-3xl">
              Why the Jammu Region Trusts FixCare Service Center
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              FixCare is not a national call-center that dispatches the nearest
              freelancer - we are a locally operated Jammu business with a team
              of certified, trained, and background-verified technicians who carry
              genuine spare parts in their service vans so most repairs are
              completed in a single visit.
            </p>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              We work on all major brands - Samsung, LG, Whirlpool, Bosch, IFB,
              Godrej, Haier, Voltas, Panasonic, and more - and offer a written
              warranty on every repair. If a problem recurs within the warranty
              period, we return and fix it free of charge.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/about">More About Us</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/reviews">Read Reviews</Link>
              </Button>
            </div>
          </div>
          <Card className="bg-card">
            <CardContent className="space-y-4 p-6">
              <h3 className="text-lg font-semibold text-primary">Our promise to every Jammu household</h3>
              <ul className="space-y-3">
                {PROMISES.map((p) => (
                  <li key={p.title} className="flex gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent">
                      <Icon name={p.icon} className="size-4" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-primary">{p.title}</p>
                      <p className="text-xs text-muted-foreground">{p.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 5. Services grid */}
      <section className="bg-card border-y border-border">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                Our Appliance Repair Services
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-primary sm:text-3xl">
                Six appliance categories, dedicated specialists for each
              </h2>
            </div>
            <Link
              href="/services/washing-machine-repair"
              className="hidden text-sm font-semibold text-accent hover:text-primary sm:inline-flex"
            >
              Browse services →
            </Link>
          </div>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            We repair every major home appliance, with dedicated specialists for
            each category. Tap any service below to learn more about the common
            problems we fix, the brands we service, and the typical repair
            process.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {SERVICES.map((s) => (
              <ServiceCard
                key={s.slug}
                icon={s.icon}
                name={s.name}
                blurb={s.blurb}
                href={s.href}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 6. How We Work */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">
          How We Work - Three Simple Steps
        </p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-primary sm:text-3xl">
          A frictionless repair experience refined over hundreds of jobs
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {STEPS.map((s) => (
            <Card key={s.title} className="bg-card">
              <CardContent className="space-y-3 p-6">
                <div className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <Icon name={s.icon} className="size-5" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-primary">{s.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {s.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 7. Locations */}
      <section className="bg-card border-y border-border">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                Service Areas Across Jammu Region
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-primary sm:text-3xl">
                Same-day in Jammu city, next-day across the region
              </h2>
            </div>
            <Link
              href="/locations"
              className="hidden text-sm font-semibold text-accent hover:text-primary sm:inline-flex"
            >
              All locations →
            </Link>
          </div>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            FixCare Service Center serves the entire Jammu region with same-day
            service in Jammu city, next-day service in nearby districts, and
            2-day service to remote areas.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {LOCATIONS.map((l) => (
              <LocationCard
                key={l.slug}
                name={l.name}
                neighborhoods={l.neighborhoods}
                href={l.href}
                serviceType={l.serviceType}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 8. Testimonials */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">
          What Our Customers Say
        </p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-primary sm:text-3xl">
          Real reviews from Jammu households
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <TestimonialCard
              key={t.name}
              quote={t.quote}
              name={t.name}
              location={t.location}
            />
          ))}
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          Read more verified reviews on our{" "}
          <Link href="/reviews" className="font-semibold text-accent hover:text-primary">
            Reviews page
          </Link>
          .
        </p>
      </section>

      {/* 9. FAQ teaser */}
      <section className="bg-card border-y border-border">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">
            Frequently Asked Questions
          </p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-primary sm:text-3xl">
            Quick answers to common questions
          </h2>
          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <FAQAccordion items={HOMEPAGE_FAQS} />
            </div>
            <div className="lg:col-span-1">
              <Card className="bg-background">
                <CardContent className="space-y-3 p-6">
                  <h3 className="text-lg font-semibold text-primary">
                    Still have questions?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    See 15+ answers to common questions about service timing,
                    fees, warranty, parts and booking on our full FAQ page.
                  </p>
                  <Button asChild className="w-full">
                    <Link href="/faq">View all FAQs</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Pincode checker */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Card className="bg-card">
          <CardContent className="grid gap-8 p-6 sm:p-8 lg:grid-cols-2 lg:items-center lg:p-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                Are we in your area?
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-primary sm:text-3xl">
                Check your pincode for service availability
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Same-day service in Jammu city. Next-day across the rest of the
                Jammu region. If your area isn&apos;t listed, call us - we
                frequently travel beyond our standard routes.
              </p>
              <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <CheckCircle2 className="size-3.5 text-accent" aria-hidden="true" />
                  50+ pincodes mapped
                </span>
                <span className="inline-flex items-center gap-1">
                  <Phone className="size-3.5 text-accent" aria-hidden="true" />
                  24/7 call desk
                </span>
              </div>
            </div>
            <PincodeChecker />
          </CardContent>
        </Card>
      </section>

      {/* 11. CTA */}
      <CTASection
        title="Ready to Get Your Appliance Fixed?"
        subtitle="Don't let a broken appliance disrupt your home. Book a repair now and a certified FixCare technician will be at your door the same day in Jammu city, the next day across the rest of the Jammu region."
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </div>
  );
}
