import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
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
    console.error("Uncaught error in React ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#051424] text-[#d4e4fa] flex items-center justify-center p-8">
          <div className="p-8 bg-[#122131] border border-[#273647] rounded-xl max-w-lg w-full space-y-4 text-center">
            <div className="text-3xl">⚠️</div>
            <h2 className="text-xl font-bold text-[#ffb4ab]">
              Something went wrong
            </h2>
            <p className="text-sm text-[#849495]">
              An unexpected error occurred in the application rendering.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#00f0ff] text-[#00363a] font-bold text-xs rounded-lg hover:opacity-90"
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
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
);
