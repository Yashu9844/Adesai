"use client";

import { use, useEffect, useState } from "react";
import { Header } from "@/components/ui/Header";
import { ProfileCard } from "@/components/ui/ProfileCard";
import { BillingSummary } from "@/components/ui/BillingSummary";
import { Package, Calendar, Clock, AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { localData } from "@/lib/local-data";

import { PageLoader } from "@/components/ui/PageLoader";

export default function ReturnToolPage({ params }: { params: Promise<{ rentalId: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  
  const [rental, setRental] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    async function fetchRental() {
      const res = await localData.getRentalById(resolvedParams.rentalId);
      if (res.success && res.data) {
        setRental(res.data);
      }
      setLoading(false);
    }
    fetchRental();
  }, [resolvedParams.rentalId]);

  const handleReturn = async () => {
    if (!rental) return;
    setProcessing(true);
    const res = await localData.completeRental(rental.id);
    setProcessing(false);

    if (res.success) {
      router.push('/rentals/active');
    } else {
      alert("Failed to return rental: " + res.error);
    }
  };

  if (loading) {
    return <PageLoader text="Loading Return Details..." />;
  }

  if (!rental) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-transparent text-center p-6">
        <AlertCircle className="w-12 h-12 text-rose-500 mb-4" />
        <h2 className="text-xl font-bold text-slate-800 mb-2">Rental Not Found</h2>
        <button onClick={() => router.back()} className="px-5 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-full">Go Back</button>
      </div>
    );
  }

  const startDate = new Date(rental.startDate);
  const totalDays = Math.max(1, Math.ceil((new Date().getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
  const totalItems = rental.rentalItems.reduce((acc: number, item: any) => acc + item.quantity, 0);
  const totalAdvance = rental.payments.filter((p: any) => p.type === 'ADVANCE').reduce((acc: number, p: any) => acc + p.amount, 0);
  
  // Combine all items into a readable string and combined daily price
  const toolNames = rental.rentalItems.map((i: any) => {
    let base = `${i.tool.name} (x${i.quantity})`;
    const assigned = i.details?.filter((d:any) => d.toolItem?.itemNumber).map((d:any) => `#${d.toolItem.itemNumber}`);
    if (assigned && assigned.length > 0) {
      base += ` [${assigned.join(', ')}]`;
    }
    return base;
  }).join('  •  ');
  const combinedDailyPrice = rental.rentalItems.reduce((acc: number, item: any) => acc + (item.quantity * item.dailyPriceSnapshot), 0);

  return (
    <div className="min-h-[100dvh] bg-transparent flex flex-col">
      <Header 
        title="Return Tool" 
        subtitle="Complete rental and final payment" 
        showNotification={false} 
        onBack={() => router.back()}
      />

      <main className="flex-1 overflow-y-auto px-4 py-6 pb-32 space-y-6">
        
        {/* Customer Information */}
        <section>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3 pl-1">Customer</h2>
          <ProfileCard 
            name={rental.customer.name}
            mobile={rental.customer.mobile}
            village={rental.customer.village}
            photoUrl={rental.customer.photoUrl}
          />
        </section>

        {/* Tool Details Card */}
        <section>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3 pl-1">Rental Details</h2>
          <div className="bg-white/50 backdrop-blur-[20px] shadow-[0_8px_30px_rgba(0,0,0,0.06)] border-[1.5px] border-white/80 rounded-[1.5rem] p-5">
            
            <div className="flex items-start justify-between border-b border-slate-200/50 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[1.25rem] bg-violet-50 flex items-center justify-center text-violet-600 shrink-0">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm leading-tight">{toolNames}</h3>
                  <p className="text-sm font-medium text-slate-500 mt-0.5">Total Quantity: <span className="text-slate-900">{totalItems}</span></p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <Calendar className="w-3.5 h-3.5" /> Start
                </span>
                <span className="text-sm font-bold text-slate-900">{startDate.toLocaleDateString()}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5" /> End
                </span>
                <span className="text-sm font-bold text-slate-900">Today</span>
              </div>
            </div>

          </div>
        </section>

        {/* Billing Calculation */}
        <section>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3 pl-1">Cost Calculation</h2>
          <BillingSummary 
            dailyPrice={combinedDailyPrice}
            totalDays={totalDays}
            advancePaid={totalAdvance}
          />
          <p className="flex items-start gap-2 text-xs text-slate-500 font-medium mt-3 px-1">
            <AlertCircle className="w-4 h-4 text-slate-400 shrink-0" />
            Daily price shown is the combined total for all {totalItems} items (₹{combinedDailyPrice}/day).
          </p>
        </section>

      </main>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
        <div className="max-w-md mx-auto flex gap-3">
          <button 
            onClick={() => router.back()}
            disabled={processing}
            className="px-5 py-3.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-[1.25rem] text-center hover:bg-slate-50 transition-colors active:scale-95 disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleReturn}
            disabled={processing}
            className="flex-1 px-5 py-3.5 bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white font-bold rounded-[1.25rem] text-center shadow-[0_2px_12px_-2px_rgba(79,70,229,0.4)] hover:from-violet-700 hover:to-fuchsia-600 transition-all active:scale-[0.98] disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
          >
            {processing ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</> : "Mark as Returned"}
          </button>
        </div>
      </div>
    </div>
  );
}
