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
      <CardHeader>
        <div className="flex size-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
          <Icon name={icon} className="size-5" aria-hidden="true" />
        </div>
        <CardTitle className="mt-2 text-lg text-primary">
          <Link href={href} className="hover:text-accent">
            {name}
          </Link>
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {blurb}
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:text-primary"
        >
          Learn more
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </CardFooter>
    </Card>
  );
}
