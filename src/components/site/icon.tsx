import {
  WashingMachine,
  Refrigerator,
  Wind,
  Microwave,
  Droplet,
  Utensils,
  AlertTriangle,
  Wrench,
  Phone,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Star,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  WashingMachine,
  Refrigerator,
  Wind,
  Microwave,
  Droplet,
  Utensils,
  AlertTriangle,
  Wrench,
  Phone,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Star,
};

export function Icon({
  name,
  className,
  size,
}: {
  name: string;
  className?: string;
  size?: number;
}) {
  const Cmp = ICON_MAP[name] ?? Wrench;
  return <Cmp className={className} size={size} />;
}
