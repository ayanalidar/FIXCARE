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
      <CardHeader className="p-4 sm:p-6">
        <div className="flex items-start gap-2">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent sm:size-9">
            <MapPin className="size-4" aria-hidden="true" />
          </span>
          <CardTitle className="text-base leading-tight text-primary sm:text-lg">
            <Link href={href} className="break-words hover:text-accent">
              {name}
            </Link>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-accent sm:text-xs">
          {serviceType} service
        </p>
        <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
          {neighborhoods.slice(0, 3).join(" · ")}
          {neighborhoods.length > 3 ? " · and more" : ""}
        </p>
        <Link
          href={href}
          className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-accent hover:text-primary sm:mt-4 sm:text-sm"
        >
          View details
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </CardContent>
    </Card>
  );
}
