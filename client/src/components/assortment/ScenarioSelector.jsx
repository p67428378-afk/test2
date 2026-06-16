import React from 'react';

export default function ScenarioSelector({ selectedScenario, onSelectScenario }) {
  const scenarios = [
    {
      id: 'conservative',
      name: 'Conservative',
      salesPerFt: '$118.00/ft',
      pbPercentage: '21.0% PB',
    },
    {
      id: 'balanced',
      name: 'Balanced',
      salesPerFt: '$125.50/ft',
      pbPercentage: '22.5% PB',
    },
    {
      id: 'aggressive',
      name: 'Aggressive',
      salesPerFt: '$135.00/ft',
      pbPercentage: '25.0% PB',
    },
  ];

  return (
    <div className='bg-surface-container-lowest border border-outline-variant rounded-lg shadow-sm p-4'>
      <h3 className='font-headline-md text-headline-md font-bold text-on-surface mb-4'>
        Select Assortment Scenario
      </h3>
      <div className='flex flex-col gap-3'>
        {scenarios.map((scenario) => {
          const isActive = selectedScenario.toLowerCase() === scenario.id;
          return (
            <div
              key={scenario.id}
              onClick={() => onSelectScenario(scenario.id)}
              className={`border rounded-DEFAULT p-3 cursor-pointer transition-all relative ${
                isActive
                  ? 'border-2 border-primary-container bg-surface-container-low shadow-sm'
                  : 'border-outline-variant hover:border-secondary'
              }`}
            >
              {isActive && (
                <div className='absolute top-3 right-3 text-primary-container bg-on-surface rounded-full w-5 h-5 flex items-center justify-center'>
                  <span className='material-symbols-outlined text-[14px] font-bold'>check</span>
                </div>
              )}
              <div className={`font-label-bold text-label-bold uppercase mb-1 ${isActive ? 'text-on-surface' : 'text-secondary'}`}>
                {scenario.name} {isActive && '(Selected)'}
              </div>
              <div className='flex justify-between items-end'>
                <span className={`font-body-lg text-body-lg ${isActive ? 'font-bold text-on-surface' : 'font-medium'}`}>
                  {scenario.salesPerFt}
                </span>
                <span className={`font-body-md text-body-md ${isActive ? 'font-medium text-on-surface' : 'text-secondary'}`}>
                  {scenario.pbPercentage}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
