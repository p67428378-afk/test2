import React from 'react';

export default function ScenarioSelector({ scenarios, selectedScenario, onSelectScenario }) {
  const conservative = scenarios?.conservative ?? {
    name: 'Conservative',
    projected_sales_lift: 1.2,
    projected_private_brand_pct: 21.5,
    actions_summary: 'Focus on low-risk swaps and maintaining current high-performers.',
  };

  const balanced = scenarios?.balanced ?? {
    name: 'Balanced',
    projected_sales_lift: 3.8,
    projected_private_brand_pct: 24.8,
    actions_summary: 'Optimize shelf space with moderate private brand expansion.',
  };

  const aggressive = scenarios?.aggressive ?? {
    name: 'Aggressive',
    projected_sales_lift: 6.5,
    projected_private_brand_pct: 28.2,
    actions_summary: 'Aggressively swap national brands for high-margin private brands.',
  };

  const renderCard = (scenarioKey, data, isRecommended = false) => {
    const isSelected = selectedScenario === scenarioKey;
    
    return (
      <div
        key={scenarioKey}
        onClick={() => onSelectScenario(scenarioKey)}
        className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 relative flex flex-col justify-between h-full ${
          isSelected
            ? 'border-2 border-primary-container bg-yellow-50/50 shadow-sm'
            : 'border-outline-variant hover:border-primary-container bg-surface-container-lowest'
        }`}
      >
        <div>
          <div className='flex justify-between items-start mb-2'>
            <div className='flex items-center gap-2'>
              <span className={`font-label-md font-bold ${isSelected ? 'text-on-surface' : 'text-secondary'}`}>
                {data.name}
              </span>
              {isRecommended && (
                <span className='bg-primary text-white text-[9px] px-1.5 py-0.5 rounded font-black tracking-wider'>
                  RECOMMENDED
                </span>
              )}
            </div>
            {isSelected && (
              <span className='material-symbols-outlined text-primary' style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
            )}
          </div>
          <p className={`text-headline-sm font-headline-sm mt-1 ${isSelected ? 'text-primary font-bold' : 'text-on-surface'}`}>
            +{data.projected_sales_lift?.toFixed(1)}% Lift
          </p>
          <p className='text-body-sm text-secondary mt-1'>
            {data.projected_private_brand_pct?.toFixed(1)}% Private Brand Mix
          </p>
        </div>
        <p className='text-body-sm text-secondary mt-3 border-t border-outline-variant/50 pt-2 italic'>
          {data.actions_summary}
        </p>
      </div>
    );
  };

  return (
    <div className='flex flex-col gap-3 mb-6'>
      <label className='text-label-md text-secondary uppercase tracking-wider block'>Select Scenario</label>
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
        {renderCard('conservative', conservative)}
        {renderCard('balanced', balanced, true)}
        {renderCard('aggressive', aggressive)}
      </div>
    </div>
  );
}
