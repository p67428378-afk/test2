import React from 'react';

const LayerToggles = () => {
  return (
    <div className='bg-surface-container/80 backdrop-blur-lg p-3 rounded-xl border border-outline-variant shadow-2xl w-56'>
      <div className='flex items-center justify-between mb-3 border-b border-outline-variant pb-2'>
        <span className='font-label-md text-label-md text-primary tracking-widest uppercase'>Layers</span>
        <span className='material-symbols-outlined text-on-surface-variant text-sm cursor-pointer'>layers</span>
      </div>
      <div className='space-y-2'>
        <label className='flex items-center justify-between group cursor-pointer'>
          <span className='font-body-sm text-body-sm text-on-surface'>Radar</span>
          <div className='w-8 h-4 bg-primary-container rounded-full relative transition-colors'>
            <div className='absolute right-0.5 top-0.5 w-3 h-3 bg-on-primary-container rounded-full'></div>
          </div>
        </label>
        <label className='flex items-center justify-between group cursor-pointer'>
          <span className='font-body-sm text-body-sm text-on-surface-variant opacity-60'>Satellite</span>
          <div className='w-8 h-4 bg-surface-container-high rounded-full relative transition-colors'>
            <div className='absolute left-0.5 top-0.5 w-3 h-3 bg-outline rounded-full'></div>
          </div>
        </label>
        <label className='flex items-center justify-between group cursor-pointer'>
          <span className='font-body-sm text-body-sm text-on-surface'>Sensor Data</span>
          <div className='w-8 h-4 bg-primary-container rounded-full relative transition-colors'>
            <div className='absolute right-0.5 top-0.5 w-3 h-3 bg-on-primary-container rounded-full'></div>
          </div>
        </label>
        <label className='flex items-center justify-between group cursor-pointer'>
          <span className='font-body-sm text-body-sm text-on-surface-variant opacity-60'>NWP Model</span>
          <div className='w-8 h-4 bg-surface-container-high rounded-full relative transition-colors'>
            <div className='absolute left-0.5 top-0.5 w-3 h-3 bg-outline rounded-full'></div>
          </div>
        </label>
        <label className='flex items-center justify-between group cursor-pointer'>
          <span className='font-body-sm text-body-sm text-on-surface'>Warnings</span>
          <div className='w-8 h-4 bg-primary-container rounded-full relative transition-colors'>
            <div className='absolute right-0.5 top-0.5 w-3 h-3 bg-on-primary-container rounded-full'></div>
          </div>
        </label>
      </div>
    </div>
  );
};

export default LayerToggles;
