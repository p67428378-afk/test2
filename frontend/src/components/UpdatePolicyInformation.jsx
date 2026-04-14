import React from 'react';

const UpdatePolicyInformation = () => {
  return (
    <section className='bg-surface-container-lowest rounded-xl p-8 shadow-sm'>
      <div className='flex items-center gap-3 mb-6'>
        <span className='material-symbols-outlined text-primary'>edit_square</span>
        <h2 className='text-2xl font-bold text-blue-900'>Update Policy Information</h2>
      </div>
      <form className='space-y-8'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='space-y-1'>
            <label className='text-xs font-bold text-slate-500 uppercase ml-1'>Contact Email</label>
            <input type='email' placeholder='alex.sterling@sovereign.com' className='w-full bg-surface-container-low border-0 border-b-2 border-transparent focus:border-primary focus:ring-0 rounded-t-lg px-4 py-3 transition-all' />
          </div>
          <div className='space-y-1'>
            <label className='text-xs font-bold text-slate-500 uppercase ml-1'>Phone Number</label>
            <input type='tel' placeholder='+1 (555) 012-3456' className='w-full bg-surface-container-low border-0 border-b-2 border-transparent focus:border-primary focus:ring-0 rounded-t-lg px-4 py-3 transition-all' />
          </div>
        </div>
        <div>
          <h3 className='text-sm font-bold text-blue-900 mb-4'>Manage Beneficiaries</h3>
          <div className='space-y-3'>
            <div className='flex items-center justify-between p-4 bg-surface rounded-xl'>
              <div className='flex items-center gap-4'>
                <div className='w-10 h-10 bg-primary-fixed rounded-full flex items-center justify-center text-primary font-bold'>AS</div>
                <div>
                  <p className='font-bold text-sm'>Alex Sterling (Primary)</p>
                  <p className='text-xs text-slate-500'>Self</p>
                </div>
              </div>
              <span className='material-symbols-outlined text-slate-300'>lock</span>
            </div>
            <div className='flex items-center justify-between p-4 bg-surface rounded-xl'>
              <div className='flex items-center gap-4'>
                <div className='w-10 h-10 bg-secondary-fixed rounded-full flex items-center justify-center text-secondary font-bold'>SS</div>
                <div>
                  <p className='font-bold text-sm'>Sarah Sterling</p>
                  <p className='text-xs text-slate-500'>Spouse</p>
                </div>
              </div>
              <label className='relative inline-flex items-center cursor-pointer'>
                <input type='checkbox' defaultChecked className='sr-only peer' />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            <button type='button' className='flex items-center gap-2 text-primary font-bold text-sm hover:underline mt-2'>
              <span className='material-symbols-outlined'>add_circle</span>
              Add New Beneficiary
            </button>
          </div>
        </div>
        <div className='flex justify-between items-center pt-4 border-t border-slate-50'>
          <p className='text-xs text-slate-400 flex items-center gap-1'>
            <span className='material-symbols-outlined text-sm'>verified_user</span>
            Secure 256-bit Encrypted Update
          </p>
          <button type='submit' className='premium-gradient px-8 py-3 text-white font-bold rounded-full shadow-lg hover:opacity-90 transition-all'>Save Changes</button>
        </div>
      </form>
    </section>
  );
};

export default UpdatePolicyInformation;
