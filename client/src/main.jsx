import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    // Error caught by boundary
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center max-w-lg mx-auto mt-12 bg-white border border-red-200 rounded-2xl shadow-sm">
          <h2 className="text-xl font-bold text-red-700 mb-2">
            Something went wrong
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            An unexpected rendering error occurred.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#2663eb] text-white text-xs font-semibold rounded-xl hover:bg-blue-700 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>,
  );
}
