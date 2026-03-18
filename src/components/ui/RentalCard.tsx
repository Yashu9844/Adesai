import { Calendar, Clock, Package, Phone, User, CheckCircle2 } from "lucide-react";
import Image from "next/image";

interface RentalCardProps {
  id: string;
  customerName: string;
  mobileNumber: string;
  village: string;
  customerPhotoUrl?: string;
  toolName: string;
  quantity: number;
  startDate: string;
  daysRunning: number;
  estimatedCost: number;
  assignedItems?: string[];
  onReturn?: (id: string) => void;
  onViewDetails?: (id: string) => void;
}

export function RentalCard({
  id,
  customerName,
  mobileNumber,
  village,
  customerPhotoUrl,
  toolName,
  quantity,
  startDate,
  daysRunning,
  estimatedCost,
  assignedItems,
  onReturn,
  onViewDetails,
}: RentalCardProps) {
  return (
    <div className="bg-white/50 backdrop-blur-[20px] shadow-[0_8px_30px_rgba(0,0,0,0.06)] border-[1.5px] border-white/80 rounded-[1.5rem] p-5 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] border border-slate-200/50 flex flex-col gap-4 transition-all duration-300 hover:border-violet-100">
      
      {/* Top Header: Customer Info */}
      <div className="flex items-start gap-4 pb-4 border-b border-slate-50">
        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
          {customerPhotoUrl ? (
            <Image src={customerPhotoUrl} alt={customerName} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-100 to-violet-50">
              <User className="w-6 h-6 text-violet-400" />
            </div>
          )}
        </div>
        
        <div className="flex flex-col flex-1 min-w-0">
          <h3 className="text-base font-bold text-slate-900 truncate">{customerName}</h3>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5">
            <span className="flex items-center gap-1 text-xs text-slate-500 font-medium whitespace-nowrap">
              <Phone className="w-3.5 h-3.5" />
              {mobileNumber}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-500 font-medium whitespace-nowrap">
              <span className="w-1 h-1 bg-slate-300 rounded-full" />
              {village}
            </span>
          </div>
        </div>
      </div>

      {/* Middle Content: Tool & Rental Stats */}
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Package className="w-4 h-4 text-violet-500" />
              {quantity}x {toolName}
            </div>
            {assignedItems && assignedItems.length > 0 && (
              <div className="flex flex-wrap gap-1 pr-2">
                {assignedItems.map(no => (
                  <span key={no} className="text-[9px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">
                    {no}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="text-sm font-bold text-violet-600 bg-violet-50 px-2.5 py-1 rounded-[1rem] whitespace-nowrap">
            ₹{estimatedCost}
          </div>
        </div>

        <div className="flex items-center justify-between mt-1 bg-slate-50 rounded-[1.25rem] p-3">
          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <Calendar className="w-3.5 h-3.5" /> Started
            </span>
            <span className="text-sm font-semibold text-slate-900 ml-5">{startDate}</span>
          </div>
          
          <div className="h-8 w-px bg-slate-200" />
          
          <div className="flex flex-col gap-1 items-end">
            <span className="flex items-center gap-1.5 text-xs font-medium text-rose-600">
              <Clock className="w-3.5 h-3.5" /> Running
            </span>
            <span className="text-sm font-bold text-slate-900">{daysRunning} {daysRunning === 1 ? 'day' : 'days'}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 mt-1 pt-1">
        <button 
          onClick={() => onViewDetails?.(id)}
          className="flex-1 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-[1.25rem] hover:bg-slate-50 transition-colors active:scale-[0.98]"
        >
          View Details
        </button>
        <button 
          onClick={() => onReturn?.(id)}
          className="flex items-center justify-center gap-1.5 flex-[1.5] py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-fuchsia-500 rounded-[1.25rem] shadow-[0_2px_10px_-2px_rgba(79,70,229,0.3)] hover:from-violet-700 hover:to-fuchsia-600 transition-all active:scale-[0.98]"
        >
          <CheckCircle2 className="w-4 h-4" /> Return Tool
        </button>
      </div>

    </div>
  );
}
