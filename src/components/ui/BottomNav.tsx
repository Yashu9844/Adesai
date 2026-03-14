import { Home, Package, Plus, Clock, History } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
}

function NavItem({ href, icon, label, isActive }: NavItemProps) {
  return (
    <Link href={href} className="flex flex-col items-center gap-1 justify-center flex-1 py-2">
      <div className={cn("transition-colors", isActive ? "text-indigo-600" : "text-gray-500")}>
        {icon}
      </div>
      <span className={cn("text-[10px] font-medium", isActive ? "text-indigo-600" : "text-gray-500")}>
        {label}
      </span>
    </Link>
  );
}

export function BottomNav() {
  // In a real app we'd use usePathname() to determine active states
  const pathname = "/dashboard"; 

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe z-50">
      <div className="flex items-center justify-around px-2 max-w-md mx-auto">
        <NavItem 
          href="/dashboard" 
          icon={<Home className="w-6 h-6" />} 
          label="Dashboard" 
          isActive={pathname === "/dashboard"} 
        />
        <NavItem 
          href="/inventory" 
          icon={<Package className="w-6 h-6" />} 
          label="Inventory" 
          isActive={pathname.startsWith("/inventory")} 
        />
        
        {/* Floating Action Button Style for Rent */}
        <div className="relative -top-5 px-2">
          <Link href="/rent/new" className="flex items-center justify-center w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 transition-transform active:scale-95">
            <Plus className="w-7 h-7" />
          </Link>
        </div>

        <NavItem 
          href="/rentals/active" 
          icon={<Clock className="w-6 h-6" />} 
          label="Rentals" 
          isActive={pathname.startsWith("/rentals/active")} 
        />
        <NavItem 
          href="/history" 
          icon={<History className="w-6 h-6" />} 
          label="History" 
          isActive={pathname.startsWith("/history")} 
        />
      </div>
    </nav>
  );
}
