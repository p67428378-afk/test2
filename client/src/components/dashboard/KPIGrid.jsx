import React from 'react';

export default function KPIGrid({ summary }) {
  const formatCurrency = (value) => {
    if (value === undefined || value === null) return '$0.00';
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    return `$${value.toLocaleString()}`;
  };

  const totalRevenue = summary?.total_revenue || 1250000000;
  const totalExpenditure = summary?.total_expenditure || 980000000;
  const macro = summary?.macro_indicators || {
    gdp_growth_pct: 2.4,
    inflation_rate_pct: 3.1,
    unemployment_rate_pct: 4.2,
  };

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-gutter'>
      {/* KPI Card 1 */}
      <div className='bg-surface-container border border-outline-variant rounded-lg p-md flex flex-col justify-between hover:border-primary-container transition-colors relative overflow-hidden group'>
        <div className='absolute inset-0 bg-gradient-to-b from-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none'></div>
        <div className='flex justify-between items-start mb-lg'>
          <span className='text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider'>Total National Revenue</span>
          <span className='material-symbols-outlined text-secondary text-[20px]'>account_balance_wallet</span>
        </div>
        <div>
          <div className='text-headline-xl font-headline-xl text-on-surface mb-sm'>{formatCurrency(totalRevenue)}</div>
          <div className='flex items-center gap-xs text-secondary'>
            <span className='material-symbols-outlined text-[16px]'>trending_up</span>
            <span className='text-label-md font-label-md'>+4.2% vs last quarter</span>
          </div>
        </div>
      </div>

      {/* KPI Card 2 */}
      <div className='bg-surface-container border border-outline-variant rounded-lg p-md flex flex-col justify-between hover:border-primary-container transition-colors relative overflow-hidden group'>
        <div className='absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none'></div>
        <div className='flex justify-between items-start mb-lg'>
          <span className='text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider'>Total Dept. Expenditure</span>
          <span className='material-symbols-outlined text-primary text-[20px]'>payments</span>
        </div>
        <div>
          <div className='text-headline-xl font-headline-xl text-on-surface mb-sm'>{formatCurrency(totalExpenditure)}</div>
          <div className='flex items-center gap-xs text-primary'>
            <span className='material-symbols-outlined text-[16px]'>data_usage</span>
            <span className='text-label-md font-label-md'>
              {((totalExpenditure / totalRevenue) * 100).toFixed(1)}% of annual budget
            </span>
          </div>
        </div>
      </div>

      {/* KPI Card 3 */}
      <div className='bg-surface-container border border-outline-variant rounded-lg p-md flex flex-col justify-between hover:border-primary-container transition-colors relative overflow-hidden group'>
        <div className='absolute inset-0 bg-gradient-to-b from-transparent to-tertiary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none'></div>
        <div className='flex justify-between items-start mb-lg'>
          <span className='text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider'>Macro Indicators</span>
          <span className='material-symbols-outlined text-tertiary text-[20px]'>public</span>
        </div>
        <div className='grid grid-cols-3 gap-sm'>
          <div>
            <div className='text-label-sm font-label-sm text-on-surface-variant mb-1'>GDP</div>
            <div className='text-headline-md font-headline-md text-secondary'>+{macro.gdp_growth_pct}%</div>
          </div>
          <div>
            <div className='text-label-sm font-label-sm text-on-surface-variant mb-1'>Inflation</div>
            <div className='text-headline-md font-headline-md text-error'>{macro.inflation_rate_pct}%</div>
          </div>
          <div>
            <div className='text-label-sm font-label-sm text-on-surface-variant mb-1'>Unemploy.</div>
            <div className='text-headline-md font-headline-md text-on-surface'>{macro.unemployment_rate_pct}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
