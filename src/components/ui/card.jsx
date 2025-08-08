import { cn } from "../../lib/utils.js";

export const Card = ({ className, ...props }) => (
  <div
    className={cn(
      "rounded-2xl border border-[--color-border] bg-[--color-card] p-6 shadow-sm sketch-border",
      className
    )}
    {...props}
  />
);

export const CardHeader = ({ className, ...props }) => (
  <div className={cn("mb-4", className)} {...props} />
);

export const CardTitle = ({ className, ...props }) => (
  <h3
    className={cn(
      "text-xl font-semibold tracking-tight font-[var(--font-accent)]",
      className
    )}
    {...props}
  />
);

export const CardDescription = ({ className, ...props }) => (
  <p
    className={cn("text-sm text-[--color-muted-foreground]", className)}
    {...props}
  />
);

export const CardContent = ({ className, ...props }) => (
  <div className={cn("space-y-4", className)} {...props} />
);
