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
}

export function ToolCard({ 
  name, 
  totalQuantity, 
  availableQuantity, 
  rentedQuantity, 
  dailyPrice,
  imageUrl 
}: ToolCardProps) {
  
  // Highlighting status for availability
  const isLowStock = availableQuantity > 0 && availableQuantity <= 3;
  const isOutOfStock = availableQuantity === 0;
  
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] border border-gray-100 flex flex-col group hover:border-indigo-100 transition-all duration-300">
      
      {/* Top Banner section with soft color overlay logic if image is missing */}
      <div className="relative h-32 w-full bg-gradient-to-tr from-gray-100 to-gray-50 flex items-center justify-center">
        {imageUrl ? (
          <Image src={imageUrl} alt={name} fill className="object-cover" />
        ) : (
          <Package className="w-12 h-12 text-indigo-200" />
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold tracking-wide shadow-sm flex items-center gap-1.5">
          {isOutOfStock ? (
            <><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span><span className="text-red-600">Out of Stock</span></>
          ) : isLowStock ? (
            <><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span><span className="text-amber-600">Low Stock</span></>
          ) : (
             <><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span><span className="text-emerald-600">Available</span></>
          )}
        </div>
        
        {/* Price Badge */}
        <div className="absolute bottom-3 right-3 bg-gray-900/80 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-lg shadow-sm">
          ₹{dailyPrice} / day
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-gray-900 leading-tight mb-4">{name}</h3>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 mb-5 pb-4 border-b border-gray-50">
          <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-2">
            <span className="text-xs text-gray-500 font-medium mb-0.5">Total</span>
            <span className="text-sm font-bold text-gray-900">{totalQuantity}</span>
          </div>
          <div className="flex flex-col items-center justify-center bg-emerald-50/50 rounded-lg p-2">
            <span className="text-xs text-emerald-600 font-medium mb-0.5">Avail</span>
            <span className="text-sm font-bold text-emerald-700">{availableQuantity}</span>
          </div>
          <div className="flex flex-col items-center justify-center bg-amber-50/50 rounded-lg p-2">
            <span className="text-xs text-amber-600 font-medium mb-0.5">Rented</span>
            <span className="text-sm font-bold text-amber-700">{rentedQuantity}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-auto">
          <button className="flex items-center justify-center gap-2 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl transition-colors active:scale-95">
            <Eye className="w-4 h-4" /> View
          </button>
          <button className="flex items-center justify-center gap-2 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-sm font-semibold rounded-xl transition-colors active:scale-95">
            <Edit2 className="w-4 h-4" /> Edit
          </button>
        </div>
      </div>
    </div>
  );
}
