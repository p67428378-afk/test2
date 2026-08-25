import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Structured error logging if needed
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[#f7fafc] p-6 text-center">
          <div className="w-full max-w-md rounded-xl border border-[#e3e8f0] bg-white p-8 shadow-sm">
            <h2 className="text-xl font-bold text-[#171c29]">
              Something went wrong
            </h2>
            <p className="mt-2 text-sm text-[#707a8c]">
              An unexpected error occurred in the application interface.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 rounded-lg bg-[#2663eb] px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Reload Application
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
