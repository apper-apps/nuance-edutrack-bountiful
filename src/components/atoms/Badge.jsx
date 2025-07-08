import React from "react";
import { cn } from "@/utils/cn";

const Badge = React.forwardRef(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      default: "bg-gray-100 text-gray-800 hover:bg-gray-200",
      primary: "bg-primary-100 text-primary-800 hover:bg-primary-200",
      secondary: "bg-secondary-100 text-secondary-800 hover:bg-secondary-200",
      accent: "bg-accent-100 text-accent-800 hover:bg-accent-200",
      success: "bg-green-100 text-green-800 hover:bg-green-200",
      warning: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
      error: "bg-red-100 text-red-800 hover:bg-red-200",
      present: "bg-green-100 text-green-800 hover:bg-green-200",
      absent: "bg-red-100 text-red-800 hover:bg-red-200",
      late: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
      active: "bg-green-100 text-green-800 hover:bg-green-200",
      inactive: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    };
    
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";

export default Badge;