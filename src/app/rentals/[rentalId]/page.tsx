"use client";

import { use, useEffect, useState } from "react";
import { Header } from "@/components/ui/Header";
import { ProfileCard } from "@/components/ui/ProfileCard";
import { Package, Calendar, Clock, AlertCircle, Loader2, IndianRupee, MapPin, Phone, Hash } from "lucide-react";
import { useRouter } from "next/navigation";
import { getRentalByIdAction } from "@/actions/rental.actions";
import { cn } from "@/lib/utils";

import { PageLoader } from "@/components/ui/PageLoader";

export default function RentalDetailsPage({ params }: { params: Promise<{ rentalId: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  
  const [rental, setRental] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRental() {
      const res = await getRentalByIdAction(resolvedParams.rentalId);
      if (res.success && res.data) {
        setRental(res.data);
      }
      setLoading(false);
    }
    fetchRental();
  }, [resolvedParams.rentalId]);

  if (loading) {
    return <PageLoader text="Loading Details..." />;
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
  const combinedDailyPrice = rental.rentalItems.reduce((acc: number, item: any) => acc + (item.quantity * item.dailyPriceSnapshot), 0);
  const currentCost = combinedDailyPrice * totalDays;
  const balance = Math.max(0, currentCost - totalAdvance);

  return (
    <div className="min-h-[100dvh] bg-transparent flex flex-col relative overflow-hidden">
      
      {/* Immersive Background Effects */}
      <div className="fixed inset-0 z-[-1] pointer-events-none">
        <div className="absolute top-[10%] right-[-10%] w-[300px] h-[300px] rounded-full bg-violet-400/20 blur-[80px]" />
        <div className="absolute bottom-[20%] left-[-20%] w-[400px] h-[400px] rounded-full bg-fuchsia-400/20 blur-[100px]" />
      </div>

      <Header 
        title="Rental Details" 
        subtitle={`ID: #${rental.id.slice(0, 8).toUpperCase()}`} 
        showNotification={false} 
        onBack={() => router.back()}
      />

      <main className="flex-1 overflow-y-auto px-4 py-6 pb-40 space-y-6">
        
        {/* Status Badge */}
        <div className="flex justify-center">
            <span className={cn(
                "px-5 py-2 font-bold text-sm tracking-wide uppercase rounded-full border shadow-sm",
                rental.status === "ACTIVE" ? "bg-amber-50 text-amber-600 border-amber-200" 
                : rental.status === "RETURNED" ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                : "bg-rose-50 text-rose-600 border-rose-200"
            )}>
              {rental.status} RENTAL
            </span>
        </div>

        {/* Customer Information */}
        <section>
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 pl-1">Customer Profile</h2>
          
          <div className="bg-white/60 backdrop-blur-2xl rounded-[1.5rem] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.06)] border border-white/80 flex flex-col gap-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500 opacity-50" />
            
            <div className="flex gap-4 items-center">
                {rental.customer.photoUrl ? (
                    <img src={rental.customer.photoUrl} alt={rental.customer.name} className="w-16 h-16 rounded-[1rem] object-cover shadow-sm bg-slate-100" />
                ) : (
                    <div className="w-16 h-16 rounded-[1rem] bg-gradient-to-br from-violet-100 to-fuchsia-100 flex items-center justify-center text-violet-600 shadow-inner">
                        <span className="text-xl font-extrabold">{rental.customer.name.charAt(0)}</span>
                    </div>
                )}
                <div>
                   <h3 className="font-extrabold text-lg text-slate-800 leading-tight">{rental.customer.name}</h3>
                   <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 mt-1">
                      <Phone className="w-3.5 h-3.5" /> {rental.customer.mobile}
                   </div>
                </div>
            </div>

            <div className="bg-slate-50/50 rounded-xl p-3 flex items-start gap-2 border border-slate-100">
                <MapPin className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
                <span className="text-sm font-semibold text-slate-700">{rental.customer.village || "No address provided."}</span>
            </div>
          </div>
        </section>

        {/* Tools Checked Out */}
        <section>
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 pl-1">Tools Rented</h2>
          <div className="bg-white/60 backdrop-blur-2xl rounded-[1.5rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white/80 overflow-hidden divide-y divide-slate-100">
            {rental.rentalItems.map((item: any) => {
               const assigned = item.details?.filter((d:any) => d.toolItem?.itemNumber).map((d:any) => d.toolItem.itemNumber);
               return (
                 <div key={item.id} className="p-4 flex justify-between items-start group hover:bg-white/40 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600 group-hover:scale-110 transition-transform shrink-0">
                        <Package className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <h4 className="font-bold text-slate-800 text-sm leading-tight">{item.tool.name}</h4>
                        <div className="text-[11px] font-semibold text-slate-400 mt-0.5">₹{item.dailyPriceSnapshot}/day</div>
                        {assigned && assigned.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {assigned.map((no: string) => (
                              <span key={no} className="text-[10px] font-bold text-violet-600 bg-violet-100/50 border border-violet-200 px-1.5 py-0.5 rounded">
                                #{no}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="bg-slate-100 px-3 py-1 rounded-lg shrink-0 mt-1">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">Qty</span>
                        <span className="text-sm font-extrabold text-slate-900">{item.quantity}</span>
                    </div>
                 </div>
               )
            })}
            
            <div className="p-4 bg-violet-50/50 flex justify-between items-center">
                <span className="text-sm font-bold text-violet-900">Combined Rate</span>
                <span className="text-sm font-extrabold text-violet-700">₹{combinedDailyPrice} / day</span>
            </div>
          </div>
        </section>

        {/* Timeline & Summary */}
        <section>
           <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 pl-1">Timeline & Cost Summary</h2>
           <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-white/60 backdrop-blur-lg p-4 rounded-[1.25rem] border border-white/60 shadow-sm flex flex-col justify-center items-center text-center">
                  <Calendar className="w-5 h-5 text-fuchsia-500 mb-2" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Start Date</span>
                  <span className="text-sm font-extrabold text-slate-800">{startDate.toLocaleDateString()}</span>
              </div>
              <div className="bg-white/60 backdrop-blur-lg p-4 rounded-[1.25rem] border border-white/60 shadow-sm flex flex-col justify-center items-center text-center">
                  <Clock className="w-5 h-5 text-emerald-500 mb-2" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Days Running</span>
                  <span className="text-sm font-extrabold text-slate-800">{totalDays} Days</span>
              </div>
           </div>

           <div className="bg-white/80 backdrop-blur-[20px] rounded-[1.5rem] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.06)] border-[1.5px] border-white flex flex-col gap-3">
              <div className="flex justify-between items-center text-sm">
                 <span className="font-semibold text-slate-500">Net Estimated Cost</span>
                 <span className="font-bold text-slate-900">₹{currentCost}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                 <span className="font-semibold text-emerald-600">Advance Paid</span>
                 <span className="font-bold text-emerald-600">-₹{totalAdvance}</span>
              </div>
              <div className="h-px bg-slate-200 border-dashed w-full my-1"></div>
              <div className="flex justify-between items-center">
                 <span className="font-extrabold text-slate-800">Current Balance</span>
                 <span className="font-extrabold text-rose-600 text-lg">₹{balance}</span>
              </div>
           </div>
        </section>

      </main>

      {/* Conditional Fixed Bottom Action Bar */}
      {rental.status === "ACTIVE" && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-2xl border-t border-slate-200 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-[0_-10px_30px_rgba(0,0,0,0.05)] z-50">
            <div className="max-w-md mx-auto flex gap-3">
            <button 
                onClick={() => router.push(`/return/${rental.id}`)}
                className="flex-1 px-5 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white font-bold rounded-[1.25rem] text-center shadow-[0_4px_20px_-2px_rgba(79,70,229,0.4)] hover:from-violet-700 hover:to-fuchsia-600 transition-all active:scale-[0.98]"
            >
                Proceed to Return Tool
            </button>
            </div>
        </div>
      )}
    </div>
  );
}
