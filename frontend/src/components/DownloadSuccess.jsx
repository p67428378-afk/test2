import React from 'react';

const DownloadSuccess = ({ onDone }) => {
  return (
    <div className="fixed inset-0 bg-surface flex items-center justify-center z-50">
      <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-6 py-12">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-surface-container-low rounded-full blur-3xl opacity-60 pointer-events-none"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-[40%] h-[40%] bg-primary-container/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="w-full max-w-md bg-surface-container-lowest rounded-xl shadow-[0_32px_64px_rgba(25,28,30,0.06)] p-10 flex flex-col items-center text-center z-10">
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-surface-container-low rounded-xl flex items-center justify-center transform rotate-3">
              <div className="w-24 h-24 absolute inset-0 bg-primary-container/5 rounded-xl -rotate-6 transition-transform"></div>
              <span className="material-symbols-outlined text-on-primary-fixed-variant text-6xl fill-icon" style={{fontVariationSettings: "'FILL' 1"}}>
                check_circle
              </span>
            </div>
          </div>
          <h1 className="font-headline font-extrabold text-3xl tracking-tight text-on-surface mb-3">
            Download Complete
          </h1>
          <p className="font-body text-on-surface-variant leading-relaxed px-4 mb-10">
            Your statement has been successfully downloaded to your device.
          </p>
          <div className="w-full space-y-4">
            <button onClick={onDone} className="w-full bg-gradient-to-r from-primary to-primary-container text-white font-label font-bold py-4 px-6 rounded-xl transition-all duration-300 active:scale-[0.98] shadow-lg shadow-primary/10">
              Done
            </button>
            <button className="w-full bg-transparent border border-surface-tint/40 text-surface-tint font-label font-bold py-4 px-6 rounded-xl transition-all duration-300 hover:bg-surface-container-low active:scale-[0.98]">
              Open File
            </button>
          </div>
        </div>
        <div className="mt-12 text-center z-10">
          <div className="inline-flex items-center gap-2 bg-surface-container-high/50 backdrop-blur-md px-4 py-2 rounded-full">
            <span className="material-symbols-outlined text-sm text-on-surface-variant">description</span>
            <span className="font-label text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
              Statement_Q3_2023.pdf
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DownloadSuccess;
