import React from 'react';

const PolicyActions = () => {
  return (
    <section className='col-span-4 flex flex-col gap-4'>
      <div className='bg-primary/5 border border-primary/10 rounded-xl p-6 flex flex-col h-full justify-between'>
        <div className='mb-4'>
          <h3 className='text-lg font-bold text-primary mb-2'>Policy Controls</h3>
          <p className='text-sm text-on-surface-variant'>Manage your coverage details or beneficiaries instantly.</p>
        </div>
        <div className='space-y-3'>
          <button className='w-full py-4 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-primary-container transition-all'>
            <span className='material-symbols-outlined'>edit_square</span>
            <span>Update Policy</span>
          </button>
          <button className='w-full py-4 bg-transparent border border-error/30 text-error rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-error-container/20 transition-all'>
            <span className='material-symbols-outlined'>cancel</span>
            <span>Cancel Policy</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default PolicyActions;
