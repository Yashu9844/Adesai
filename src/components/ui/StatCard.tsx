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
    default: "text-indigo-600 bg-indigo-50",
    warning: "text-amber-500 bg-amber-50",
    success: "text-emerald-500 bg-emerald-50",
    danger: "text-red-500 bg-red-50",
  };

  return (
    <div className={cn("bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4", className)}>
      <div className={cn("p-3 rounded-lg", variantStyles[variant])}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{title}</p>
        <p className="text-lg font-semibold text-gray-900 mt-0.5">{value}</p>
      </div>
    </div>
  );
}
