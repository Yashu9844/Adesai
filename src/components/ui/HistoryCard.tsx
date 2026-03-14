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
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col gap-3 transition-opacity duration-300 hover:shadow-md">
      
      {/* Top Header: Customer Info & Status Badge */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-50">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
            {customerPhotoUrl ? (
              <Image src={customerPhotoUrl} alt={customerName} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400 font-bold text-sm">
                {customerName.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <h3 className="text-sm font-bold text-gray-900 truncate">{customerName}</h3>
            <span className="text-[11px] text-gray-500 font-medium truncate">{mobileNumber}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide shrink-0">
          <CheckCircle2 className="w-3 h-3" />
          Returned
        </div>
      </div>

      {/* Middle Content: Item & Dates */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
          <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-500 shrink-0">
            <Package className="w-4 h-4" />
          </div>
          <span className="truncate">{quantity}x {toolName}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 bg-gray-50/80 rounded-xl p-2.5">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mb-0.5">Start Date</span>
            <span className="text-xs font-semibold text-gray-900">{startDate}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mb-0.5">End Date</span>
            <span className="text-xs font-semibold text-gray-900">{endDate}</span>
          </div>
        </div>
      </div>

      {/* Bottom Content: Duration & Payment */}
      <div className="flex items-center justify-between mt-1 pt-3 border-t border-dashed border-gray-100">
        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
          <Calendar className="w-3.5 h-3.5" />
          {totalDays} {totalDays === 1 ? 'day' : 'days'}
        </div>
        
        <div className="flex items-center gap-1.5 text-sm font-bold text-indigo-700 bg-indigo-50/50 px-3 py-1.5 rounded-lg">
          <IndianRupee className="w-4 h-4 text-indigo-500" />
          {totalAmountPaid}
        </div>
      </div>

    </div>
  );
}
