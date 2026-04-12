"use client";

import { useState } from "react";
import { Header } from "@/components/ui/Header";
import { FormInput } from "@/components/ui/FormInput";
import { PhotoUpload } from "@/components/ui/PhotoUpload";
import { 
  Package, 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  Clock, 
  IndianRupee,
  ChevronDown
} from "lucide-react";
import Link from "next/link";

// Mock Tool Data for the selector (Note: Real data should come from DB in production)
const TOOLS = [
  { id: "1", name: "Iron Mesh (Jali - Heavy)", price: 20 },
  { id: "2", name: "Support Stand (Adjustable)", price: 15 },
  { id: "3", name: "Compactor (Dimsa 5HP)", price: 150 },
  { id: "4", name: "Concrete Mixer (1/2 Bag)", price: 500 },
];

export default function CreateRentalPage() {
  const [selectedTool, setSelectedTool] = useState("");
  const [quantity, setQuantity] = useState("1");
  
  // To format today's date nicely for the default input value
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-[100dvh] bg-transparent flex flex-col">
      <Header title="Give Tool" subtitle="Create a new rental entry" showNotification={false} />

      <main className="flex-1 overflow-y-auto px-4 py-6 pb-32">
        <form className="space-y-6 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
          
          {/* Section 1: Tool Selection */}
          <section className="bg-white p-5 rounded-[1.5rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-200/50 flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 bg-violet-50 rounded-[1rem] text-violet-600">
                <Package className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Select Tool</h2>
            </div>
            
            <div className="w-full flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Tool Name</label>
              <div className="relative">
                <select 
                  className="flex w-full appearance-none rounded-[1.25rem] border border-slate-200 bg-white px-4 py-3.5 text-sm transition-all shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] focus-visible:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent"
                  value={selectedTool}
                  onChange={(e) => setSelectedTool(e.target.value)}
                  required
                >
                  <option value="" disabled>Choose a tool...</option>
                  {TOOLS.map(tool => (
                    <option key={tool.id} value={tool.id}>{tool.name} - ₹{tool.price}/day</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                  <ChevronDown className="w-5 h-5" />
                </div>
              </div>
            </div>

            <FormInput 
              label="Quantity" 
              type="number" 
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="e.g. 5"
              icon={<Package className="w-5 h-5" />}
              required
            />
          </section>

          {/* Section 2: Customer Information */}
          <section className="bg-white p-5 rounded-[1.5rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-200/50 flex flex-col gap-5">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 bg-rose-50 rounded-[1rem] text-rose-500">
                <User className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Customer Details</h2>
            </div>

            <PhotoUpload label="Customer Photo" />

            <FormInput 
              label="Full Name" 
              placeholder="Enter customer name" 
              icon={<User className="w-5 h-5" />}
              required
            />
            
            <FormInput 
              label="Mobile Number" 
              type="tel"
              placeholder="Enter 10-digit number" 
              icon={<Phone className="w-5 h-5" />}
              required
            />

            <FormInput 
              label="Village / Address" 
              placeholder="Enter village name" 
              icon={<MapPin className="w-5 h-5" />}
              required
            />
          </section>

          {/* Section 3: Rental Terms */}
          <section className="bg-white p-5 rounded-[1.5rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-200/50 flex flex-col gap-5">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 bg-teal-50 rounded-[1rem] text-teal-500">
                <Calendar className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Rental Terms</h2>
            </div>

            <FormInput 
              label="Start Date" 
              type="date"
              defaultValue={today}
              icon={<Calendar className="w-5 h-5" />}
              required
            />

            <FormInput 
              label="Expected Return (Days)" 
              type="number"
              min="1"
              placeholder="e.g. 2 days (Optional)" 
              icon={<Clock className="w-5 h-5" />}
            />

            <FormInput 
              label="Advance Payment (₹)" 
              type="number"
              min="0"
              placeholder="e.g. 500" 
              icon={<IndianRupee className="w-5 h-5" />}
            />
          </section>

        </form>
      </main>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
        <div className="max-w-md mx-auto flex gap-3">
          <Link 
            href="/dashboard"
            className="px-5 py-3.5 bg-slate-50 text-slate-700 font-semibold rounded-[1.25rem] text-center hover:bg-slate-100 transition-colors active:scale-95"
          >
            Cancel
          </Link>
          <button 
            type="submit"
            className="flex-1 px-5 py-3.5 bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white font-semibold rounded-[1.25rem] text-center shadow-lg shadow-violet-600/25 hover:from-violet-700 hover:to-fuchsia-600 transition-all active:scale-[0.98]"
          >
            Create Rental
          </button>
        </div>
      </div>
    </div>
  );
}
