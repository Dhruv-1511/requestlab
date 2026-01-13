import React from "react";
import { twMerge } from "tailwind-merge";

const Button = React.forwardRef(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const variants = {
      primary:
        "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:scale-105 shadow-md transition-all duration-300 active:scale-95",
      secondary:
        "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-lg hover:scale-105 shadow-md transition-all duration-300",
      brand:
        "electric-gradient text-white border-none glow-primary hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:brightness-110",
      ghost: "hover:bg-accent/60 hover:text-accent-foreground hover:shadow-md hover:scale-105 transition-all duration-300",
      outline:
        "border border-border/60 bg-card/60 backdrop-blur-sm hover:bg-accent/80 hover:text-accent-foreground hover:border-primary/30 hover:shadow-lg hover:scale-105 transition-all duration-300 shadow-sm",
      destructive:
        "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-lg hover:scale-105 shadow-md transition-all duration-300 active:scale-95",
    };

    const sizes = {
      sm: "h-9 px-4 text-xs font-bold tracking-wide uppercase",
      md: "h-11 px-6 py-3 text-sm font-semibold",
      lg: "h-14 px-10 text-base font-bold",
      icon: "h-11 w-11",
    };

    return (
      <button
        ref={ref}
        className={twMerge(
          "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed select-none",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
