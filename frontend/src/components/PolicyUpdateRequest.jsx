import React, { useState } from 'react';
import { createPolicyUpdateRequest } from '../services/api';

const PolicyUpdateRequest = () => {
  const [message, setMessage] = useState(null);

  const handleUpdate = (details) => {
    const requestData = {
      policy_id: 'policy-123',
      request_type: 'UPDATE',
      request_details: details,
      submitted_by: 'user-abc'
    };

    createPolicyUpdateRequest(requestData)
      .then(response => {
        setMessage('Update request submitted successfully!');
      })
      .catch(error => {
        setMessage('Error submitting update request.');
        console.error('Error submitting update request:', error);
      });
  };

  return (
    <div className='lg:col-span-2'>
      <div className='bg-surface-container-lowest rounded-xl overflow-hidden relative'>
        <div className='absolute inset-0 opacity-[0.03] pointer-events-none' style={{backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuCBirLoUIc-JrA-U17j4Vx7pKG4RjEKJRZNNsvmObRb86KOhTJDUSgpqnH11Cstw4AefocCKL9lZvCjftGhXkp8LADgWMOF_3bBf-f2PefoRBSZjYjgCWPgSzz2NGgpxmNbpwrYVC9zH6o8od7fAOI76yciKGYyrN3EzFdw2Bmw2MZL98bfFL7aTxDW4qSHod3qNJ6wEl5QD1rKrk5Ob3G9PHX6D5Yyuf0opAhYTGt1qisXvwtSmvKtqh9vL7Ei4hvp9Vg1gDAxwKg)'}}></div>
        <div className='p-8 relative z-10'>
          <div className='flex items-center gap-4 mb-8'>
            <div className='w-12 h-12 rounded-xl vitality-gradient flex items-center justify-center text-white'>
              <span className='material-symbols-outlined' data-icon='edit_note'>edit_note</span>
            </div>
            <div>
              <h3 className='text-2xl font-bold text-primary'>Policy Management</h3>
              <p className='text-on-surface-variant text-sm'>Update your information and coverage settings in real-time.</p>
            </div>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <button onClick={() => handleUpdate({ updated_field: 'personal_info' })} className='group p-6 bg-surface-container-low rounded-xl text-left hover:bg-primary hover:text-white transition-all duration-300'>
              <span className='material-symbols-outlined text-primary group-hover:text-primary-fixed-dim mb-4 block' data-icon='person_edit'>person_edit</span>
              <h4 className='font-bold mb-1'>Edit Personal Info</h4>
              <p className='text-xs opacity-70'>Address, contact details, and emergency contacts.</p>
            </button>
            <button onClick={() => handleUpdate({ updated_field: 'beneficiaries' })} className='group p-6 bg-surface-container-low rounded-xl text-left hover:bg-primary hover:text-white transition-all duration-300'>
              <span className='material-symbols-outlined text-primary group-hover:text-primary-fixed-dim mb-4 block' data-icon='group_add'>group_add</span>
              <h4 className='font-bold mb-1'>Manage Beneficiaries</h4>
              <p className='text-xs opacity-70'>Add or remove dependents from your active plan.</p>
            </button>
            <button onClick={() => handleUpdate({ updated_field: 'coverage' })} className='group p-6 bg-surface-container-low rounded-xl text-left hover:bg-primary hover:text-white transition-all duration-300 border-2 border-transparent hover:border-primary-fixed/20'>
              <span className='material-symbols-outlined text-primary group-hover:text-primary-fixed-dim mb-4 block' data-icon='published_with_changes'>published_with_changes</span>
              <h4 className='font-bold mb-1'>Change Coverage</h4>
              <p className='text-xs opacity-70'>Upgrade your plan or adjust deductible tiers.</p>
            </button>
          </div>
          {message && <div className='mt-4 text-center text-sm font-medium'>{message}</div>}
        </div>
      </div>
    </div>
  );
};

export default PolicyUpdateRequest;
