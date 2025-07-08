import React from "react";
import { cn } from "@/utils/cn";
import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";

const FormField = React.forwardRef(
  ({ className, label, error, type = "input", children, ...props }, ref) => {
    return (
      <div className={cn("space-y-2", className)}>
        {label && <Label>{label}</Label>}
        {type === "input" && <Input ref={ref} {...props} />}
        {type === "select" && (
          <Select ref={ref} {...props}>
            {children}
          </Select>
        )}
        {type === "textarea" && (
          <textarea
            ref={ref}
            className="flex min-h-[80px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
            {...props}
          />
        )}
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

FormField.displayName = "FormField";

export default FormField;