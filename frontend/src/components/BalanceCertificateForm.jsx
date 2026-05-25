import React, { useState } from 'react';
import { generateCertificate } from '../services/api';

const BalanceCertificateForm = ({ setCertificate, setError, setLoading, loading }) => {
  const [accountNumber, setAccountNumber] = useState('');
  const [purpose, setPurpose] = useState('VISA');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setCertificate(null);

    try {
      const pdfBlob = await generateCertificate({ accountNumber, purpose });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setCertificate({ url: pdfUrl, filename: `Balance_Certificate_${accountNumber}.pdf` });
    } catch (err) {
      setError(err.response?.data?.detail || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Request Details</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700">Account Number</label>
          <input
            type="text"
            id="accountNumber"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter account number"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">Purpose of Certificate</label>
          <select
            id="purpose"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="VISA">Visa Application</option>
            <option value="LOAN">Bank Loan / Mortgage</option>
            <option value="OTHER">Other Official Purposes</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
        >
          {loading ? 'Generating...' : 'Generate Certificate'}
        </button>
      </form>
    </div>
  );
};

export default BalanceCertificateForm;
