import { cn } from "@/lib/utils";

export function PageHero({
  title,
  subtitle,
  eyebrow,
  className,
  children,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "bg-gradient-to-br from-primary to-accent text-primary-foreground",
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        {eyebrow && (
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground/80">
            {eyebrow}
          </p>
        )}
        <h1 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 max-w-2xl text-base text-primary-foreground/85 sm:text-lg">
            {subtitle}
          </p>
        )}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  );
}
