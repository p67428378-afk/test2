import React, { useState, useEffect } from "react";
import ImageUploadPage from "./pages/ImageUploadPage.jsx";
import EstimateResultsPage from "./pages/EstimateResultsPage.jsx";
import RoadsideAssistancePage from "./pages/RoadsideAssistancePage.jsx";
import UploadQueuePage from "./pages/UploadQueuePage.jsx";
import SafetyPromptCard from "./components/claims/SafetyPromptCard.jsx";
import { getQueue } from "./services/queueService.js";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <h2 style={{ padding: "2rem" }}>
          Something went wrong. Check console.
        </h2>
      );
    }
    return this.props.children;
  }
}

function MainApp() {
  const [claimId, setClaimId] = useState(null);
  const [view, setView] = useState("upload"); // upload, estimate, roadside, queue
  const [queueCount, setQueueCount] = useState(0);

  // Update queue count periodically
  useEffect(() => {
    const updateCount = () => {
      setQueueCount(getQueue().length);
    };
    updateCount();
    const interval = setInterval(updateCount, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleUploadSuccess = (id) => {
    setClaimId(id);
    setView("estimate");
  };

  const handleReset = () => {
    setClaimId(null);
    setView("upload");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background relative">
      {/* Floating Queue Button */}
      {view !== "queue" && queueCount > 0 && (
        <button
          onClick={() => setView("queue")}
          className="fixed top-4 right-4 bg-secondary text-on-secondary px-4 py-2 rounded-full shadow-lg flex items-center gap-2 z-50 hover:bg-secondary/90 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">
            cloud_off
          </span>
          <span>Queue ({queueCount})</span>
        </button>
      )}

      {view === "upload" && (
        <div className="flex-1 flex flex-col">
          <ImageUploadPage onUploadSuccess={handleUploadSuccess} />
          {/* Quick link to queue if items exist */}
          {queueCount > 0 && (
            <div className="text-center pb-4">
              <button
                onClick={() => setView("queue")}
                className="text-primary font-semibold text-sm hover:underline"
              >
                View Offline Upload Queue ({queueCount} items)
              </button>
            </div>
          )}
        </div>
      )}

      {view === "estimate" && claimId && (
        <div className="flex-1 flex flex-col gap-6 p-4 max-w-2xl mx-auto w-full">
          <EstimateResultsPage claimId={claimId} onReset={handleReset} />

          {/* Safety Prompt Card */}
          <SafetyPromptCard
            onSelectSafe={() =>
              alert(
                "Glad to hear you are safe! Please proceed to schedule repairs.",
              )
            }
            onSelectUnsafe={() => setView("roadside")}
          />
        </div>
      )}

      {view === "roadside" && claimId && (
        <RoadsideAssistancePage
          claimId={claimId}
          onBack={() => setView("estimate")}
        />
      )}

      {view === "queue" && (
        <UploadQueuePage
          onBack={() => setView(claimId ? "estimate" : "upload")}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <MainApp />
    </ErrorBoundary>
  );
}
