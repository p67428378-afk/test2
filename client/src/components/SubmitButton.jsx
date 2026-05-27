import React from 'react';

const SubmitButton = ({ isSubmitting }) => {
  return (
    <div className='pt-stack-md'>
      <button
        className='w-full md:w-auto px-10 py-3 bg-primary text-white font-bold rounded-lg hover:opacity-90 active:scale-[0.98] transition-all flex justify-center items-center gap-2'
        type='submit'
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <span className='material-symbols-outlined animate-spin'>sync</span>
            <span>Processing...</span>
          </>
        ) : (
          <>
            <span>Set Alert</span>
            <span className='material-symbols-outlined text-[20px]'>notifications_active</span>
          </>
        )}
      </button>
    </div>
  );
};

export default SubmitButton;
