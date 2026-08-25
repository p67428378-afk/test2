import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error?.message || "Unknown error" };
  }

  componentDidCatch(_error, _errorInfo) {
    // Intentionally empty for production cleanliness
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#f7fafc] flex items-center justify-center p-6 text-center">
          <div className="bg-white border border-[#e3e8f0] rounded-2xl p-8 max-w-md w-full shadow-lg">
            <h2 className="text-xl font-bold text-[#171c29] mb-2">
              Something went wrong.
            </h2>
            <p className="text-sm text-[#707a8c] mb-6">
              An unexpected error occurred while rendering the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#2663eb] text-white rounded-lg text-sm font-medium hover:bg-[#1d4ed8] transition-colors"
            >
              Refresh Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
