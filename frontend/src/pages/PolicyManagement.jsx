import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import PolicyDetails from '../components/PolicyDetails';
import SecurityTips from '../components/SecurityTips';
import TrustIndicators from '../components/TrustIndicators';
import PolicyCancellation from '../components/PolicyCancellation';
import Footer from '../components/Footer';
import UpdatePolicyInformation from '../components/UpdatePolicyInformation';

const PolicyManagement = () => {
  return (
    <>
      <Header />
      <Sidebar />
      <main className='ml-64 pt-24 px-12 pb-12'>
        <div className='max-w-7xl mx-auto'>
          <div className='mb-10'>
            <h1 className='text-4xl font-extrabold text-blue-900 tracking-tight mb-2'>Policy Management</h1>
            <p className='text-on-surface-variant flex items-center gap-2'>
              <span className='material-symbols-outlined text-primary' style={{ fontVariationSettings: '"FILL" 1' }}>
                verified
              </span>
              Your Premier Gold health coverage is active and secure.
            </p>
          </div>
          <div className='grid grid-cols-12 gap-8'>
            <div className='col-span-12 lg:col-span-8 space-y-8'>
              <PolicyDetails />
              <UpdatePolicyInformation />
            </div>
            <div className='col-span-12 lg:col-span-4 space-y-8'>
              <SecurityTips />
              <TrustIndicators />
              <PolicyCancellation />
            </div>
          </div>
          <Footer />
        </div>
      </main>
    </>
  );
};

export default PolicyManagement;
