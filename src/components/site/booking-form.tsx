"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  CalendarCheck,
  ShieldCheck,
  PartyPopper,
} from "lucide-react";
import { SERVICES, LOCATIONS, BRANDS, SITE } from "@/lib/site";

interface BookingState {
  appliance: string;
  brand: string;
  model: string;
  issue: string;
  preferredDate: string;
  preferredSlot: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  pincode: string;
  consent: boolean;
}

const TOTAL_STEPS = 5;

const STEP_LABELS = [
  "Select Appliance",
  "Describe Issue",
  "Date & Time",
  "Address & Contact",
  "Confirm",
];

const TIME_SLOTS = [
  { value: "8-11", label: "8:00 AM – 11:00 AM" },
  { value: "11-2", label: "11:00 AM – 2:00 PM" },
  { value: "2-5", label: "2:00 PM – 5:00 PM" },
  { value: "5-8", label: "5:00 PM – 8:00 PM" },
];

const initialState: BookingState = {
  appliance: "",
  brand: "",
  model: "",
  issue: "",
  preferredDate: "",
  preferredSlot: "",
  name: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  pincode: "",
  consent: false,
};

export function BookingForm() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<BookingState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof BookingState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function update<K extends keyof BookingState>(key: K, value: BookingState[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validateStep(stepIdx: number): boolean {
    const errs: Partial<Record<keyof BookingState, string>> = {};
    if (stepIdx === 0) {
      if (!data.appliance) errs.appliance = "Please choose an appliance.";
    } else if (stepIdx === 1) {
      if (!data.issue || data.issue.trim().length < 10)
        errs.issue = "Please describe the issue in at least 10 characters.";
    } else if (stepIdx === 2) {
      if (!data.preferredDate) errs.preferredDate = "Please pick a preferred date.";
      if (!data.preferredSlot) errs.preferredSlot = "Please pick a time slot.";
    } else if (stepIdx === 3) {
      if (!data.name || data.name.trim().length < 2) errs.name = "Please enter your name.";
      if (!/^[0-9+\-\s]{10,15}$/.test(data.phone)) errs.phone = "Please enter a valid phone number.";
      if (!data.address || data.address.trim().length < 6) errs.address = "Please enter your full address.";
      if (!data.city) errs.city = "Please select your city.";
      if (!/^\d{6}$/.test(data.pincode)) errs.pincode = "Please enter a 6-digit pincode.";
      if (!data.consent) errs.consent = "Please accept the consent to proceed.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function next() {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }
  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function submit() {
    if (!validateStep(3)) {
      setStep(3);
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Could not submit booking. Please try again.");
      }
      setReference(json.reference);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Could not submit booking.";
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  if (reference) {
    return (
      <Card className="bg-card">
        <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-accent/10 text-accent">
            <PartyPopper className="size-8" aria-hidden="true" />
          </div>
          <h2 className="text-2xl font-bold text-primary">Booking Confirmed</h2>
          <p className="max-w-md text-sm text-muted-foreground">
            Thank you, {data.name.split(" ")[0]}. We&apos;ve received your repair
            request. You&apos;ll get an SMS confirmation shortly with the assigned
            technician&apos;s name.
          </p>
          <div className="rounded-lg border border-accent/30 bg-accent/5 px-6 py-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Your Booking Reference
            </p>
            <p className="text-2xl font-bold text-accent">{reference}</p>
          </div>
          <p className="text-xs text-muted-foreground">
            Save this reference to track your booking or claim warranty later.
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            <Button asChild variant="outline">
              <a href={SITE.whatsappLink(`Hi FixCare, my booking reference is ${reference}`)}>
                Share on WhatsApp
              </a>
            </Button>
            <Button asChild>
              <a href="/">Back to Home</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-xl text-primary">Book a Repair</CardTitle>
        <CardDescription>
          Step {step + 1} of {TOTAL_STEPS} — {STEP_LABELS[step]}
        </CardDescription>
        <Progress value={((step + 1) / TOTAL_STEPS) * 100} className="mt-2 h-2" />
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {/* Step 0 — appliance */}
        {step === 0 && (
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">Which appliance needs repair?</Label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {SERVICES.map((s) => (
                  <button
                    type="button"
                    key={s.slug}
                    onClick={() => update("appliance", s.name)}
                    className={`flex flex-col gap-1 rounded-lg border p-3 text-left text-sm transition-all hover:border-accent ${
                      data.appliance === s.name
                        ? "border-accent bg-accent/5 text-primary"
                        : "border-border text-muted-foreground"
                    }`}
                    aria-pressed={data.appliance === s.name}
                  >
                    <span className="font-semibold">{s.shortName}</span>
                    <span className="text-xs line-clamp-2">{s.blurb}</span>
                  </button>
                ))}
              </div>
              {errors.appliance && (
                <p className="mt-2 text-xs text-destructive">{errors.appliance}</p>
              )}
            </div>
            <div>
              <Label htmlFor="brand" className="mb-1.5 block">
                Brand (optional)
              </Label>
              <Select value={data.brand} onValueChange={(v) => update("brand", v)}>
                <SelectTrigger id="brand" className="w-full">
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  {BRANDS.map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))}
                  <SelectItem value="Other">Other / Not sure</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="model" className="mb-1.5 block">
                Model number (optional)
              </Label>
              <Input
                id="model"
                value={data.model}
                onChange={(e) => update("model", e.target.value)}
                placeholder="e.g. WF8802"
              />
            </div>
          </div>
        )}

        {/* Step 1 — issue */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="issue" className="mb-1.5 block">
                Describe the issue
              </Label>
              <Textarea
                id="issue"
                rows={6}
                value={data.issue}
                onChange={(e) => update("issue", e.target.value)}
                placeholder="e.g. Washing machine stops mid-cycle and shows OE error. Drum has standing water inside."
              />
              {errors.issue && (
                <p className="mt-2 text-xs text-destructive">{errors.issue}</p>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Tip: Mention the symptom, any error code shown, and any recent changes
              (power cut, water supply, etc.). This helps our technician arrive
              prepared with the right parts.
            </p>
          </div>
        )}

        {/* Step 2 — date & time */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="preferredDate" className="mb-1.5 block">
                Preferred date
              </Label>
              <Input
                id="preferredDate"
                type="date"
                value={data.preferredDate}
                onChange={(e) => update("preferredDate", e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
              {errors.preferredDate && (
                <p className="mt-2 text-xs text-destructive">{errors.preferredDate}</p>
              )}
            </div>
            <div>
              <Label className="mb-2 block">Preferred time slot</Label>
              <RadioGroup
                value={data.preferredSlot}
                onValueChange={(v) => update("preferredSlot", v)}
                className="grid grid-cols-2 gap-2"
              >
                {TIME_SLOTS.map((slot) => (
                  <Label
                    key={slot.value}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all hover:border-accent ${
                      data.preferredSlot === slot.value
                        ? "border-accent bg-accent/5"
                        : "border-border"
                    }`}
                  >
                    <RadioGroupItem value={slot.value} />
                    <span className="text-sm">{slot.label}</span>
                  </Label>
                ))}
              </RadioGroup>
              {errors.preferredSlot && (
                <p className="mt-2 text-xs text-destructive">{errors.preferredSlot}</p>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Same-day service is typical in Jammu city; next-day across the rest
              of the Jammu region. Our team will confirm the exact slot by SMS.
            </p>
          </div>
        )}

        {/* Step 3 — address & contact */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="name" className="mb-1.5 block">
                  Full name
                </Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Your name"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-destructive">{errors.name}</p>
                )}
              </div>
              <div>
                <Label htmlFor="phone" className="mb-1.5 block">
                  Phone number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={data.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="Your 10-digit mobile number"
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-destructive">{errors.phone}</p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="email" className="mb-1.5 block">
                Email (optional)
              </Label>
              <Input
                id="email"
                type="email"
                value={data.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <Label htmlFor="address" className="mb-1.5 block">
                Full address
              </Label>
              <Textarea
                id="address"
                rows={3}
                value={data.address}
                onChange={(e) => update("address", e.target.value)}
                placeholder="House number, street, area, landmark"
              />
              {errors.address && (
                <p className="mt-1 text-xs text-destructive">{errors.address}</p>
              )}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="city" className="mb-1.5 block">
                  City
                </Label>
                <Select value={data.city} onValueChange={(v) => update("city", v)}>
                  <SelectTrigger id="city" className="w-full">
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {LOCATIONS.map((l) => (
                      <SelectItem key={l.slug} value={l.name}>
                        {l.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.city && (
                  <p className="mt-1 text-xs text-destructive">{errors.city}</p>
                )}
              </div>
              <div>
                <Label htmlFor="pincode" className="mb-1.5 block">
                  Pincode
                </Label>
                <Input
                  id="pincode"
                  inputMode="numeric"
                  pattern="\d{6}"
                  maxLength={6}
                  value={data.pincode}
                  onChange={(e) =>
                    update("pincode", e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="180001"
                />
                {errors.pincode && (
                  <p className="mt-1 text-xs text-destructive">{errors.pincode}</p>
                )}
              </div>
            </div>
            <div>
              <Label className="flex items-start gap-3 text-sm">
                <Checkbox
                  checked={data.consent}
                  onCheckedChange={(v) => update("consent", v === true)}
                  className="mt-0.5"
                />
                <span className="text-muted-foreground">
                  I agree to be contacted by FixCare Service Center regarding this
                  booking and accept the{" "}
                  <a
                    href="/terms"
                    className="font-medium text-accent hover:text-primary"
                  >
                    Terms
                  </a>{" "}
                  and{" "}
                  <a
                    href="/privacy-policy"
                    className="font-medium text-accent hover:text-primary"
                  >
                    Privacy Policy
                  </a>
                  .
                </span>
              </Label>
              {errors.consent && (
                <p className="mt-1 text-xs text-destructive">{errors.consent}</p>
              )}
            </div>
          </div>
        )}

        {/* Step 4 — confirm */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-background p-4">
              <h3 className="text-sm font-semibold text-primary">Appliance</h3>
              <p className="text-sm text-muted-foreground">
                {data.appliance || "—"}
                {data.brand && ` · ${data.brand}`}
                {data.model && ` · Model ${data.model}`}
              </p>
              <h3 className="mt-3 text-sm font-semibold text-primary">Issue</h3>
              <p className="text-sm text-muted-foreground">{data.issue || "—"}</p>
              <h3 className="mt-3 text-sm font-semibold text-primary">Schedule</h3>
              <p className="text-sm text-muted-foreground">
                {data.preferredDate || "—"} ·{" "}
                {TIME_SLOTS.find((s) => s.value === data.preferredSlot)?.label ??
                  "—"}
              </p>
              <h3 className="mt-3 text-sm font-semibold text-primary">
                Contact & Address
              </h3>
              <p className="text-sm text-muted-foreground">
                {data.name} · {data.phone} {data.email && `· ${data.email}`}
              </p>
              <p className="text-sm text-muted-foreground">
                {data.address}, {data.city} — {data.pincode}
              </p>
            </div>
            <div className="rounded-lg border border-accent/30 bg-accent/5 p-3 text-xs text-muted-foreground">
              <ShieldCheck className="mb-1 inline size-4 text-accent" aria-hidden="true" />{" "}
              You will receive an instant SMS confirmation with your booking
              reference and assigned technician. No payment is taken until the
              repair is complete.
            </div>
          </div>
        )}

        {submitError && (
          <p className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            {submitError}
          </p>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between border-t border-border pt-4">
          <Button
            variant="ghost"
            onClick={back}
            disabled={step === 0 || submitting}
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back
          </Button>
          {step < TOTAL_STEPS - 1 ? (
            <Button onClick={next}>
              Continue
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          ) : (
            <Button onClick={submit} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  Submitting…
                </>
              ) : (
                <>
                  <CalendarCheck className="size-4" aria-hidden="true" />
                  Confirm Booking
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
