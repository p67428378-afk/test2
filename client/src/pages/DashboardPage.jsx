import React, { useState, useEffect } from 'react';
import { DollarSign, ClipboardList, AlertTriangle, Percent } from 'lucide-react';
import { getDashboardMetrics, getOrders } from '../services/api.js';
import KPICard from '../components/dashboard/KPICard.jsx';
import RecentOrdersTable from '../components/dashboard/RecentOrdersTable.jsx';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [metricsData, ordersData] = await Promise.all([
          getDashboardMetrics(),
          getOrders(0, 5)
        ]);
        setMetrics(metricsData);
        setRecentOrders(ordersData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-brand-indigo font-semibold">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-on-surface">Dashboard Overview</h1>
        <p className="text-sm text-on-surface-variant mt-1">Real-time metrics for GlassFlow Pro.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Revenue"
          value={`$${parseFloat(metrics?.total_revenue || 125000.5).toLocaleString()}`}
          icon={DollarSign}
          trend={`${metrics?.revenue_trend || '+12.5%'} MoM`}
          trendType="up"
          glowColor="brand-indigo"
        />
        <KPICard
          title="Active Orders"
          value={metrics?.active_orders_count || 18}
          icon={ClipboardList}
          trend={`${metrics?.orders_trend || '+8.3%'} MoM`}
          trendType="up"
          glowColor="secondary"
        />
        <KPICard
          title="Low Stock Alert"
          value={metrics?.low_stock_count || 5}
          icon={AlertTriangle}
          subtitle="Below reorder point"
          glowColor="warning"
        />
        <KPICard
          title="Avg Profit Margin"
          value="42.5%"
          icon={Percent}
          trend="+1.8% MoM"
          trendType="up"
          glowColor="tertiary"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Line Chart Panel */}
        <div className="lg:col-span-8 glass-panel rounded-xl p-6 flex flex-col min-h-[360px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-on-surface">Monthly Sales &amp; Profitability</h2>
          </div>
          <div className="flex-1 relative w-full h-full flex items-end">
            <div className="absolute inset-0 flex flex-col justify-between py-4 pointer-events-none">
              <div className="w-full h-[1px] bg-outline-variant/20"></div>
              <div className="w-full h-[1px] bg-outline-variant/20"></div>
              <div className="w-full h-[1px] bg-outline-variant/20"></div>
              <div className="w-full h-[1px] bg-outline-variant/20"></div>
            </div>
            <svg className="w-full h-[80%] overflow-visible chart-glow" preserveAspectRatio="none" viewBox="0 0 100 50">
              <defs>
                <linearGradient id="chartGlow" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="rgba(99, 102, 241, 0.4)"></stop>
                  <stop offset="100%" stopColor="rgba(99, 102, 241, 0)"></stop>
                </linearGradient>
              </defs>
              <path d="M0,45 C10,40 20,42 30,30 C40,18 50,25 60,15 C70,5 80,20 90,10 L100,5 L100,50 L0,50 Z" fill="url(#chartGlow)" opacity="0.6"></path>
              <path d="M0,45 C10,40 20,42 30,30 C40,18 50,25 60,15 C70,5 80,20 90,10 L100,5" fill="none" stroke="#6366F1" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              <path d="M0,48 C15,45 25,46 35,38 C45,30 55,32 65,25 C75,18 85,28 100,20" fill="none" stroke="#00a6e0" strokeDasharray="2,2" strokeWidth="1.5"></path>
            </svg>
            <div className="absolute bottom-0 w-full flex justify-between transform translate-y-full pt-2 text-on-surface-variant text-xs px-2">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
            </div>
          </div>
        </div>

        {/* Donut Chart Panel */}
        <div className="lg:col-span-4 glass-panel rounded-xl p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-on-surface">Sales by Glass Type</h2>
          </div>
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="relative w-40 h-40 mb-6">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" fill="transparent" r="40" stroke="#222a3d" strokeDasharray="251.2" strokeDashoffset="0" strokeWidth="16"></circle>
                <circle cx="50" cy="50" fill="transparent" r="40" stroke="#464554" strokeDasharray="251.2" strokeDashoffset="226.08" strokeWidth="16"></circle>
                <circle cx="50" cy="50" fill="transparent" r="40" stroke="#00a6e0" strokeDasharray="251.2" strokeDashoffset="175.84" strokeWidth="16"></circle>
                <circle cx="50" cy="50" fill="transparent" r="40" stroke="#c0c1ff" strokeDasharray="251.2" strokeDashoffset="113.04" strokeWidth="16"></circle>
                <circle cx="50" cy="50" fill="transparent" r="40" stroke="#6366F1" strokeDasharray="251.2" strokeDashoffset="138.16" strokeLinecap="round" strokeWidth="16"></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-on-surface">45%</span>
                <span className="text-xs text-on-surface-variant">Tempered</span>
              </div>
            </div>
            <div className="w-full grid grid-cols-2 gap-y-2 gap-x-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-brand-indigo"></div>
                <span className="text-xs text-on-surface-variant flex-1">Tempered</span>
                <span className="text-xs text-on-surface">45%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-xs text-on-surface-variant flex-1">Laminated</span>
                <span className="text-xs text-on-surface">25%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-secondary-container"></div>
                <span className="text-xs text-on-surface-variant flex-1">Double G.</span>
                <span className="text-xs text-on-surface">20%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-outline-variant"></div>
                <span className="text-xs text-on-surface-variant flex-1">Float</span>
                <span className="text-xs text-on-surface">10%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <RecentOrdersTable orders={recentOrders} />
    </div>
  );
}