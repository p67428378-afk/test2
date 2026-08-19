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
    // Error logged for development boundary
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#f7fafc] flex items-center justify-center p-6">
          <div className="bg-white border border-[#e3e8f0] rounded-xl p-8 max-w-lg shadow-sm text-center">
            <h2 className="text-xl font-bold text-[#dc2626] mb-2">
              Something went wrong
            </h2>
            <p className="text-sm text-[#707a8c] mb-6">
              {this.state.error?.message ||
                "An unexpected error occurred in the application interface."}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-[#2663eb] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Reload Page
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
