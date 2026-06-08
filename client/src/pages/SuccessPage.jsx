import React from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import DocumentPreview from '../components/certificates/DocumentPreview';

const SuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const certificate = location.state?.certificate;

  // Redirect to dashboard if no certificate data is present in state
  if (!certificate) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
      {/* TopNavBar */}
      <header className="bg-surface dark:bg-on-background text-primary dark:text-primary-fixed border-b border-outline-variant flex items-center h-16 px-container-padding-desktop shrink-0 z-10 sticky top-0">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors font-label-md text-label-md"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Dashboard
        </button>
      </header>

      {/* Scrollable Canvas */}
      <main className="flex-1 overflow-y-auto p-container-padding-desktop flex items-center justify-center">
        <div className="w-full max-w-2xl">
          <DocumentPreview certificate={certificate} />
        </div>
      </main>
    </div>
  );
};

export default SuccessPage;
