import React, { useState } from 'react';
import * as api from '../api';

function ApplicationForm({ product, onSubmitSuccess, onBack }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    dateOfBirth: '',
    socialSecurityNumber: '',
    employmentStatus: '',
    employer: '',
    occupation: '',
    annualIncome: '',
    sourceOfIncome: '',
    otherIncome: '',
    expenses: '',
    authenticationCredentials: 'temp_hashed_password', // Placeholder
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // First, create the applicant
      const applicantPayload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone_number: formData.phoneNumber,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zipCode,
          country: formData.country,
        },
        authentication_credentials: formData.authenticationCredentials,
      };
      const applicantResponse = await api.createApplicant(applicantPayload);
      const userId = applicantResponse.data.user_id;

      // Then, create the application
      const applicationPayload = {
        user_id: userId,
        product_id: product.product_id,
        personal_info: {
          date_of_birth: formData.dateOfBirth,
          social_security_number: formData.socialSecurityNumber,
          employment_status: formData.employmentStatus,
          employer: formData.employer,
          occupation: formData.occupation,
        },
        financial_info: {
          annual_income: parseFloat(formData.annualIncome),
          source_of_income: formData.sourceOfIncome,
          other_income: parseFloat(formData.otherIncome) || 0,
          expenses: parseFloat(formData.expenses) || 0,
        },
        status: 'Pending Review',
        comments: { initial: 'Submitted via web form' },
      };
      const applicationResponse = await api.createApplication(applicationPayload);
      setSuccess(true);
      onSubmitSuccess(applicationResponse.data.application_id);
    } catch (err) {
      console.error('Application submission error:', err.response ? err.response.data : err);
      setError(err.response?.data?.detail || 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return (
      <div className='p-4 text-center text-gray-700'>
        <p className='mb-4'>Please select a credit card product to apply for.</p>
        <button
          onClick={onBack}
          className='bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out'
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className='p-4 bg-white shadow-lg rounded-lg'>
      <h2 className='text-3xl font-bold text-gray-800 mb-6'>Apply for {product.name}</h2>
      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Personal Information */}
        <fieldset className='border border-gray-300 p-4 rounded-md'>
          <legend className='text-xl font-semibold text-gray-700 mb-4'>Personal Information</legend>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label htmlFor='firstName' className='block text-sm font-medium text-gray-700'>First Name</label>
              <input type='text' id='firstName' name='firstName' value={formData.firstName} onChange={handleChange} required
                className='mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500' />
            </div>
            <div>
              <label htmlFor='lastName' className='block text-sm font-medium text-gray-700'>Last Name</label>
              <input type='text' id='lastName' name='lastName' value={formData.lastName} onChange={handleChange} required
                className='mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500' />
            </div>
            <div>
              <label htmlFor='email' className='block text-sm font-medium text-gray-700'>Email</label>
              <input type='email' id='email' name='email' value={formData.email} onChange={handleChange} required
                className='mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500' />
            </div>
            <div>
              <label htmlFor='phoneNumber' className='block text-sm font-medium text-gray-700'>Phone Number</label>
              <input type='tel' id='phoneNumber' name='phoneNumber' value={formData.phoneNumber} onChange={handleChange} required
                className='mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500' />
            </div>
            <div>
              <label htmlFor='dateOfBirth' className='block text-sm font-medium text-gray-700'>Date of Birth</label>
              <input type='date' id='dateOfBirth' name='dateOfBirth' value={formData.dateOfBirth} onChange={handleChange} required
                className='mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500' />
            </div>
            <div>
              <label htmlFor='socialSecurityNumber' className='block text-sm font-medium text-gray-700'>Social Security Number</label>
              <input type='text' id='socialSecurityNumber' name='socialSecurityNumber' value={formData.socialSecurityNumber} onChange={handleChange} required
                className='mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500' />
            </div>
          </div>
        </fieldset>

        {/* Address Information */}
        <fieldset className='border border-gray-300 p-4 rounded-md'>
          <legend className='text-xl font-semibold text-gray-700 mb-4'>Address Information</legend>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label htmlFor='street' className='block text-sm font-medium text-gray-700'>Street</label>
              <input type='text' id='street' name='street' value={formData.street} onChange={handleChange} required
                className='mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500' />
            </div>
            <div>
              <label htmlFor='city' className='block text-sm font-medium text-gray-700'>City</label>
              <input type='text' id='city' name='city' value={formData.city} onChange={handleChange} required
                className='mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500' />
            </div>
            <div>
              <label htmlFor='state' className='block text-sm font-medium text-gray-700'>State</label>
              <input type='text' id='state' name='state' value={formData.state} onChange={handleChange} required
                className='mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500' />
            </div>
            <div>
              <label htmlFor='zipCode' className='block text-sm font-medium text-gray-700'>Zip Code</label>
              <input type='text' id='zipCode' name='zipCode' value={formData.zipCode} onChange={handleChange} required
                className='mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500' />
            </div>
            <div>
              <label htmlFor='country' className='block text-sm font-medium text-gray-700'>Country</label>
              <input type='text' id='country' name='country' value={formData.country} onChange={handleChange} required
                className='mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500' />
            </div>
          </div>
        </fieldset>

        {/* Employment Information */}
        <fieldset className='border border-gray-300 p-4 rounded-md'>
          <legend className='text-xl font-semibold text-gray-700 mb-4'>Employment Information</legend>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label htmlFor='employmentStatus' className='block text-sm font-medium text-gray-700'>Employment Status</label>
              <input type='text' id='employmentStatus' name='employmentStatus' value={formData.employmentStatus} onChange={handleChange} required
                className='mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500' />
            </div>
            <div>
              <label htmlFor='employer' className='block text-sm font-medium text-gray-700'>Employer (Optional)</label>
              <input type='text' id='employer' name='employer' value={formData.employer} onChange={handleChange}
                className='mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500' />
            </div>
            <div>
              <label htmlFor='occupation' className='block text-sm font-medium text-gray-700'>Occupation (Optional)</label>
              <input type='text' id='occupation' name='occupation' value={formData.occupation} onChange={handleChange}
                className='mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500' />
            </div>
          </div>
        </fieldset>

        {/* Financial Information */}
        <fieldset className='border border-gray-300 p-4 rounded-md'>
          <legend className='text-xl font-semibold text-gray-700 mb-4'>Financial Information</legend>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label htmlFor='annualIncome' className='block text-sm font-medium text-gray-700'>Annual Income</label>
              <input type='number' id='annualIncome' name='annualIncome' value={formData.annualIncome} onChange={handleChange} required
                className='mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500' />
            </div>
            <div>
              <label htmlFor='sourceOfIncome' className='block text-sm font-medium text-gray-700'>Source of Income</label>
              <input type='text' id='sourceOfIncome' name='sourceOfIncome' value={formData.sourceOfIncome} onChange={handleChange} required
                className='mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500' />
            </div>
            <div>
              <label htmlFor='otherIncome' className='block text-sm font-medium text-gray-700'>Other Income (Optional)</label>
              <input type='number' id='otherIncome' name='otherIncome' value={formData.otherIncome} onChange={handleChange}
                className='mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500' />
            </div>
            <div>
              <label htmlFor='expenses' className='block text-sm font-medium text-gray-700'>Monthly Expenses (Optional)</label>
              <input type='number' id='expenses' name='expenses' value={formData.expenses} onChange={handleChange}
                className='mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500' />
            </div>
          </div>
        </fieldset>

        {error && <p className='text-red-500 text-center'>{error}</p>}
        {success && <p className='text-green-500 text-center'>Application submitted successfully!</p>}

        <div className='flex justify-between mt-6'>
          <button
            type='button'
            onClick={onBack}
            className='bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out'
          >
            Back
          </button>
          <button
            type='submit'
            disabled={loading}
            className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50'
          >
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ApplicationForm;
