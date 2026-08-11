import React, { useState, useEffect } from 'react';
import * as api from '../api';

function ApplicationStatus({ applicationId, onBack }) {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputApplicationId, setInputApplicationId] = useState(applicationId || '');

  const fetchApplicationStatus = async (id) => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const response = await api.getApplicationStatus(id);
      setApplication(response.data);
    } catch (err) {
      console.error('Error fetching application status:', err.response ? err.response.data : err);
      setError(err.response?.data?.detail || 'Failed to fetch application status.');
      setApplication(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (applicationId) {
      fetchApplicationStatus(applicationId);
    }
  }, [applicationId]);

  const handleInputChange = (e) => {
    setInputApplicationId(e.target.value);
  };

  const handleSearch = () => {
    fetchApplicationStatus(inputApplicationId);
  };

  return (
    <div className='p-4 bg-white shadow-lg rounded-lg'>
      <h2 className='text-3xl font-bold text-gray-800 mb-6'>Track Application Status</h2>

      <div className='mb-6 flex items-center space-x-4'>
        <input
          type='text'
          placeholder='Enter Application ID'
          value={inputApplicationId}
          onChange={handleInputChange}
          className='flex-grow p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
        />
        <button
          onClick={handleSearch}
          disabled={loading || !inputApplicationId}
          className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50'
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {loading && <p className='text-center text-blue-600'>Loading application status...</p>}
      {error && <p className='text-center text-red-500'>{error}</p>}

      {application && (
        <div className='border border-gray-200 rounded-md p-6 mt-6 space-y-4'>
          <p className='text-lg'><strong>Application ID:</strong> {application.application_id}</p>
          <p className='text-lg'><strong>Product:</strong> {application.product_id} (Placeholder - ideally fetch product name)</p>
          <p className='text-lg'><strong>Status:</strong> <span className={`font-semibold ${
            application.status === 'Approved' ? 'text-green-600' :
            application.status === 'Declined' ? 'text-red-600' :
            'text-yellow-600'
          }`}>{application.status}</span></p>
          <p className='text-lg'><strong>Submission Date:</strong> {new Date(application.submission_date).toLocaleDateString()}</p>
          <p className='text-lg'><strong>Last Updated:</strong> {new Date(application.last_updated_date).toLocaleDateString()}</p>
          {application.comments && Object.keys(application.comments).length > 0 && (
            <div>
              <p className='text-lg font-semibold'>Comments:</p>
              <ul className='list-disc list-inside ml-4'>
                {Object.entries(application.comments).map(([key, value]) => (
                  <li key={key} className='text-gray-700'>{key}: {value}</li>
                ))}
              </ul>
            </div>
          )}
          {/* Displaying personal and financial info for completeness, though in a real app this might be restricted */}
          <div className='border-t border-gray-200 pt-4 mt-4'>
            <h3 className='text-xl font-semibold text-gray-700 mb-2'>Applicant Details</h3>
            <p><strong>Date of Birth:</strong> {application.personal_info.date_of_birth}</p>
            <p><strong>Employment Status:</strong> {application.personal_info.employment_status}</p>
            <p><strong>Annual Income:</strong> ${application.financial_info.annual_income?.toFixed(2)}</p>
          </div>
        </div>
      )}

      <div className='mt-6 flex justify-end'>
        <button
          onClick={onBack}
          className='bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out'
        >
          Back to Products
        </button>
      </div>
    </div>
  );
}

export default ApplicationStatus;
