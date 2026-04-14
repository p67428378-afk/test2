import React from 'react';

const SecurityTips = () => {
  return (
    <section className='bg-blue-900 text-white rounded-xl p-8 shadow-xl'>
      <div className='flex items-center gap-3 mb-6'>
        <span className='material-symbols-outlined text-blue-300'>security</span>
        <h3 className='text-xl font-bold'>Security Tips</h3>
      </div>
      <ul className='space-y-6'>
        <li className='flex gap-4'>
          <span className='bg-blue-800 p-2 rounded-lg h-fit text-blue-300 material-symbols-outlined'>vibration</span>
          <div>
            <p className='font-bold text-sm mb-1'>Enable MFA</p>
            <p className='text-xs text-blue-100/80 leading-relaxed'>Add an extra layer of protection by enabling Multi-Factor Authentication.</p>
          </div>
        </li>
        <li className='flex gap-4'>
          <span className='bg-blue-800 p-2 rounded-lg h-fit text-blue-300 material-symbols-outlined'>phishing</span>
          <div>
            <p className='font-bold text-sm mb-1'>Phishing Alert</p>
            <p className='text-xs text-blue-100/80 leading-relaxed'>Sovereign Health will never ask for your password via email or text.</p>
          </div>
        </li>
        <li className='flex gap-4'>
          <span className='bg-blue-800 p-2 rounded-lg h-fit text-blue-300 material-symbols-outlined'>encrypted</span>
          <div>
            <p className='font-bold text-sm mb-1'>Session Auto-lock</p>
            <p className='text-xs text-blue-100/80 leading-relaxed'>Your session will automatically expire after 15 minutes of inactivity.</p>
          </div>
        </li>
      </ul>
    </section>
  );
};

export default SecurityTips;
