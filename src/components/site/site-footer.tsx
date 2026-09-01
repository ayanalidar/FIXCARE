import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, Facebook, Instagram, Twitter } from "lucide-react";
import { SERVICES, LOCATIONS, SITE } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company */}
          <div>
            <Link
              href="/"
              className="flex items-center gap-2 text-primary font-bold tracking-tight"
              aria-label="FixCare Service Center - home"
            >
              <Image
                src="/fixcare-logo-particles.png"
                alt="FixCare Service Center"
                width={160}
                height={63}
                className="h-9 w-auto sm:h-10"
              />
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              Locally owned appliance repair business serving the Jammu region.
              Same-day service in Jammu city, next-day across the rest of the region.
            </p>
            <div className="mt-4 flex flex-col gap-2 text-sm">
              <a
                href={SITE.phoneHref}
                className="flex items-center gap-2 text-primary hover:text-accent"
              >
                <Phone className="size-4" aria-hidden="true" />
                <span>{SITE.phone}</span>
              </a>
              <a
                href={SITE.emailHref}
                className="flex items-center gap-2 text-primary hover:text-accent"
              >
                <Mail className="size-4" aria-hidden="true" />
                <span>{SITE.email}</span>
              </a>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <a
                href="https://www.facebook.com/fixcareservicecenter"
                aria-label="FixCare on Facebook"
                className="text-muted-foreground hover:text-accent"
              >
                <Facebook className="size-5" aria-hidden="true" />
              </a>
              <a
                href="https://www.instagram.com/fixcareservicecenter"
                aria-label="FixCare on Instagram"
                className="text-muted-foreground hover:text-accent"
              >
                <Instagram className="size-5" aria-hidden="true" />
              </a>
              <a
                href="https://twitter.com/fixcaresvc"
                aria-label="FixCare on Twitter"
                className="text-muted-foreground hover:text-accent"
              >
                <Twitter className="size-5" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Company links */}
          <div>
            <h2 className="text-sm font-semibold text-primary">Company</h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-accent"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/reviews"
                  className="text-muted-foreground hover:text-accent"
                >
                  Reviews
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-muted-foreground hover:text-accent"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-muted-foreground hover:text-accent"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-accent"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/brands"
                  className="text-muted-foreground hover:text-accent"
                >
                  Brands We Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h2 className="text-sm font-semibold text-primary">Services</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={s.href}
                    className="text-muted-foreground hover:text-accent"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/book-repair"
                  className="text-accent font-medium hover:text-primary"
                >
                  Book a Repair
                </Link>
              </li>
            </ul>
          </div>

          {/* Locations + Legal */}
          <div>
            <h2 className="text-sm font-semibold text-primary">Locations</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {LOCATIONS.slice(0, 8).map((l) => (
                <li key={l.slug}>
                  <Link
                    href={l.href}
                    className="text-muted-foreground hover:text-accent"
                  >
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
            <h2 className="mt-5 text-sm font-semibold text-primary">Legal</h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-muted-foreground hover:text-accent"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-accent"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/warranty-policy"
                  className="text-muted-foreground hover:text-accent"
                >
                  Warranty Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} FixCare Service Center. All rights reserved. Locally owned in the Jammu region.
          </p>
          <p className="text-muted-foreground">
            Certified technicians · Genuine parts · Written warranty · 24/7 service
          </p>
        </div>

        {/* Made and maintained by GuardianX — link opens www.guardianx.in */}
        <div className="mt-4 flex justify-center border-t border-border pt-4 text-[11px] text-muted-foreground sm:justify-end">
          <p className="tracking-wide">
            MADE AND MAINTAINED BY:{" "}
            <a
              href="https://www.guardianx.in"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-accent transition-colors hover:text-primary hover:underline underline-offset-2"
              aria-label="Visit GuardianX - opens in a new tab"
            >
              GUARDIANX
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
