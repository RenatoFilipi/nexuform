import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default:
          "border border-foreground/10 bg-foreground/5 text-foreground dark:border-white/10 dark:bg-white/5 dark:text-white p-2 rounded-sm shadow-sm",

        info: "border border-info/20 bg-info/5 text-info dark:border-info/30 dark:bg-info/10 dark:text-info p-2 rounded-sm shadow-sm",

        destructive:
          "border border-destructive/30 bg-destructive/5 text-destructive dark:border-destructive/40 dark:bg-destructive/10 dark:text-destructive p-2 rounded-sm shadow-sm",

        success:
          "border border-success/25 bg-success/5 text-success dark:border-success/30 dark:bg-success/10 dark:text-success p-2 rounded-sm shadow-sm",

        warning:
          "border border-warning/25 bg-warning/10 text-warning dark:border-warning/30 dark:bg-warning/15 dark:text-warning p-2 rounded-sm shadow-sm",
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
  <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5 ref={ref} className={cn("mb-1 font-medium leading-none tracking-tight", className)} {...props} />
  )
);
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("text-xs [&_p]:leading-relaxed", className)} {...props} />
  )
);
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertDescription, AlertTitle };
