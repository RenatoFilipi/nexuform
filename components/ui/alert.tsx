import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default:
          "border-foreground/20 text-foreground dark:border-foreground/20 [&>svg]:text-foreground bg-foreground/5 dark:bg-foreground/5 dark:text-white p-3",
        info: "border-info/20 text-info dark:border-info [&>svg]:text-info bg-info/5 dark:bg-info/40 dark:text-white/80 p-3",
        destructive:
          "border-destructive/20 text-destructive dark:border-destructive [&>svg]:text-destructive bg-destructive/5 dark:bg-destructive/40 dark:text-white/80 p-3",
        success:
          "border-success/20 text-success dark:border-success [&>svg]:text-success bg-success/5 dark:bg-success/40 dark:text-white/80 p-3",
        warning:
          "border-warning/20 text-warning dark:border-warning [&>svg]:text-warning bg-warning/5 dark:bg-warning/40 dark:text-white/80 p-3",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertDescription, AlertTitle };
