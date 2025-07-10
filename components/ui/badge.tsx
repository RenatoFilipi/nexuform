import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const badgeVariants = cva(
  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "inline-flex items-center rounded-md bg-foreground/5 px-2 py-1 text-xs font-medium text-foreground/80 dark:bg-foreground/5 dark:text-foreground",
        primary:
          "inline-flex items-center rounded-md bg-primary/5 px-2 py-1 text-xs font-medium text-primary/80 dark:bg-primary/10 dark:text-primary",
        success:
          "inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-500",
        warning:
          "inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-500",
        info: "inline-flex items-center rounded-md bg-sky-50 px-2 py-1 text-xs font-medium text-sky-700 dark:bg-sky-900/50 dark:text-sky-500",
        destructive:
          "inline-flex items-center rounded-md bg-destructive/20 px-2 py-1 text-xs font-medium text-destructive",
        green:
          "inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900/50 dark:text-green-500",
        gray: "inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-gray-900/50 dark:text-gray-500",
        red: "inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-inset ring-red-600/20 dark:bg-red-900/50 dark:text-red-500",
        yellow:
          "inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-500",
        blue: "inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/50 dark:text-blue-500",
        indigo:
          "inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-500",
        purple:
          "inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 dark:bg-purple-900/50 dark:text-purple-500",
        pink: "inline-flex items-center rounded-md bg-pink-50 px-2 py-1 text-xs font-medium text-pink-700 dark:bg-pink-900/50 dark:text-pink-500",
        orange:
          "inline-flex items-center rounded-md bg-orange-50 px-2 py-1 text-xs font-medium text-orange-700 dark:bg-orange-900/50 dark:text-orange-500",
        lime: "inline-flex items-center rounded-md bg-lime-50 px-2 py-1 text-xs font-medium text-lime-700 dark:bg-lime-900/50 dark:text-lime-500",
        gold: "inline-flex items-center rounded-md bg-yellow-400/20 px-2 py-1 text-xs font-medium text-yellow-600 dark:bg-yellow-600/30 dark:text-yellow-300",
        silver:
          "inline-flex items-center rounded-md bg-gray-300/20 px-2 py-1 text-xs font-medium text-gray-500 dark:bg-gray-500/30 dark:text-gray-200",
        bronze:
          "inline-flex items-center rounded-md bg-orange-600/20 px-2 py-1 text-xs font-medium text-orange-700 dark:bg-orange-700/30 dark:text-orange-300",
        plan: "px-2 border-primary/40 text-xs text-primary bg-primary/10",
      },
      uppercase: {
        true: "uppercase",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      uppercase: false,
    },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
  uppercase?: boolean;
}

function Badge({ className, variant, uppercase, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant, uppercase }), className)} {...props} />;
}

export { Badge, badgeVariants };
