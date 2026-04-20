import React, { useState } from 'react';
import { updatePolicy } from '../services/policyService';

const UpdatePolicy = () => {
  const [formData, setFormData] = useState({
    street: '123 Serenity Lane',
    city: 'Azure City',
    state: 'ST',
    zip: '00000',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // NOTE: Hardcoding policy ID to 1 for demonstration
      await updatePolicy(1, { holder: 'John Doe', policy_number: 'HS123456', address: `${formData.street}, ${formData.city}, ${formData.state} ${formData.zip}` });
      console.log('Policy updated successfully');
      alert('Policy updated successfully!');
    } catch (error) {
      console.error('Failed to update policy:', error);
      alert('Failed to update policy.');
    }
  };

  return (
    <main className='pt-24 pb-32 px-6 max-w-5xl mx-auto'>
      <section className='mb-12'>
        <h1 className='font-headline font-extrabold text-on-surface text-4xl md:text-5xl tracking-tight mb-4'>Update Policy</h1>
        <p className='text-on-surface-variant text-lg max-w-2xl leading-relaxed'>
          Ensure your protection remains uninterrupted by keeping your mailing details current. Our clinical precision ensures your security follows you wherever you go.
        </p>
      </section>
      <div className='flex flex-col lg:flex-row gap-8 items-start'>
        <div className='w-full lg:w-3/5 bg-surface-container-lowest rounded-full p-8 md:p-12 shadow-[0_12px_32px_rgba(0,72,141,0.06)]'>
          <h2 className='font-headline font-bold text-xl mb-8 text-primary'>Mailing Address</h2>
          <form className='space-y-6' onSubmit={handleSubmit}>
            <div className='space-y-2'>
              <label className='text-xs font-semibold uppercase tracking-wider text-outline px-4'>Street Address</label>
              <input className='w-full h-14 px-6 bg-surface-container-high border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-outline/60' type='text' name='street' value={formData.street} onChange={handleChange} />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='space-y-2'>
                <label className='text-xs font-semibold uppercase tracking-wider text-outline px-4'>City</label>
                <input className='w-full h-14 px-6 bg-surface-container-high border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-outline/60' type='text' name='city' value={formData.city} onChange={handleChange} />
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <label className='text-xs font-semibold uppercase tracking-wider text-outline px-4'>State</label>
                  <input className='w-full h-14 px-6 bg-surface-container-high border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-outline/60' type='text' name='state' value={formData.state} onChange={handleChange} />
                </div>
                <div className='space-y-2'>
                  <label className='text-xs font-semibold uppercase tracking-wider text-outline px-4'>Zip Code</label>
                  <input className='w-full h-14 px-6 bg-surface-container-high border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-outline/60' type='text' name='zip' value={formData.zip} onChange={handleChange} />
                </div>
              </div>
            </div>
            <div className='pt-6'>
              <button className='w-full h-16 bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold rounded-xl text-lg hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/10' type='submit'>
                Submit Request
              </button>
            </div>
          </form>
        </div>
        <div className='w-full lg:w-2/5 lg:mt-12'>
          <div className='bg-surface-container-low rounded-full p-8 border-l-4 border-tertiary'>
            <div className='flex items-center gap-3 mb-4'>
              <span className='material-symbols-outlined text-tertiary'>info</span>
              <h3 className='font-headline font-bold text-on-tertiary-fixed text-lg'>Verification Notice</h3>
            </div>
            <p className='text-on-surface-variant leading-relaxed mb-6'>
              For your security, all address modifications undergo a manual verification process. Changes typically reflect in your profile within <span className='font-bold text-on-surface'>24-48 hours</span>.
            </p>
            <div className='p-4 bg-surface-container-lowest rounded-xl flex items-center gap-4'>
              <div className='w-12 h-12 bg-tertiary-fixed rounded-full flex items-center justify-center text-on-tertiary-fixed'>
                <span className='material-symbols-outlined' style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
              </div>
              <div>
                <p className='text-xs text-outline font-semibold uppercase'>Security Protocol</p>
                <p className='text-sm font-medium'>Encrypted Data Transfer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default UpdatePolicy;
