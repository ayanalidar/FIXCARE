import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookingActions } from "@/components/admin/booking-actions";
import {
  STATUS_BADGE_CLASSES,
  formatPreferredDate,
  formatTimestamp,
} from "@/lib/admin";

export const metadata = {
  title: "Booking Detail - FixCare Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type Params = { id: string };

export default async function AdminBookingDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const numericId = parseInt(id, 10);
  if (Number.isNaN(numericId)) {
    notFound();
  }

  let booking: Awaited<ReturnType<typeof db.booking.findUnique>> = null;
  let dbError = false;

  try {
    booking = await db.booking.findUnique({ where: { id: numericId } });
  } catch {
    dbError = true;
  }

  if (dbError) {
    return (
      <div>
        <p className="text-sm text-muted-foreground">
          Database not configured. Set <code>DATABASE_URL</code> in{" "}
          <code>.env</code> and run <code>bun run db:push</code>.
        </p>
        <Button asChild variant="outline" size="sm" className="mt-4">
          <Link href="/admin/bookings">Back to bookings</Link>
        </Button>
      </div>
    );
  }

  if (!booking) {
    notFound();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            href="/admin/bookings"
            className="text-sm text-muted-foreground hover:text-primary"
          >
            ← Back to bookings
          </Link>
          <h1 className="mt-1 font-mono text-2xl font-bold tracking-tight text-primary">
            {booking.reference}
          </h1>
          <p className="text-sm text-muted-foreground">
            Booking received {formatTimestamp(booking.createdAt)}
          </p>
        </div>
        <span
          className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
            STATUS_BADGE_CLASSES[booking.status] ||
            "bg-gray-100 text-gray-800"
          }`}
        >
          {booking.status}
        </span>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Left: Customer + appliance details */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Customer</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <DetailRow label="Name" value={booking.name} />
              <DetailRow label="Phone" value={booking.phone} />
              <DetailRow
                label="Email"
                value={booking.email || "—"}
              />
              <DetailRow label="City" value={booking.city} />
              <DetailRow label="Pincode" value={booking.pincode} />
              <DetailRow label="Address" value={booking.address} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Appliance &amp; issue</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-4 sm:grid-cols-3">
                <DetailRow label="Appliance" value={booking.appliance} />
                <DetailRow label="Brand" value={booking.brand || "—"} />
                <DetailRow label="Model" value={booking.model || "—"} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Issue
                </p>
                <p className="mt-1 text-sm leading-relaxed text-primary">
                  {booking.issue}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Schedule</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <DetailRow
                label="Preferred date"
                value={formatPreferredDate(booking.preferredDate)}
              />
              <DetailRow label="Preferred slot" value={booking.preferredSlot} />
            </CardContent>
          </Card>

          {booking.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Admin notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-primary">
                  {booking.notes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right: Actions */}
        <div>
          <Card className="lg:sticky lg:top-6">
            <CardHeader>
              <CardTitle className="text-base">Manage booking</CardTitle>
            </CardHeader>
            <CardContent>
              <BookingActions booking={booking} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-primary">{value}</p>
    </div>
  );
}
