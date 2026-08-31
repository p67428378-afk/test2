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
    // Log or handle error if needed
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#f5f7fc] p-6">
          <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md border border-[#dee3ed] text-center">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
              !
            </div>
            <h2 className="text-xl font-bold text-[#171f2e] mb-2">
              Something went wrong
            </h2>
            <p className="text-sm text-[#6b758a] mb-6">
              An unexpected error occurred. Please refresh the page or return to
              the dashboard.
            </p>
            <button
              onClick={() => window.location.assign("/")}
              className="px-4 py-2 bg-[#1466bf] text-white rounded-lg font-medium hover:bg-[#0e4b8f] transition"
            >
              Return to Dashboard
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
