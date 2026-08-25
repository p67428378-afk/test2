import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0f1729] text-white flex flex-col justify-center items-center p-6">
          <div className="bg-[#1f293b] border border-[#334054] p-8 rounded-[14px] max-w-md text-center shadow-lg">
            <h2 className="text-2xl font-bold text-red-500 mb-4">
              Something went wrong.
            </h2>
            <p className="text-[#94a3b8] mb-6">
              An unexpected error occurred. Please try refreshing the page or
              checking the console.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-[#6173f5] hover:bg-[#4f5fd8] text-white font-medium px-6 py-3 rounded-[10px] transition-colors"
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
