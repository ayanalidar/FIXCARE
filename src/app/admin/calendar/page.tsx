import Link from "next/link";
import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
} from "lucide-react";
import { STATUS_DOT_CLASSES } from "@/lib/admin";

export const metadata = {
  title: "Calendar - FixCare Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type SearchParams = { month?: string };

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function parseMonth(month: string | undefined): { year: number; month: number } {
  const now = new Date();
  if (!month) {
    return { year: now.getFullYear(), month: now.getMonth() };
  }
  const [y, m] = month.split("-").map((n) => parseInt(n, 10));
  if (
    !Number.isNaN(y) &&
    !Number.isNaN(m) &&
    y >= 2000 &&
    y <= 2100 &&
    m >= 1 &&
    m <= 12
  ) {
    return { year: y, month: m - 1 }; // JS month is 0-indexed
  }
  return { year: now.getFullYear(), month: now.getMonth() };
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function isoDate(year: number, month: number, day: number): string {
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

export default async function AdminCalendarPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const { year, month } = parseMonth(params.month);

  // Month boundaries
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startWeekday = firstDay.getDay();

  // Build an array of days with optional booking counts
  type DayInfo = {
    day: number;
    iso: string;
    inMonth: boolean;
    counts: Record<string, number>;
    total: number;
  };

  // Fetch bookings for this month (preferredDate is "YYYY-MM-DD" string)
  const monthPrefix = `${year}-${pad(month + 1)}`;
  let bookingsForMonth: { preferredDate: string; status: string }[] = [];
  let dbOk = false;
  try {
    bookingsForMonth = await db.booking.findMany({
      where: { preferredDate: { startsWith: monthPrefix } },
      select: { preferredDate: true, status: true },
    });
    dbOk = true;
  } catch {
    // DB not configured — show empty calendar
  }

  // Aggregate counts per date
  const countsByDate = new Map<string, Record<string, number>>();
  for (const b of bookingsForMonth) {
    const d = b.preferredDate;
    if (!countsByDate.has(d)) countsByDate.set(d, {});
    const bucket = countsByDate.get(d)!;
    bucket[b.status] = (bucket[b.status] || 0) + 1;
  }

  // Build calendar grid: leading blanks + days + trailing blanks to fill 6 rows
  const days: DayInfo[] = [];
  // Leading blanks (previous month tail — render as empty)
  for (let i = 0; i < startWeekday; i += 1) {
    days.push({
      day: 0,
      iso: "",
      inMonth: false,
      counts: {},
      total: 0,
    });
  }
  for (let d = 1; d <= daysInMonth; d += 1) {
    const iso = isoDate(year, month, d);
    const counts = countsByDate.get(iso) || {};
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    days.push({ day: d, iso, inMonth: true, counts, total });
  }
  // Trailing blanks to fill out the last week
  while (days.length % 7 !== 0) {
    days.push({
      day: 0,
      iso: "",
      inMonth: false,
      counts: {},
      total: 0,
    });
  }

  // Month navigation
  const prevDate = new Date(year, month - 1, 1);
  const nextDate = new Date(year, month + 1, 1);
  const prevMonthStr = `${prevDate.getFullYear()}-${pad(prevDate.getMonth() + 1)}`;
  const nextMonthStr = `${nextDate.getFullYear()}-${pad(nextDate.getMonth() + 1)}`;

  const monthName = firstDay.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  const todayIso = isoDate(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate()
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-primary">
          Calendar
        </h1>
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/bookings">View bookings list →</Link>
        </Button>
      </div>

      {!dbOk && (
        <div className="mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-900">
          <strong className="font-semibold">Database not configured.</strong>{" "}
          Set <code>DATABASE_URL</code> in <code>.env</code> and run{" "}
          <code>bun run db:push</code> to enable calendar data.
        </div>
      )}

      <Card className="mt-6">
        <CardContent className="p-4 sm:p-6">
          {/* Month header */}
          <div className="mb-4 flex items-center justify-between">
            <Button asChild variant="ghost" size="sm">
              <Link href={`/admin/calendar?month=${prevMonthStr}`} aria-label="Previous month">
                <ChevronLeft className="size-4" aria-hidden="true" />
                Prev
              </Link>
            </Button>
            <div className="flex items-center gap-2 text-base font-semibold text-primary">
              <CalendarDays className="size-4" aria-hidden="true" />
              {monthName}
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href={`/admin/calendar?month=${nextMonthStr}`} aria-label="Next month">
                Next
                <ChevronRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>

          {/* Weekday header */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {WEEKDAYS.map((wd) => (
              <div
                key={wd}
                className="pb-2 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-xs"
              >
                {wd}
              </div>
            ))}
            {days.map((d, idx) => {
              if (!d.inMonth) {
                return <div key={`blank-${idx}`} className="min-h-[80px] rounded-md sm:min-h-[100px]" />;
              }
              const isToday = d.iso === todayIso;
              return (
                <Link
                  key={d.iso}
                  href={`/admin/bookings?date=${d.iso}`}
                  className={`group flex min-h-[80px] flex-col gap-1 rounded-md border p-1.5 transition-colors hover:border-primary hover:bg-muted/40 sm:min-h-[100px] sm:p-2 ${
                    isToday
                      ? "border-primary bg-primary/5"
                      : "border-border bg-background"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-semibold sm:text-sm ${
                        isToday ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {d.day}
                    </span>
                    {d.total > 0 && (
                      <span className="rounded-full bg-primary/10 px-1.5 text-[10px] font-semibold text-primary">
                        {d.total}
                      </span>
                    )}
                  </div>
                  {d.total > 0 && (
                    <div className="mt-auto flex flex-wrap gap-1">
                      {Object.entries(d.counts).map(([status, count]) => (
                        <span
                          key={status}
                          className="inline-flex items-center gap-1 text-[10px] text-muted-foreground"
                          title={`${status}: ${count}`}
                        >
                          <span
                            className={`size-1.5 rounded-full ${STATUS_DOT_CLASSES[status] || "bg-gray-400"}`}
                            aria-hidden="true"
                          />
                          {count}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <span className="font-semibold">Legend:</span>
        <span className="inline-flex items-center gap-1">
          <span className={`size-2 rounded-full ${STATUS_DOT_CLASSES.new}`} />
          New
        </span>
        <span className="inline-flex items-center gap-1">
          <span className={`size-2 rounded-full ${STATUS_DOT_CLASSES.confirmed}`} />
          Confirmed
        </span>
        <span className="inline-flex items-center gap-1">
          <span className={`size-2 rounded-full ${STATUS_DOT_CLASSES.assigned}`} />
          Assigned
        </span>
        <span className="inline-flex items-center gap-1">
          <span className={`size-2 rounded-full ${STATUS_DOT_CLASSES.completed}`} />
          Completed
        </span>
        <span className="inline-flex items-center gap-1">
          <span className={`size-2 rounded-full ${STATUS_DOT_CLASSES.cancelled}`} />
          Cancelled
        </span>
      </div>
    </div>
  );
}
