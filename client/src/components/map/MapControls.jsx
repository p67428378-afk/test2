import React from 'react';

const MapControls = () => {
  return (
    <div className='flex flex-col bg-surface-container/80 backdrop-blur-lg rounded-full border border-outline-variant overflow-hidden w-10 ml-auto shadow-xl'>
      <button className='p-2.5 hover:bg-surface-container-high transition-colors'><span className='material-symbols-outlined text-sm'>add</span></button>
      <div className='h-px bg-outline-variant mx-2'></div>
      <button className='p-2.5 hover:bg-surface-container-high transition-colors'><span className='material-symbols-outlined text-sm'>remove</span></button>
      <div className='h-px bg-outline-variant mx-2'></div>
      <button className='p-2.5 hover:bg-surface-container-high transition-colors'><span className='material-symbols-outlined text-sm'>pan_tool</span></button>
    </div>
  );
};

export default MapControls;
