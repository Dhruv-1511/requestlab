import React from "react";
import { twMerge } from "tailwind-merge";
import { ChevronDown } from "lucide-react";

const Select = React.forwardRef(({ className, options, ...props }, ref) => {
  return (
    <div className="relative group">
      <select
        ref={ref}
        className={twMerge(
          "flex h-10 w-full rounded-xl border border-input bg-background/50 pl-4 pr-10 py-2 text-sm font-bold ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus:border-primary/50 transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 appearance-none",
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option
            key={opt.value}
            value={opt.value}
            className="bg-slate-900 text-white"
          >
            {opt.label}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-primary/60 group-hover:text-primary transition-colors">
        <ChevronDown size={16} strokeWidth={3} />
      </div>
    </div>
  );
});

Select.displayName = "Select";

export { Select };
