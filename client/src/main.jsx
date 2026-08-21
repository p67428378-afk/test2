import React from "react";
import ReactDOM from "react-dom/client";
import AppLayout from "./components/layout/AppLayout.jsx";
import "./index.css";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-[#0f1729] text-[#f7fafc] p-8">
          <h2 className="text-2xl font-bold mb-4">Something went wrong.</h2>
          <p className="text-[#94a3b8] mb-6">
            Please refresh the page or try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#6173f5] text-white rounded-lg hover:bg-[#4f5fd8] transition-colors"
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AppLayout />
    </ErrorBoundary>
  </React.StrictMode>,
);
