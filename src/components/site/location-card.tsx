import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { MapPin, ArrowRight } from "lucide-react";

export function LocationCard({
  name,
  neighborhoods,
  href,
  serviceType = "next-day",
}: {
  name: string;
  neighborhoods: string[];
  href: string;
  serviceType?: string;
}) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <MapPin className="size-4" aria-hidden="true" />
          </span>
          <CardTitle className="text-lg text-primary">
            <Link href={href} className="hover:text-accent">
              {name}
            </Link>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">
          {serviceType} service
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {neighborhoods.slice(0, 4).join(" · ")}
          {neighborhoods.length > 4 ? " · and more" : ""}
        </p>
        <Link
          href={href}
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent hover:text-primary"
        >
          View details
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </CardContent>
    </Card>
  );
}
