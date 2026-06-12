import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, LayoutDashboard, Users, AlertTriangle, FileText, Settings } from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Case Review', path: '/cases', icon: Users },
    { name: 'Transaction Alerts', path: '/alerts', icon: AlertTriangle },
    { name: 'Regulatory Reports', path: '/reports', icon: FileText },
  ];

  return (
    <aside className="hidden md:flex flex-col h-full py-6 bg-surface-container-lowest border-r border-outline-variant fixed left-0 top-0 w-[260px] z-20">
      <div className="px-6 mb-8 flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-on-primary font-bold">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-headline-md text-headline-md font-bold text-primary">Aegis Compliance</h1>
          <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mt-0.5">Enterprise Risk Engine</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 mt-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-6 py-3 transition-all duration-200 ${
                isActive
                  ? 'text-primary font-bold border-l-2 border-primary bg-primary-container/10 translate-x-1'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="px-6 mt-auto">
        <div className="flex items-center gap-3 pt-6 border-t border-outline-variant/30 cursor-pointer hover:bg-surface-container-high transition-colors rounded-lg p-2 -mx-2">
          <img
            alt="Vikram Sen"
            className="w-10 h-10 rounded-full border border-outline-variant object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_Ggsf05QShLvSKmrrhmQqZAAJxO44mZDZBHKFpNkAtj2KSI_Rd_47lWaZQ2ZzdP-Ny4HN5F-q2aLbjGtEPhXk2hGmcaXeufeN7OBrswOoMxah4oINm3EC46udbr1B6eh_co1znR86ZOhSFL3oNQ2DYKmPcbBxbm2W2dZGHmLcwmwLLE8RBg6ngNI6Qr_tqArsXGtdXjY2iQ_Oxe2crxvzadEtNrEIzePANGJ38j8ELN1i_2u6H251C8DaUOnp0nIBnK4CzK4Ug-oH"
          />
          <div>
            <p className="font-mono-data text-mono-data text-on-surface">Vikram Sen</p>
            <p className="font-label-md text-label-md text-on-surface-variant">Chief Compliance Officer</p>
          </div>
        </div>
      </div>
    </aside>
  );
}