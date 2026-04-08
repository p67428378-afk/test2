import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ApplicationForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    phoneNumber: '',
    emailAddress: '',
    dateOfBirth: '',
    annualIncome: '',
    creditScore: '',
    employerName: '',
    employerAddress: '',
    jobTitle: '',
    employmentStartDate: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send data to your backend API
    console.log('Form submitted:', formData);
    navigate('/confirmation');
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className='space-y-4'>
            <h3 className='text-xl font-semibold'>Personal Information</h3>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Full Name</label>
              <input type='text' name='fullName' value={formData.fullName} onChange={handleChange} className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500' required />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Address</label>
              <input type='text' name='address' value={formData.address} onChange={handleChange} className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500' required />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Phone Number</label>
              <input type='tel' name='phoneNumber' value={formData.phoneNumber} onChange={handleChange} className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500' required />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Email Address</label>
              <input type='email' name='emailAddress' value={formData.emailAddress} onChange={handleChange} className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500' required />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Date of Birth</label>
              <input type='date' name='dateOfBirth' value={formData.dateOfBirth} onChange={handleChange} className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500' required />
            </div>
            <button type='button' onClick={nextStep} className='mt-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'>Next</button>
          </div>
        );
      case 2:
        return (
          <div className='space-y-4'>
            <h3 className='text-xl font-semibold'>Financial Information</h3>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Annual Income</label>
              <input type='number' name='annualIncome' value={formData.annualIncome} onChange={handleChange} className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500' required />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Credit Score</label>
              <input type='number' name='creditScore' value={formData.creditScore} onChange={handleChange} className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500' required />
            </div>
            {/* File Upload Placeholder */}
            <div>
              <label className='block text-sm font-medium text-gray-700'>Account Statement (Upload)</label>
              <input type='file' name='accountStatement' onChange={handleChange} className='mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100' />
            </div>
            <div className='flex justify-between'>
              <button type='button' onClick={prevStep} className='mt-4 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'>Previous</button>
              <button type='button' onClick={nextStep} className='mt-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'>Next</button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className='space-y-4'>
            <h3 className='text-xl font-semibold'>Employment Information</h3>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Employer Name</label>
              <input type='text' name='employerName' value={formData.employerName} onChange={handleChange} className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500' required />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Employer Address</label>
              <input type='text' name='employerAddress' value={formData.employerAddress} onChange={handleChange} className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500' required />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Job Title</label>
              <input type='text' name='jobTitle' value={formData.jobTitle} onChange={handleChange} className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500' required />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Employment Start Date</label>
              <input type='date' name='employmentStartDate' value={formData.employmentStartDate} onChange={handleChange} className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500' required />
            </div>
            <div className='flex justify-between'>
              <button type='button' onClick={prevStep} className='mt-4 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'>Previous</button>
              <button type='submit' onClick={handleSubmit} className='mt-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'>Submit Application</button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className='max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md mt-8'>
      <h2 className='text-3xl font-bold text-center text-blue-800 mb-6'>Credit Card Application</h2>
      <div className='mb-6'>
        <div className='flex justify-between mb-2'>
          <span className={`text-sm font-medium ${step === 1 ? 'text-blue-600' : 'text-gray-400'}`}>Personal Info</span>
          <span className={`text-sm font-medium ${step === 2 ? 'text-blue-600' : 'text-gray-400'}`}>Financial Info</span>
          <span className={`text-sm font-medium ${step === 3 ? 'text-blue-600' : 'text-gray-400'}`}>Employment Info</span>
        </div>
        <div className='w-full bg-gray-200 rounded-full h-2.5'>
          <div className='bg-blue-600 h-2.5 rounded-full' style={{ width: `${(step / 3) * 100}%` }}></div>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        {renderStep()}
      </form>
    </div>
  );
}

export default ApplicationForm;
