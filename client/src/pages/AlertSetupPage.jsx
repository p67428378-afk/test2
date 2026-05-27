import React from 'react';
import AlertSetupForm from '../components/AlertSetupForm';

const AlertSetupPage = () => {
  return (
    <main className='min-h-[calc(100vh-160px)] py-stack-lg px-container-padding-desktop'>
      <div className='max-w-[800px] mx-auto'>
        <h1 className='font-headline-lg text-headline-lg text-on-surface mb-stack-lg'>
          Low Balance Alert Setup
        </h1>
        <AlertSetupForm />
        <div className='mt-stack-lg grid grid-cols-1 md:grid-cols-2 gap-stack-md'>
          <div className='bg-surface-container-low p-stack-md rounded-lg border border-outline-variant flex items-start gap-4'>
            <span className='material-symbols-outlined text-primary'>security</span>
            <div>
              <h3 className='font-bold text-on-surface font-body-md'>Secure Messaging</h3>
              <p className='text-on-surface-variant text-label-md'>
                Your alerts are encrypted and sent only to your registered device.
              </p>
            </div>
          </div>
          <div className='bg-surface-container-low p-stack-md rounded-lg border border-outline-variant flex items-start gap-4'>
            <span className='material-symbols-outlined text-primary'>speed</span>
            <div>
              <h3 className='font-bold text-on-surface font-body-md'>Instant Delivery</h3>
              <p className='text-on-surface-variant text-label-md'>
                Notifications are triggered the moment your balance dips below the limit.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AlertSetupPage;
