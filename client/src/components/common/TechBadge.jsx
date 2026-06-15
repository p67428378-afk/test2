import React from 'react';

const TechBadge = ({ label }) => {
  return (
    <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-container/20 text-primary border border-primary/30'>
      {label}
    </span>
  );
};

export default TechBadge;
