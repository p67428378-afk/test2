import React, { useEffect, useState } from 'react';
import { getDashboardKPIs, getDashboardSKUs } from '../services/api';
import KPICard from '../components/KPICard';
import StatusBadge from '../components/StatusBadge';

export default function Dashboard() {
  const [kpis, setKpis] = useState(null);
  const [skus, setSkus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const [kpiData, skusData] = await Promise.all([
          getDashboardKPIs(),
          getDashboardSKUs(),
        ]);
        setKpis(kpiData);
        setSkus(skusData);
      } catch (err) {
        console.error(err);
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredSkus = skus.filter((sku) =>
    sku.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sku.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className='flex items-center justify-center h-full p-8'>
        <div className='text-slate-500 font-medium'>Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='p-8'>
        <div className='bg-red-50 border border-red-200 text-red-800 rounded-lg p-4'>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* KPI Cards Row */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <KPICard
          title='Sales/Linear Ft'
          value={`$${kpis?.sales_linear_ft?.toFixed(2) || '0.00'}`}
          change='+4.2%'
          changeType='up'
          subtitle='vs last month'
        />
        <KPICard
          title='Private Brand %'
          value={`${kpis?.private_brand_pct?.toFixed(1) || '0.0'}%`}
          change='+1.5%'
          changeType='up'
          subtitle='vs target'
        />
        <KPICard
          title='In-Stock Rate'
          value={`${kpis?.in_stock_rate?.toFixed(1) || '0.0'}%`}
          change='-0.8%'
          changeType='down'
          subtitle='vs last week'
        />
        <KPICard
          title='Shelf Capacity'
          value={`${kpis?.shelf_capacity?.toFixed(1) || '0.0'}%`}
          progress={kpis?.shelf_capacity}
        />
      </div>

      {/* SKU Performance Table Card */}
      <div className='glass-card rounded-xl overflow-hidden flex flex-col bg-white'>
        {/* Table Header Actions */}
        <div className='p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white'>
          <h3 className='text-lg font-semibold text-slate-900'>SKU Performance</h3>
          <div className='flex items-center gap-3 w-full sm:w-auto'>
            <div className='relative w-full sm:w-64'>
              <span className='material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]'>
                search
              </span>
              <input
                type='text'
                className='w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-md text-sm bg-slate-50 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-colors'
                placeholder='Filter SKUs...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Table Data */}
        <div className='overflow-x-auto'>
          <table className='w-full text-left border-collapse'>
            <thead>
              <tr className='bg-slate-50 border-b border-slate-100'>
                <th className='py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap'>
                  SKU
                </th>
                <th className='py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider'>
                  Product Name
                </th>
                <th className='py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right'>
                  Sales ($)
                </th>
                <th className='py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right'>
                  Margin (%)
                </th>
                <th className='py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center'>
                  Status
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-100 text-sm'>
              {filteredSkus.map((sku) => (
                <tr key={sku.sku} className='hover:bg-slate-50/50 transition-colors h-12'>
                  <td className='py-2 px-5 font-mono text-slate-500'>{sku.sku}</td>
                  <td className='py-2 px-5 text-slate-900 font-medium'>{sku.name}</td>
                  <td className='py-2 px-5 text-right font-mono text-slate-600'>
                    ${sku.sales.toLocaleString()}
                  </td>
                  <td className='py-2 px-5 text-right font-mono text-slate-600'>
                    {sku.margin.toFixed(1)}%
                  </td>
                  <td className='py-2 px-5 text-center'>
                    <StatusBadge status={sku.status} />
                  </td>
                </tr>
              ))}
              {filteredSkus.length === 0 && (
                <tr>
                  <td colSpan={5} className='py-8 text-center text-slate-400'>
                    No SKUs found matching "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
