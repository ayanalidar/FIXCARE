import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const BookingSchema = z.object({
  appliance: z.string().min(1, "Appliance is required"),
  brand: z.string().optional().nullable(),
  model: z.string().optional().nullable(),
  issue: z.string().min(10, "Issue description too short"),
  preferredDate: z.string().min(1, "Preferred date is required"),
  preferredSlot: z.string().min(1, "Preferred slot is required"),
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Phone number is required"),
  email: z.string().email().optional().or(z.literal("")).nullable(),
  address: z.string().min(6, "Address is required"),
  city: z.string().min(1, "City is required"),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
  consent: z.boolean().refine((v) => v === true, "Consent is required"),
});

function generateReference(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "WC-";
  for (let i = 0; i < 6; i += 1) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const parsed = BookingSchema.safeParse(body);
  if (!parsed.success) {
    const firstErr = parsed.error.issues[0];
    return NextResponse.json(
      {
        success: false,
        error: firstErr ? firstErr.message : "Validation failed.",
        issues: parsed.error.issues,
      },
      { status: 400 }
    );
  }

  const data = parsed.data;

  let reference = "";
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const candidate = generateReference();
    const existing = await db.booking.findUnique({
      where: { reference: candidate },
      select: { reference: true },
    });
    if (!existing) {
      reference = candidate;
      break;
    }
  }
  if (!reference) {
    return NextResponse.json(
      { success: false, error: "Could not allocate booking reference. Please retry." },
      { status: 500 }
    );
  }

  try {
    await db.booking.create({
      data: {
        reference,
        appliance: data.appliance,
        brand: data.brand ?? null,
        model: data.model ?? null,
        issue: data.issue,
        preferredDate: data.preferredDate,
        preferredSlot: data.preferredSlot,
        name: data.name,
        phone: data.phone,
        email: data.email ?? null,
        address: data.address,
        city: data.city,
        pincode: data.pincode,
        consent: data.consent,
        status: "new",
      },
    });
    return NextResponse.json({ success: true, reference });
  } catch (err) {
    console.error("Booking creation error:", err);
    return NextResponse.json(
      { success: false, error: "Could not save booking. Please retry." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      success: false,
      error: "Method not allowed. Use POST to create a booking.",
    },
    { status: 405 }
  );
}
