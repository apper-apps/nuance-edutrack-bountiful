import React from "react";
import { cn } from "@/utils/cn";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";

const SearchBar = React.forwardRef(
  ({ className, placeholder = "Search...", ...props }, ref) => {
    return (
      <div className={cn("relative", className)}>
        <ApperIcon 
          name="Search" 
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" 
        />
        <Input
          ref={ref}
          placeholder={placeholder}
          className="pl-10"
          {...props}
        />
      </div>
    );
  }
);

SearchBar.displayName = "SearchBar";

export default SearchBar;