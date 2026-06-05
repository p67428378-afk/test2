import React from 'react';
import { TrendingUp, List, Landmark, BarChart } from 'lucide-react';
import MetricCard from '../components/dashboard/MetricCard';
import OrderBlotterTable from '../components/orders/OrderBlotterTable';
import PositionsTable from '../components/positions/PositionsTable';
import MarketOverviewChart from '../components/dashboard/MarketOverviewChart';

// Mock Data
const recentOrders = [
    { order_id: 'ORD-001', instrument_id: 'AAPL', quantity: 100, price: 175.50, order_type: 'LIMIT', status: 'FILLED', updated_at: '2023-10-27T10:30:00Z' },
    { order_id: 'ORD-002', instrument_id: 'MSFT', quantity: 200, price: 320.10, order_type: 'MARKET', status: 'PARTIALLY_FILLED', updated_at: '2023-10-27T10:31:15Z' },
    { order_id: 'ORD-003', instrument_id: 'GOOG', quantity: 50, price: 1400.00, order_type: 'LIMIT', status: 'PENDING', updated_at: '2023-10-27T10:32:30Z' },
];

const currentPositions = [
    { instrument_id: 'AAPL', quantity: 500, average_price: 170.00 },
    { instrument_id: 'TSLA', quantity: 100, average_price: 250.00 },
];

const DashboardPage = () => {
  return (
    <div className='space-y-6'>
      {/* Section 1: Key Metrics */}
      <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <MetricCard title="Total P&L (Today)" value="$12,345.67" change="+1.25%" changeType="positive" icon={<TrendingUp size={36} />} />
        <MetricCard title="Open Orders" value="15" icon={<List size={36} />} />
        <MetricCard title="Total Positions" value="230" icon={<Landmark size={36} />} />
        <MetricCard title="Market Sentiment" value="Bullish" change="Vantage" changeType="positive" icon={<BarChart size={36} />} />
      </section>

      {/* Main Workspace: Split Layout */}
      <div className='grid grid-cols-12 gap-6'>
        {/* Section 2: Real-time Order Blotter */}
        <div className='col-span-12 lg:col-span-8 space-y-6'>
          <div className='bg-surface-container-lowest border border-outline-variant rounded-lg'>
             <div className='px-4 py-3 border-b border-outline-variant flex justify-between items-center'>
                <h3 className='font-title-sm text-base text-on-surface'>Recent Orders</h3>
                <button className='px-3 py-1 text-xs bg-primary text-on-primary rounded-md font-semibold'>New Trade</button>
            </div>
            <OrderBlotterTable orders={recentOrders} />
          </div>
          
          <div className='bg-surface-container-lowest border border-outline-variant rounded-lg'>
            <div className='px-4 py-3 border-b border-outline-variant'>
                <h3 className='font-title-sm text-base text-on-surface'>Current Positions</h3>
            </div>
            <PositionsTable positions={currentPositions} />
          </div>
        </div>

        {/* Section 4: Market Overview Chart */}
        <div className='col-span-12 lg:col-span-4'>
          <MarketOverviewChart />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
