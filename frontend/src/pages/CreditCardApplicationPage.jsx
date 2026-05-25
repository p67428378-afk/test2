import React from 'react';
import ApplicationForm from '../components/ApplicationForm';

const CreditCardApplicationPage = () => {
  return (
    <main className="max-w-7xl mx-auto px-6 py-12 lg:py-20 flex flex-col items-center">
      <div className="w-full max-w-3xl mb-10 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-on-background mb-3">Apply for a Credit Card</h1>
        <p className="text-on-surface-variant text-lg">Please fill out the form below to apply.</p>
      </div>
      <ApplicationForm />
    </main>
  );
};

export default CreditCardApplicationPage;