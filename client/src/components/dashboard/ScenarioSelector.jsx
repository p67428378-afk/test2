import React from 'react';

export default function ScenarioSelector({ scenarios, selectedScenario, onSelectScenario }) {
  // Fallback scenarios if API doesn't return them or is loading
  const defaultScenarios = [
    {
      name: 'Conservative',
      description: 'Minimal changes, stable core products.',
      projected_sales_growth: 1.2,
      projected_private_brand_pct: 18.0,
      projected_shelf_capacity: 85.0,
    },
    {
      name: 'Balanced',
      description: 'Optimal mix of growth and stability.',
      projected_sales_growth: 4.8,
      projected_private_brand_pct: 18.5,
      projected_shelf_capacity: 88.4,
    },
    {
      name: 'Aggressive',
      description: 'High-turnover swaps for maximum growth.',
      projected_sales_growth: 8.5,
      projected_private_brand_pct: 16.2,
      projected_shelf_capacity: 92.1,
    }
  ];

  const displayScenarios = scenarios && scenarios.length > 0 ? scenarios : defaultScenarios;

  return (
    <section aria-label='Scenario Selection' className='grid grid-cols-1 lg:grid-cols-3 gap-gutter'>
      {displayScenarios.map((scenario) => {
        const isSelected = selectedScenario?.toLowerCase() === scenario.name?.toLowerCase();
        const isAggressive = scenario.name?.toLowerCase() === 'aggressive';
        
        return (
          <div
            key={scenario.name}
            onClick={() => onSelectScenario(scenario.name)}
            className={`bg-surface-container-lowest rounded-lg p-md shadow-sm hover:shadow transition-all cursor-pointer relative overflow-hidden flex flex-col border-2 ${isSelected ? 'border-primary-container shadow-md' : 'border-surface-variant hover:border-outline-variant'}`}
          >
            {isSelected && (
              <div className='absolute top-0 right-0 bg-primary-container text-on-primary-container font-label-sm text-[10px] px-2 py-1 rounded-bl-lg uppercase font-bold tracking-wide'>
                Active Plan
              </div>
            )}
            <h3 className='font-headline-sm text-headline-sm text-on-surface mb-2 flex items-center'>
              {scenario.name}
              {isSelected && (
                <span className='material-symbols-outlined text-primary-container ml-2 text-[20px]'>check_circle</span>
              )}
            </h3>
            <p className='font-body-md text-body-md text-on-surface-variant mb-4 flex-1'>
              {scenario.description}
            </p>
            <div className='bg-surface-container-low rounded p-3 grid grid-cols-3 gap-2 font-data-tabular text-data-tabular text-sm text-center'>
              <div>
                <div className='text-on-surface-variant font-label-sm text-[10px] uppercase mb-1'>Sales</div>
                <div className='text-[#166534] font-medium'>+{scenario.projected_sales_growth?.toFixed(1)}%</div>
              </div>
              <div>
                <div className='text-on-surface-variant font-label-sm text-[10px] uppercase mb-1'>PB %</div>
                <div className='text-on-surface font-medium'>{scenario.projected_private_brand_pct?.toFixed(1)}%</div>
              </div>
              <div>
                <div className='text-on-surface-variant font-label-sm text-[10px] uppercase mb-1'>Capacity</div>
                <div className={`font-medium ${isAggressive ? 'text-[#991B1B]' : 'text-on-surface'}`}>
                  {scenario.projected_shelf_capacity?.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}