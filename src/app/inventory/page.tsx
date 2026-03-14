"use client";

import { useState } from "react";
import { Header } from "@/components/ui/Header";
import { BottomNav } from "@/components/ui/BottomNav";
import { SearchBar } from "@/components/ui/SearchBar";
import { ToolCard } from "@/components/ui/ToolCard";
import { Plus } from "lucide-react";

// Placeholder Mock Data
const INVENTORY_DATA = [
  {
    id: "1",
    name: "Jali (Iron Mesh)",
    totalQuantity: 50,
    availableQuantity: 12,
    rentedQuantity: 38,
    dailyPrice: 20,
  },
  {
    id: "2",
    name: "Support Stand",
    totalQuantity: 120,
    availableQuantity: 45,
    rentedQuantity: 75,
    dailyPrice: 15,
  },
  {
    id: "3",
    name: "Dimsa (Compactor)",
    totalQuantity: 5,
    availableQuantity: 0,
    rentedQuantity: 5,
    dailyPrice: 150,
  },
  {
    id: "4",
    name: "Concrete Mixer",
    totalQuantity: 2,
    availableQuantity: 1,
    rentedQuantity: 1,
    dailyPrice: 500,
  },
  {
    id: "5",
    name: "Scaffolding Pipe",
    totalQuantity: 200,
    availableQuantity: 180,
    rentedQuantity: 20,
    dailyPrice: 10,
  },
];

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTools = INVENTORY_DATA.filter((tool) =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      <Header title="Inventory" subtitle="Manage and track all available tools" />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-28 pt-4">
        
        {/* Sticky Utility Bar with Search and Add Action */}
        <div className="sticky top-0 z-30 bg-white/40 backdrop-blur-2xl border-b border-white/60 px-4 py-2 mb-4">
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center px-1">
              <h2 className="text-slate-900 font-bold text-lg">All Tools</h2>
              <button className="bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-700 hover:to-fuchsia-600 active:scale-95 transition-all text-white text-sm font-semibold px-4 py-2 rounded-[1.25rem] flex items-center justify-center gap-1.5 shadow-[0_2px_10px_-2px_rgba(79,70,229,0.3)]">
                <Plus className="w-4 h-4" /> Add Tool
              </button>
            </div>
            <SearchBar 
              placeholder="Search tools by name..." 
              value={searchQuery}
              onChange={setSearchQuery} 
            />
          </div>
        </div>

        {/* Inventory Grid */}
        <div className="px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTools.length > 0 ? (
            filteredTools.map((tool) => (
              <ToolCard key={tool.id} {...tool} />
            ))
          ) : (
            <div className="col-span-full py-16 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-slate-900 font-bold text-lg mb-1">No tools found</h3>
              <p className="text-slate-500 text-sm max-w-[200px]">
                We couldn't find any tools matching "{searchQuery}"
              </p>
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
