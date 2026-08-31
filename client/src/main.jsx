import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
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
    // Structured error handling without console pollution
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6 text-center">
          <div className="max-w-md bg-white p-8 rounded-3xl border border-[#E8E2DC] shadow-lg">
            <div className="text-5xl mb-4">🍫</div>
            <h2 className="font-heading text-2xl font-bold text-[#2D1B18] mb-2">
              Something went wrong
            </h2>
            <p className="text-xs text-stone-500 mb-6">
              An unexpected error occurred while preparing your chocolate
              experience.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-[#2D1B18] text-[#D4AF37] rounded-xl text-xs font-bold hover:bg-[#1A0F0D] transition-colors"
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
