"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/ui/Header";
import { BottomNav } from "@/components/ui/BottomNav";
import { SearchBar } from "@/components/ui/SearchBar";
import { FilterTabs } from "@/components/ui/FilterTabs";
import { HistoryCard } from "@/components/ui/HistoryCard";
import { Search, Loader2 } from "lucide-react";
import { getRentalHistoryAction } from "@/actions/rental.actions";

const FILTER_OPTIONS = ["All Time", "Today", "This Week", "This Month"];

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Time");
  
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      const res = await getRentalHistoryAction();
      if (res.success && res.data) {
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
  }, []);

  const filteredHistory = history.filter((record) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      record.customerName.toLowerCase().includes(q) ||
      record.mobileNumber.includes(q) ||
      record.toolName.toLowerCase().includes(q);
      
    // Stub for advanced date filters via activeFilter
    
    return matchesSearch;
  });

  const totalEarned = history.reduce((sum, record) => sum + record.totalAmountPaid, 0);

  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      <Header title="Rental History" subtitle="View past rental transactions" showNotification={false} />

      <main className="flex-1 overflow-y-auto pb-28 pt-4">
        
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

        {/* Total Summary Mini-Banner */}
        <div className="px-4 mb-5 pt-2">
          <div className="flex items-center justify-between text-sm px-1">
            <span className="text-slate-500 font-medium">Showing <strong className="text-slate-900">{filteredHistory.length}</strong> transactions</span>
            <span className="text-slate-500 font-medium">Earned: <strong className="text-violet-600">₹{totalEarned}</strong></span>
          </div>
        </div>

        {/* History List Grid */}
        <div className="px-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {loading ? (
             <div className="col-span-full py-16 flex flex-col items-center justify-center text-center">
                <Loader2 className="w-8 h-8 text-violet-600 animate-spin mb-4" />
                <h3 className="text-slate-900 font-bold text-lg">Loading History...</h3>
             </div>
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
