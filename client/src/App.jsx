import React, { useState } from "react";
import ImageUploadPage from "./pages/ImageUploadPage.jsx";
import EstimateResultsPage from "./pages/EstimateResultsPage.jsx";

export default function App() {
  const [claimId, setClaimId] = useState(null);

  const handleUploadSuccess = (id) => {
    setClaimId(id);
  };

  const handleReset = () => {
    setClaimId(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background">
      {!claimId ? (
        <ImageUploadPage onUploadSuccess={handleUploadSuccess} />
      ) : (
        <EstimateResultsPage claimId={claimId} onReset={handleReset} />
      )}
    </div>
  );
}
