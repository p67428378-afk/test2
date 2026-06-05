import React from 'react';
import { Search, Bell } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const getPageTitle = (pathname) => {
  switch (pathname) {
    case '/': return 'Dashboard';
    case '/orders/new': return 'Order Entry';
    case '/orders': return 'Order Blotter';
    case '/positions': return 'Positions';
    default: return 'Money Management System';
  }
}

const Header = () => {
  const location = useLocation();
  const title = getPageTitle(location.pathname);

  return (
    <header className="h-[60px] border-b border-outline-variant flex-shrink-0 bg-surface-container-lowest flex justify-between items-center px-4 md:px-6">
      <div className="flex items-center gap-4">
        <h2 className="font-headline-md text-xl font-bold text-on-surface hidden sm:block">{title}</h2>
      </div>
      <div className="flex items-center gap-4 md:gap-6">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" size={20} />
          <input 
            className="bg-surface-container-low border border-outline-variant rounded-lg pl-10 pr-4 py-1.5 text-body-sm focus:outline-none focus:ring-1 focus:ring-primary w-48 md:w-64 lg:w-80 transition-all duration-300" 
            placeholder="Search instrument, order..." 
            type="text"
          />
        </div>
        <div className="flex items-center gap-4">
          <button className="relative active:scale-95 transition-transform">
            <Bell className="text-on-surface-variant" />
            <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-error ring-2 ring-surface-container-lowest"></span>
          </button>
          <img alt="Trader Profile" className="w-8 h-8 rounded-full border border-outline-variant" src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
        </div>
      </div>
    </header>
  );
};

export default Header;
