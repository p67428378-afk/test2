import React from 'react';

export default function ScenarioSelector({
  scenarios,
  selectedScenario,
  onSelectScenario,
}) {
  // Fallback default scenarios if API is loading or empty
  const defaultScenarios = [
    { name: 'Conservative', sales_lift: 1.2, pb_change: 0.5 },
    { name: 'Balanced', sales_lift: 3.5, pb_change: 2.1 },
    { name: 'Aggressive', sales_lift: 6.8, pb_change: -1.5 },
  ];

  const displayScenarios = scenarios && scenarios.length > 0 ? scenarios : defaultScenarios;

  return (
    <div className='flex flex-col gap-3'>
      <h2 className='font-headline-sm text-headline-sm dark-slate mb-1'>Scenario Selection</h2>
      {displayScenarios.map((scenario) => {
        const isSelected = selectedScenario.toLowerCase() === scenario.name.toLowerCase();
        return (
          <div
            key={scenario.name}
            onClick={() => onSelectScenario(scenario.name)}
            className={`border rounded-lg p-4 cursor-pointer card-shadow transition-all ${
              isSelected
                ? 'border-2 border-primary-container bg-primary-container/10 relative'
                : 'border-gray bg-surface-container-lowest hover:border-outline'
            }`}
          >
            <div className='flex justify-between items-center mb-2'>
              <h3 className='font-body-lg text-body-lg font-semibold text-on-surface'>
                {scenario.name}
              </h3>
              <span
                className={`material-symbols-outlined ${
                  isSelected ? 'text-primary-container' : 'text-on-surface-variant opacity-0'
                }`}
                style={isSelected ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                check_circle
              </span>
            </div>
            <div className='flex gap-4 text-sm'>
              <div>
                <span className='text-on-surface-variant'>Sales Lift:</span>{' '}
                <span className='font-medium text-green-600'>
                  +{scenario.sales_lift.toFixed(1)}%
                </span>
              </div>
              <div>
                <span className='text-on-surface-variant'>PB Change:</span>{' '}
                <span className={`font-medium ${scenario.pb_change >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  {scenario.pb_change >= 0 ? '+' : ''}
                  {scenario.pb_change.toFixed(1)}%
                </span>
              </div>
            </div>
            {scenario.description && (
              <p className='text-xs text-on-surface-variant mt-2 italic'>
                {scenario.description}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
