import React, { useEffect, useRef } from 'react';

const ResultDisplay = ({ premium }) => {
  const resultContainerRef = useRef(null);
  const premiumResultRef = useRef(null);

  useEffect(() => {
    if (premium !== null) {
      const resultContainer = resultContainerRef.current;
      resultContainer.classList.remove('opacity-0', 'translate-y-4');
      resultContainer.classList.add('opacity-100', 'translate-y-0');

      const start = 0;
      const duration = 800;
      const startTime = performance.now();

      function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentVal = start + (premium * progress);
        if (premiumResultRef.current) {
          premiumResultRef.current.textContent = `$${currentVal.toFixed(2)}`;
        }

        if (progress < 1) {
          requestAnimationFrame(updateNumber);
        }
      }
      requestAnimationFrame(updateNumber);
    }
  }, [premium]);

  return (
    <div className='pt-sm border-t border-outline-variant/30'>
      <div
        ref={resultContainerRef}
        className='p-lg rounded-xl bg-surface-container text-center opacity-0 transform translate-y-4 transition-all duration-500'
        id='result-container'
      >
        <p className='font-label-md text-label-md text-on-surface-variant mb-xs'>Calculated Premium</p>
        <h2 ref={premiumResultRef} className='font-display-lg text-display-lg text-secondary' id='premium-result'>
          {premium !== null ? `$${premium.toFixed(2)}` : ''}
        </h2>
        {premium !== null && (
          <div className='mt-sm flex items-center justify-center gap-xs text-secondary'>
            <span className='material-symbols-outlined' data-icon='verified' style={{ fontVariationSettings: "'FILL' 1" }}>
              verified
            </span>
            <span className='font-label-sm text-label-sm'>Quote valid for 30 days</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultDisplay;
