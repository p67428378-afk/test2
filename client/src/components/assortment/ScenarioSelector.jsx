import React from 'react';

export default function ScenarioSelector({ selectedScenario, onSelectScenario }) {
  const scenarios = ['Conservative', 'Balanced', 'Aggressive'];

  return (
    <div className='dg-card rounded-xl p-4 shrink-0'>
      <h3 className='text-body-md font-body-md font-bold text-on-surface mb-3 flex items-center gap-1 text-sm'>
        <span className='material-symbols-outlined text-primary text-[18px]'>tune</span>
        Scenario Selector
      </h3>
      <div className='flex gap-2'>
        {scenarios.map((scenario) => {
          const isSelected = selectedScenario === scenario;
          return (
            <button
              key={scenario}
              onClick={() => onSelectScenario(scenario)}
              className={`flex-1 py-2 px-3 text-body-sm font-body-sm rounded transition-all text-xs ${
                isSelected
                  ? 'bg-[#1E293B] border-2 border-[#6366F1] text-on-surface font-bold relative overflow-hidden shadow-[inset_0_0_10px_rgba(99,102,241,0.2)]'
                  : 'bg-[#0F172A] border border-[#334155] text-on-surface-variant hover:border-[#475569]'
              }`}
            >
              {scenario}
              {isSelected && (
                <span className='material-symbols-outlined absolute top-0.5 right-0.5 text-[#6366F1] text-[14px]'>
                  check_circle
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}