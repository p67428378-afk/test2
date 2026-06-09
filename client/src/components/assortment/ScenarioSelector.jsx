import React from 'react';

export default function ScenarioSelector({ scenarios, selectedScenarioId, onSelectScenario }) {
  return (
    <div className='bg-surface-container-lowest rounded-lg shadow-level-1 border border-outline-variant/30 p-md flex flex-col gap-sm'>
      <h2 className='font-headline-sm text-headline-sm font-bold text-on-surface mb-2'>Select Scenario</h2>
      
      {scenarios.map((scenario) => {
        const isSelected = scenario.id === selectedScenarioId;
        return (
          <label
            key={scenario.id}
            onClick={() => onSelectScenario(scenario.id)}
            className={`flex flex-col p-3 border rounded-lg cursor-pointer transition-colors relative ${
              isSelected
                ? 'border-2 border-primary-container bg-surface'
                : 'border-outline-variant hover:bg-surface'
            }`}
          >
            {isSelected && (
              <div className='absolute top-2 right-2 text-primary-container'>
                <span className='material-symbols-outlined text-[18px]' style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              </div>
            )}
            <div className='flex items-center justify-between mb-1 pr-6'>
              <span className='font-bold text-on-surface'>{scenario.name}</span>
              {!isSelected && (
                <input
                  className='text-primary-container focus:ring-primary-container'
                  name='scenario'
                  type='radio'
                  checked={false}
                  readOnly
                />
              )}
            </div>
            <span className='text-xs text-on-surface-variant'>
              {scenario.description || `Projected PB: ${scenario.projected_private_brand_pct}%`}
            </span>
          </label>
        );
      })}
    </div>
  );
}
