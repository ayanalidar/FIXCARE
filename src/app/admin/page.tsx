import Link from "next/link";
import { db } from "@/lib/db";
import {
  Wrench,
  Clock,
  CheckCircle2,
  Calendar as CalendarIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  STATUS_BADGE_CLASSES,
} from "@/lib/admin";

export const metadata = {
  title: "Admin Dashboard - FixCare Service Center",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  let newToday = 0;
  let pending = 0;
  let completedWeek = 0;
  let total = 0;
  let recent: Awaited<ReturnType<typeof db.booking.findMany>> = [];
  let dbOk = false;

  try {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    [newToday, pending, completedWeek, total, recent] = await Promise.all([
      db.booking.count({
        where: { createdAt: { gte: startOfToday }, status: "new" },
      }),
      db.booking.count({
        where: { status: { in: ["confirmed", "assigned"] } },
      }),
      db.booking.count({
        where: { status: "completed", updatedAt: { gte: weekAgo } },
      }),
      db.booking.count(),
      db.booking.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);
    dbOk = true;
  } catch {
    // DB not configured yet — show placeholder zeros
  }

  const stats = [
    {
      label: "New today",
      value: newToday,
      icon: Wrench,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Pending",
      value: pending,
      icon: Clock,
      color: "text-yellow-600 bg-yellow-50",
    },
    {
      label: "Completed (7d)",
      value: completedWeek,
      icon: CheckCircle2,
      color: "text-green-600 bg-green-50",
    },
    {
      label: "Total",
      value: total,
      icon: CalendarIcon,
      color: "text-purple-600 bg-purple-50",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-primary">
        Dashboard
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Overview of bookings and recent activity.
      </p>

      {!dbOk && (
        <div className="mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-900">
          <strong className="font-semibold">
            Database not configured.
          </strong>{" "}
          Set <code className="rounded bg-yellow-100 px-1">DATABASE_URL</code> in{" "}
          <code className="rounded bg-yellow-100 px-1">.env</code> to your
          Supabase Postgres connection string and run{" "}
          <code className="rounded bg-yellow-100 px-1">bun run db:push</code> to
          create the Booking table.
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">
                      {s.label}
                    </p>
                    <p className="mt-1 text-3xl font-bold text-primary">
                      {s.value}
                    </p>
                  </div>
                  <span
                    className={`flex size-10 items-center justify-center rounded-lg ${s.color}`}
                  >
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-primary">
            Recent bookings
          </h2>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/bookings">View all</Link>
          </Button>
        </div>
        <div className="mt-4 overflow-hidden rounded-lg border border-border bg-background">
          {recent.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted-foreground">
              No bookings yet. Once customers submit the booking form,
              they&apos;ll appear here.
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
                      Date
                    </th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((b) => (
                    <tr key={b.id} className="border-t border-border">
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/bookings/${b.id}`}
                          className="font-mono text-accent hover:underline"
                        >
                          {b.reference}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        {b.name}
                        <br />
                        <span className="text-xs text-muted-foreground">
                          {b.phone}
                        </span>
                      </td>
                      <td className="hidden px-4 py-3 sm:table-cell">
                        {b.appliance}
                      </td>
                      <td className="hidden px-4 py-3 md:table-cell">
                        {b.preferredDate}
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
    </div>
  );
}
