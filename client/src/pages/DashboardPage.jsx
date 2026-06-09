import React, { useEffect, useState } from 'react';
import { getDashboardKPIs, getSKUPerformance } from '../services/api';
import Card from '../components/common/Card';
import SKUDataTable from '../components/assortment/SKUDataTable';

const DashboardPage = ({ searchTerm }) => {
  const [kpis, setKpis] = useState(null);
  const [skuData, setSkuData] = useState({ items: [], total: 0, page: 1, limit: 10 });
  const [sortBy, setSortBy] = useState('-sales');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        const data = await getDashboardKPIs();
        setKpis(data);
      } catch (error) {
        console.error('Failed to fetch KPIs:', error);
      }
    };
    fetchKPIs();
  }, []);

  useEffect(() => {
    const fetchSKUs = async () => {
      setLoading(true);
      try {
        const data = await getSKUPerformance({
          filter: searchTerm,
          limit: 10,
          skip: (page - 1) * 10,
          sort_by: sortBy,
        });
        setSkuData(data);
      } catch (error) {
        console.error('Failed to fetch SKUs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSKUs();
  }, [searchTerm, page, sortBy]);

  return (
    <div className='space-y-6'>
      {/* Row 1: KPIs */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <Card title='Sales / Linear Ft' className='h-[120px]'>
          <div className='flex items-end justify-between mt-2'>
            <span className='text-2xl font-bold text-on-surface'>
              ${kpis ? kpis.sales_per_linear_ft.toLocaleString() : '1,245.50'}
            </span>
            <div className='flex items-center text-green-status bg-green-status/10 px-2 py-0.5 rounded-full text-xs font-semibold'>
              <span className='material-symbols-outlined text-sm mr-1'>trending_up</span>
              <span>8.2%</span>
            </div>
          </div>
        </Card>

        <Card title='Private Brand %' className='h-[120px]'>
          <div className='flex items-end justify-between mt-2'>
            <span className='text-2xl font-bold text-on-surface'>
              {kpis ? kpis.private_brand_pct : '24.5'}%
            </span>
            <div className='flex flex-col items-end'>
              <div className='w-16 h-1.5 bg-surface-variant rounded-full overflow-hidden mb-1'>
                <div
                  className='h-full bg-primary-container'
                  style={{ width: `${kpis ? (kpis.private_brand_pct / 25.0) * 100 : 98}%` }}
                ></div>
              </div>
              <span className='text-xs text-on-surface-variant'>Tgt: 25.0%</span>
            </div>
          </div>
        </Card>

        <Card title='In-Stock Rate' className='h-[120px]'>
          <div className='flex items-end justify-between mt-2'>
            <span className='text-2xl font-bold text-on-surface'>
              {kpis ? kpis.in_stock_rate_pct : '96.8'}%
            </span>
            <div className='flex items-center text-green-status bg-green-status/10 px-2 py-0.5 rounded-full text-xs font-semibold'>
              <span className='material-symbols-outlined text-sm mr-1'>arrow_upward</span>
              <span>1.2%</span>
            </div>
          </div>
        </Card>

        <Card title='Shelf Capacity' className='h-[120px]'>
          <div className='flex items-end justify-between mt-2'>
            <span className='text-2xl font-bold text-on-surface'>
              {kpis ? kpis.shelf_capacity_pct : '88.2'}%
            </span>
            <div className='flex items-center text-green-status'>
              <span className='material-symbols-outlined'>check_circle</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Row 2: Charts */}
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
        {/* Line Chart */}
        <div className='lg:col-span-8 bg-surface-container rounded-lg p-6 border border-outline-variant/30 h-[320px] flex flex-col'>
          <h3 className='text-sm font-semibold text-on-surface mb-4'>Weekly Sales Trend</h3>
          <div className='flex-1 relative border-l border-b border-surface-variant pb-6 pl-6 mt-2'>
            <div className='absolute inset-0 pl-6 pb-6 flex items-end'>
              <div className='w-full h-full relative overflow-hidden'>
                <svg className='absolute w-full h-full' preserveAspectRatio='none' viewBox='0 0 100 100'>
                  <defs>
                    <linearGradient id='chart-grad' x1='0' x2='0' y1='0' y2='1'>
                      <stop offset='0%' stopColor='#fdb813' stopOpacity='0.2'></stop>
                      <stop offset='100%' stopColor='#fdb813' stopOpacity='0'></stop>
                    </linearGradient>
                  </defs>
                  <path d='M0,80 L15,70 L30,85 L45,50 L60,65 L75,30 L90,45 L100,20 L100,100 L0,100 Z' fill='url(#chart-grad)'></path>
                  <polyline fill='none' points='0,80 15,70 30,85 45,50 60,65 75,30 90,45 100,20' stroke='#fdb813' strokeWidth='2'></polyline>
                </svg>
              </div>
            </div>
            <div className='absolute bottom-[-20px] left-6 right-0 flex justify-between text-on-surface-variant text-[10px] font-semibold'>
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
            </div>
          </div>
        </div>

        {/* Donut Chart */}
        <div className='lg:col-span-4 bg-surface-container rounded-lg p-6 border border-outline-variant/30 h-[320px] flex flex-col items-center justify-center relative'>
          <h3 className='text-sm font-semibold text-on-surface absolute top-6 left-6'>Brand Share</h3>
          <div className='relative w-[160px] h-[160px] rounded-full border-[16px] border-surface-variant'>
            <div className='absolute inset-[-16px] rounded-full' style={{ background: 'conic-gradient(#fdb813 0% 24.5%, transparent 24.5% 100%)' }}></div>
            <div className='absolute inset-[-16px] rounded-full border-[16px] border-surface-variant' style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 100%, 0 100%, 0 0, 50% 0)', transform: 'rotate(88.2deg)' }}></div>
            <div className='absolute inset-0 flex flex-col items-center justify-center bg-surface-container rounded-full z-10'>
              <span className='text-xl font-bold text-on-surface'>100%</span>
              <span className='text-xs text-on-surface-variant'>Total</span>
            </div>
          </div>
          <div className='flex space-x-4 mt-6 w-full justify-center'>
            <div className='flex items-center'>
              <div className='w-3 h-3 rounded-sm bg-surface-variant mr-2'></div>
              <span className='text-xs text-on-surface-variant'>National (75.5%)</span>
            </div>
            <div className='flex items-center'>
              <div className='w-3 h-3 rounded-sm bg-primary-container mr-2'></div>
              <span className='text-xs text-on-surface-variant'>Private (24.5%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Data Table */}
      <SKUDataTable
        items={skuData.items}
        total={skuData.total}
        page={page}
        limit={10}
        onPageChange={setPage}
        onSort={setSortBy}
        sortBy={sortBy}
      />
    </div>
  );
};

export default DashboardPage;
