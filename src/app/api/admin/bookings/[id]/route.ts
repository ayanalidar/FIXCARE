import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

type Params = { id: string };

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const numericId = parseInt(id, 10);
  if (Number.isNaN(numericId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  try {
    const booking = await db.booking.findUnique({ where: { id: numericId } });
    if (!booking) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ booking });
  } catch (err) {
    console.error("Admin booking GET error:", err);
    return NextResponse.json(
      { error: "Database query failed. Check DATABASE_URL." },
      { status: 503 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const numericId = parseInt(id, 10);
  if (Number.isNaN(numericId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const data = (body || {}) as Record<string, unknown>;

  const update: {
    status?: string;
    notes?: string;
    technician?: string;
  } = {};
  if (typeof data.status === "string" && data.status) update.status = data.status;
  if (typeof data.notes === "string") update.notes = data.notes;
  if (typeof data.technician === "string") update.technician = data.technician;

  try {
    const booking = await db.booking.update({
      where: { id: numericId },
      data: update,
    });
    return NextResponse.json({ booking });
  } catch (err) {
    console.error("Admin booking PATCH error:", err);
    return NextResponse.json(
      { error: "Database update failed. Check DATABASE_URL." },
      { status: 503 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const numericId = parseInt(id, 10);
  if (Number.isNaN(numericId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  try {
    // Soft delete: mark as cancelled
    await db.booking.update({
      where: { id: numericId },
      data: { status: "cancelled" },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Admin booking DELETE error:", err);
    return NextResponse.json(
      { error: "Database update failed. Check DATABASE_URL." },
      { status: 503 }
    );
  }
}
