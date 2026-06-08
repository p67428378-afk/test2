import React from 'react';

export default function DepartmentalBudgetTable({ departments }) {
  const formatCurrency = (value) => {
    if (value === undefined || value === null) return '$0.00';
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    return `$${value.toLocaleString()}`;
  };

  return (
    <div className='bg-surface-container border border-outline-variant rounded-lg overflow-hidden'>
      <div className='p-md border-b border-outline-variant flex justify-between items-center bg-surface-container-high'>
        <h3 className='text-headline-md font-headline-md text-on-surface'>Departmental Budget Variance</h3>
        <span className='text-label-sm font-label-sm text-tertiary bg-tertiary-container/10 px-2 py-1 rounded border border-tertiary-container/20'>
          ⚠️ Variances &gt; 5% Highlighted
        </span>
      </div>
      <div className='overflow-x-auto'>
        <table className='w-full text-left border-collapse'>
          <thead>
            <tr className='bg-surface-container-highest'>
              <th className='px-md py-sm text-label-md font-label-md text-on-surface-variant uppercase tracking-wider border-b border-outline-variant'>Department</th>
              <th className='px-md py-sm text-label-md font-label-md text-on-surface-variant uppercase tracking-wider border-b border-outline-variant text-right'>Allocated Budget</th>
              <th className='px-md py-sm text-label-md font-label-md text-on-surface-variant uppercase tracking-wider border-b border-outline-variant text-right'>Actual Spending</th>
              <th className='px-md py-sm text-label-md font-label-md text-on-surface-variant uppercase tracking-wider border-b border-outline-variant text-right'>Variance Amount</th>
              <th className='px-md py-sm text-label-md font-label-md text-on-surface-variant uppercase tracking-wider border-b border-outline-variant text-right'>Variance %</th>
              <th className='px-md py-sm text-label-md font-label-md text-on-surface-variant uppercase tracking-wider border-b border-outline-variant'>Status</th>
            </tr>
          </thead>
          <tbody className='text-body-md font-body-md divide-y divide-outline-variant'>
            {departments && departments.map((dept, index) => {
              const variancePct = dept.variance_pct !== undefined ? dept.variance_pct : ((dept.actual_spending - dept.allocated_budget) / dept.allocated_budget) * 100;
              const isHighVariance = Math.abs(variancePct) > 5 || dept.highlight;

              return (
                <tr key={index} className={`hover:bg-surface-bright transition-colors group ${isHighVariance ? 'bg-error-container/5' : ''}`}>
                  <td className='px-md py-sm text-on-surface font-medium'>{dept.department_name}</td>
                  <td className='px-md py-sm text-on-surface text-right font-mono'>{formatCurrency(dept.allocated_budget)}</td>
                  <td className='px-md py-sm text-on-surface text-right font-mono'>{formatCurrency(dept.actual_spending)}</td>
                  <td className={`px-md py-sm text-right font-mono ${dept.variance_amount > 0 ? 'text-error' : 'text-secondary'}`}>
                    {dept.variance_amount > 0 ? '+' : ''}{formatCurrency(dept.variance_amount)}
                  </td>
                  <td className={`px-md py-sm text-right font-mono font-bold ${isHighVariance ? 'text-error' : 'text-on-surface-variant'}`}>
                    {variancePct > 0 ? '+' : ''}{variancePct.toFixed(1)}%
                  </td>
                  <td className='px-md py-sm'>
                    {isHighVariance ? (
                      <span className='inline-flex items-center px-2 py-0.5 rounded text-label-sm font-label-sm bg-error-container text-error border border-error/20'>
                        Action Required
                      </span>
                    ) : (
                      <span className='inline-flex items-center px-2 py-0.5 rounded text-label-sm font-label-sm bg-secondary/10 text-secondary border border-secondary/20'>
                        Within Limit
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
