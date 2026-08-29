import * as React from "react";
import { cn } from "../../utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "success" | "warning" | "destructive";
  children?: React.ReactNode;
  className?: string;
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "border-transparent bg-primary/20 text-primary hover:bg-primary/30",
    secondary: "border-transparent bg-secondary/20 text-secondary hover:bg-secondary/30",
    outline: "text-on-surface-variant border-outline-variant",
    success: "border-transparent bg-green-500/20 text-green-400 hover:bg-green-500/30",
    warning: "border-transparent bg-tertiary/20 text-tertiary hover:bg-tertiary/30",
    destructive: "border-transparent bg-error/20 text-error hover:bg-error/30",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
