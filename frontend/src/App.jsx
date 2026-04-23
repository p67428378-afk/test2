import React from 'react';
import BalanceCertificateForm from './components/BalanceCertificateForm';
import CertificateStatus from './components/CertificateStatus';

function App() {
  const [certificate, setCertificate] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-8">Balance Certificate Generator</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <BalanceCertificateForm setCertificate={setCertificate} setError={setError} setLoading={setLoading} loading={loading} />
          <CertificateStatus certificate={certificate} error={error} loading={loading} />
        </div>
      </div>
    </div>
  );
}

export default App;
