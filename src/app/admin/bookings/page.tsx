import Link from "next/link";
import { db } from "@/lib/db";
import { BookingsFilters } from "@/components/admin/bookings-filters";
import { STATUS_BADGE_CLASSES, formatTimestamp } from "@/lib/admin";

export const metadata = {
  title: "Bookings - FixCare Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type SearchParams = {
  status?: string;
  q?: string;
  date?: string;
};

function buildDateRange(date: string): { gte?: Date; lt?: Date } | undefined {
  if (!date) return undefined;
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  if (date === "today") {
    const tomorrow = new Date(startOfToday);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return { gte: startOfToday, lt: tomorrow };
  }
  if (date === "tomorrow") {
    const tomorrow = new Date(startOfToday);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(startOfToday);
    dayAfter.setDate(dayAfter.getDate() + 2);
    return { gte: tomorrow, lt: dayAfter };
  }
  if (date === "this_week") {
    const endOfWeek = new Date(startOfToday);
    endOfWeek.setDate(endOfWeek.getDate() + 7);
    return { gte: startOfToday, lt: endOfWeek };
  }
  // YYYY-MM-DD format → match that single date
  const target = new Date(`${date}T00:00:00`);
  if (Number.isNaN(target.getTime())) return undefined;
  const next = new Date(target);
  next.setDate(next.getDate() + 1);
  return { gte: target, lt: next };
}

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const status = params.status || "";
  const q = params.q || "";
  const date = params.date || "";

  // Build Prisma where clause
  // We keep `where` typed as a plain object to avoid TS friction with Prisma's
  // deep conditional types in a server component.
  const where: {
    status?: string;
    OR?: Array<Record<string, unknown>>;
    preferredDate?: string;
    createdAt?: { gte?: Date; lt?: Date };
  } = {};

  if (status && status !== "all") {
    where.status = status;
  }

  if (q) {
    where.OR = [
      { reference: { contains: q } },
      { name: { contains: q } },
      { phone: { contains: q } },
    ];
  }

  const dateRange = buildDateRange(date);
  if (dateRange) {
    where.createdAt = dateRange;
  }

  let bookings: Awaited<ReturnType<typeof db.booking.findMany>> = [];
  let dbOk = false;
  try {
    bookings = await db.booking.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    dbOk = true;
  } catch {
    // DB not configured
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-primary">
          Bookings
        </h1>
        <p className="text-sm text-muted-foreground">
          Showing {bookings.length} {bookings.length === 1 ? "booking" : "bookings"}
          {dbOk ? "" : " (database offline)"}
        </p>
      </div>

      <div className="mt-6">
        <BookingsFilters
          initialStatus={status}
          initialQ={q}
          initialDate={date}
        />
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-border bg-background">
        {bookings.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">
            {dbOk
              ? "No bookings match the current filters."
              : "Database not configured. Set DATABASE_URL in .env and run `bun run db:push`."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium text-muted-foreground">
                    Reference
                  </th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">
                    Customer
                  </th>
                  <th className="hidden px-4 py-3 font-medium text-muted-foreground sm:table-cell">
                    Appliance
                  </th>
                  <th className="hidden px-4 py-3 font-medium text-muted-foreground md:table-cell">
                    Pref. Date
                  </th>
                  <th className="hidden px-4 py-3 font-medium text-muted-foreground lg:table-cell">
                    Created
                  </th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-t border-border hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/bookings/${b.id}`}
                        className="font-mono text-accent hover:underline"
                      >
                        {b.reference}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-primary">{b.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {b.phone}
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      {b.appliance}
                      {b.brand ? ` · ${b.brand}` : ""}
                    </td>
                    <td className="hidden px-4 py-3 md:table-cell">
                      {b.preferredDate}
                      <div className="text-xs text-muted-foreground">
                        {b.preferredSlot}
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">
                      {formatTimestamp(b.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                          STATUS_BADGE_CLASSES[b.status] ||
                          "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
