import React from 'react';

const CalculateButton = ({ onClick }) => {
  return (
    <button
      className='w-full bg-primary text-on-primary py-md rounded-lg font-headline-md text-headline-md hover:bg-primary-container transition-all shadow-md active:scale-[0.98]'
      onClick={onClick}
    >
      Calculate Premium
    </button>
  );
};

export default CalculateButton;
