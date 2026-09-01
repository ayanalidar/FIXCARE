import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Icon } from "./icon";

export function ServiceCard({
  icon,
  name,
  blurb,
  href,
}: {
  icon: string;
  name: string;
  blurb: string;
  href: string;
}) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="p-4 sm:p-6">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent sm:size-10">
          <Icon name={icon} className="size-5" aria-hidden="true" />
        </div>
        <CardTitle className="mt-2 text-base leading-tight text-primary sm:text-lg">
          <Link href={href} className="break-words hover:text-accent">
            {name}
          </Link>
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground sm:text-sm">
          {blurb}
        </CardDescription>
      </CardHeader>
      <CardFooter className="p-4 pt-0 sm:p-6 sm:pt-0">
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:text-primary sm:text-sm"
        >
          Learn more
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </CardFooter>
    </Card>
  );
}
