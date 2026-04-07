import React, { useState } from 'react';
import { getApplicationStatus } from '../api';

function ApplicationStatus({ initialApplicationId }) {
  const [applicationId, setApplicationId] = useState(initialApplicationId || '');
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleIdChange = (e) => {
    setApplicationId(e.target.value);
  };

  const fetchStatus = async (e) => {
    e.preventDefault();
    if (!applicationId) return;

    setLoading(true);
    setError(null);
    setStatusData(null);

    try {
      const data = await getApplicationStatus(applicationId);
      setStatusData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md'>
      <h2 className='text-2xl font-bold text-blue-800 mb-6'>Track Application Status</h2>

      <form onSubmit={fetchStatus} className='flex flex-col sm:flex-row gap-4 mb-6'>
        <input
          type='text'
          value={applicationId}
          onChange={handleIdChange}
          placeholder='Enter Application ID'
          required
          className='flex-grow border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500'
        />
        <button
          type='submit'
          disabled={loading}
          className='bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 disabled:opacity-50'
        >
          {loading ? 'Fetching...' : 'Get Status'}
        </button>
      </form>

      {error && <div className='text-red-600 text-center mt-4'>{error}</div>}

      {statusData && (
        <div className='mt-6 border border-gray-200 rounded-md p-4 bg-gray-50'>
          <h3 className='text-xl font-semibold text-gray-800 mb-3'>Application Details</h3>
          <p className='mb-1'><strong>Application ID:</strong> {statusData.application_id}</p>
          <p className='mb-1'><strong>Product ID:</strong> {statusData.product_id}</p>
          <p className='mb-1'><strong>User ID:</strong> {statusData.user_id}</p>
          <p className='mb-1'><strong>Status:</strong> <span className='font-semibold text-blue-700'>{statusData.status}</span></p>
          <p className='mb-1'><strong>Submission Date:</strong> {new Date(statusData.submission_date).toLocaleDateString()}</p>
          <p className='mb-1'><strong>Last Updated:</strong> {new Date(statusData.last_updated_date).toLocaleDateString()}</p>
          {statusData.comments && (
            <div className='mt-3'>
              <p className='font-semibold'>Comments:</p>
              <pre className='bg-gray-100 p-2 rounded-md text-sm overflow-x-auto'>
                {JSON.stringify(statusData.comments, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ApplicationStatus;
