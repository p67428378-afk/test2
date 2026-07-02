import React from "react";
import { Home, CreditCard, TrendingUp, Settings } from "lucide-react";

export default function BottomNavBar() {
  return (
    <nav className="bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-50 shadow-lg">
      <div className="max-w-md mx-auto px-6 py-2 flex justify-between items-center">
        <button className="flex flex-col items-center space-y-1 text-gray-400 hover:text-primary-600 transition-colors">
          <Home className="h-5 w-5" />
          <span className="text-[10px] font-medium">Home</span>
        </button>
        <button className="flex flex-col items-center space-y-1 text-gray-400 hover:text-primary-600 transition-colors">
          <CreditCard className="h-5 w-5" />
          <span className="text-[10px] font-medium">Accounts</span>
        </button>
        <button className="flex flex-col items-center space-y-1 text-primary-600 transition-colors">
          <TrendingUp className="h-5 w-5" />
          <span className="text-[10px] font-medium">Invest</span>
        </button>
        <button className="flex flex-col items-center space-y-1 text-gray-400 hover:text-primary-600 transition-colors">
          <Settings className="h-5 w-5" />
          <span className="text-[10px] font-medium">Settings</span>
        </button>
      </div>
    </nav>
  );
}
