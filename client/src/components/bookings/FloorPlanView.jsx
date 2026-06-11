import React from 'react';
import CubicleCard from './CubicleCard.jsx';

export default function FloorPlanView({ cubicles, selectedCubicle, onSelectCubicle, loading }) {
  return (
    <div className='lg:col-span-8 bg-surface-override border border-outline-override rounded-lg p-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.15)]'>
      <div className='flex justify-between items-center mb-6 pb-4 border-b border-outline-override'>
        <div>
          <h3 className='font-semibold text-lg text-white'>Floor 1, Zone A</h3>
          <p className='text-sm text-on-surface-variant mt-1'>Select an available workspace to view details.</p>
        </div>
        <div className='flex gap-4'>
          <div className='flex items-center gap-2'>
            <div className='w-3 h-3 rounded-full bg-emerald-override/20 border border-emerald-override'></div>
            <span className='text-xs font-semibold text-on-surface-variant'>Available</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-3 h-3 rounded-full bg-rose-override/20 border border-rose-override'></div>
            <span className='text-xs font-semibold text-on-surface-variant'>Occupied</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className='flex justify-center items-center py-12'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-override'></div>
        </div>
      ) : cubicles.length === 0 ? (
        <div className='text-center py-12 text-on-surface-variant'>
          <span className='material-symbols-outlined text-4xl mb-2 block'>info</span>
          <p className='text-sm'>No available cubicles</p>
        </div>
      ) : (
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
          {cubicles.map((cubicle) => (
            <CubicleCard
              key={cubicle.id}
              cubicle={cubicle}
              isSelected={selectedCubicle && selectedCubicle.id === cubicle.id}
              onSelect={() => onSelectCubicle(cubicle)}
            />
          ))}
        </div>
      )}
    </div>
  );
}