import React from 'react';

const Card = ({ children }) => {
  return (
    <div className='bg-white shadow-md rounded-lg p-6'>
      {children}
    </div>
  );
};

export default Card;
