import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils.js";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[var(--radius)] text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-ring] disabled:pointer-events-none disabled:opacity-50 sketch-border scribble-shadow",
  {
    variants: {
      variant: {
        default:
          "bg-[--color-primary] text-[--color-primary-foreground] hover:-translate-y-px active:translate-y-0",
        secondary:
          "bg-[--color-secondary] text-[--color-secondary-foreground] hover:-translate-y-px active:translate-y-0",
        outline:
          "border border-[--color-border] bg-transparent hover:bg-[--color-muted] hover:text-[--color-foreground] hover:-translate-y-px active:translate-y-0",
        ghost:
          "hover:bg-[--color-muted] hover:text-[--color-foreground] hover:-translate-y-px active:translate-y-0",
        link: "text-[--color-accent] underline-offset-4 hover:underline sketch-underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export const Button = ({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
};
