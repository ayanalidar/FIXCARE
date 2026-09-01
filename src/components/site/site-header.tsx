"use client";

import * as React from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, Phone, Wrench } from "lucide-react";
import { SERVICES, LOCATIONS, SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

const MAIN_NAV = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Reviews", href: "/reviews" },
  { label: "FAQ", href: "/faq" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export function SiteHeader() {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-primary font-bold tracking-tight"
          aria-label="FixCare Service Center — home"
        >
          <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <Wrench className="size-5" aria-hidden="true" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-base sm:text-lg">FixCare</span>
            <span className="text-[10px] sm:text-xs font-medium text-muted-foreground">
              Service Center
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <NavigationMenu className="hidden lg:flex" aria-label="Main">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Services</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[640px] gap-1 p-2 md:grid-cols-2">
                  {SERVICES.map((s) => (
                    <li key={s.slug}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={s.href}
                          className="flex flex-col gap-1 rounded-sm p-3 transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                          <span className="text-sm font-semibold">
                            {s.name}
                          </span>
                          <span className="text-xs text-muted-foreground line-clamp-2">
                            {s.blurb}
                          </span>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Locations</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[520px] gap-1 p-2 md:grid-cols-2">
                  {LOCATIONS.map((l) => (
                    <li key={l.slug}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={l.href}
                          className="flex flex-col gap-1 rounded-sm p-3 transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                          <span className="text-sm font-semibold">
                            {l.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {l.serviceType} service
                          </span>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/locations"
                        className="flex flex-col gap-1 rounded-sm p-3 transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        <span className="text-sm font-semibold">
                          All Locations
                        </span>
                        <span className="text-xs text-muted-foreground">
                          See every area we serve
                        </span>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {MAIN_NAV.slice(1).map((item) => (
              <NavigationMenuItem key={item.href}>
                <Link
                  href={item.href}
                  className={cn(navigationMenuTriggerStyle())}
                >
                  {item.label}
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right cluster: phone + book CTA + mobile menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={SITE.phoneHref}
            className="hidden xl:inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent"
            aria-label={`Call us at ${SITE.phone}`}
          >
            <Phone className="size-4" aria-hidden="true" />
            <span>{SITE.phone}</span>
          </a>
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/book-repair">Book a Repair</Link>
          </Button>

          {/* Mobile */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden"
                aria-label="Open navigation menu"
              >
                <Menu className="size-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[320px] overflow-y-auto bg-background p-0"
            >
              <SheetHeader className="border-b p-4 text-left">
                <SheetTitle className="flex items-center gap-2 text-primary">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <Wrench className="size-4" aria-hidden="true" />
                  </span>
                  FixCare Service Center
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-1 p-4">
                <MobileLink href="/" label="Home" setOpen={setOpen} />
                <MobileGroup label="Services">
                  {SERVICES.map((s) => (
                    <MobileLink
                      key={s.slug}
                      href={s.href}
                      label={s.name}
                      setOpen={setOpen}
                      indent
                    />
                  ))}
                </MobileGroup>
                <MobileGroup label="Locations">
                  {LOCATIONS.map((l) => (
                    <MobileLink
                      key={l.slug}
                      href={l.href}
                      label={l.name}
                      setOpen={setOpen}
                      indent
                    />
                  ))}
                  <MobileLink
                    href="/locations"
                    label="All Locations"
                    setOpen={setOpen}
                    indent
                  />
                </MobileGroup>
                <MobileLink href="/about" label="About" setOpen={setOpen} />
                <MobileLink href="/reviews" label="Reviews" setOpen={setOpen} />
                <MobileLink href="/faq" label="FAQ" setOpen={setOpen} />
                <MobileLink href="/blog" label="Blog" setOpen={setOpen} />
                <MobileLink href="/brands" label="Brands We Service" setOpen={setOpen} />
                <MobileLink href="/contact" label="Contact" setOpen={setOpen} />
                <div className="mt-4 flex flex-col gap-2 border-t pt-4">
                  <Button asChild>
                    <Link href="/book-repair" onClick={() => setOpen(false)}>
                      Book a Repair
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <a href={SITE.phoneHref}>
                      <Phone className="size-4" aria-hidden="true" />
                      {SITE.phone}
                    </a>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function MobileGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-2">
      <p className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      {children}
    </div>
  );
}

function MobileLink({
  href,
  label,
  setOpen,
  indent,
}: {
  href: string;
  label: string;
  setOpen: (v: boolean) => void;
  indent?: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={() => setOpen(false)}
      className={cn(
        "block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
        indent && "pl-6"
      )}
    >
      {label}
    </Link>
  );
}
