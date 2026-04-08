"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/ui/Header";
import { BottomNav } from "@/components/ui/BottomNav";
import { SearchBar } from "@/components/ui/SearchBar";
import { RentalCard } from "@/components/ui/RentalCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { Clock } from "lucide-react";
import { getActiveRentalsAction } from "@/actions/rental.actions";
import { useRouter } from "next/navigation";

export default function ActiveRentalsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeRentals, setActiveRentals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRentals() {
      const res = await getActiveRentalsAction();
      if (res.success && res.data) {
        const mappedData = res.data.map((r: any) => {
          const startDate = new Date(r.startDate);
          const daysRunning = Math.max(1, Math.ceil((new Date().getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
          
          let totalQty = 0;
          let currentCost = 0;
          let toolNames = [];
          let assignedItemsList: string[] = [];

          for (const item of r.rentalItems) {
            totalQty += item.quantity;
            currentCost += (item.quantity * item.dailyPriceSnapshot * daysRunning);
            toolNames.push(`${item.tool.name} (x${item.quantity})`);
            
            if (item.details) {
              item.details.forEach((d: any) => {
                if (d.toolItem && d.toolItem.itemNumber) {
                   assignedItemsList.push(d.toolItem.itemNumber);
                }
              });
            }
          }

          return {
            id: r.id,
            customerName: r.customer.name,
            mobileNumber: r.customer.mobile,
            village: r.customer.village,
            toolName: toolNames.join(', '),
            quantity: totalQty,
            startDate: startDate.toLocaleDateString(),
            daysRunning,
            estimatedCost: currentCost,
            assignedItems: assignedItemsList,
          };
        });

        setActiveRentals(mappedData);
      }
      setLoading(false);
    }
    loadRentals();
  }, []);

  const filteredRentals = activeRentals.filter((rental) => {
    const q = searchQuery.toLowerCase();
    return (
      rental.customerName.toLowerCase().includes(q) ||
      rental.mobileNumber.includes(q) ||
      rental.toolName.toLowerCase().includes(q)
    );
  });

  const totalEstimatedValue = activeRentals.reduce((sum, r) => sum + r.estimatedCost, 0);

  return (
    <div className="min-h-[100dvh] bg-transparent flex flex-col">
      <Header title="Active Rentals" subtitle="Tools currently rented by customers" showNotification={false} />

      <main className="flex-1 overflow-y-auto pb-28 pt-4 no-scrollbar">
        
        {/* Sticky Utility Bar with Search */}
        <div className="sticky top-0 z-30 bg-white/40 backdrop-blur-2xl border-b border-white/60 px-4 py-2 mb-4">
          <SearchBar 
            placeholder="Search by name, mobile, or tool..." 
            value={searchQuery}
            onChange={setSearchQuery} 
          />
        </div>

        {/* Info Banner */}
        <div className="px-4 mb-5">
          {loading ? (
            <Skeleton className="h-14 w-full rounded-[1.25rem]" />
          ) : (
            <div className="bg-rose-50 border border-rose-100 p-3 rounded-[1.25rem] flex items-start gap-3 shadow-sm">
              <Clock className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <p className="text-sm text-rose-800 font-medium">
                You have <span className="font-bold">{activeRentals.length} active rentals</span> at the moment. Total estimated value: ₹{totalEstimatedValue}.
              </p>
            </div>
          )}
        </div>

        {/* Rentals List Grid */}
        <div className="px-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 pb-10">
          {loading ? (
             <>
               <Skeleton className="h-64 rounded-[1.5rem]" />
               <Skeleton className="h-64 rounded-[1.5rem]" />
               <Skeleton className="h-64 rounded-[1.5rem]" />
             </>
          ) : filteredRentals.length > 0 ? (
            filteredRentals.map((rental) => (
              <RentalCard 
                key={rental.id} 
                {...rental} 
                onReturn={(id) => router.push(`/return/${id}`)}
                onViewDetails={(id) => router.push(`/rentals/${id}`)}
              />
            ))
          ) : (
            <div className="col-span-full py-16 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 shadow-sm">
                <Clock className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-slate-900 font-bold text-lg mb-1">No active rentals</h3>
              <p className="text-slate-500 text-sm max-w-[200px]">
                {searchQuery ? `We couldn't find any rentals matching "${searchQuery}"` : "All rented tools have been returned."}
              </p>
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
