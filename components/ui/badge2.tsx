import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants2 = cva(
  "inline-flex items-center rounded border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary/20 text-primary hover:bg-primary/30",
        secondary:
          "border-transparent bg-secondary/20 text-secondary hover:bg-secondary/30",
        destructive:
          "border-transparent bg-destructive/20 text-destructive hover:bg-destructive/30",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants2> {}

function Badge2({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants2({ variant }), className)} {...props} />
  );
}

export { Badge2, badgeVariants2 };
