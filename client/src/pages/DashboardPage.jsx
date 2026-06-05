import React, { useState, useEffect } from 'react';
import MetricCard from '../components/dashboard/MetricCard';
import OrderBlotterTable from '../components/orders/OrderBlotterTable';
import PositionsTable from '../components/positions/PositionsTable';
import MarketOverviewChart from '../components/dashboard/MarketOverviewChart';
import { getPositions } from '../services/api';
import { TrendingUp, List, Wallet, BarChart } from 'lucide-react';

const DashboardPage = () => {
  const [positions, setPositions] = useState([]);
  const [orders, setOrders] = useState([]); // This would be fetched from a websocket or API

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        // Assuming traderId is available, e.g., from user context
        const traderId = 'some-trader-id';
        const response = await getPositions(traderId);
        // Add mock data for current_price and pnl for demonstration
        const positionsWithMockData = response.data.map(p => ({
          ...p,
          current_price: p.average_price * (1 + (Math.random() - 0.5) * 0.1), // Simulate price fluctuation
          pnl: (p.average_price * (1 + (Math.random() - 0.5) * 0.1) - p.average_price) * p.quantity,
          updated_at: new Date().toISOString(),
        }));
        setPositions(positionsWithMockData);
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
    <div className="space-y-lg">
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
        <MetricCard title="Total P&L (Today)" value="+$12,345.67" change="+1.25%" changeType="positive" icon={<TrendingUp />} />
        <MetricCard title="Open Orders" value="15" icon={<List />} />
        <MetricCard title="Total Positions" value="230" icon={<Wallet />} />
        <MetricCard title="Market Sentiment" value="Bullish" icon={<BarChart />} />
      </section>

      <div className="grid grid-cols-12 gap-lg">
        <div className="col-span-12 lg:col-span-8 space-y-lg">
          <OrderBlotterTable orders={orders} />
          <PositionsTable positions={positions} />
        </div>
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-lg">
          <MarketOverviewChart />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
