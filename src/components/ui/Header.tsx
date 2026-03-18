import { Bell, Search } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string; // Kept in props so other pages don't break, but unused in rendering for minimalism
  showNotification?: boolean;
  onBack?: () => void;
}

export function Header({ title, showNotification = true }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-teal-600/95 backdrop-blur-2xl px-6 flex flex-col justify-center transition-all duration-300 h-[76px] rounded-b-[2.5rem] shadow-[0_12px_40px_-12px_rgba(13,148,136,0.5)] border-b border-teal-400/30">
      <div className="flex items-center justify-between w-full">
        {/* Simplified Single Line Header Title */}
        <h1 className="text-xl font-bold text-white tracking-tight leading-none drop-shadow-sm">
          {title}
        </h1>
        
        <div className="flex items-center gap-3">
          <button className="relative w-10 h-10 flex items-center justify-center text-slate-300 hover:text-white bg-white/5 hover:bg-white/15 rounded-full transition-all duration-200 active:scale-95 border border-white/5 shadow-sm">
            <Search className="w-5 h-5" strokeWidth={2} />
          </button>
          
          {showNotification && (
            <button className="relative w-10 h-10 flex items-center justify-center text-slate-300 hover:text-white bg-white/5 hover:bg-white/15 rounded-full transition-all duration-200 active:scale-95 border border-white/5 shadow-sm">
              <Bell className="w-5 h-5" strokeWidth={2} />
              <span className="absolute top-[8px] right-[10px] w-2 h-2 bg-rose-500 rounded-full border border-slate-900 shadow-sm" />
            </button>
          )}

          {/* Minimal Profile Picture Placeholder */}
          <div className="relative ml-1 shadow-[0_4px_12px_rgba(124,58,237,0.3)] rounded-full">
             <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
               <span className="text-white font-bold text-[13px] tracking-wide">AD</span>
             </div>
             <div className="absolute bottom-[-2px] right-[-2px] w-3 h-3 bg-teal-400 rounded-full border-2 border-slate-950" />
          </div>
        </div>
      </div>
    </header>
  );
}
