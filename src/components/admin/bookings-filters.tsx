"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "confirmed", label: "Confirmed" },
  { value: "assigned", label: "Assigned" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const DATE_FILTERS = [
  { value: "", label: "Any date" },
  { value: "today", label: "Today" },
  { value: "tomorrow", label: "Tomorrow" },
  { value: "this_week", label: "This week" },
];

export function BookingsFilters({
  initialStatus,
  initialQ,
  initialDate,
}: {
  initialStatus: string;
  initialQ: string;
  initialDate: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(initialQ);

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (!value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (q) {
      params.set("q", q);
    } else {
      params.delete("q");
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="space-y-4">
      {/* Status pills */}
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((s) => {
          const active =
            (s.value === "all" && (!initialStatus || initialStatus === "all")) ||
            initialStatus === s.value;
          return (
            <button
              key={s.value}
              type="button"
              onClick={() => updateParam("status", s.value === "all" ? "" : s.value)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:bg-muted"
              )}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      {/* Search + date filter */}
      <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="q" className="sr-only">
            Search by reference, name, or phone
          </label>
          <Input
            id="q"
            placeholder="Search reference, name, or phone..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="date" className="sr-only">
            Filter by date
          </label>
          <select
            id="date"
            value={initialDate}
            onChange={(e) => updateParam("date", e.target.value)}
            className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            {DATE_FILTERS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>
        <Button type="submit" size="sm">
          Search
        </Button>
        {(initialStatus || initialQ || initialDate) && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => router.push(pathname)}
          >
            Clear
          </Button>
        )}
      </form>
    </div>
  );
}
