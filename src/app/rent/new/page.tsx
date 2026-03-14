"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Package, User, Calendar, IndianRupee, 
  ArrowRight, Phone, MapPin, Search, ChevronLeft, Check
} from "lucide-react";
import { cn } from "@/lib/utils";

const TOOLS = [
  { id: "1", name: "Iron Mesh", desc: "Jali - Heavy", price: 20 },
  { id: "2", name: "Support Stand", desc: "Adjustable", price: 15 },
  { id: "3", name: "Compactor", desc: "Dimsa 5HP", price: 150 },
  { id: "4", name: "Mixer", desc: "Concrete 1/2 Bag", price: 500 },
];

export default function PremiumRentPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [mounted, setMounted] = useState(false);
  
  // Form State
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [qty, setQty] = useState("1");
  const [focusInput, setFocusInput] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-transparent flex flex-col relative overflow-hidden text-slate-800 pb-32">
      
      {/* Immersive Background Effects specific to this flow */}
      <div className="fixed inset-0 z-[-1] pointer-events-none">
        <div className="absolute top-[10%] right-[-10%] w-[300px] h-[300px] rounded-full bg-fuchsia-400/20 blur-[80px] animate-pulse" />
        <div className="absolute bottom-[20%] left-[-20%] w-[400px] h-[400px] rounded-full bg-violet-400/20 blur-[100px]" />
      </div>

      {/* Floating Header */}
      <header className="fixed top-0 w-full z-50 px-6 py-5 flex items-center justify-between bg-white/30 backdrop-blur-2xl border-b border-white/40 shadow-sm">
        <button 
          onClick={() => step === 1 ? router.back() : setStep(step - 1)}
          className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center text-slate-700 hover:bg-white transition-all shadow-sm ring-1 ring-slate-900/5 active:scale-95"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-violet-600 mb-0.5">Step {step} of 3</span>
          <h1 className="text-lg font-bold text-slate-800 tracking-tight leading-none">
            {step === 1 ? "Select Tool" : step === 2 ? "Customer Info" : "Checkout"}
          </h1>
        </div>
        <div className="w-10 h-10" /> {/* Spacer */}
      </header>

      {/* Main Form Area container */}
      <main className="flex-1 mt-[100px] px-5 flex flex-col gap-6 w-full max-w-md mx-auto">
        
        {/* Step 1: Tool Selection (Visual Horizon Scrolling Cards) */}
        <div className={cn("transition-all duration-500 ease-out transform", step === 1 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full absolute pointer-events-none")}>
          <p className="text-slate-500 font-medium text-sm mb-4 px-1">Choose the equipment the customer wants to rent.</p>
          
          <div className="grid grid-cols-2 gap-4">
            {TOOLS.map((tool) => {
              const isActive = selectedTool === tool.id;
              return (
                <button
                  key={tool.id}
                  onClick={() => setSelectedTool(tool.id)}
                  className={cn(
                    "relative text-left p-5 rounded-[1.5rem] transition-all duration-300 ease-out flex flex-col gap-3 group overflow-hidden outline-none",
                    isActive 
                      ? "bg-violet-600 shadow-[0_12px_30px_rgba(124,58,237,0.3)] scale-[1.02] ring-2 ring-violet-400 ring-offset-2 ring-offset-[#fdfdff]" 
                      : "bg-white/60 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:bg-white active:scale-95"
                  )}
                >
                  {/* Background decoration for active */}
                  {isActive && <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full blur-xl" />}
                  
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors shadow-inner",
                    isActive ? "bg-white/20 text-white" : "bg-violet-50 text-violet-600 group-hover:bg-violet-100"
                  )}>
                    <Package className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  
                  <div className="flex flex-col z-10">
                    <span className={cn("text-xs font-bold uppercase tracking-wider mb-1", isActive ? "text-violet-200" : "text-slate-400")}>{tool.desc}</span>
                    <h3 className={cn("text-lg font-extrabold tracking-tight leading-none mb-2", isActive ? "text-white" : "text-slate-800")}>{tool.name}</h3>
                    <div className={cn("inline-flex items-center text-sm font-bold mt-auto", isActive ? "text-fuchsia-200" : "text-fuchsia-600")}>
                      ₹{tool.price} <span className="text-[10px] font-medium ml-1 opacity-80 uppercase tracking-widest">/ day</span>
                    </div>
                  </div>

                  {/* Check indicator */}
                  <div className={cn(
                    "absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 transform",
                    isActive ? "bg-white/20 scale-100 opacity-100" : "scale-50 opacity-0"
                  )}>
                    <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-8 bg-white/50 backdrop-blur-xl rounded-[1.5rem] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white/60 flex items-center justify-between">
            <span className="font-bold text-slate-700">Quantity</span>
            <div className="flex items-center gap-4 bg-white rounded-xl p-1 shadow-sm border border-slate-100">
              <button 
                onClick={() => setQty(String(Math.max(1, parseInt(qty) - 1)))}
                className="w-10 h-10 rounded-lg bg-slate-50 text-slate-600 hover:bg-slate-100 flex items-center justify-center text-lg font-bold"
              >-</button>
              <span className="text-lg font-bold w-6 text-center text-violet-600">{qty}</span>
              <button 
                onClick={() => setQty(String(parseInt(qty) + 1))}
                className="w-10 h-10 rounded-lg bg-slate-50 text-slate-600 hover:bg-slate-100 flex items-center justify-center text-lg font-bold"
              >+</button>
            </div>
          </div>
        </div>

        {/* Step 2: Customer Input (Minimalist Floating Inputs) */}
        <div className={cn("transition-all duration-500 ease-out transform", step === 2 ? "opacity-100 translate-x-0" : step < 2 ? "opacity-0 translate-x-full absolute pointer-events-none" : "opacity-0 -translate-x-full absolute pointer-events-none")}>
          <div className="bg-white/60 backdrop-blur-[20px] rounded-[2rem] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.06)] border border-white/80 flex flex-col gap-6 relative overflow-hidden">
             
             {/* Decorative top blur */}
             <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-rose-500 opacity-50" />

             <CustomInput 
               icon={<User className="w-5 h-5" />} 
               label="Customer Name" 
               placeholder="e.g. Ramesh Kumar"
               isFocused={focusInput === 'name'}
               onFocus={() => setFocusInput('name')}
               onBlur={() => setFocusInput(null)}
             />
             
             <CustomInput 
               icon={<Phone className="w-5 h-5" />} 
               label="Mobile Number" 
               type="tel"
               placeholder="10-digit number"
               isFocused={focusInput === 'phone'}
               onFocus={() => setFocusInput('phone')}
               onBlur={() => setFocusInput(null)}
             />

             <CustomInput 
               icon={<MapPin className="w-5 h-5" />} 
               label="Village / Address" 
               placeholder="e.g. Ramnagar"
               isFocused={focusInput === 'location'}
               onFocus={() => setFocusInput('location')}
               onBlur={() => setFocusInput(null)}
             />
          </div>
          
          <div className="mt-4 text-center">
            <button className="text-sm font-bold text-violet-600 bg-violet-50 px-5 py-2.5 rounded-full hover:bg-violet-100 transition-colors">
              + Add Customer Photo (Optional)
            </button>
          </div>
        </div>

        {/* Step 3: Checkout (Beautiful Receipt View) */}
        <div className={cn("transition-all duration-500 ease-out transform", step === 3 ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full absolute pointer-events-none")}>
           <div className="relative bg-white/70 backdrop-blur-[2xl] rounded-[2rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-white">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 border-[3px] border-[#fdfdff]">
                <Check className="w-6 h-6 text-white" strokeWidth={3} />
              </div>
              
              <div className="mt-8 text-center border-b border-dashed border-slate-200 pb-6 mb-6">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1 block">Total Daily Rent</span>
                <div className="text-4xl font-extrabold text-slate-800 tracking-tighter">
                  ₹{selectedTool ? TOOLS.find(t=>t.id===selectedTool)?.price! * parseInt(qty) : 0}
                </div>
                <span className="text-sm font-semibold text-emerald-600 mt-2 block bg-emerald-50 w-max mx-auto px-3 py-1 rounded-full">
                  No advance required
                </span>
              </div>

              <div className="flex flex-col gap-4">
                 <div className="flex justify-between items-center text-sm font-semibold">
                   <span className="text-slate-500 flex items-center gap-2"><Package className="w-4 h-4" /> Item</span>
                   <span className="text-slate-900">{qty}x {selectedTool ? TOOLS.find(t=>t.id===selectedTool)?.name : ''}</span>
                 </div>
                 <div className="flex justify-between items-center text-sm font-semibold">
                   <span className="text-slate-500 flex items-center gap-2"><User className="w-4 h-4" /> Customer</span>
                   <span className="text-slate-900">New Walk-in</span>
                 </div>
                 <div className="flex justify-between items-center text-sm font-semibold">
                   <span className="text-slate-500 flex items-center gap-2"><Calendar className="w-4 h-4" /> Start Date</span>
                   <span className="text-slate-900">Today</span>
                 </div>
              </div>
           </div>
        </div>
      </main>

      {/* Floating Action Bar */}
      <div className="fixed bottom-6 left-0 right-0 px-6 z-50">
        <button 
          onClick={step === 3 ? () => router.push('/rentals/active') : handleNext}
          disabled={step === 1 && !selectedTool}
          className={cn(
            "w-full h-[60px] rounded-full flex items-center justify-center gap-2 text-lg font-bold text-white shadow-[0_8px_30px_rgba(124,58,237,0.4)] transition-all duration-300 transform",
             (!selectedTool && step === 1) 
               ? "bg-slate-300 shadow-none scale-100 opacity-60 cursor-not-allowed" 
               : "bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-700 hover:to-fuchsia-600 active:scale-[0.98] hover:shadow-[0_12px_40px_rgba(124,58,237,0.5)]"
          )}
        >
          {step === 3 ? "Confirm Rental" : "Continue"} 
          {step < 3 && <ArrowRight className="w-5 h-5 ml-1" />}
        </button>
      </div>

    </div>
  );
}

// Custom animated input component
function CustomInput({ icon, label, type="text", placeholder, isFocused, onFocus, onBlur }: any) {
  return (
    <div className="relative group">
      <label className={cn(
        "absolute left-12 transition-all duration-200 font-bold",
        isFocused ? "-top-2 text-[10px] text-violet-600 uppercase tracking-widest bg-white/80 backdrop-blur px-2 rounded-full" : "top-3.5 text-sm text-slate-500 pointer-events-none"
      )}>
        {label}
      </label>
      <div className="flex items-center">
        <div className={cn("w-12 flex justify-center transition-colors duration-200", isFocused ? "text-violet-600" : "text-slate-400")}>
          {icon}
        </div>
        <input 
          type={type}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={isFocused ? placeholder : ""}
          className="w-full bg-transparent border-b-2 border-slate-200 py-3.5 pl-0 pr-4 text-slate-800 font-semibold focus:outline-none focus:border-violet-500 transition-colors placeholder:text-slate-300 placeholder:font-medium"
        />
      </div>
    </div>
  );
}
