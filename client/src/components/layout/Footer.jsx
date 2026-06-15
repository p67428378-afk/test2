import React from 'react';

const Footer = () => {
  return (
    <footer className='w-full py-margin-md bg-surface dark:bg-surface border-t border-outline-variant'>
      <div className='flex justify-center items-center w-full px-container-padding'>
        <p className='font-label-sm text-label-sm text-on-surface-variant dark:text-on-surface-variant'>
          Powered by React &amp; FastAPI. Deployed on Google Cloud Run.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
