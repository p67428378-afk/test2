import React from 'react';
import SummaryCard from '../components/common/SummaryCard';
import LineChart from '../components/common/LineChart';
import BarChart from '../components/common/BarChart';
import { DollarSign, Package, Users, ShoppingCart } from 'lucide-react';

const salesData = [
    { name: 'Jan', sales: 4000 }, { name: 'Feb', sales: 3000 }, { name: 'Mar', sales: 5000 },
    { name: 'Apr', sales: 4500 }, { name: 'May', sales: 6000 }, { name: 'Jun', sales: 5500 },
];

const bestSellersData = [
    { name: 'Ring', sales: 120 }, { name: 'Necklace', sales: 98 }, { name: 'Bracelet', sales: 86 },
    { name: 'Earrings', sales: 75 }, { name: 'Pendant', sales: 60 },
];

const DashboardPage = () => {
  return (
    <div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6'>
        <SummaryCard title='Total Revenue' value='$125,670' icon={<DollarSign />} />
        <SummaryCard title='Total Items' value='1,234' icon={<Package />} />
        <SummaryCard title='Total Customers' value='345' icon={<Users />} />
        <SummaryCard title='Total Sales' value='876' icon={<ShoppingCart />} />
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <LineChart data={salesData} xAxisKey="name" dataKey="sales" title="Sales Over Time" />
        <BarChart data={bestSellersData} xAxisKey="name" dataKey="sales" title="Best Selling Items" />
      </div>
    </div>
  );
};

export default DashboardPage;
