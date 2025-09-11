import * as React from "react";
import { cn } from "@/lib/utils";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive";
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          "relative w-full rounded border px-4 py-3 text-sm",
          variant === "default" && "bg-yellow-100 border-yellow-400 text-yellow-800",
          variant === "destructive" && "bg-red-100 border-red-400 text-red-800",
          className
        )}
        {...props}
      />
    );
  }
);
Alert.displayName = "Alert";

export { Alert };
