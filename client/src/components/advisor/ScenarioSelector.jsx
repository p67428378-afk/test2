import React from 'react';

export default function ScenarioSelector({ selectedScenario, onSelectScenario }) {
  const scenarios = [
    {
      name: 'Conservative',
      sales: '+$1.2k',
      pbLift: '+0.5%',
      actions: '0 Grow, 4 Maintain, 0 Swap, 2 Reduce',
    },
    {
      name: 'Balanced',
      sales: '+$4.5k',
      pbLift: '+1.8%',
      actions: '2 Grow, 2 Maintain, 1 Swap, 1 Reduce',
      recommended: true,
    },
    {
      name: 'Aggressive',
      sales: '+$8.1k',
      pbLift: '+3.2%',
      actions: '4 Grow, 0 Maintain, 2 Swap, 0 Reduce',
    },
  ];

  return (
    <div className='bg-white border border-[#d1c6ab]/50 rounded-xl p-5 shadow-sm'>
      <h3 className='text-lg font-bold text-[#0b1c30] mb-4'>Scenario Modeling</h3>
      <div className='flex flex-col gap-3'>
        {scenarios.map((scen) => {
          const isActive = selectedScenario?.toLowerCase() === scen.name.toLowerCase();
          return (
            <div
              key={scen.name}
              onClick={() => onSelectScenario(scen.name)}
              className={`border rounded-lg p-4 cursor-pointer transition-all relative ${
                isActive
                  ? 'border-2 border-[#ffd200] bg-[#FFFBEB] shadow-[0_4px_12px_rgba(0,0,0,0.02)]'
                  : 'border-[#d1c6ab]/50 hover:border-[#ffd200]/50 hover:bg-[#f8f9ff]'
              }`}
            >
              {isActive && (
                <div className='absolute top-3 right-3 w-5 h-5 bg-[#ffd200] rounded-full flex items-center justify-center'>
                  <span className='material-symbols-outlined text-[14px] text-[#705b00] font-bold'>check</span>
                </div>
              )}
              <div className='flex justify-between items-center mb-2 pr-6'>
                <span className={`font-bold text-[#0b1c30] ${isActive ? 'text-[15px]' : 'text-sm'}`}>
                  {scen.name} {scen.recommended && '(Recommended)'}
                </span>
              </div>
              <div className='grid grid-cols-2 gap-2 text-xs text-[#4d4632]/80'>
                <div>
                  Proj. Sales:{' '}
                  <span className={`font-mono ${isActive ? 'font-bold text-[#10B981]' : 'text-[#0b1c30]'}`}>
                    {scen.sales}
                  </span>
                </div>
                <div>
                  PB Lift:{' '}
                  <span className={`font-mono ${isActive ? 'font-bold text-[#0b1c30]' : 'text-[#0b1c30]'}`}>
                    {scen.pbLift}
                  </span>
                </div>
                {isActive && (
                  <div className='col-span-2 mt-1 pt-1 border-t border-[#d1c6ab]/30 text-[11px] text-[#4d4632]/90'>
                    Actions: {scen.actions}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
