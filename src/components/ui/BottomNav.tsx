"use client";

import { Home, Package, Plus, Clock, History } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  isActive?: boolean;
}

// Removed labels for an ultra-clean, icon-only minimalist dock approach
function NavItem({ href, icon, isActive }: NavItemProps) {
  return (
    <Link href={href} className={cn(
      "flex flex-col items-center justify-center flex-1 h-full relative group transition-all duration-300",
      isActive ? "text-white" : "text-white/60 hover:text-white"
    )}>
      <div className={cn(
        "transition-all duration-300 transform", 
        isActive ? "scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] -translate-y-1" : "scale-100 group-hover:scale-105"
      )}>
        {icon}
      </div>
      
      {/* Active Dot Indicator */}
      <div className={cn(
        "absolute bottom-[10px] w-1 h-1 rounded-full bg-white transition-all duration-300",
        isActive ? "opacity-100 scale-100" : "opacity-0 scale-50"
      )} />
    </Link>
  );
}

export function BottomNav() {
  const pathname = usePathname(); 

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-teal-600/95 backdrop-blur-2xl border-t border-teal-400/30 pb-[env(safe-area-inset-bottom)] z-50 rounded-t-[2.5rem] shadow-[0_-12px_40px_-12px_rgba(13,148,136,0.5)]">
      <div className="flex items-center justify-around px-2 max-w-md mx-auto h-[76px] relative">
        
        <NavItem 
          href="/dashboard" 
          icon={<Home className="w-[22px] h-[22px]" />} 
          isActive={pathname === "/dashboard"} 
        />
        <NavItem 
          href="/inventory" 
          icon={<Package className="w-[22px] h-[22px]" />} 
          isActive={pathname.startsWith("/inventory")} 
        />
        
        {/* Central Premium Action Button */}
        <div className="relative -top-7 px-2">
          <Link href="/rent/new" className="flex items-center justify-center w-[60px] h-[60px] bg-gradient-to-tr from-violet-600 to-fuchsia-500 text-white rounded-[1.5rem] rotate-45 shadow-[0_8px_24px_rgba(124,58,237,0.4)] hover:rotate-0 hover:shadow-[0_12px_32px_rgba(124,58,237,0.6)] transition-all duration-300 ease-out active:scale-95 ring-[4px] ring-[#fdfdff]/40">
            <Plus className="w-8 h-8 -rotate-45 transition-transform duration-300 group-hover:rotate-0" strokeWidth={2.5} />
          </Link>
        </div>

        <NavItem 
          href="/rentals/active" 
          icon={<Clock className="w-[22px] h-[22px]" />}  
          isActive={pathname.startsWith("/rentals/active")} 
        />
        <NavItem 
          href="/history" 
          icon={<History className="w-[22px] h-[22px]" />} 
          isActive={pathname.startsWith("/history")} 
        />
        
      </div>
    </nav>
  );
}
