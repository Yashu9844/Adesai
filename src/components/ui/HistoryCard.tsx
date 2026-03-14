import { Calendar, Package, IndianRupee, CheckCircle2 } from "lucide-react";
import Image from "next/image";

interface HistoryCardProps {
  id: string;
  customerName: string;
  mobileNumber: string;
  customerPhotoUrl?: string;
  toolName: string;
  quantity: number;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalAmountPaid: number;
}

export function HistoryCard({
  customerName,
  mobileNumber,
  customerPhotoUrl,
  toolName,
  quantity,
  startDate,
  endDate,
  totalDays,
  totalAmountPaid,
}: HistoryCardProps) {
  return (
    <div className="bg-white/50 backdrop-blur-[20px] shadow-[0_8px_30px_rgba(0,0,0,0.06)] border-[1.5px] border-white/80 rounded-[1.5rem] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-200/50 flex flex-col gap-3 transition-opacity duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
      
      {/* Top Header: Customer Info & Status Badge */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-50">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
            {customerPhotoUrl ? (
              <Image src={customerPhotoUrl} alt={customerName} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-400 font-bold text-sm">
                {customerName.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <h3 className="text-sm font-bold text-slate-900 truncate">{customerName}</h3>
            <span className="text-[11px] text-slate-500 font-medium truncate">{mobileNumber}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1 bg-teal-50 text-teal-700 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide shrink-0">
          <CheckCircle2 className="w-3 h-3" />
          Returned
        </div>
      </div>

      {/* Middle Content: Item & Dates */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <div className="p-1.5 bg-violet-50 rounded-[1rem] text-violet-500 shrink-0">
            <Package className="w-4 h-4" />
          </div>
          <span className="truncate">{quantity}x {toolName}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 bg-slate-50/80 rounded-[1.25rem] p-2.5">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mb-0.5">Start Date</span>
            <span className="text-xs font-semibold text-slate-900">{startDate}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mb-0.5">End Date</span>
            <span className="text-xs font-semibold text-slate-900">{endDate}</span>
          </div>
        </div>
      </div>

      {/* Bottom Content: Duration & Payment */}
      <div className="flex items-center justify-between mt-1 pt-3 border-t border-dashed border-slate-200/50">
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <Calendar className="w-3.5 h-3.5" />
          {totalDays} {totalDays === 1 ? 'day' : 'days'}
        </div>
        
        <div className="flex items-center gap-1.5 text-sm font-bold text-violet-700 bg-violet-50/50 px-3 py-1.5 rounded-[1rem]">
          <IndianRupee className="w-4 h-4 text-violet-500" />
          {totalAmountPaid}
        </div>
      </div>

    </div>
  );
}
