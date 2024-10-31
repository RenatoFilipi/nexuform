import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants2 = cva(
  "inline-flex items-center rounded border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        green:
          "inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-900/50 dark:text-green-500",
        gray: "inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-600/20 dark:bg-gray-900/50 dark:text-gray-500",
        red: "inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20 dark:bg-red-900/50 dark:text-red-500",
        yellow:
          "inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-600/20 dark:bg-yellow-900/50 dark:text-yellow-500",
        blue: "inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20 dark:bg-blue-900/50 dark:text-blue-500",
        indigo:
          "inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-600/20 dark:bg-indigo-900/50 dark:text-indigo-500",
        purple:
          "inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-600/20 dark:bg-purple-900/50 dark:text-purple-500",
        pink: "inline-flex items-center rounded-md bg-pink-50 px-2 py-1 text-xs font-medium text-pink-700 ring-1 ring-inset ring-pink-600/20 dark:bg-pink-900/50 dark:text-pink-500",
        orange:
          "inline-flex items-center rounded-md bg-orange-50 px-2 py-1 text-xs font-medium text-orange-700 ring-1 ring-inset ring-orange-600/20 dark:bg-orange-900/50 dark:text-orange-500",
        lime: "inline-flex items-center rounded-md bg-lime-50 px-2 py-1 text-xs font-medium text-lime-700 ring-1 ring-inset ring-lime-600/20 dark:bg-lime-900/50 dark:text-lime-500",
      },
      uppercase: {
        true: "uppercase",
        false: "",
      },
    },
    defaultVariants: {
      variant: "blue",
      uppercase: false,
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants2> {
  uppercase?: boolean;
}

function Badge2({ className, variant, uppercase, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants2({ variant, uppercase }), className)}
      {...props}
    />
  );
}

export { Badge2, badgeVariants2 };
