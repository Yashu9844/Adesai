"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/ui/Header";
import { BottomNav } from "@/components/ui/BottomNav";
import { SearchBar } from "@/components/ui/SearchBar";
import { FilterTabs } from "@/components/ui/FilterTabs";
import { HistoryCard } from "@/components/ui/HistoryCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { Search } from "lucide-react";
import { localData } from "@/lib/local-data";

const FILTER_OPTIONS = ["All Time", "Today", "This Week", "This Month"];

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Time");
  
  const [history, setHistory] = useState<any[]>([]);
  const [overview, setOverview] = useState({ transactions: 0, totalEarned: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      setLoading(true);
      const res = await localData.getRentalHistory(activeFilter);
      if (res.success && res.data) {
        setOverview(res.summary || { transactions: 0, totalEarned: 0 });
        const mappedData = res.data.map((r: any) => {
          const startDate = new Date(r.startDate);
          const endDate = new Date(r.returnedAt);
          const totalDays = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
          
          return {
            id: r.id,
            customerName: r.customer.name,
            mobileNumber: r.customer.mobile,
            toolName: r.rentalItems.map((i: any) => `${i.tool.name} (x${i.quantity})`).join(', '),
            quantity: r.rentalItems.reduce((acc: number, item: any) => acc + item.quantity, 0),
            startDate: startDate.toLocaleDateString(),
            endDate: endDate.toLocaleDateString(),
            totalDays,
            totalAmountPaid: r.totalAmount || 0,
          };
        });
        setHistory(mappedData);
      }
      setLoading(false);
    }
    fetchHistory();
  }, [activeFilter]);

  const filteredHistory = history.filter((record) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      record.customerName.toLowerCase().includes(q) ||
      record.mobileNumber.includes(q) ||
      record.toolName.toLowerCase().includes(q);
      
    return matchesSearch;
  });

  const totalEarned = filteredHistory.reduce((sum, record) => sum + record.totalAmountPaid, 0);

  return (
    <div className="min-h-[100dvh] bg-transparent flex flex-col">
      <Header title="Rental History" subtitle="View past rental transactions" showNotification={false} />

      <main className="flex-1 overflow-y-auto pb-28 pt-4 no-scrollbar">
        
        {/* Sticky Filters & Search */}
        <div className="sticky top-0 z-30 bg-white/40 backdrop-blur-2xl border-b border-white/60 px-4 py-2 mb-2 flex flex-col gap-3">
          <SearchBar 
            placeholder="Search by name, mobile, or tool..." 
            value={searchQuery}
            onChange={setSearchQuery} 
          />
          <FilterTabs 
            tabs={FILTER_OPTIONS}
            activeTab={activeFilter}
            onTabChange={setActiveFilter}
          />
        </div>

        {/* Global Backend Overview Cards */}
        <div className="px-4 grid grid-cols-2 gap-3 mb-5 pt-2">
          {loading ? (
            <>
              <Skeleton className="h-20 rounded-2xl" />
              <Skeleton className="h-20 rounded-2xl" />
            </>
          ) : (
            <>
              <div className="bg-white/60 backdrop-blur-md rounded-2xl p-4 border border-white/60 shadow-sm flex flex-col justify-center items-center">
                 <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase mb-1">Total Earned</span>
                 <span className="text-2xl font-extrabold text-violet-600">₹{overview.totalEarned}</span>
              </div>
              <div className="bg-white/60 backdrop-blur-md rounded-2xl p-4 border border-white/60 shadow-sm flex flex-col justify-center items-center">
                 <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase mb-1">Transactions</span>
                 <span className="text-2xl font-extrabold text-slate-800">{overview.transactions}</span>
              </div>
            </>
          )}
        </div>

        {/* Local Summary Mini-Banner for Search */}
        {searchQuery && (
          <div className="px-5 mb-4">
            <div className="flex items-center justify-between text-xs px-2 py-1.5 bg-slate-100/50 rounded-lg">
              <span className="text-slate-500 font-semibold">Found <strong className="text-slate-800">{filteredHistory.length}</strong> matches</span>
              <span className="text-slate-500 font-semibold">Value: <strong className="text-violet-600">₹{totalEarned}</strong></span>
            </div>
          </div>
        )}

        {/* History List Grid */}
        <div className="px-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-10">
          {loading ? (
             <>
               <Skeleton className="h-44 rounded-[1.5rem]" />
               <Skeleton className="h-44 rounded-[1.5rem]" />
               <Skeleton className="h-44 rounded-[1.5rem]" />
               <Skeleton className="h-44 rounded-[1.5rem]" />
             </>
          ) : filteredHistory.length > 0 ? (
            filteredHistory.map((record) => (
              <HistoryCard key={record.id} {...record} />
            ))
          ) : (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-200/50 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-slate-900 font-bold text-lg mb-1">No records found</h3>
              <p className="text-slate-500 text-sm max-w-[220px]">
                {searchQuery 
                  ? `We couldn't find any history matching "${searchQuery}"` 
                  : `No completed rentals for "${activeFilter}"`}
              </p>
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
