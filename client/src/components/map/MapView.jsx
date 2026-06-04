import React from 'react';
import MapControls from './MapControls';
import LayerToggles from './LayerToggles';
import TimeSlider from './TimeSlider';

const MapView = () => {
  return (
    <div className='relative flex-1 bg-[#05070A] overflow-hidden flex items-center justify-center'>
      <div className='absolute inset-0 z-0 bg-center bg-cover' style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC6DTYrxI_W8iUZUc8tt6PFPa4zaXLI081T5ygu57lunYTfSabBIm2tSB225OWsQbcx3MEa-VATmUwgF3S3Ltbk4V0TM-8iG7v-NaoX7qk2x1X9ypHrF2Hy_KkFYw3NgTs3ewOmiiwHqUyim4sOCqLeOJgbrKJ_vdGfI_XQNeceiRXSafg6MbO7q9w7OVyiX6ZD3aJiN5tr1wQLR_ClQ6duP0NZ3Pgb6NA6IxdCHC6A15rJ7Pg5Hwl98vIsCrUfOY2U4IMPiu9MuPw')"}}>
        <div className='absolute inset-0 map-gradient-overlay'></div>
        <svg className='absolute inset-0 w-full h-full pointer-events-none opacity-60' viewBox='0 0 1000 1000'>
          <path className='animate-pulse' d='M400,300 Q450,280 500,350 T600,300' fill='none' stroke='#4a8eff' strokeWidth='2'></path>
          <circle className='animate-pulse opacity-40' cx='500' cy='400' fill='url(#radar-grad)' r='120'></circle>
          <defs>
            <radialGradient cx='50%' cy='50%' id='radar-grad' r='50%'>
              <stop offset='0%' stopColor='#ff525e' stopOpacity='0.8'></stop>
              <stop offset='60%' stopColor='#fabd00' stopOpacity='0.4'></stop>
              <stop offset='100%' stopColor='#4a8eff' stopOpacity='0'></stop>
            </radialGradient>
          </defs>
        </svg>
      </div>
      <div className='absolute top-[45%] left-[52%] z-20 group'>
        <div className='bg-surface-container/90 backdrop-blur-md border border-primary/40 p-2 rounded shadow-xl flex items-center gap-2 transition-transform hover:scale-105 cursor-pointer'>
          <span className='w-2 h-2 bg-primary rounded-full animate-ping'></span>
          <div className='font-mono-data text-[11px]'>
            <span className='text-primary font-bold'>KXYZ</span>
            <span className='text-on-surface mx-1 opacity-40'>|</span>
            <span className='text-on-surface'>25°C</span>
          </div>
        </div>
      </div>
      <div className='absolute top-margin-desktop right-margin-desktop z-30 flex flex-col gap-4'>
        <LayerToggles />
        <MapControls />
      </div>
      <div className='absolute bottom-margin-desktop left-margin-desktop z-30'>
        <div className='bg-surface-container/80 backdrop-blur-lg border-l-4 border-error p-4 rounded-lg shadow-2xl min-w-[280px]'>
          <div className='flex items-center gap-2 mb-2'>
            <span className='material-symbols-outlined text-error text-[20px] animate-pulse' style={{fontVariationSettings: '\'FILL\' 1'}}>warning</span>
            <span className='font-title-lg text-title-lg text-on-surface'>Tornado Warning</span>
          </div>
          <div className='space-y-1'>
            <div className='flex justify-between text-body-sm'>
              <span className='text-on-surface-variant'>Expires:</span>
              <span className='font-mono-data text-error font-bold'>19:00 UTC</span>
            </div>
            <div className='flex justify-between text-body-sm'>
              <span className='text-on-surface-variant'>Severity:</span>
              <span className='font-mono-data bg-error/20 text-error px-1.5 py-0.5 rounded text-[10px] font-bold uppercase'>Extreme</span>
            </div>
            <p className='text-[11px] text-on-surface-variant mt-2 border-t border-outline-variant pt-2'>Immediate shelter recommended for Sector 4G. Large hail reported.</p>
          </div>
        </div>
      </div>
      <TimeSlider />
      <div className='absolute bottom-margin-desktop right-margin-desktop z-30'>
        <div className='bg-surface-container-lowest/60 backdrop-blur-md p-3 rounded-lg border border-outline-variant/50 font-mono-data text-[10px] space-y-1.5 text-on-surface-variant'>
          <div className='flex items-center justify-between gap-4'>
            <span>RADAR:</span>
            <div className='flex items-center gap-1.5'>
              <span className='text-primary font-bold'>LIVE (1m ago)</span>
              <span className='w-1.5 h-1.5 bg-primary rounded-full'></span>
            </div>
          </div>
          <div className='flex items-center justify-between gap-4'>
            <span>SATELLITE:</span>
            <div className='flex items-center gap-1.5'>
              <span className='text-secondary font-bold'>LIVE (5m ago)</span>
              <span className='w-1.5 h-1.5 bg-secondary rounded-full'></span>
            </div>
          </div>
          <div className='flex items-center justify-between gap-4'>
            <span>GFS MODEL:</span>
            <span className='text-on-surface opacity-80'>00Z RUN</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
