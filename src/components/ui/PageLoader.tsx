"use client";

import { Hexagon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageLoaderProps {
  text?: string;
  className?: string;
  fullScreen?: boolean;
}

export function PageLoader({ text = "Loading...", className, fullScreen = true }: PageLoaderProps) {
  const content = (
    <div className={cn("flex flex-col items-center justify-center relative z-50", className)}>
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-violet-500/20 rounded-full blur-xl animate-pulse" />
        <div className="w-20 h-20 bg-white/60 backdrop-blur-[20px] shadow-[0_12px_40px_rgba(0,0,0,0.08)] border-[1.5px] border-white/80 rounded-[1.25rem] flex items-center justify-center relative z-10 transition-transform duration-1000">
          <Hexagon className="w-10 h-10 text-violet-600 drop-shadow-md animate-[spin_4s_linear_infinite]" strokeWidth={1.5} />
        </div>
      </div>
      
      <div className="text-center space-y-2 relative z-10">
        {text && (
          <h2 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-500 tracking-tight animate-pulse">
            {text}
          </h2>
        )}
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
          Srisaibaba Hardware
        </p>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-slate-50/50 backdrop-blur-md relative z-50 overflow-hidden">
        {/* Decorative background ambient light */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-violet-400/10 rounded-full blur-[64px] pointer-events-none" />
        {content}
      </div>
    );
  }

  return content;
}
