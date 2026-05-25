import React from 'react';
import { Link } from 'react-router-dom';

function ConfirmationPage() {
  return (
    <div className='max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-8 text-center'>
      <h2 className='text-3xl font-bold text-green-600 mb-4'>Application Submitted!</h2>
      <p className='text-gray-700 mb-6'>Thank you for your application. We will review it shortly and get back to you.</p>
      <Link to="/" className='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'>Go to Home</Link>
    </div>
  );
}

export default ConfirmationPage;
