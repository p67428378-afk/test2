import React, { useEffect, useState } from 'react';
import SummaryCard from '../components/common/SummaryCard';
import CustomLineChart from '../components/common/LineChart';
import CustomBarChart from '../components/common/BarChart';
import { getItems, getSalesHistory, getProfitabilityReport } from '../services/api';
import { Gem, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';

const DashboardPage = () => {
  const [itemCount, setItemCount] = useState(0);
  const [salesCount, setSalesCount] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [salesData, setSalesData] = useState([]);
  const [profitabilityData, setProfitabilityData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const itemsRes = await getItems();
        setItemCount(itemsRes.data.length);

        const salesRes = await getSalesHistory();
        setSalesCount(salesRes.data.length);
        
        const profitRes = await getProfitabilityReport();
        setTotalProfit(profitRes.data.total_profit || 0);

        // Mock data for charts - replace with actual API data processing
        const formattedSales = salesRes.data.map(sale => ({
          date: new Date(sale.date).toLocaleDateString(),
          amount: sale.total_amount,
        })).slice(0, 10); // show last 10 sales
        setSalesData(formattedSales);

        const formattedProfit = salesRes.data.map(sale => ({
            name: new Date(sale.date).toLocaleDateString(),
            profit: sale.profit,
          })).slice(0, 10);
        setProfitabilityData(formattedProfit);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <SummaryCard title="Total Items" value={itemCount} icon={<Gem />} />
        <SummaryCard title="Total Sales" value={salesCount} icon={<ShoppingCart />} />
        <SummaryCard title="Total Profit" value={`$${totalProfit.toFixed(2)}`} icon={<DollarSign />} />
        <SummaryCard title="Sales Trend" value="+15%" icon={<TrendingUp />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CustomLineChart data={salesData} xAxisKey="date" dataKey="amount" title="Sales Over Time" />
        <CustomBarChart data={profitabilityData} xAxisKey="name" dataKey="profit" title="Profitability by Sale" />
      </div>
    </div>
  );
};

export default DashboardPage;
