import React from 'react';

const DownloadActions = () => {
  return (
    <section className='mb-12'>
      <div className='flex flex-col sm:flex-row gap-4'>
        <button className='btn-gradient flex-1 flex items-center justify-center gap-3 py-4 rounded-xl shadow-xl hover:shadow-2xl active:scale-95 transition-all duration-200'>
          <span className='material-symbols-outlined text-white' style={{fontVariationSettings: "'FILL' 1"}}>picture_as_pdf</span>
          <span className='font-headline font-bold text-white tracking-wide'>Download PDF</span>
        </button>
        <button className='flex-1 flex items-center justify-center gap-3 py-4 rounded-xl border border-primary/40 hover:bg-surface-container-low active:scale-95 transition-all duration-200'>
          <span className='material-symbols-outlined text-primary'>table_view</span>
          <span className='font-headline font-bold text-primary tracking-wide'>Export Excel</span>
        </button>
      </div>
    </section>
  );
};

export default DownloadActions;
