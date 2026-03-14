import { cn } from "@/lib/utils";

interface BillingSummaryProps {
  dailyPrice: number;
  totalDays: number;
  advancePaid: number;
}

export function BillingSummary({ dailyPrice, totalDays, advancePaid }: BillingSummaryProps) {
  const totalAmount = dailyPrice * totalDays;
  const balanceDue = totalAmount - advancePaid;
  
  // Security check: if balance is negative, it means shop owes customer refund
  const isRefund = balanceDue < 0;
  const displayBalance = Math.abs(balanceDue);

  return (
    <div className="bg-white/50 backdrop-blur-[20px] shadow-[0_8px_30px_rgba(0,0,0,0.06)] border-[1.5px] border-white/80 rounded-[1.5rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-200/50 overflow-hidden">
      
      <div className="p-5 flex flex-col gap-3.5">
        <div className="flex justify-between items-center text-sm font-medium">
          <span className="text-slate-500">Daily Price</span>
          <span className="text-slate-900">₹{dailyPrice}</span>
        </div>
        
        <div className="flex justify-between items-center text-sm font-medium">
          <span className="text-slate-500">Total Days</span>
          <span className="text-slate-900">{totalDays} {totalDays === 1 ? 'day' : 'days'}</span>
        </div>
        
        <div className="my-1 h-px w-full bg-slate-100 border-dashed border-t border-slate-200" />
        
        <div className="flex justify-between items-center font-semibold">
          <span className="text-slate-700">Total Amount</span>
          <span className="text-slate-900">₹{totalAmount}</span>
        </div>
        
        <div className="flex justify-between items-center text-sm font-medium">
          <span className="text-slate-500">Advance Paid</span>
          <span className="text-teal-600">- ₹{advancePaid}</span>
        </div>
      </div>

      <div className={cn(
        "p-5 flex items-center justify-between border-t border-violet-100", 
        balanceDue === 0 ? "bg-teal-50" : "bg-violet-50"
      )}>
        <div className="flex flex-col">
          <span className={cn(
            "text-xs font-bold uppercase tracking-widest",
             balanceDue === 0 ? "text-teal-600" : "text-violet-600"
          )}>
            {isRefund ? "Refund Due" : balanceDue === 0 ? "Fully Settled" : "Balance Due"}
          </span>
          <span className={cn(
            "text-3xl font-extrabold tracking-tight mt-0.5",
            balanceDue === 0 ? "text-teal-700" : "text-violet-900"
          )}>
            ₹{displayBalance}
          </span>
        </div>
      </div>

    </div>
  );
}
