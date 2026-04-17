import React from 'react';

const DeductibleProgress = () => {
  return (
    <div className="md:absolute -bottom-10 left-12 right-12 mt-6 md:mt-0">
      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xl shadow-primary/5 flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1 w-full">
          <div className="flex justify-between items-end mb-3">
            <h3 className="font-headline font-bold text-on-surface">Deductible Progress</h3>
            <div className="text-right">
              <span className="text-2xl font-bold text-primary font-headline">$1,200</span>
              <span className="text-on-surface-variant font-medium"> / $3,000</span>
            </div>
          </div>
          <div className="h-4 w-full bg-surface-container-highest rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-tertiary-container rounded-full" style={{ width: '40%' }}></div>
          </div>
        </div>
        <div className="h-px w-full md:h-12 md:w-px bg-surface-container"></div>
        <div className="flex gap-4">
          <div className="flex flex-col items-center px-4">
            <span className="text-xs font-label uppercase tracking-tighter text-on-surface-variant">Remaining</span>
            <span className="font-headline font-bold text-lg">$1,800</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeductibleProgress;
