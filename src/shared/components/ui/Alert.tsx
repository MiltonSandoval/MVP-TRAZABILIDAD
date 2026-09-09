import React from "react";
import { cn } from "@/shared/utils/cn";
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "success" | "warning" | "danger";
  title?: string;
}

export function Alert({
  className,
  variant = "info",
  title,
  children,
  ...props
}: AlertProps) {
  const styles = {
    info: {
      container: "bg-blue-50 border-blue-200 text-blue-900",
      icon: <Info className="w-5 h-5 text-blue-600 shrink-0" />,
    },
    success: {
      container: "bg-emerald-50 border-emerald-200 text-emerald-900",
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    },
    warning: {
      container: "bg-amber-50 border-amber-200 text-amber-900",
      icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
    },
    danger: {
      container: "bg-red-50 border-red-200 text-red-900",
      icon: <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />,
    },
  };

  return (
    <div
      role="alert"
      className={cn(
        "flex gap-3 p-4 rounded-xl border text-sm",
        styles[variant].container,
        className
      )}
      {...props}
    >
      {styles[variant].icon}
      <div className="space-y-1 flex-1">
        {title && <h4 className="font-semibold">{title}</h4>}
        <div>{children}</div>
      </div>
    </div>
  );
}
