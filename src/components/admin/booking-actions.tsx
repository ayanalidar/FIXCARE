"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Phone, MessageCircle, Save, CheckCircle2 } from "lucide-react";
import { BOOKING_STATUSES, STATUS_LABELS, type BookingStatus } from "@/lib/admin";

type BookingActionsProps = {
  booking: {
    id: number;
    reference: string;
    name: string;
    phone: string;
    status: string;
    notes: string | null;
    technician: string | null;
    appliance: string;
    brand: string | null;
    model: string | null;
    issue: string;
  };
};

export function BookingActions({ booking }: BookingActionsProps) {
  const router = useRouter();
  const [status, setStatus] = useState(booking.status);
  const [notes, setNotes] = useState(booking.notes || "");
  const [technician, setTechnician] = useState(booking.technician || "");
  const [saving, setSaving] = useState(false);
  const [markingDone, setMarkingDone] = useState(false);
  const [error, setError] = useState("");
  const [savedAt, setSavedAt] = useState<string>("");

  async function patch(payload: Record<string, unknown>) {
    const res = await fetch(`/api/admin/bookings/${booking.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data?.error || "Failed to update booking");
    }
    return res.json();
  }

  async function handleSave() {
    setError("");
    setSaving(true);
    try {
      await patch({ status, notes, technician });
      setSavedAt(new Date().toLocaleTimeString());
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleMarkDone() {
    setError("");
    setMarkingDone(true);
    try {
      await patch({ status: "completed" });
      setStatus("completed");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to mark done");
    } finally {
      setMarkingDone(false);
    }
  }

  const phoneDigits = booking.phone.replace(/[^\d]/g, "");
  const whatsappUrl = `https://wa.me/${phoneDigits}?text=${encodeURIComponent(
    `Hi ${booking.name}, this is FixCare Service Center about your booking ${booking.reference} for ${booking.appliance}${booking.brand ? ` (${booking.brand})` : ""}.`
  )}`;

  return (
    <div className="space-y-5">
      {/* Status + actions */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-primary">Status</h3>
        <div className="flex flex-wrap gap-2">
          {BOOKING_STATUSES.map((s) => {
            const active = status === s;
            const variant = active
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-background text-muted-foreground border-border hover:bg-muted";
            return (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${variant}`}
              >
                {STATUS_LABELS[s as BookingStatus]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Technician */}
      <div className="space-y-2">
        <Label htmlFor="technician">Assigned technician</Label>
        <Input
          id="technician"
          value={technician}
          onChange={(e) => setTechnician(e.target.value)}
          placeholder="Technician name"
        />
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Admin notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={5}
          placeholder="Add internal notes, parts ordered, customer preferences..."
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {savedAt && (
        <p className="text-xs text-muted-foreground">
          Last saved at {savedAt}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={handleSave} disabled={saving}>
          <Save className="size-4" aria-hidden="true" />
          {saving ? "Saving..." : "Save changes"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleMarkDone}
          disabled={markingDone || status === "completed"}
        >
          <CheckCircle2 className="size-4" aria-hidden="true" />
          {markingDone ? "Marking..." : "Mark as completed"}
        </Button>
      </div>

      {/* Contact */}
      <div className="border-t border-border pt-4">
        <h3 className="mb-3 text-sm font-semibold text-primary">
          Contact customer
        </h3>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <a href={`tel:${phoneDigits}`}>
              <Phone className="size-4" aria-hidden="true" />
              Call
            </a>
          </Button>
          <Button asChild variant="outline">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
