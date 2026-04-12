"use client";

import { useState } from "react";
import { loginAction } from "@/actions/auth.actions";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await loginAction(password);
      if (res.success) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setError(res.error || "Invalid password");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-500/10 blur-[120px] rounded-full" />
      
      <div className="w-full max-w-md z-10">
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col items-center text-center">
          
          <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-violet-500/20 rotate-3">
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">Admin Portal</h1>
          <p className="text-slate-400 text-sm mb-10 font-medium">Please enter your password to continue</p>

          <form onSubmit={handleLogin} className="w-full space-y-6">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-slate-500 group-focus-within:text-violet-400 transition-colors" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Manager Password"
                className={cn(
                  "w-full bg-white/5 border border-white/10 text-white rounded-[1.25rem] py-4 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all font-medium placeholder:text-slate-600",
                  error && "border-rose-500/50 focus:ring-rose-500/50 focus:border-rose-500/50"
                )}
                autoFocus
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 text-rose-400 text-xs font-bold animate-in fade-in slide-in-from-top-1">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-violet-600 to-teal-500 hover:from-violet-700 hover:to-teal-600 text-white font-bold rounded-[1.25rem] shadow-lg shadow-violet-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:grayscale disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Access System
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 w-full">
            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest leading-loose">
              © 2026 Admin Management System <br />
              Srisaibaba Hardware
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
