
import React, { useState, useEffect } from 'react';
import { getPolicyHolder, updatePolicyHolder } from '../services/api';

const ManagePolicy = () => {
  const [policyHolder, setPolicyHolder] = useState(null);
  const [formData, setFormData] = useState({ address: '', contact_info: '' });

  useEffect(() => {
    // Hardcoded policy holder id for now
    const policyHolderId = 'some-policy-holder-id';
    getPolicyHolder(policyHolderId).then(response => {
      setPolicyHolder(response.data);
      setFormData({ address: response.data.address, contact_info: response.data.contact_info });
    }).catch(error => {
      console.error("Error fetching policy holder details", error);
      // Set mock data on error for UI development
      setPolicyHolder({
        name: 'Alex Johnson',
        address: '1248 Sanctuary Drive, Medical District, WA 98101',
        contact_info: 'alex.j@example.com',
        beneficiaries: [
          { name: 'Sarah Johnson', relationship: 'Spouse', type: 'Primary', allocation: 100 }
        ]
      });
      setFormData({ address: '1248 Sanctuary Drive, Medical District, WA 98101', contact_info: 'alex.j@example.com' });
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = () => {
    updatePolicyHolder(policyHolder.id, formData).then(response => {
      setPolicyHolder(response.data);
    });
  };

  if (!policyHolder) {
    return <div>Loading...</div>;
  }

  return (
    <section className='flex-shrink-0 w-[800px]'>
      <div className='bg-surface-container-lowest rounded-full h-[600px] p-10 flex flex-col'>
        <div className='flex justify-between items-center mb-8'>
          <h3 className='text-2xl font-extrabold text-on-surface'>Manage Policy Settings</h3>
          <div className='flex space-x-2'>
            <span className='px-4 py-1 bg-surface-container text-on-secondary-container text-xs font-bold rounded-full'>LATEST UPDATE: OCT 12</span>
          </div>
        </div>
        <div className='grid grid-cols-2 gap-8 flex-grow'>
          <div className='space-y-6'>
            <h4 className='text-sm font-black text-primary uppercase tracking-widest'>Personal Details</h4>
            <div className='space-y-4'>
              <div className='group'>
                <label className='block text-xs font-bold text-on-surface-variant mb-2'>Primary Contact Email</label>
                <input className='w-full bg-surface-container-high border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20 transition-all' type='email' name='contact_info' value={formData.contact_info} onChange={handleChange} />
              </div>
              <div className='group'>
                <label className='block text-xs font-bold text-on-surface-variant mb-2'>Residential Address</label>
                <textarea className='w-full bg-surface-container-high border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20 transition-all' name='address' rows='3' value={formData.address} onChange={handleChange}></textarea>
              </div>
            </div>
          </div>
          <div className='space-y-6'>
            <h4 className='text-sm font-black text-primary uppercase tracking-widest'>Beneficiaries</h4>
            <div className='bg-surface-container-low rounded-xl p-4 space-y-3'>
              {policyHolder.beneficiaries.map((beneficiary, index) => (
                <div key={index} className='flex items-center justify-between p-3 bg-white rounded-lg shadow-sm'>
                  <div className='flex items-center space-x-3'>
                    <div className='w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-primary font-bold text-xs'>{beneficiary.name.charAt(0)}{beneficiary.name.split(' ')[1].charAt(0)}</div>
                    <div>
                      <p className='text-sm font-bold'>{beneficiary.name}</p>
                      <p className='text-[10px] text-on-surface-variant'>{beneficiary.relationship} • {beneficiary.allocation}% {beneficiary.type}</p>
                    </div>
                  </div>
                  <button className='text-primary-container'><span className='material-symbols-outlined'>edit</span></button>
                </div>
              ))}
              <button className='w-full py-3 border-2 border-dashed border-outline-variant rounded-lg text-on-surface-variant text-sm font-medium hover:border-primary hover:text-primary transition-all'>
                + Add Secondary Beneficiary
              </button>
            </div>
          </div>
        </div>
        <div className='mt-8 pt-8 border-t border-surface-container flex justify-end gap-4'>
          <button className='px-8 py-3 bg-surface-container-highest text-on-surface font-bold rounded-xl hover:opacity-80'>Discard Changes</button>
          <button onClick={handleSaveChanges} className='px-12 py-3 bg-gradient-to-r from-primary to-primary-container text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all'>
            Save Updated Policy
          </button>
        </div>
      </div>
    </section>
  );
};

export default ManagePolicy;
