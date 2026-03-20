import { Edit2, Eye, Package } from "lucide-react";
import Image from "next/image";

interface ToolCardProps {
  id: string;
  name: string;
  totalQuantity: number;
  availableQuantity: number;
  rentedQuantity: number;
  dailyPrice: number;
  imageUrl?: string;
  toolItems?: { id: string; itemNumber: string; status: string }[];
}

export function ToolCard({ 
  name, 
  totalQuantity, 
  availableQuantity, 
  rentedQuantity, 
  dailyPrice,
  imageUrl,
  toolItems = [],
}: ToolCardProps) {
  
  // Highlighting status for availability
  const isLowStock = availableQuantity > 0 && availableQuantity <= 3;
  const isOutOfStock = availableQuantity === 0;

  const availableItems = toolItems.filter(i => i.status === 'AVAILABLE');
  const rentedItems = toolItems.filter(i => i.status === 'RENTED');
  
  return (
    <div className="bg-white/50 backdrop-blur-[20px] shadow-[0_8px_30px_rgba(0,0,0,0.06)] border-[1.5px] border-white/80 rounded-[1.5rem] overflow-hidden shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] border border-slate-200/50 flex flex-col group hover:border-violet-100 transition-all duration-300">
      
      {/* Top Banner section with soft color overlay logic if image is missing */}
      <div className="relative aspect-square w-full bg-gradient-to-tr from-slate-100 to-slate-50 flex items-center justify-center border-b border-slate-100">
        {imageUrl ? (
          <Image src={imageUrl} alt={name} fill className="object-cover" />
        ) : (
          <Package className="w-12 h-12 text-violet-200" />
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold tracking-wide shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex items-center gap-1.5">
          {isOutOfStock ? (
            <><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span><span className="text-red-600">Out of Stock</span></>
          ) : isLowStock ? (
            <><span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span><span className="text-rose-600">Low Stock</span></>
          ) : (
             <><span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span><span className="text-teal-600">Available</span></>
          )}
        </div>
        
        {/* Price Badge */}
        <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-[1rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
          ₹{dailyPrice} / day
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-slate-900 leading-tight mb-4">{name}</h3>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 mb-5 pb-4 border-b border-slate-50">
          <div className="flex flex-col items-center justify-center bg-slate-50 rounded-[1rem] p-2">
            <span className="text-xs text-slate-500 font-medium mb-0.5">Total</span>
            <span className="text-sm font-bold text-slate-900">{totalQuantity}</span>
          </div>
          <div className="flex flex-col items-center justify-center bg-teal-50/50 rounded-[1rem] p-2">
            <span className="text-xs text-teal-600 font-medium mb-0.5">Avail</span>
            <span className="text-sm font-bold text-teal-700">{availableQuantity}</span>
          </div>
          <div className="flex flex-col items-center justify-center bg-rose-50/50 rounded-[1rem] p-2">
            <span className="text-xs text-rose-600 font-medium mb-0.5">Rented</span>
            <span className="text-sm font-bold text-rose-700">{rentedQuantity}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-auto mb-4">
          <button className="flex items-center justify-center gap-2 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-semibold rounded-[1.25rem] transition-colors active:scale-95">
            <Eye className="w-4 h-4" /> View
          </button>
          <button className="flex items-center justify-center gap-2 py-2.5 bg-violet-50 hover:bg-violet-100 text-violet-700 text-sm font-semibold rounded-[1.25rem] transition-colors active:scale-95">
            <Edit2 className="w-4 h-4" /> Edit
          </button>
        </div>

        {/* Detailed Item Tracking List */}
        {toolItems.length > 0 && (
          <div className="border-t border-slate-100 pt-3">
             <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Available Serials ({availableItems.length})</div>
             <div className="flex flex-wrap gap-1.5 mb-3 max-h-[80px] overflow-y-auto pr-1 custom-scrollbar">
                {availableItems.length > 0 ? availableItems.map(item => (
                   <span key={item.id} className="text-[10px] font-bold bg-teal-50 text-teal-700 px-2 py-1 rounded-md border border-teal-100">
                     {item.itemNumber}
                   </span>
                )) : <span className="text-xs text-slate-400">None</span>}
             </div>
             
             <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Rented Out ({rentedItems.length})</div>
             <div className="flex flex-wrap gap-1.5 max-h-[80px] overflow-y-auto pr-1 custom-scrollbar">
                {rentedItems.length > 0 ? rentedItems.map(item => (
                   <span key={item.id} className="text-[10px] font-bold bg-rose-50 text-rose-700 px-2 py-1 rounded-md border border-rose-100 opacity-60">
                     {item.itemNumber}
                   </span>
                )) : <span className="text-xs text-slate-400">None</span>}
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
