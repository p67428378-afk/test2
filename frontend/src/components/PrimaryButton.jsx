import React from 'react';

const PrimaryButton = ({ isSubmitting }) => {
  return (
    <button
      type='submit'
      disabled={isSubmitting}
      className='w-full primary-gradient text-white font-bold py-4 rounded-lg transition-transform active:scale-[0.98] shadow-lg shadow-primary/20 flex justify-center items-center gap-2 group disabled:opacity-50'
    >
      {isSubmitting ? 'Submitting...' : 'Submit Application'}
      {!isSubmitting && <span className='material-symbols-outlined group-hover:translate-x-1 transition-transform'>arrow_forward</span>}
    </button>
  );
};

export default PrimaryButton;