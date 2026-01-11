import React from "react";
import { twMerge } from "tailwind-merge";

const Select = React.forwardRef(({ className, options, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={twMerge(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
});

Select.displayName = "Select";

export { Select };
