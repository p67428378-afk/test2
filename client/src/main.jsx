import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
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
    console.error("Uncaught React Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#f5fafc] flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full border border-[#e0e8f0]">
            <div className="text-4xl mb-4">🏥</div>
            <h1 className="text-xl font-bold text-[#db2727] mb-2">
              Something went wrong
            </h1>
            <p className="text-[#6b7a8f] text-sm mb-4">
              An unexpected error occurred in the application.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#1485b8] text-white rounded font-medium text-sm hover:bg-[#0f6e99] transition-colors"
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
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
);
