"use client";

import { useState } from "react";
import { Header } from "@/components/ui/Header";
import { BottomNav } from "@/components/ui/BottomNav";
import { SearchBar } from "@/components/ui/SearchBar";
import { RentalCard } from "@/components/ui/RentalCard";
import { Clock } from "lucide-react";

// Mock Active Rentals Data
const ACTIVE_RENTALS = [
  {
    id: "r1",
    customerName: "Ramesh Kumar",
    mobileNumber: "9876543210",
    village: "Ramnagar",
    toolName: "Jali (Iron Mesh)",
    quantity: 15,
    startDate: "12 Oct 2026",
    daysRunning: 3,
    estimatedCost: 900, // 3 days * 15 qty * 20 price
  },
  {
    id: "r2",
    customerName: "Suresh Patel",
    mobileNumber: "9812345678",
    village: "Shivpur",
    toolName: "Support Stand",
    quantity: 40,
    startDate: "14 Oct 2026",
    daysRunning: 1,
    estimatedCost: 600, // 1 day * 40 qty * 15 price
  },
  {
    id: "r3",
    customerName: "Mohan Lal",
    mobileNumber: "9988776655",
    village: "Bhavanipur",
    toolName: "Dimsa (Compactor)",
    quantity: 1,
    startDate: "10 Oct 2026",
    daysRunning: 5,
    estimatedCost: 750, // 5 days * 1 qty * 150 price
  },
];

export default function ActiveRentalsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRentals = ACTIVE_RENTALS.filter((rental) => {
    const q = searchQuery.toLowerCase();
    return (
      rental.customerName.toLowerCase().includes(q) ||
      rental.mobileNumber.includes(q) ||
      rental.toolName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header title="Active Rentals" subtitle="Tools currently rented by customers" showNotification={false} />

      <main className="flex-1 overflow-y-auto pb-28 pt-4">
        
        {/* Sticky Utility Bar with Search */}
        <div className="sticky top-0 z-30 bg-gray-50/95 backdrop-blur-sm px-4 py-2 mb-4">
          <SearchBar 
            placeholder="Search by name, mobile, or tool..." 
            value={searchQuery}
            onChange={setSearchQuery} 
          />
        </div>

        {/* Info Banner */}
        <div className="px-4 mb-5">
          <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 font-medium">
              You have <span className="font-bold">{ACTIVE_RENTALS.length} active rentals</span> at the moment. Total estimated value: ₹2,250.
            </p>
          </div>
        </div>

        {/* Rentals List Grid */}
        <div className="px-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredRentals.length > 0 ? (
            filteredRentals.map((rental) => (
              <RentalCard 
                key={rental.id} 
                {...rental} 
                onReturn={(id) => console.log("Return", id)}
                onViewDetails={(id) => console.log("Details", id)}
              />
            ))
          ) : (
            <div className="col-span-full py-16 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-gray-900 font-bold text-lg mb-1">No active rentals</h3>
              <p className="text-gray-500 text-sm max-w-[200px]">
                {searchQuery ? `We couldn't find any rentals matching "${searchQuery}"` : "All rented tools have been returned."}
              </p>
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
