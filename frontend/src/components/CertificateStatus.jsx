import React from 'react';

const CertificateStatus = ({ certificate, error, loading }) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-6">Generation Status</h2>
      {loading && (
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="ml-3">Generating your certificate...</p>
        </div>
      )}
      {error && (
        <div className="text-red-600 bg-red-100 p-4 rounded-md">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}
      {certificate && (
        <div className="text-center">
          <p className="text-green-600 font-bold mb-4">Certificate generated successfully!</p>
          <a
            href={certificate.url}
            download={certificate.filename}
            className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Download PDF
          </a>
        </div>
      )}
      {!loading && !error && !certificate && (
        <p className="text-gray-500">Fill out the form to generate a certificate.</p>
      )}
    </div>
  );
};

export default CertificateStatus;
