import { Booking } from "@prisma/client";

export const BOOKING_STATUSES = [
  "new",
  "confirmed",
  "assigned",
  "completed",
  "cancelled",
] as const;

export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const STATUS_LABELS: Record<BookingStatus, string> = {
  new: "New",
  confirmed: "Confirmed",
  assigned: "Assigned",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const STATUS_BADGE_CLASSES: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  confirmed: "bg-yellow-100 text-yellow-800",
  assigned: "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export const STATUS_DOT_CLASSES: Record<string, string> = {
  new: "bg-blue-500",
  confirmed: "bg-yellow-500",
  assigned: "bg-purple-500",
  completed: "bg-green-500",
  cancelled: "bg-red-500",
};

export function formatPreferredDate(date: string): string {
  // preferredDate is stored as "YYYY-MM-DD"
  const d = new Date(`${date}T00:00:00`);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatTimestamp(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(date.getTime())) return String(d);
  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export type BookingRow = Pick<
  Booking,
  | "id"
  | "reference"
  | "appliance"
  | "name"
  | "phone"
  | "preferredDate"
  | "preferredSlot"
  | "city"
  | "status"
  | "createdAt"
>;
