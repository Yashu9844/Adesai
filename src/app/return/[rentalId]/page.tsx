"use client";

import { use } from "react";
import { Header } from "@/components/ui/Header";
import { ProfileCard } from "@/components/ui/ProfileCard";
import { BillingSummary } from "@/components/ui/BillingSummary";
import { Package, Calendar, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Mock Data for a single rental return
const MOCK_RENTAL = {
  id: "r1",
  customer: {
    name: "Ramesh Kumar",
    mobile: "9876543210",
    village: "Ramnagar",
    photoUrl: undefined, 
  },
  tool: {
    name: "Jali (Iron Mesh)",
    quantity: 15,
    dailyPrice: 20,
  },
  rental: {
    startDate: "12 Oct 2026",
    endDate: "15 Oct 2026", // Simulated "Today"
    totalDays: 3,
    advancePaid: 500,
  }
};

export default function ReturnToolPage({ params }: { params: Promise<{ rentalId: string }> }) {
  const router = useRouter();
  // Using React.use to unwrap params per Next.js 15+ routing conventions if needed, 
  // though we mock the UI data regardless of the ID for now.
  const resolvedParams = use(params);

  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      <Header 
        title="Return Tool" 
        subtitle="Complete rental and final payment" 
        showNotification={false} 
      />

      <main className="flex-1 overflow-y-auto px-4 py-6 pb-32 space-y-6">
        
        {/* Customer Information */}
        <section>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3 pl-1">Customer</h2>
          <ProfileCard 
            name={MOCK_RENTAL.customer.name}
            mobile={MOCK_RENTAL.customer.mobile}
            village={MOCK_RENTAL.customer.village}
            photoUrl={MOCK_RENTAL.customer.photoUrl}
          />
        </section>

        {/* Tool Details Card */}
        <section>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3 pl-1">Rental Details</h2>
          <div className="bg-white/50 backdrop-blur-[20px] shadow-[0_8px_30px_rgba(0,0,0,0.06)] border-[1.5px] border-white/80 rounded-[1.5rem] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-200/50 flex flex-col gap-4">
            
            <div className="flex items-start justify-between border-b border-slate-50 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[1.25rem] bg-violet-50 flex items-center justify-center text-violet-600">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{MOCK_RENTAL.tool.name}</h3>
                  <p className="text-sm font-medium text-slate-500 mt-0.5">Quantity: <span className="text-slate-900">{MOCK_RENTAL.tool.quantity}</span></p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <Calendar className="w-3.5 h-3.5" /> Start
                </span>
                <span className="text-sm font-bold text-slate-900">{MOCK_RENTAL.rental.startDate}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5" /> End
                </span>
                <span className="text-sm font-bold text-slate-900">{MOCK_RENTAL.rental.endDate}</span>
              </div>
            </div>

          </div>
        </section>

        {/* Billing Calculation */}
        <section>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3 pl-1">Cost Calculation</h2>
          <BillingSummary 
            dailyPrice={MOCK_RENTAL.tool.dailyPrice * MOCK_RENTAL.tool.quantity} // Total daily value of all items combined
            totalDays={MOCK_RENTAL.rental.totalDays}
            advancePaid={MOCK_RENTAL.rental.advancePaid}
          />
          <p className="flex items-start gap-2 text-xs text-slate-500 font-medium mt-3 px-1">
            <AlertCircle className="w-4 h-4 text-slate-400 shrink-0" />
            Daily price shown is the combined total for all {MOCK_RENTAL.tool.quantity} items (₹{MOCK_RENTAL.tool.dailyPrice} each/day).
          </p>
        </section>

      </main>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
        <div className="max-w-md mx-auto flex gap-3">
          <button 
            onClick={() => router.back()}
            className="px-5 py-3.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-[1.25rem] text-center hover:bg-slate-50 transition-colors active:scale-95"
          >
            Cancel
          </button>
          <button 
            className="flex-1 px-5 py-3.5 bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white font-bold rounded-[1.25rem] text-center shadow-[0_2px_12px_-2px_rgba(79,70,229,0.4)] hover:from-violet-700 hover:to-fuchsia-600 transition-all active:scale-[0.98]"
          >
            Mark as Returned
          </button>
        </div>
      </div>
    </div>
  );
}
