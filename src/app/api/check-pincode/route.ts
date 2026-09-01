import { NextResponse } from "next/server";
import pincodes from "@/data/serviceable-pincodes.json";

interface PincodeEntry {
  city: string;
  url: string;
  locality: string;
}

type PincodeMap = Record<string, PincodeEntry>;

// Strip comment keys (start with "_")
const pincodeMap = Object.fromEntries(
  Object.entries(pincodes as Record<string, unknown>).filter(
    ([k, v]) => !k.startsWith("_") && v && typeof v === "object"
  )
) as PincodeMap;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pincode = searchParams.get("pincode");

  if (!pincode || !/^\d{6}$/.test(pincode)) {
    return NextResponse.json(
      { served: false, error: "Please provide a valid 6-digit pincode." },
      { status: 400 }
    );
  }

  const entry = pincodeMap[pincode];
  if (entry) {
    return NextResponse.json({
      served: true,
      city: entry.city,
      url: entry.url,
      locality: entry.locality,
    });
  }
  return NextResponse.json({ served: false });
}
