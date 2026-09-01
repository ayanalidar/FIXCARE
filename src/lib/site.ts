/**
 * Site-wide constants and shared data used across every page.
 * Update these in one place if business details change.
 */

export const SITE = {
  name: "WeCare Home Solutions",
  tagline: "Same-Day Appliance Repair Across Kashmir",
  phone: "+91 9XXXXXXXXX",
  phoneHref: "tel:+919XXXXXXXXX",
  whatsapp: "919XXXXXXXXX",
  whatsappLink: (text: string) =>
    `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`,
  email: "care@wecarehomesolutions.in",
  emailHref: "mailto:care@wecarehomesolutions.in",
  domain: "https://www.wecarehomesolutions.in",
  addressLine: "Srinagar, Jammu & Kashmir, India",
  reviewUrl: "https://search.google.com/local/writereview?placeid=YOUR_PLACE_ID",
} as const;

export interface ServiceMeta {
  slug: string;
  name: string;
  shortName: string;
  icon: string; // lucide icon name
  blurb: string;
  href: string;
}

export const SERVICES: ServiceMeta[] = [
  {
    slug: "washing-machine-repair",
    name: "Washing Machine Repair",
    shortName: "Washing Machine",
    icon: "WashingMachine",
    blurb:
      "Not spinning, not draining, leaking, error codes, drum issues and motor replacement for all major brands.",
    href: "/services/washing-machine-repair",
  },
  {
    slug: "refrigerator-repair",
    name: "Refrigerator Repair",
    shortName: "Refrigerator",
    icon: "Refrigerator",
    blurb:
      "Not cooling, over-freezing, leaking, compressor problems and thermostat issues for single and double-door fridges.",
    href: "/services/refrigerator-repair",
  },
  {
    slug: "air-conditioner-repair",
    name: "Air Conditioner Repair",
    shortName: "Air Conditioner",
    icon: "Wind",
    blurb:
      "Not cooling, gas refill with genuine R32/R410A, water leakage, noise and annual maintenance.",
    href: "/services/air-conditioner-repair",
  },
  {
    slug: "microwave-repair",
    name: "Microwave Repair",
    shortName: "Microwave",
    icon: "Microwave",
    blurb:
      "Not heating, turntable issues, sparking, keypad failures and magnetron replacement.",
    href: "/services/microwave-repair",
  },
  {
    slug: "water-dispenser-repair",
    name: "Water Dispenser Repair",
    shortName: "Water Dispenser",
    icon: "Droplet",
    blurb:
      "Not cooling or heating, leaking, tap issues and compressor problems for all dispenser brands.",
    href: "/services/water-dispenser-repair",
  },
  {
    slug: "dishwasher-repair",
    name: "Dishwasher Repair",
    shortName: "Dishwasher",
    icon: "Utensils",
    blurb:
      "Not cleaning, draining issues, error codes and detergent problems for Bosch, IFB, Samsung.",
    href: "/services/dishwasher-repair",
  },
];

export interface LocationMeta {
  slug: string;
  name: string;
  neighborhoods: string[];
  href: string;
  /** Approx geo coordinates for the city centre, used in LocalBusiness schema + map embed */
  lat: string;
  lng: string;
  /** Same-day or next-day */
  serviceType: string;
}

export const LOCATIONS: LocationMeta[] = [
  {
    slug: "srinagar",
    name: "Srinagar",
    neighborhoods: ["Lal Chowk", "Hyderpora", "Rajbagh", "Karan Nagar", "Sonwar", "Bemina"],
    href: "/locations/srinagar",
    lat: "34.0837",
    lng: "74.7973",
    serviceType: "same-day",
  },
  {
    slug: "anantnag",
    name: "Anantnag",
    neighborhoods: ["Khanabal", "Anantnag town", "Mattan", "Achabal", "Verinag", "Dooru"],
    href: "/locations/anantnag",
    lat: "33.7313",
    lng: "75.1514",
    serviceType: "next-day",
  },
  {
    slug: "baramulla",
    name: "Baramulla",
    neighborhoods: ["Old Town", "New Town", "Sopore", "Uri", "Tangmarg", "Pattan"],
    href: "/locations/baramulla",
    lat: "34.2095",
    lng: "74.3428",
    serviceType: "next-day",
  },
  {
    slug: "budgam",
    name: "Budgam",
    neighborhoods: ["Budgam town", "Beerwah", "Magam", "Chadoora", "Charar-i-Sharief", "Soibugh"],
    href: "/locations/budgam",
    lat: "34.0167",
    lng: "74.7167",
    serviceType: "next-day",
  },
  {
    slug: "pulwama",
    name: "Pulwama",
    neighborhoods: ["Pulwama town", "Pampore", "Awantipora", "Tral", "Rajpora", "Lethpora"],
    href: "/locations/pulwama",
    lat: "33.8856",
    lng: "74.9056",
    serviceType: "next-day",
  },
  {
    slug: "ganderbal",
    name: "Ganderbal",
    neighborhoods: ["Ganderbal town", "Kangan", "Wayil", "Lar", "Tullamulla", "Manasbal"],
    href: "/locations/ganderbal",
    lat: "34.2306",
    lng: "74.7756",
    serviceType: "next-day",
  },
  {
    slug: "bandipora",
    name: "Bandipora",
    neighborhoods: ["Bandipora town", "Sumbal", "Hajin", "Nadihal", "Ajas", "Watlab"],
    href: "/locations/bandipora",
    lat: "34.4233",
    lng: "74.6547",
    serviceType: "next-day",
  },
  {
    slug: "kupwara",
    name: "Kupwara",
    neighborhoods: ["Kupwara town", "Handwara", "Kralpora", "Trehgam", "Lolab", "Langate"],
    href: "/locations/kupwara",
    lat: "34.5311",
    lng: "74.2522",
    serviceType: "next-day / planned",
  },
];

export const BRANDS = [
  "Samsung",
  "LG",
  "Whirlpool",
  "Bosch",
  "IFB",
  "Godrej",
  "Haier",
  "Voltas",
  "Panasonic",
];

export interface BlogMeta {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  icon: string;
  href: string;
}

export const BLOG_POSTS: BlogMeta[] = [
  {
    slug: "why-is-my-washing-machine-not-draining",
    title: "Why Is My Washing Machine Not Draining? 7 Common Causes & Fixes",
    excerpt:
      "A washing machine that fills, washes and spins but refuses to drain leaves you with a drum full of grey water. Discover the 7 most common causes and Kashmir-specific fixes.",
    date: "September 2026",
    icon: "WashingMachine",
    href: "/blog/why-is-my-washing-machine-not-draining",
  },
  {
    slug: "signs-your-refrigerator-needs-repair",
    title: "Signs Your Refrigerator Needs Repair — Don't Ignore These 8 Red Flags",
    excerpt:
      "A plain-English checklist of the eight most common warning signs that your fridge is failing, with Kashmir-specific context around wazwan prep, noon chai storage and Eid week.",
    date: "September 2026",
    icon: "Refrigerator",
    href: "/blog/signs-your-refrigerator-needs-repair",
  },
  {
    slug: "summer-ac-maintenance-tips",
    title: "Summer AC Maintenance Tips for Kashmir Homes — Beat the Heat Smartly",
    excerpt:
      "Kashmir air conditioners sit idle for 9 months and need careful reactivation before the May-July heat. Pre-season and in-season maintenance tips that actually help.",
    date: "August 2026",
    icon: "Wind",
    href: "/blog/summer-ac-maintenance-tips",
  },
  {
    slug: "how-to-extend-the-life-of-your-microwave",
    title: "How to Extend the Life of Your Microwave — 10 Tips That Actually Work",
    excerpt:
      "Ten everyday habits that protect a microwave from the most common failures, written for Kashmiri households that use microwaves for reheating noon chai and leftover wazwan.",
    date: "August 2026",
    icon: "Microwave",
    href: "/blog/how-to-extend-the-life-of-your-microwave",
  },
  {
    slug: "common-ac-error-codes-explained",
    title: "Common AC Error Codes Explained — What Those Flashing Lights Mean",
    excerpt:
      "A reference guide to the most common AC error codes (E1 through H1) across Voltas, LG, Samsung and Daikin, with what each code means and what to do next.",
    date: "July 2026",
    icon: "AlertTriangle",
    href: "/blog/common-ac-error-codes-explained",
  },
];

/** Star renderer helper — used by testimonials, reviews and aggregate ratings. */
export function renderStars(rating: number): string {
  return "★".repeat(Math.floor(rating)) + "☆".repeat(5 - Math.floor(rating));
}
