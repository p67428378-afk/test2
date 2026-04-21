import React, { useState } from 'react';
import LoanForm from './components/LoanForm';
import Results from './components/Results';
import axios from 'axios';

function App() {
  const [results, setResults] = useState(null);

  const handleFormSubmit = async (formData) => {
    try {
      const response = await axios.post('http://localhost:8000/predict', formData);
      setResults(response.data);
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle error state in the UI
    }
  };

  return (
    <div className='bg-gray-900 min-h-screen flex flex-col items-center justify-center text-white font-sans'>
      <header className='w-full max-w-4xl mx-auto p-4'>
        <h1 className='text-4xl font-bold text-center'>Loan Eligibility</h1>
      </header>
      <main className='w-full max-w-4xl mx-auto p-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div className='bg-gray-800 p-8 rounded-lg shadow-lg'>
            <h2 className='text-2xl font-semibold mb-6'>Enter Your Details</h2>
            <LoanForm onSubmit={handleFormSubmit} />
          </div>
          <div className='bg-gray-800 p-8 rounded-lg shadow-lg'>
            <h2 className='text-2xl font-semibold mb-6'>Results</h2>
            <Results results={results} />
          </div>
        </div>
      </main>
      <footer className='w-full max-w-4xl mx-auto p-4 mt-8'>
        <div className='bg-gray-800 rounded-lg p-4'>
          <div className='flex justify-around'>
            <a href='#' className='flex flex-col items-center text-gray-400 hover:text-white'>
              <span className='material-symbols-outlined'>home</span>
              <span className='text-xs mt-1'>HOME</span>
            </a>
            <a href='#' className='flex flex-col items-center text-white'>
              <span className='material-symbols-outlined'>account_balance</span>
              <span className='text-xs mt-1'>LOANS</span>
            </a>
            <a href='#' className='flex flex-col items-center text-gray-400 hover:text-white'>
              <span className='material-symbols-outlined'>person</span>
              <span className='text-xs mt-1'>PROFILE</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
