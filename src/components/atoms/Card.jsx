import React from "react";
import { cn } from "@/utils/cn";

const Card = React.forwardRef(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-200",
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = "Card";

export default Card;