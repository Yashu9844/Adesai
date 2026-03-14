import { cn } from "@/lib/utils";

interface FilterTabsProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function FilterTabs({ tabs, activeTab, onTabChange }: FilterTabsProps) {
  return (
    <div className="w-full overflow-x-auto no-scrollbar pb-2">
      <div className="flex items-center gap-2">
        {tabs.map((tab) => {
          const isActive = tab === activeTab;
          return (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={cn(
                "px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 whitespace-nowrap active:scale-95",
                isActive 
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20" 
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              {tab}
            </button>
          );
        })}
      </div>
    </div>
  );
}
