import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";

export function TestimonialCard({
  quote,
  name,
  location,
  rating = 5,
}: {
  quote: string;
  name: string;
  location: string;
  rating?: number;
}) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((s) => s[0])
    .join("")
    .toUpperCase();

  return (
    <Card className="bg-card">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback className="bg-accent/15 text-accent font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-primary">{name}</p>
            <p className="text-xs text-muted-foreground">{location}</p>
          </div>
          <div
            className="ml-auto flex items-center gap-0.5 text-accent"
            aria-label={`${rating} out of 5 stars`}
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="size-4"
                fill={i < rating ? "currentColor" : "none"}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <blockquote className="text-sm leading-relaxed text-foreground">
          “{quote}”
        </blockquote>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">Verified FixCare customer</p>
      </CardFooter>
    </Card>
  );
}
