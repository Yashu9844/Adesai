import { Header } from "@/components/ui/Header";
import { StatCard } from "@/components/ui/StatCard";
import { BottomNav } from "@/components/ui/BottomNav";
import { Package, Clock, RotateCcw, Box, ArrowRight, FileText } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  // Placeholder Data
  const stats = {
    totalTools: 124,
    availableTools: 86,
    rentedTools: 38,
    todayReturns: 5,
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header title="Tool Rental" subtitle="Welcome back, Admin" />
      
      {/* Scrollable Main Content Content */}
      <main className="flex-1 overflow-y-auto px-4 py-6 space-y-6 pb-24">
        
        {/* Statistics Grid */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 mb-3 px-1 uppercase tracking-wider">Overview</h2>
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              title="Total Tools"
              value={stats.totalTools}
              icon={Box}
              variant="default"
            />
            <StatCard
              title="Available"
              value={stats.availableTools}
              icon={Package}
              variant="success"
            />
            <StatCard
              title="Rented Out"
              value={stats.rentedTools}
              icon={Clock}
              variant="warning"
            />
            <StatCard
              title="Returns Today"
              value={stats.todayReturns}
              icon={RotateCcw}
              variant="default"
            />
          </div>
        </section>

        {/* Primary Action Section */}
        <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col items-center text-center space-y-3">
          <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mb-1">
            <Package className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">New Rental</h3>
            <p className="text-sm text-gray-500 mt-1">Rent out tools to a new or returning customer.</p>
          </div>
          <Link 
            href="/rent/new" 
            className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg px-4 py-3 flex items-center justify-center gap-2 transition-colors active:scale-[0.98]"
          >
            Go to Give Tool <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        {/* Quick Navigation Cards */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 mb-3 px-1 uppercase tracking-wider">Quick Actions</h2>
          <div className="space-y-3">
            <Link href="/inventory" className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 active:bg-gray-100 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Package className="w-5 h-5 text-gray-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Inventory</p>
                  <p className="text-xs text-gray-500">View and manage all tools</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </Link>

            <Link href="/rentals/active" className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 active:bg-gray-100 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-amber-50 rounded-lg">
                  <Clock className="w-5 h-5 text-amber-500" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Active Rentals</p>
                  <p className="text-xs text-gray-500">Track returning tools</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-2 py-0.5 rounded-full">{stats.rentedTools}</span>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
            </Link>
            
            <Link href="/history" className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 active:bg-gray-100 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <FileText className="w-5 h-5 text-gray-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Rental History</p>
                  <p className="text-xs text-gray-500">Past transactions</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </Link>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
