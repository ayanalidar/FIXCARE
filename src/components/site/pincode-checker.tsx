"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, MapPin, XCircle, Loader2 } from "lucide-react";

interface PincodeResult {
  served: boolean;
  city?: string;
  url?: string;
  locality?: string;
}

export function PincodeChecker() {
  const [pincode, setPincode] = useState("");
  const [result, setResult] = useState<PincodeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function checkPincode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    if (!/^\d{6}$/.test(pincode)) {
      setError("Please enter a valid 6-digit pincode.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `/api/check-pincode?pincode=${encodeURIComponent(pincode)}`,
        { method: "GET" }
      );
      const data: PincodeResult = await res.json();
      setResult(data);
    } catch {
      setError("Could not check pincode right now. Please call us instead.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-xl">
      <form
        onSubmit={checkPincode}
        className="flex flex-col gap-3 sm:flex-row sm:items-end"
      >
        <div className="flex-1">
          <Label htmlFor="pincode" className="mb-1.5 text-sm font-medium">
            Enter your 6-digit pincode
          </Label>
          <Input
            id="pincode"
            inputMode="numeric"
            pattern="\d{6}"
            maxLength={6}
            placeholder="e.g. 190001"
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
            autoComplete="postal-code"
          />
        </div>
        <Button type="submit" disabled={loading} className="sm:mt-0">
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Checking…
            </>
          ) : (
            "Check Area"
          )}
        </Button>
      </form>

      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

      {result && !error && (
        <div
          className={`mt-4 rounded-lg border p-4 ${
            result.served
              ? "border-accent/30 bg-accent/5"
              : "border-destructive/30 bg-destructive/5"
          }`}
        >
          {result.served ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-accent">
                <CheckCircle2 className="size-5" aria-hidden="true" />
                <p className="font-semibold">
                  Yes — we serve {result.city} ({result.locality})
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                A certified FixCare technician can be at your door the same day in
                Jammu city, or next-day across the rest of the Jammu region.
              </p>
              {result.url && (
                <a
                  href={result.url}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:text-primary"
                >
                  <MapPin className="size-3.5" aria-hidden="true" />
                  View {result.city} service page
                </a>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-1 text-foreground">
              <div className="flex items-center gap-2">
                <XCircle className="size-5 text-destructive" aria-hidden="true" />
                <p className="font-semibold">
                  We don&apos;t have {pincode} on our standard route yet.
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                We frequently travel to areas beyond this list — call us at{" "}
                <a
                  href="tel:+917051587802"
                  className="font-semibold text-accent hover:text-primary"
                >
                  +91-70515-87802
                </a>{" "}
                and we will do our best to help.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
