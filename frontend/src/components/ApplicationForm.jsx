import React, { useState, useEffect } from 'react';
import { createApplicant, createApplication } from '../api';

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
    authenticationCredentials: 'password123', // Simplified for demo
    dateOfBirth: '',
    socialSecurityNumber: '', // Simplified for demo
    employmentStatus: '',
    employer: '',
    occupation: '',
    annualIncome: '',
    sourceOfIncome: '',
    otherIncome: '',
    expenses: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (product) {
      // Pre-fill product details if a product was selected
      // (Not directly used in form fields, but good for context)
    }
  }, [product]);

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
    setSuccessMessage(null);

    try {
      // 1. Create Applicant
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
      const newApplicant = await createApplicant(applicantPayload);

      // 2. Create Application
      const applicationPayload = {
        user_id: newApplicant.user_id,
        product_id: product.product_id, // Use the selected product's ID
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
      const newApplication = await createApplication(applicationPayload);

      setSuccessMessage(`Application submitted successfully! Your Application ID is: ${newApplication.application_id}`);
      onSubmitSuccess(newApplication.application_id);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md'>
      <h2 className='text-2xl font-bold text-blue-800 mb-6'>Apply for {product ? product.name : 'Credit Card'}</h2>
      {product && (
        <div className='mb-6 p-4 bg-blue-50 rounded-md border border-blue-200'>
          <h3 className='text-lg font-semibold text-blue-700'>Product Details:</h3>
          <p><strong>APR:</strong> {product.apr}%</p>
          <p><strong>Annual Charges:</strong> ${product.annual_charges.toFixed(2)}</p>
          <p><strong>Credit Limit:</strong> ${product.credit_limit_min.toFixed(2)} - ${product.credit_limit_max.toFixed(2)}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Personal Information */}
        <fieldset className='border border-gray-300 p-4 rounded-md'>
          <legend className='text-lg font-semibold text-gray-700 px-2'>Personal Information</legend>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
            <div>
              <label htmlFor='firstName' className='block text-sm font-medium text-gray-700'>First Name</label>
              <input type='text' name='firstName' id='firstName' value={formData.firstName} onChange={handleChange} required
                     className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500' />
            </div>
            <div>
              <label htmlFor='lastName' className='block text-sm font-medium text-gray-700'>Last Name</label>
              <input type='text' name='lastName' id='lastName' value={formData.lastName} onChange={handleChange} required
                     className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500' />
            </div>
            <div>
              <label htmlFor='email' className='block text-sm font-medium text-gray-700'>Email</label>
              <input type='email' name='email' id='email' value={formData.email} onChange={handleChange} required
                     className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500' />
            </div>
            <div>
              <label htmlFor='phoneNumber' className='block text-sm font-medium text-gray-700'>Phone Number</label>
              <input type='tel' name='phoneNumber' id='phoneNumber' value={formData.phoneNumber} onChange={handleChange} required
                     className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500' />
            </div>
            <div>
              <label htmlFor='dateOfBirth' className='block text-sm font-medium text-gray-700'>Date of Birth</label>
              <input type='date' name='dateOfBirth' id='dateOfBirth' value={formData.dateOfBirth} onChange={handleChange} required
                     className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500' />
            </div>
            <div>
              <label htmlFor='socialSecurityNumber' className='block text-sm font-medium text-gray-700'>Social Security Number (Last 4 digits)</label>
              <input type='text' name='socialSecurityNumber' id='socialSecurityNumber' value={formData.socialSecurityNumber} onChange={handleChange} required maxLength='4' pattern='\d{4}'
                     className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500' />
            </div>
          </div>
        </fieldset>

        {/* Address Information */}
        <fieldset className='border border-gray-300 p-4 rounded-md'>
          <legend className='text-lg font-semibold text-gray-700 px-2'>Address Information</legend>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
            <div className='md:col-span-2'>
              <label htmlFor='street' className='block text-sm font-medium text-gray-700'>Street Address</label>
              <input type='text' name='street' id='street' value={formData.street} onChange={handleChange} required
                     className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500' />
            </div>
            <div>
              <label htmlFor='city' className='block text-sm font-medium text-gray-700'>City</label>
              <input type='text' name='city' id='city' value={formData.city} onChange={handleChange} required
                     className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500' />
            </div>
            <div>
              <label htmlFor='state' className='block text-sm font-medium text-gray-700'>State</label>
              <input type='text' name='state' id='state' value={formData.state} onChange={handleChange} required
                     className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500' />
            </div>
            <div>
              <label htmlFor='zipCode' className='block text-sm font-medium text-gray-700'>Zip Code</label>
              <input type='text' name='zipCode' id='zipCode' value={formData.zipCode} onChange={handleChange} required
                     className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500' />
            </div>
            <div>
              <label htmlFor='country' className='block text-sm font-medium text-gray-700'>Country</label>
              <input type='text' name='country' id='country' value={formData.country} onChange={handleChange} required
                     className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500' />
            </div>
          </div>
        </fieldset>

        {/* Employment Information */}
        <fieldset className='border border-gray-300 p-4 rounded-md'>
          <legend className='text-lg font-semibold text-gray-700 px-2'>Employment Information</legend>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
            <div>
              <label htmlFor='employmentStatus' className='block text-sm font-medium text-gray-700'>Employment Status</label>
              <select name='employmentStatus' id='employmentStatus' value={formData.employmentStatus} onChange={handleChange} required
                      className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500'>
                <option value=''>Select...</option>
                <option value='Employed'>Employed</option>
                <option value='Self-Employed'>Self-Employed</option>
                <option value='Unemployed'>Unemployed</option>
                <option value='Student'>Student</option>
                <option value='Retired'>Retired</option>
              </select>
            </div>
            <div>
              <label htmlFor='employer' className='block text-sm font-medium text-gray-700'>Employer (if employed)</label>
              <input type='text' name='employer' id='employer' value={formData.employer} onChange={handleChange}
                     className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500' />
            </div>
            <div>
              <label htmlFor='occupation' className='block text-sm font-medium text-gray-700'>Occupation</label>
              <input type='text' name='occupation' id='occupation' value={formData.occupation} onChange={handleChange}
                     className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500' />
            </div>
          </div>
        </fieldset>

        {/* Financial Information */}
        <fieldset className='border border-gray-300 p-4 rounded-md'>
          <legend className='text-lg font-semibold text-gray-700 px-2'>Financial Information</legend>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
            <div>
              <label htmlFor='annualIncome' className='block text-sm font-medium text-gray-700'>Annual Income</label>
              <input type='number' name='annualIncome' id='annualIncome' value={formData.annualIncome} onChange={handleChange} required min='0' step='0.01'
                     className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500' />
            </div>
            <div>
              <label htmlFor='sourceOfIncome' className='block text-sm font-medium text-gray-700'>Source of Income</label>
              <input type='text' name='sourceOfIncome' id='sourceOfIncome' value={formData.sourceOfIncome} onChange={handleChange} required
                     className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500' />
            </div>
            <div>
              <label htmlFor='otherIncome' className='block text-sm font-medium text-gray-700'>Other Income (Optional)</label>
              <input type='number' name='otherIncome' id='otherIncome' value={formData.otherIncome} onChange={handleChange} min='0' step='0.01'
                     className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500' />
            </div>
            <div>
              <label htmlFor='expenses' className='block text-sm font-medium text-gray-700'>Monthly Expenses (Optional)</label>
              <input type='number' name='expenses' id='expenses' value={formData.expenses} onChange={handleChange} min='0' step='0.01'
                     className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500' />
            </div>
          </div>
        </fieldset>

        {error && <div className='text-red-600 text-center mt-4'>{error}</div>}
        {successMessage && <div className='text-green-600 text-center mt-4'>{successMessage}</div>}

        <div className='flex justify-between mt-6'>
          <button type='button' onClick={onBack}
                  className='bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50'>
            Back to Products
          </button>
          <button type='submit' disabled={loading}
                  className='bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 disabled:opacity-50'>
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ApplicationForm;
