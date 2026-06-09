import React from 'react';

export default function ScenarioSelector({ scenarios, selectedScenario, onSelectScenario }) {
  const scenarioKeys = ['conservative', 'balanced', 'aggressive'];

  return (
    <div className='flex flex-col gap-3 mb-6'>
      <label className='text-label-md text-secondary uppercase tracking-wider'>Select Scenario</label>
      <div className='grid grid-cols-1 gap-3'>
        {scenarioKeys.map((key) => {
          const scenario = scenarios[key];
          if (!scenario) return null;

          const isSelected = selectedScenario === key;

          return (
            <div
              key={key}
              onClick={() => onSelectScenario(key)}
              className={`p-4 border rounded-xl cursor-pointer transition-all relative ${
                isSelected
                  ? 'border-2 border-primary-container bg-yellow-50/50 shadow-sm'
                  : 'border-outline-variant hover:border-primary-container bg-surface-container-lowest'
              }`}
            >
              <div className='flex justify-between items-start'>
                <div>
                  <div className='flex items-center gap-2'>
                    <span className={`font-label-md ${isSelected ? 'font-bold text-on-surface' : 'text-secondary'}`}>
                      {scenario.name}
                    </span>
                    {key === 'balanced' && (
                      <span className='bg-primary text-white text-[9px] px-1.5 py-0.5 rounded font-black'>
                        RECOMMENDED
                      </span>
                    )}
                  </div>
                  <p className={`text-headline-sm font-headline-sm mt-1 ${isSelected ? 'text-primary font-bold' : 'text-on-surface'}`}>
                    +{scenario.projected_sales_lift}% Lift
                  </p>
                  <p className='text-body-sm text-secondary'>
                    {scenario.projected_private_brand_pct}% Private Brand Mix
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
        })}
      </div>
    </div>
  );
}
