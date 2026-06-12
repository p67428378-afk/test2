import React from 'react';

const STAGES = ['Seeding', 'Sprouting', 'Vegetative', 'Flowering', 'Harvested'];

export default function GrowthTimeline({ batch, onUpdateStage }) {
  if (!batch) return null;

  const currentStageIndex = STAGES.indexOf(batch.growth_stage);

  return (
    <div className='card-level-1 rounded-xl p-6 micro-shadow space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h3 className='font-headline-sm text-headline-sm text-primary font-bold'>
            Growth Stage: {batch.growth_stage}
          </h3>
          <p className='font-label-sm text-on-surface-variant mt-1'>
            Batch ID: {batch.batch_id.substring(0, 8).toUpperCase()} • {batch.flower_type || 'Unknown'}
          </p>
        </div>
        <div className='flex gap-2'>
          {STAGES.map((stage, idx) => (
            <button
              key={stage}
              onClick={() => onUpdateStage(batch.batch_id, stage)}
              disabled={idx === currentStageIndex}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                idx === currentStageIndex
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
              }`}
            >
              {stage}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Timeline */}
      <div className='relative flex justify-between items-center pt-4'>
        <div className='absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-surface-container-high z-0'></div>
        <div
          className='absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary transition-all duration-500 z-0'
          style={{ width: `${(currentStageIndex / (STAGES.length - 1)) * 100}%` }}
        ></div>

        {STAGES.map((stage, idx) => {
          const isCompleted = idx <= currentStageIndex;
          const isActive = idx === currentStageIndex;

          return (
            <div key={stage} className='relative z-10 flex flex-col items-center'>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  isActive
                    ? 'bg-primary border-primary text-on-primary scale-110 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                    : isCompleted
                    ? 'bg-primary/20 border-primary text-primary'
                    : 'bg-[#1E293B] border-outline-variant text-on-surface-variant'
                }`}
              >
                {isCompleted ? (
                  <span className='material-symbols-outlined text-[16px] font-bold'>check</span>
                ) : (
                  <span className='text-xs font-bold'>{idx + 1}</span>
                )}
              </div>
              <span
                className={`text-xs font-bold mt-2 transition-colors ${
                  isActive ? 'text-primary' : 'text-on-surface-variant'
                }`}
              >
                {stage}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}