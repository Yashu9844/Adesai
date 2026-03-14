import { Bell, Search } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  showNotification?: boolean;
}

export function Header({ title, subtitle, showNotification = true }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-xl border-b border-gray-100 px-5 flex items-center justify-between transition-all duration-300 h-20">
      <div className="flex items-center gap-3.5">
        {/* Premium Avatar Placeholder with Online Indicator */}
        <div className="relative">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-sm flex items-center justify-center">
            <span className="text-white font-bold text-sm tracking-wide">AD</span>
          </div>
          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
        </div>
        
        <div className="flex flex-col">
          {subtitle && (
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">
              {subtitle}
            </p>
          )}
          <h1 className="text-xl font-extrabold text-gray-900 tracking-tight leading-none">
            {title}
          </h1>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <button className="relative w-10 h-10 flex items-center justify-center text-gray-600 hover:text-indigo-600 bg-white hover:bg-indigo-50 rounded-full transition-all duration-200 active:scale-[0.92] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)] border border-gray-100">
          <Search className="w-[18px] h-[18px]" strokeWidth={2.5} />
        </button>
        {showNotification && (
          <button className="relative w-10 h-10 flex items-center justify-center text-gray-600 hover:text-indigo-600 bg-white hover:bg-indigo-50 rounded-full transition-all duration-200 active:scale-[0.92] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)] border border-gray-100">
            <Bell className="w-[18px] h-[18px]" strokeWidth={2.5} />
            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-white shadow-sm" />
          </button>
        )}
      </div>
    </header>
  );
}
