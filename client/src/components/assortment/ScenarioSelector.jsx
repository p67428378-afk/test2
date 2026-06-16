import React from 'react';

export default function ScenarioSelector({ scenarios, selectedScenario, onSelectScenario, loading, error }) {
  if (loading) {
    return (
      <div className='bg-surface-container border border-outline-variant rounded-xl p-md animate-pulse'>
        <div className='h-6 bg-[#334155] rounded mb-4 w-1/3'></div>
        <div className='space-y-3'>
          {[1, 2, 3].map((i) => (
            <div key={i} className='h-20 bg-[#334155] rounded'></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='bg-red-900/20 border border-red-800 text-red-400 p-md rounded-xl'>
        Failed to load scenarios.
      </div>
    );
  }

  return (
    <div className='bg-surface-container border border-outline-variant rounded-xl p-md' id='scenario-modeling'>
      <h3 className='font-title-sm text-title-sm text-on-surface mb-sm'>Scenario Modeling</h3>
      <div className='flex flex-col gap-sm'>
        {scenarios.map((scenario) => {
          const isSelected = selectedScenario?.id === scenario.id;
          
          return (
            <div
              key={scenario.id}
              onClick={() => onSelectScenario(scenario)}
              className={`border rounded-lg p-sm bg-[#1E293B] cursor-pointer transition-all relative ${
                isSelected
                  ? 'border-2 border-[#FFD100] shadow-[0_0_15px_rgba(255,209,0,0.1)]'
                  : 'border-[#334155] hover:border-surface-container-highest'
              }`}
            >
              {isSelected && (
                <span className='material-symbols-outlined absolute top-sm right-sm text-[#FFD100] text-lg'>
                  check_circle
                </span>
              )}
              <div className={`font-bold text-sm ${isSelected ? 'text-[#FFD100]' : 'text-on-surface'} mb-1`}>
                {scenario.name} Scenario
              </div>
              <p className='text-xs text-on-surface-variant mb-2'>{scenario.description}</p>
              
              <div className='grid grid-cols-2 gap-2 mt-2 border-t border-[#334155]/50 pt-2'>
                <div>
                  <div className='text-[10px] text-on-surface-variant uppercase font-bold'>Proj. Sales</div>
                  <div className='text-xs font-mono-data text-on-surface'>
                    ${scenario.projected_sales.toFixed(2)}/ft
                  </div>
                </div>
                <div>
                  <div className='text-[10px] text-on-surface-variant uppercase font-bold'>Private Brand</div>
                  <div className='text-xs font-mono-data text-on-surface'>
                    {scenario.projected_pb_percentage.toFixed(1)}%
                  </div>
                </div>
                <div className='mt-1'>
                  <div className='text-[10px] text-on-surface-variant uppercase font-bold'>In-Stock Rate</div>
                  <div className='text-xs font-mono-data text-on-surface'>
                    {scenario.projected_in_stock_rate.toFixed(1)}%
                  </div>
                </div>
                <div className='mt-1'>
                  <div className='text-[10px] text-on-surface-variant uppercase font-bold'>Shelf Capacity</div>
                  <div className='text-xs font-mono-data text-on-surface'>
                    {scenario.projected_shelf_capacity.toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
