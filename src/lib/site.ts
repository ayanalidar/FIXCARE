/**
 * Site-wide constants and shared data used across every page.
 * Update these in one place if business details change.
 */

export const SITE = {
  name: "FixCare Service Center",
  tagline: "Same-Day Appliance Repair Across the Jammu Region",
  phone: "+91-70515-87802",
  phoneHref: "tel:+917051587802",
  whatsapp: "917051587802",
  whatsappLink: (text: string) =>
    `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`,
  // hello@ for general inquiries, fix@ for repair-booking inquiries
  email: "hello@fixcareservicecenter.in",
  emailHref: "mailto:hello@fixcareservicecenter.in",
  bookingEmail: "fix@fixcareservicecenter.in",
  bookingEmailHref: "mailto:fix@fixcareservicecenter.in",
  domain: "https://www.fixcareservicecenter.in",
  addressLine: "Jammu, Jammu & Kashmir, India",
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
  /** Same-day, next-day, or 2-day */
  serviceType: string;
}

export const LOCATIONS: LocationMeta[] = [
  {
    slug: "jammu",
    name: "Jammu City",
    neighborhoods: ["Gandhinagar", "Talab Tillo", "Janipur", "Rehari", "Bakshi Nagar", "Nanak Nagar", "Trikuta Nagar", "Gangyal", "Satwari", "Bari Brahmana"],
    href: "/locations/jammu",
    lat: "32.7266",
    lng: "74.8570",
    serviceType: "same-day",
  },
  {
    slug: "kathua",
    name: "Kathua",
    neighborhoods: ["Kathua city", "Hiranagar", "Bilawar", "Bashohli", "Jodian", "Marheen"],
    href: "/locations/kathua",
    lat: "32.3792",
    lng: "75.5208",
    serviceType: "next-day",
  },
  {
    slug: "samba",
    name: "Samba",
    neighborhoods: ["Samba town", "Vijaypur", "Nandpur", "Ghagwal", "Purmandal"],
    href: "/locations/samba",
    lat: "32.5675",
    lng: "75.1030",
    serviceType: "next-day",
  },
  {
    slug: "udhampur",
    name: "Udhampur",
    neighborhoods: ["Udhampur city", "Ramnagar", "Chenani", "Katra", "Patnitop"],
    href: "/locations/udhampur",
    lat: "32.9159",
    lng: "75.1407",
    serviceType: "next-day",
  },
  {
    slug: "reasi",
    name: "Reasi",
    neighborhoods: ["Reasi town", "Katra", "Pouni", "Mahore", "Salal", "Arnas"],
    href: "/locations/reasi",
    lat: "33.0812",
    lng: "74.8298",
    serviceType: "next-day",
  },
  {
    slug: "rajouri",
    name: "Rajouri",
    neighborhoods: ["Rajouri town", "Thanamandi", "Koteranka", "Budhal", "Darhal", "Sunderbani"],
    href: "/locations/rajouri",
    lat: "33.3825",
    lng: "74.3112",
    serviceType: "2-day",
  },
  {
    slug: "poonch",
    name: "Poonch",
    neighborhoods: ["Poonch town", "Surankote", "Mendhar", "Balakote", "Loran"],
    href: "/locations/poonch",
    lat: "33.7703",
    lng: "74.2634",
    serviceType: "2-day",
  },
  {
    slug: "doda",
    name: "Doda",
    neighborhoods: ["Doda town", "Bhaderwah", "Thathri", "Gandoh", "Ramban", "Banihal"],
    href: "/locations/doda",
    lat: "33.1464",
    lng: "75.5613",
    serviceType: "2-day",
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
      "A washing machine that fills, washes and spins but refuses to drain leaves you with a drum full of grey water. Discover the 7 most common causes and Jammu-specific fixes.",
    date: "September 2026",
    icon: "WashingMachine",
    href: "/blog/why-is-my-washing-machine-not-draining",
  },
  {
    slug: "signs-your-refrigerator-needs-repair",
    title: "Signs Your Refrigerator Needs Repair - Don't Ignore These 8 Red Flags",
    excerpt:
      "A plain-English checklist of the eight most common warning signs that your fridge is failing, with Jammu-specific context around festive prep, rajma-chawal storage and Eid week.",
    date: "September 2026",
    icon: "Refrigerator",
    href: "/blog/signs-your-refrigerator-needs-repair",
  },
  {
    slug: "summer-ac-maintenance-tips",
    title: "Summer AC Maintenance Tips for Jammu Homes - Beat the Heat Smartly",
    excerpt:
      "Jammu air conditioners run for a long, hot season from April through September. Pre-season and in-season maintenance tips that actually help.",
    date: "August 2026",
    icon: "Wind",
    href: "/blog/summer-ac-maintenance-tips",
  },
  {
    slug: "how-to-extend-the-life-of-your-microwave",
    title: "How to Extend the Life of Your Microwave - 10 Tips That Actually Work",
    excerpt:
      "Ten everyday habits that protect a microwave from the most common failures, written for Jammu households that use microwaves for reheating rajma-chawal and leftovers.",
    date: "August 2026",
    icon: "Microwave",
    href: "/blog/how-to-extend-the-life-of-your-microwave",
  },
  {
    slug: "common-ac-error-codes-explained",
    title: "Common AC Error Codes Explained - What Those Flashing Lights Mean",
    excerpt:
      "A reference guide to the most common AC error codes (E1 through H1) across Voltas, LG, Samsung and Daikin, with what each code means and what to do next.",
    date: "July 2026",
    icon: "AlertTriangle",
    href: "/blog/common-ac-error-codes-explained",
  },
];

/** Star renderer helper - used by testimonials, reviews and aggregate ratings. */
export function renderStars(rating: number): string {
  return "★".repeat(Math.floor(rating)) + "☆".repeat(5 - Math.floor(rating));
}
