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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      
      <div className="p-5 flex flex-col gap-3.5">
        <div className="flex justify-between items-center text-sm font-medium">
          <span className="text-gray-500">Daily Price</span>
          <span className="text-gray-900">₹{dailyPrice}</span>
        </div>
        
        <div className="flex justify-between items-center text-sm font-medium">
          <span className="text-gray-500">Total Days</span>
          <span className="text-gray-900">{totalDays} {totalDays === 1 ? 'day' : 'days'}</span>
        </div>
        
        <div className="my-1 h-px w-full bg-gray-100 border-dashed border-t border-gray-200" />
        
        <div className="flex justify-between items-center font-semibold">
          <span className="text-gray-700">Total Amount</span>
          <span className="text-gray-900">₹{totalAmount}</span>
        </div>
        
        <div className="flex justify-between items-center text-sm font-medium">
          <span className="text-gray-500">Advance Paid</span>
          <span className="text-emerald-600">- ₹{advancePaid}</span>
        </div>
      </div>

      <div className={cn(
        "p-5 flex items-center justify-between border-t border-indigo-100", 
        balanceDue === 0 ? "bg-emerald-50" : "bg-indigo-50"
      )}>
        <div className="flex flex-col">
          <span className={cn(
            "text-xs font-bold uppercase tracking-widest",
             balanceDue === 0 ? "text-emerald-600" : "text-indigo-600"
          )}>
            {isRefund ? "Refund Due" : balanceDue === 0 ? "Fully Settled" : "Balance Due"}
          </span>
          <span className={cn(
            "text-3xl font-extrabold tracking-tight mt-0.5",
            balanceDue === 0 ? "text-emerald-700" : "text-indigo-900"
          )}>
            ₹{displayBalance}
          </span>
        </div>
      </div>

    </div>
  );
}
