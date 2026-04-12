import React, { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, label, error, icon, type = "text", ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-slate-700 ml-1">
          {label}
        </label>
        <div className="relative group">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-600 transition-colors">
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "flex w-full rounded-[1.25rem] border border-slate-200 bg-white px-4 py-3.5 text-slate-900 font-medium text-sm transition-all shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:border-transparent",
              "placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500",
              icon && "pl-11", // Add padding if icon exists
              error && "border-red-500 focus-visible:ring-red-500",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-red-500 font-medium ml-1 mt-0.5">{error}</p>}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";
