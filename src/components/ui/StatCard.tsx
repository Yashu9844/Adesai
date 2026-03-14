import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  variant?: "default" | "warning" | "success" | "danger";
  className?: string;
}

export function StatCard({ title, value, icon: Icon, variant = "default", className }: StatCardProps) {
  const variantStyles = {
    default: "text-violet-600 bg-violet-50",
    warning: "text-rose-500 bg-rose-50",
    success: "text-teal-500 bg-teal-50",
    danger: "text-red-500 bg-red-50",
  };

  return (
    <div className={cn("bg-white p-4 rounded-[1.25rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-200/50 flex items-center gap-4", className)}>
      <div className={cn("p-3 rounded-[1rem]", variantStyles[variant])}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</p>
        <p className="text-lg font-semibold text-slate-900 mt-0.5">{value}</p>
      </div>
    </div>
  );
}
