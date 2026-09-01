import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

type Where = {
  status?: string;
  preferredDate?: string;
  OR?: Array<Record<string, unknown>>;
};

export async function GET(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "";
  const q = searchParams.get("q") || "";
  const date = searchParams.get("date") || "";
  const take = parseInt(searchParams.get("take") || "50", 10);

  const where: Where = {};
  if (status && status !== "all") where.status = status;
  if (q) {
    where.OR = [
      { reference: { contains: q } },
      { name: { contains: q } },
      { phone: { contains: q } },
    ];
  }
  if (date) where.preferredDate = date;

  try {
    const bookings = await db.booking.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: Number.isFinite(take) && take > 0 ? take : 50,
    });
    return NextResponse.json({ bookings });
  } catch (err) {
    console.error("Admin bookings GET error:", err);
    return NextResponse.json(
      { error: "Database query failed. Check DATABASE_URL." },
      { status: 503 }
    );
  }
}
