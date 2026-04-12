"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Hexagon } from "lucide-react";

export default function SplashScreen() {
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // 1.5 seconds total duration for the splash screen
    const duration = 1500;
    const intervalTime = 15; // update every 15ms
    const steps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const newProgress = Math.min(Math.round((currentStep / steps) * 100), 100);
      setProgress(newProgress);

      if (currentStep >= steps) {
        clearInterval(timer);
        // Short delay after hitting 100% before redirecting
        setTimeout(() => {
          router.push("/dashboard");
        }, 300);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] relative overflow-hidden">
      {/* Central Brand Icon with generic spinning pulse */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-violet-500/20 rounded-full blur-xl animate-pulse" />
        <div className="w-24 h-24 bg-white/50 backdrop-blur-[20px] shadow-[0_12px_40px_rgba(0,0,0,0.08)] border-[1.5px] border-white/80 rounded-[1.5rem] flex items-center justify-center relative z-10 transition-transform duration-1000 scale-100">
          <Hexagon className="w-12 h-12 text-violet-600 drop-shadow-md animate-[spin_4s_linear_infinite]" strokeWidth={1.5} />
        </div>
      </div>

      {/* Brand Name */}
      <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight mb-2 opacity-90">
        Srisaibaba Hardware
      </h1>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-500 mb-12 opacity-80">
        Karimnagar
      </p>

      {/* Progress Counter */}
      <div className="flex flex-col items-center gap-4 w-full max-w-[200px]">
        <span className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-500 tracking-tighter tabular-nums drop-shadow-sm">
          {progress}%
        </span>

        {/* Loading Bar */}
        <div className="w-full h-1.5 bg-slate-200/50 rounded-full overflow-hidden shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-violet-600 to-fuchsia-500 rounded-full transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
