import React, { useState, useEffect } from 'react';
import MetricCard from '../components/dashboard/MetricCard';
import OrderBlotterTable from '../components/orders/OrderBlotterTable';
import PositionsTable from '../components/positions/PositionsTable';
import MarketOverviewChart from '../components/dashboard/MarketOverviewChart';
import { getPositions } from '../services/api';
import { TrendingUp, List, Wallet, BarChart } from 'lucide-react';

const DashboardPage = () => {
  const [positions, setPositions] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const traderId = 'some-trader-id'; // Mock traderId
        const response = await getPositions(traderId);
        if (response && response.data) {
            const positionsWithMockData = response.data.map(p => ({
              ...p,
              current_price: p.average_price * (1 + (Math.random() - 0.5) * 0.1),
              pnl: (p.average_price * (1 + (Math.random() - 0.5) * 0.1) - p.average_price) * p.quantity,
              updated_at: new Date().toISOString(),
            }));
            setPositions(positionsWithMockData);
        }
      } catch (error) {
        console.error("Failed to fetch positions:", error);
      }
    };

    fetchPositions();

    // Mock orders for demonstration
    setOrders([
        { order_id: 'ORD-001', instrument_id: 'AAPL', quantity: 100, price: 175.50, order_type: 'LIMIT', status: 'FILLED', filled_percent: 100, updated_at: new Date().toISOString() },
        { order_id: 'ORD-002', instrument_id: 'MSFT', quantity: 200, price: 320.10, order_type: 'MARKET', status: 'PARTIALLY_FILLED', filled_percent: 50, updated_at: new Date().toISOString() },
        { order_id: 'ORD-003', instrument_id: 'GOOG', quantity: 50, price: 1400.00, order_type: 'LIMIT', status: 'PENDING', filled_percent: 0, updated_at: new Date().toISOString() },
    ]);

  }, []);

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total P&L (Today)" value="+$12,345.67" change="+1.25%" changeType="positive" icon={<TrendingUp />} />
        <MetricCard title="Open Orders" value="15" icon={<List />} />
        <MetricCard title="Total Positions" value="230" icon={<Wallet />} />
        <MetricCard title="Market Sentiment" value="Bullish" icon={<BarChart />} />
      </section>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <OrderBlotterTable orders={orders} title="Recent Orders" />
          <PositionsTable positions={positions} />
        </div>
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <MarketOverviewChart />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
