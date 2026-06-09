import React from 'react';
import { LayoutDashboard, Package, FileText, Users, BarChart3, Settings, MoreVertical } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'orders', label: 'Quotes & Orders', icon: FileText },
    { id: 'crm', label: 'CRM', icon: Users },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-[280px] bg-surface-container border-r border-outline-variant/30 flex flex-col z-40 hidden md:flex">
      <div className="h-[64px] flex items-center px-6 border-b border-outline-variant/30">
        <div className="flex items-center gap-2">
          <span className="text-brand-indigo font-bold text-2xl">💎</span>
          <div className="flex flex-col">
            <span className="font-semibold text-lg text-on-surface tracking-tight">GlassFlow Pro</span>
            <span className="text-[10px] text-on-surface-variant uppercase tracking-wider opacity-70 -mt-1">Precision Glass ERP</span>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'text-brand-indigo font-bold bg-brand-indigo/10 border-l-2 border-brand-indigo'
                  : 'text-on-surface-variant hover:bg-surface-variant hover:text-on-surface'
              }`}
            >
              <Icon className={`mr-3 h-5 w-5 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-brand-indigo' : 'text-on-surface-variant'}`} />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-outline-variant/30 mt-auto">
        <div className="w-full flex items-center px-3 py-2 rounded-lg hover:bg-surface-variant transition-colors text-on-surface-variant">
          <img
            alt="John Doe"
            className="w-8 h-8 rounded-full border border-outline mr-3 object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhOfPbzAEU8Wbd005Of31j8EdmIZcRJClsXz1Xm8YmS09f22uP8jCIJGkz_b9x4WXs-zWWrScYs8S_bV-BwUGpCNtFSvAmracc35-xRsFQCfOM2cWVMcYKQ5Hp3vGRmsUa2M75PlrlfF5xh0u_YjXmu5oxYWhHnY3YBP58qOLP2aaF15OJJoCSW7lQnoDrBIDkERMSpc9Hy_sZ_9bsr1gLBYryX6ZECOn15rCNtbI71AeYZNjCF0CE0p0ms0-sGlAaUlNZhQK2gBlX"
          />
          <div className="flex-1 text-left truncate">
            <p className="text-sm font-medium text-on-surface">John Doe</p>
            <p className="text-xs text-on-surface-variant">Owner</p>
          </div>
          <MoreVertical className="h-4 w-4 text-on-surface-variant" />
        </div>
      </div>
    </aside>
  );
}