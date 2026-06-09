import React from 'react';

export default function ScenarioSelector({ selectedScenario, onSelectScenario }) {
  const scenarios = [
    {
      id: 'conservative',
      name: 'Conservative',
      description: 'Minimal changes, low risk.',
      icon: 'radio_button_unchecked',
      activeIcon: 'radio_button_checked',
      borderClass: 'border-[#334155] hover:bg-[#273647]/50',
      selectedClass: 'border-2 border-[#F59E0B] bg-[#F59E0B]/5',
    },
    {
      id: 'balanced',
      name: 'Balanced',
      description: 'Optimal mix of growth and stability.',
      icon: 'radio_button_unchecked',
      activeIcon: 'radio_button_checked',
      borderClass: 'border-[#334155] hover:bg-[#273647]/50',
      selectedClass: 'border-2 border-[#F59E0B] bg-[#F59E0B]/5',
    },
    {
      id: 'aggressive',
      name: 'Aggressive',
      description: 'High churn, potential violation.',
      icon: 'warning',
      activeIcon: 'warning',
      borderClass: 'border-rose-500/50 bg-rose-500/5 hover:bg-rose-500/10',
      selectedClass: 'border-2 border-rose-500 bg-rose-500/10',
    },
  ];

  return (
    <div className='bg-[#1E293B] border border-[#334155] rounded-xl flex flex-col p-5'>
      <h3 className='text-lg font-semibold text-white mb-4 border-b border-[#334155] pb-2'>Scenario Selector</h3>
      <div className='flex flex-col gap-3'>
        {scenarios.map((scenario) => {
          const isSelected = selectedScenario === scenario.id;
          return (
            <div
              key={scenario.id}
              className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                isSelected ? scenario.selectedClass : scenario.borderClass
              }`}
              onClick={() => onSelectScenario(scenario.id)}
            >
              <div className='flex justify-between items-center'>
                <span className='text-base text-white font-medium'>{scenario.name}</span>
                <span
                  className={`material-symbols-outlined ${
                    isSelected
                      ? scenario.id === 'aggressive'
                        ? 'text-rose-500'
                        : 'text-[#F59E0B]'
                      : scenario.id === 'aggressive'
                      ? 'text-rose-500/70'
                      : 'text-[#d8c3ad]'
                  }`}
                  style={{ fontSize: '20px', fontVariationSettings: isSelected ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {isSelected ? scenario.activeIcon : scenario.icon}
                </span>
              </div>
              <p className={`mt-1 text-sm ${scenario.id === 'aggressive' ? 'text-rose-400/80' : 'text-[#d8c3ad]'}`}>
                {scenario.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
