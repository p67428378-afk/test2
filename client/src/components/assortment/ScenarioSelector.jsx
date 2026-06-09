import React from 'react';

export const ScenarioSelector = ({ scenarios, selectedScenario, onSelectScenario }) => {
  const conservative = scenarios?.conservative ?? {
    name: 'Conservative',
    projected_sales_lift: 1.2,
    projected_private_brand_pct: 21.5,
  };
  const balanced = scenarios?.balanced ?? {
    name: 'Balanced',
    projected_sales_lift: 3.8,
    projected_private_brand_pct: 24.8,
  };
  const aggressive = scenarios?.aggressive ?? {
    name: 'Aggressive',
    projected_sales_lift: 6.5,
    projected_private_brand_pct: 28.2,
  };

  const renderCard = (key, data, isRecommended = false) => {
    const isSelected = selectedScenario === key;
    return (
      <div
        key={key}
        onClick={() => onSelectScenario(key)}
        className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 relative ${
          isSelected
            ? 'border-2 border-primary-container bg-yellow-50 shadow-sm'
            : 'border-outline-variant hover:border-primary-container bg-white'
        }`}
      >
        <div className='flex justify-between items-start'>
          <div>
            <div className='flex items-center gap-2'>
              <span className={`font-label-md ${isSelected ? 'font-bold text-on-surface' : 'text-secondary'}`}>
                {data.name || key.charAt(0).toUpperCase() + key.slice(1)}
              </span>
              {isRecommended && (
                <span className='bg-primary text-white text-[9px] px-1.5 py-0.5 rounded font-black'>
                  RECOMMENDED
                </span>
              )}
            </div>
            <p className={`text-headline-sm font-headline-sm mt-1 ${isSelected ? 'text-primary font-bold' : 'text-on-surface'}`}>
              +{data.projected_sales_lift?.toFixed(1)}% Lift
            </p>
            <p className='text-body-sm text-secondary mt-0.5'>
              {data.projected_private_brand_pct?.toFixed(1)}% Private Brand Mix
            </p>
          </div>
          {isSelected && (
            <span className='material-symbols-outlined text-primary' style={{ fontVariationSettings: "'FILL' 1" }}>
              check_circle
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className='flex flex-col gap-3 mb-6'>
      <label className='text-label-md text-secondary uppercase tracking-wider'>Select Scenario</label>
      <div className='grid grid-cols-1 gap-3'>
        {renderCard('conservative', conservative)}
        {renderCard('balanced', balanced, true)}
        {renderCard('aggressive', aggressive)}
      </div>
    </div>
  );
};

export default ScenarioSelector;