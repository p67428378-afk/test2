import React, { useState } from 'react';

const ManagementSection = () => {
  const [activeTab, setActiveTab] = useState('contact');

  return (
    <section className='col-span-12 bg-surface-container-low/50 rounded-xl overflow-hidden'>
      <div className='flex bg-surface-container-high/40 p-1'>
        <button onClick={() => setActiveTab('contact')} className={`flex-1 py-4 text-sm font-bold ${activeTab === 'contact' ? 'bg-white text-primary rounded-lg shadow-sm' : 'text-slate-500 hover:text-primary transition-all'}`}>Contact Info</button>
        <button onClick={() => setActiveTab('payment')} className={`flex-1 py-4 text-sm font-bold ${activeTab === 'payment' ? 'bg-white text-primary rounded-lg shadow-sm' : 'text-slate-500 hover:text-primary transition-all'}`}>Payment Methods</button>
        <button onClick={() => setActiveTab('dependents')} className={`flex-1 py-4 text-sm font-bold ${activeTab === 'dependents' ? 'bg-white text-primary rounded-lg shadow-sm' : 'text-slate-500 hover:text-primary transition-all'}`}>Dependents</button>
      </div>
      <div className='p-10'>
        {activeTab === 'contact' && (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
            <div className='space-y-6'>
              <h3 className='text-xl font-extrabold text-sky-900 mb-6'>Update Contact Information</h3>
              <div className='space-y-4'>
                <div>
                  <label className='block text-xs font-bold uppercase text-slate-400 mb-2'>Primary Residential Address</label>
                  <input className='w-full bg-surface-container-high border-none rounded-xl px-4 py-3 focus:ring-1 focus:ring-primary font-medium' type='text' value='482 Editorial Way, Clinical District'/>
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-xs font-bold uppercase text-slate-400 mb-2'>Phone Number</label>
                    <input className='w-full bg-surface-container-high border-none rounded-xl px-4 py-3 focus:ring-1 focus:ring-primary font-medium' type='text' value='+1 (555) 012-3456'/>
                  </div>
                  <div>
                    <label className='block text-xs font-bold uppercase text-slate-400 mb-2'>Email Address</label>
                    <input className='w-full bg-surface-container-high border-none rounded-xl px-4 py-3 focus:ring-1 focus:ring-primary font-medium' type='email' value='p.jameson@example.com'/>
                  </div>
                </div>
              </div>
              <div className='pt-4'>
                <button className='bg-primary text-white font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-all'>Save Changes</button>
              </div>
            </div>
            <div className='relative rounded-2xl overflow-hidden h-full min-h-[300px]'>
              <img alt='Office background' className='absolute inset-0 w-full h-full object-cover' src='https://lh3.googleusercontent.com/aida-public/AB6AXuAbI8BrYR454ShgmfIqak9hDRScpFCCZLZpGWVbEdlsn-GIPxGp_FWVQKkV8IVxXLtI-PWdqwX-Q9vwZ2iW3rwuosEvcvgsfKo3mIY9GU1VKkkaJWDd753wXSpQ4GNerGUIhrdKzFK02qnWATPe1KOQ-vWv6ql8R-ag3t84G_DSL11IJ6fC0tGyyP86ic00KRS9Fl2VliRsd7lgLBtElxCZ45C6Wo581GWfC-ISoY6GliEU69rDp9pqMYKL0_fcHyavl1sjSwV6WAmv'/>
              <div className='absolute inset-0 bg-primary/20 backdrop-blur-[2px] flex items-center justify-center p-8 text-center'>
                <div className='bg-white/90 p-8 rounded-xl max-w-sm'>
                  <span className='material-symbols-outlined text-4xl text-primary mb-4'>verified_user</span>
                  <h4 className='font-black text-on-surface mb-2'>Your Data is Encrypted</h4>
                  <p className='text-sm text-slate-600'>All updates are protected by 256-bit SSL encryption and HIPAA compliance standards.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ManagementSection;
