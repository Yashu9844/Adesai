"use client";

import { useState } from "react";
import { Header } from "@/components/ui/Header";
import { BottomNav } from "@/components/ui/BottomNav";
import { SearchBar } from "@/components/ui/SearchBar";
import { FilterTabs } from "@/components/ui/FilterTabs";
import { HistoryCard } from "@/components/ui/HistoryCard";
import { Search, History as HistoryIcon } from "lucide-react";

// Mock Completed Rentals Data
const HISTORY_DATA = [
  {
    id: "h1",
    customerName: "Ramesh Kumar",
    mobileNumber: "9876543210",
    toolName: "Jali (Iron Mesh)",
    quantity: 10,
    startDate: "01 Oct 2026",
    endDate: "05 Oct 2026",
    totalDays: 4,
    totalAmountPaid: 800, // 4 days * 10 qty * 20 price
  },
  {
    id: "h2",
    customerName: "Sanjay Verma",
    mobileNumber: "9911223344",
    toolName: "Concrete Mixer",
    quantity: 1,
    startDate: "10 Oct 2026",
    endDate: "12 Oct 2026",
    totalDays: 2,
    totalAmountPaid: 1000, // 2 days * 1 qty * 500 price
  },
  {
    id: "h3",
    customerName: "Amit Singh",
    mobileNumber: "9871122334",
    toolName: "Support Stand",
    quantity: 20,
    startDate: "12 Oct 2026",
    endDate: "12 Oct 2026",
    totalDays: 1,
    totalAmountPaid: 300, // 1 day (minimum) * 20 qty * 15 price
  },
  {
    id: "h4",
    customerName: "Suresh Patel",
    mobileNumber: "9812345678",
    toolName: "Scaffolding Pipe",
    quantity: 50,
    startDate: "05 Sep 2026",
    endDate: "15 Sep 2026",
    totalDays: 10,
    totalAmountPaid: 5000, 
  },
];

const FILTER_OPTIONS = ["All Time", "Today", "This Week", "This Month"];

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Time");

  // Basic client side filtering for the mock data
  const filteredHistory = HISTORY_DATA.filter((record) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      record.customerName.toLowerCase().includes(q) ||
      record.mobileNumber.includes(q) ||
      record.toolName.toLowerCase().includes(q);
      
    // In a real app we'd filter dates here based on activeFilter
    
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header title="Rental History" subtitle="View past rental transactions" showNotification={false} />

      <main className="flex-1 overflow-y-auto pb-28 pt-4">
        
        {/* Sticky Filters & Search */}
        <div className="sticky top-0 z-30 bg-gray-50/95 backdrop-blur-sm px-4 py-2 mb-2 flex flex-col gap-3">
          <SearchBar 
            placeholder="Search by name, mobile, or tool..." 
            value={searchQuery}
            onChange={setSearchQuery} 
          />
          <FilterTabs 
            tabs={FILTER_OPTIONS}
            activeTab={activeFilter}
            onTabChange={setActiveFilter}
          />
        </div>

        {/* Total Summary Mini-Banner */}
        <div className="px-4 mb-5 pt-2">
          <div className="flex items-center justify-between text-sm px-1">
            <span className="text-gray-500 font-medium">Showing <strong className="text-gray-900">{filteredHistory.length}</strong> transactions</span>
            <span className="text-gray-500 font-medium">Earned: <strong className="text-indigo-600">₹7,100</strong></span>
          </div>
        </div>

        {/* History List Grid */}
        <div className="px-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredHistory.length > 0 ? (
            filteredHistory.map((record) => (
              <HistoryCard key={record.id} {...record} />
            ))
          ) : (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-white shadow-sm border border-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-gray-900 font-bold text-lg mb-1">No records found</h3>
              <p className="text-gray-500 text-sm max-w-[220px]">
                {searchQuery 
                  ? `We couldn't find any history matching "${searchQuery}"` 
                  : `No completed rentals for "${activeFilter}"`}
              </p>
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
