import React, { useState, useEffect } from 'react';
import AppLayout from '../components/layout/AppLayout.jsx';
import KPIGrid from '../components/dashboard/KPIGrid.jsx';
import RecentRevenueTable from '../components/dashboard/RecentRevenueTable.jsx';
import { getDashboardSummary } from '../services/api';

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await getDashboardSummary();
        setSummary(data);
      } catch (err) {
        console.error('Failed to fetch dashboard summary:', err);
        setError('Failed to load real-time fiscal data.');
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  return (
    <AppLayout title="Fiscal Overview" subtitle="Real-time national financial status">
      {loading ? (
        <div className='flex items-center justify-center h-64'>
          <div className='text-headline-md text-on-surface-variant'>Loading real-time fiscal data...</div>
        </div>
      ) : error ? (
        <div className='bg-error-container/20 border border-error/30 text-error p-md rounded-lg text-center'>
          {error}
        </div>
      ) : (
        <>
          <KPIGrid summary={summary} />

          {/* Charts Row (8:4 Split) */}
          <div className='grid grid-cols-1 xl:grid-cols-12 gap-gutter'>
            {/* Main Chart (8 col) */}
            <div className='xl:col-span-8 bg-surface-container border border-outline-variant rounded-lg p-md flex flex-col'>
              <div className='flex justify-between items-center mb-lg'>
                <h3 className='text-headline-md font-headline-md text-on-surface'>Revenue vs. Expenditure Trend</h3>
                <div className='flex items-center gap-md'>
                  <div className='flex items-center gap-xs'>
                    <div className='w-3 h-3 rounded-full bg-secondary'></div>
                    <span className='text-label-sm font-label-sm text-on-surface-variant'>Revenue</span>
                  </div>
                  <div className='flex items-center gap-xs'>
                    <div className='w-3 h-3 rounded-full bg-primary'></div>
                    <span className='text-label-sm font-label-sm text-on-surface-variant'>Expenditure</span>
                  </div>
                </div>
              </div>
              {/* Pseudo Chart Area */}
              <div className='flex-1 relative min-h-[300px] border-l border-b border-outline-variant mt-sm'>
                <div className='absolute inset-0 flex flex-col justify-between pointer-events-none'>
                  <div className='border-t border-outline-variant/30 w-full'></div>
                  <div className='border-t border-outline-variant/30 w-full'></div>
                  <div className='border-t border-outline-variant/30 w-full'></div>
                  <div className='border-t border-outline-variant/30 w-full'></div>
                  <div className='border-t border-outline-variant/30 w-full'></div>
                </div>
                <div className='absolute inset-0 flex items-end opacity-80'>
                  <div className='w-full h-3/4 bg-gradient-to-t from-primary/20 to-transparent border-t-2 border-primary' style={{ clipPath: 'polygon(0 80%, 20% 75%, 40% 60%, 60% 70%, 80% 50%, 100% 40%, 100% 100%, 0% 100%)' }}></div>
                </div>
                <div className='absolute inset-0 flex items-end opacity-80'>
                  <div className='w-full h-full bg-gradient-to-t from-secondary/20 to-transparent border-t-2 border-secondary' style={{ clipPath: 'polygon(0 90%, 20% 85%, 40% 70%, 60% 80%, 80% 60%, 100% 30%, 100% 100%, 0% 100%)' }}></div>
                </div>
                <div className='absolute -bottom-6 left-0 right-0 flex justify-between text-label-sm font-label-sm text-on-surface-variant px-sm'>
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                </div>
              </div>
            </div>

            {/* Donut Chart (4 col) */}
            <div className='xl:col-span-4 bg-surface-container border border-outline-variant rounded-lg p-md flex flex-col'>
              <div className='flex justify-between items-center mb-lg'>
                <h3 className='text-headline-md font-headline-md text-on-surface'>Expenditure by Sector</h3>
              </div>
              <div className='flex-1 flex flex-col justify-center gap-lg'>
                <div className='relative w-48 h-48 mx-auto'>
                  <svg className='w-full h-full transform -rotate-90' viewBox="0 0 100 100">
                    <circle cx="50" cy="50" fill="transparent" r="40" stroke="#2d3449" strokeWidth="20"></circle>
                    <circle cx="50" cy="50" fill="transparent" r="40" stroke="#c0c1ff" strokeDasharray="87.9 251.2" strokeDashoffset="0" strokeWidth="20"></circle>
                    <circle cx="50" cy="50" fill="transparent" r="40" stroke="#4edea3" strokeDasharray="62.8 251.2" strokeDashoffset="-87.9" strokeWidth="20"></circle>
                    <circle cx="50" cy="50" fill="transparent" r="40" stroke="#8083ff" strokeDasharray="50.2 251.2" strokeDashoffset="-150.7" strokeWidth="20"></circle>
                  </svg>
                  <div className='absolute inset-0 flex flex-col items-center justify-center'>
                    <span className='text-headline-lg font-headline-lg text-on-surface leading-none'>100%</span>
                    <span className='text-label-sm font-label-sm text-on-surface-variant mt-1'>Total Budget</span>
                  </div>
                </div>
                <div className='space-y-sm'>
                  <div className='flex items-center justify-between text-label-sm font-label-sm'>
                    <div className='flex items-center gap-sm'><div className='w-3 h-3 rounded bg-primary'></div><span className='text-on-surface'>Social Services</span></div>
                    <span className='text-on-surface-variant'>35%</span>
                  </div>
                  <div className='flex items-center justify-between text-label-sm font-label-sm'>
                    <div className='flex items-center gap-sm'><div className='w-3 h-3 rounded bg-secondary'></div><span className='text-on-surface'>Defence</span></div>
                    <span className='text-on-surface-variant'>25%</span>
                  </div>
                  <div className='flex items-center justify-between text-label-sm font-label-sm'>
                    <div className='flex items-center gap-sm'><div className='w-3 h-3 rounded bg-primary-container'></div><span className='text-on-surface'>Infrastructure</span></div>
                    <span className='text-on-surface-variant'>20%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <RecentRevenueTable streams={summary?.revenue_streams} />
        </>
      )}
    </AppLayout>
  );
}
