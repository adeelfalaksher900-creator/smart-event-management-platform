import * as React from "react";
import { cn } from "../../utils/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
    
    const variants = {
      primary: "bg-primary text-on-primary hover:brightness-110 shadow-sm",
      secondary: "bg-secondary text-on-secondary hover:brightness-110",
      outline: "border border-outline-variant bg-transparent hover:bg-surface-container text-on-surface",
      ghost: "hover:bg-surface-container text-on-surface hover:text-on-surface-variant",
    };
    
    const sizes = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 py-2 px-4",
      lg: "h-12 px-8 text-base",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
