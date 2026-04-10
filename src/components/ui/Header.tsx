"use client";

import { Bell, ArrowLeft, X, User, Package, Clock, LogOut } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { getTodayTasksAction } from "@/actions/rental.actions";
import { logoutAction } from "@/actions/auth.actions";
import { cn } from "@/lib/utils";

interface HeaderProps {
  title: string;
  subtitle?: string; 
  showNotification?: boolean;
  onBack?: () => void;
}

export function Header({ title, showNotification = true, onBack }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [showOverlay, setShowOverlay] = useState(false);
  const [tasks, setTasks] = useState<any[]>([]);
  const isHome = pathname === "/" || pathname === "/dashboard";

  useEffect(() => {
    if (showNotification) {
      async function fetchTasks() {
        const res = await getTodayTasksAction();
        if (res.success) setTasks(res.data || []);
      }
      fetchTasks();
    }
  }, [showNotification]);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-teal-600/95 backdrop-blur-2xl px-6 flex flex-col justify-center transition-all duration-300 min-h-[76px] pb-4 pt-[calc(1rem+env(safe-area-inset-top))] rounded-b-[2.5rem] shadow-[0_12px_40px_-12px_rgba(13,148,136,0.5)] border-b border-teal-400/30">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            {!isHome && (
              <button 
                onClick={handleBack}
                className="w-10 h-10 flex items-center justify-center text-teal-100/80 hover:text-white bg-white/5 hover:bg-white/15 rounded-full transition-all duration-200 active:scale-90 border border-white/5"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <h1 className="text-xl font-bold text-white tracking-tight leading-none drop-shadow-sm">
              {title}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            {showNotification && (
              <button 
                onClick={() => setShowOverlay(true)}
                className="relative w-10 h-10 flex items-center justify-center text-slate-300 hover:text-white bg-white/5 hover:bg-white/15 rounded-full transition-all duration-200 active:scale-95 border border-white/5 shadow-sm"
              >
                <Bell className="w-5 h-5" strokeWidth={2} />
                {tasks.length > 0 && (
                  <span className="absolute top-[8px] right-[10px] w-4 h-4 bg-rose-500 rounded-full border border-teal-600 flex items-center justify-center text-[8px] font-bold text-white shadow-sm overflow-hidden">
                    {tasks.length}
                  </span>
                )}
              </button>
            )}

            <button 
              onClick={() => logoutAction()}
              className="relative w-10 h-10 flex items-center justify-center text-slate-300 hover:text-white bg-white/5 hover:bg-white/15 rounded-full transition-all duration-200 active:scale-95 border border-white/5 shadow-sm"
              title="Logout"
            >
              <LogOut className="w-[18px] h-[18px]" strokeWidth={2.5} />
            </button>

            {/* Profile Picture Placeholder */}
            <Link href="/" className="relative ml-1 shadow-[0_4px_12px_rgba(124,58,237,0.3)] rounded-full active:scale-90 transition-transform">
               <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                 <span className="text-white font-bold text-[13px] tracking-wide">AD</span>
               </div>
               <div className="absolute bottom-[-2px] right-[-2px] w-3 h-3 bg-teal-400 rounded-full border-2 border-slate-950" />
            </Link>
          </div>
        </div>
      </header>

      {/* Task Notifications Overlay */}
      {showOverlay && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-md transition-all duration-300 animate-in fade-in">
          <div className="absolute top-0 right-0 h-full w-[85%] max-w-sm bg-white shadow-[-10px_0_40px_rgba(0,0,0,0.1)] flex flex-col animate-in slide-in-from-right duration-500">
            <div className="px-6 py-8 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 leading-none">Today's Tasks</h2>
                <p className="text-xs font-semibold text-slate-400 mt-2 uppercase tracking-wider">{tasks.length} Tools Out on Rent</p>
              </div>
              <button 
                onClick={() => setShowOverlay(false)}
                className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 active:scale-90 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 no-scrollbar">
              {tasks.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-50 px-4">
                  <Clock className="w-12 h-12 text-slate-200 mb-4" />
                  <p className="text-slate-400 font-bold">No active tasks for today.</p>
                </div>
              ) : (
                tasks.map((task) => (
                  <div 
                    key={task.id} 
                    onClick={() => { setShowOverlay(false); router.push(`/rentals/${task.id}`); }}
                    className="p-4 bg-slate-50 rounded-[1.5rem] border border-slate-100 flex flex-col gap-3 active:scale-[0.98] transition-all cursor-pointer hover:bg-slate-100/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                        <User className="w-5 h-5 text-violet-500" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800 leading-tight">{task.customer.name}</span>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{task.customer.village || 'No Village'}</span>
                      </div>
                    </div>
                    <div className="py-2 px-3 bg-white rounded-xl border border-slate-100 flex items-center gap-3">
                      <Package className="w-4 h-4 text-emerald-500" />
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-slate-700">
                          {task.rentalItems.map((ri: any) => `${ri.quantity}x ${ri.tool.name}`).join(', ')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-6 bg-slate-50/50 border-t border-slate-100">
               <button 
                onClick={() => { setShowOverlay(false); router.push('/rentals/active'); }}
                className="w-full py-4 bg-teal-600 text-white font-bold rounded-[1.25rem] shadow-lg shadow-teal-600/20 active:scale-[0.98] transition-all"
               >
                 Manage All Active Rentals
               </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
