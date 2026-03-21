"use client";

import { Header } from "@/components/ui/Header";
import { StatCard } from "@/components/ui/StatCard";
import { BottomNav } from "@/components/ui/BottomNav";
import { Skeleton } from "@/components/ui/Skeleton";
import { Package, Clock, RotateCcw, Box, ArrowRight, FileText } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type DashboardStats = {
  totalTools: number;
  availableTools: number;
  rentedTools: number;
  todayReturns: number;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/dashboard/stats", {
          method: "GET",
          cache: "no-store",
        });

        const res = await response.json();
        if (res.success) {
          setStats(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      }

      setLoading(false);
    }
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      <Header title="Tool Rental" subtitle="Welcome back, Admin" />
      
      {/* Scrollable Main Content Content */}
      <main className="flex-1 overflow-y-auto px-4 py-6 space-y-6 pb-24 no-scrollbar">
        
        {/* Statistics Grid */}
        <section>
          <h2 className="text-sm font-semibold text-slate-500 mb-3 px-1 uppercase tracking-wider">Overview</h2>
          <div className="grid grid-cols-2 gap-3">
            {loading ? (
              <>
                <Skeleton className="h-24 rounded-[1.25rem]" />
                <Skeleton className="h-24 rounded-[1.25rem]" />
                <Skeleton className="h-24 rounded-[1.25rem]" />
                <Skeleton className="h-24 rounded-[1.25rem]" />
              </>
            ) : (
              <>
                <StatCard
                  title="Total Tools"
                  value={stats?.totalTools || 0}
                  icon={Box}
                  variant="default"
                />
                <StatCard
                  title="Available"
                  value={stats?.availableTools || 0}
                  icon={Package}
                  variant="success"
                />
                <StatCard
                  title="Rented Out"
                  value={stats?.rentedTools || 0}
                  icon={Clock}
                  variant="warning"
                />
                <StatCard
                  title="Returns Today"
                  value={stats?.todayReturns || 0}
                  icon={RotateCcw}
                  variant="default"
                />
              </>
            )}
          </div>
        </section>

        {/* Primary Action Section */}
        <section className="bg-white/50 backdrop-blur-[20px] shadow-[0_8px_30px_rgba(0,0,0,0.06)] border-[1.5px] border-white/80 rounded-[1.25rem] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-200/50 flex flex-col items-center text-center space-y-3">
          <div className="w-12 h-12 bg-violet-50 rounded-full flex items-center justify-center mb-1">
            <Package className="w-6 h-6 text-violet-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">New Rental</h3>
            <p className="text-sm text-slate-500 mt-1">Rent out tools to a new or returning customer.</p>
          </div>
          <Link 
            href="/rent/new" 
            className="w-full mt-2 bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-700 hover:to-fuchsia-600 text-white font-medium rounded-[1rem] px-4 py-3 flex items-center justify-center gap-2 transition-colors active:scale-[0.98]"
          >
            Go to Give Tool <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        {/* Quick Navigation Cards */}
        <section>
          <h2 className="text-sm font-semibold text-slate-500 mb-3 px-1 uppercase tracking-wider">Quick Actions</h2>
          <div className="space-y-3">
            <Link href="/inventory" className="flex items-center justify-between bg-white/60 backdrop-blur-xl p-4 rounded-[1.25rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white/80 hover:bg-white active:bg-slate-100 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-slate-100/50 rounded-[1rem]">
                  <Package className="w-5 h-5 text-slate-600" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-900">Inventory</p>
                  <p className="text-xs text-slate-500">View and manage all tools</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400" />
            </Link>

            <Link href="/rentals/active" className="flex items-center justify-between bg-white/60 backdrop-blur-xl p-4 rounded-[1.25rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white/80 hover:bg-white active:bg-slate-100 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-rose-50/50 rounded-[1rem]">
                  <Clock className="w-5 h-5 text-rose-500" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-900">Active Rentals</p>
                  <p className="text-xs text-slate-500">Track returning tools</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {loading ? (
                  <Skeleton className="w-6 h-5 rounded-full" />
                ) : (
                  <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2 py-0.5 rounded-full">{stats?.rentedTools || 0}</span>
                )}
                <ArrowRight className="w-5 h-5 text-slate-400" />
              </div>
            </Link>
            
            <Link href="/history" className="flex items-center justify-between bg-white/60 backdrop-blur-xl p-4 rounded-[1.25rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white/80 hover:bg-white active:bg-slate-100 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-slate-100/50 rounded-[1rem]">
                  <FileText className="w-5 h-5 text-slate-600" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-900">Rental History</p>
                  <p className="text-xs text-slate-500">Past transactions</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400" />
            </Link>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}

