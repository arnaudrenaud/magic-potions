import { ReactElement, ReactNode, cloneElement } from "react";
import { cn } from "@/lib/utils";

export function ElementWithIcon({
  icon,
  children = null,
  size = "BASE",
  className,
}: {
  icon: ReactElement;
  children?: ReactNode;
  size?: "SMALL" | "BASE";
  className?: string;
}) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      {cloneElement(icon, {
        className: cn(
          size === "BASE" ? "h-4 w-4" : "h-3 w-3",
          icon.props.className
        ),
      })}
      {children}
    </span>
  );
}
