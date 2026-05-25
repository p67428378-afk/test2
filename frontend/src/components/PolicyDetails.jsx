
import React, { useState, useEffect } from 'react';
import { getPolicy } from '../services/api';

const PolicyDetails = () => {
  const [policy, setPolicy] = useState(null);

  useEffect(() => {
    // Hardcoded policy id for now
    const policyId = 'some-policy-id'; 
    getPolicy(policyId).then(response => {
      setPolicy(response.data);
    }).catch(error => {
      console.error("Error fetching policy details", error);
      // Set mock data on error for UI development
      setPolicy({
        plan_type: 'Platinum Health Plan',
        premium_amount: 450,
        effective_date: '2024-01-01',
        expiration_date: '2024-12-31',
        annual_deductible: 3000,
        deductible_paid: 1200,
      });
    });
  }, []);

  if (!policy) {
    return <div>Loading...</div>;
  }

  const deductiblePercentage = (policy.deductible_paid / policy.annual_deductible) * 100;

  return (
    <section className='flex-shrink-0 w-[450px]'>
      <div className='bg-primary rounded-full p-8 text-white relative overflow-hidden h-[600px] flex flex-col justify-between shadow-2xl shadow-primary/20'>
        <div className='absolute top-0 right-0 w-64 h-64 bg-primary-container/30 rounded-full -mr-20 -mt-20'></div>
        <div>
          <div className='flex justify-between items-start mb-12 relative z-10'>
            <div>
              <span className='text-xs font-bold uppercase tracking-widest opacity-70'>Active Plan</span>
              <h2 className='text-3xl font-extrabold mt-1'>{policy.plan_type}</h2>
            </div>
            <span className='material-symbols-outlined text-4xl' data-weight='fill'>verified_user</span>
          </div>
          <div className='space-y-8 relative z-10'>
            <div>
              <p className='text-sm opacity-70 mb-1'>Monthly Premium</p>
              <p className='text-4xl font-black'>${policy.premium_amount}<span className='text-lg font-normal opacity-80'>/mo</span></p>
            </div>
            <div className='flex gap-12'>
              <div>
                <p className='text-sm opacity-70 mb-1'>Effective From</p>
                <p className='font-bold'>{policy.effective_date}</p>
              </div>
              <div>
                <p className='text-sm opacity-70 mb-1'>Expires On</p>
                <p className='font-bold'>{policy.expiration_date}</p>
              </div>
            </div>
          </div>
        </div>
        <div className='bg-white/10 backdrop-blur-sm rounded-xl p-6 relative z-10'>
          <div className='flex justify-between items-center mb-4'>
            <p className='text-sm font-bold'>Annual Deductible</p>
            <p className='text-sm font-bold'>${policy.deductible_paid} / ${policy.annual_deductible}</p>
          </div>
          <div className='w-full bg-white/20 h-2 rounded-full overflow-hidden'>
            <div className='bg-white h-full rounded-full' style={{ width: `${deductiblePercentage}%` }}></div>
          </div>
          <button className='mt-6 w-full py-4 bg-white text-primary font-bold rounded-xl hover:bg-surface-container-lowest transition-all'>
            View Full Benefits
          </button>
        </div>
      </div>
    </section>
  );
};

export default PolicyDetails;
