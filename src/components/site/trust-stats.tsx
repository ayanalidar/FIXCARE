import { Star } from "lucide-react";

export function TrustStats() {
  const stats = [
    { value: "500+", label: "Repairs completed" },
    { value: "4.8★", label: "Average rating", icon: true },
    { value: "10+", label: "Cities served" },
    { value: "8+", label: "Brands serviced" },
  ];
  return (
    <section className="bg-card border-y border-border">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-8 sm:px-6 md:grid-cols-4 lg:px-8">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex flex-col items-center justify-center rounded-lg border border-border bg-background p-4 text-center"
          >
            <p className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              {s.value}
            </p>
            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground sm:text-sm">
              {s.icon && (
                <Star className="size-3 text-accent" fill="currentColor" aria-hidden="true" />
              )}
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
