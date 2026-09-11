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
    console.error("Uncaught error in React ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 max-w-xl mx-auto my-12 bg-white rounded-2xl shadow-lg border border-rose-200">
          <h2 className="text-xl font-bold text-rose-600 mb-2">
            Something went wrong
          </h2>
          <p className="text-sm text-slate-600 mb-4">
            An unexpected error occurred while rendering this view. Please try
            refreshing or returning to home.
          </p>
          <pre className="p-3 bg-slate-100 rounded text-xs font-mono text-slate-800 overflow-x-auto mb-4">
            {this.state.error?.toString()}
          </pre>
          <button
            onClick={() => (window.location.href = "/")}
            className="px-4 py-2 bg-indigo-600 text-white font-medium text-xs rounded-lg hover:bg-indigo-700"
          >
            Return to Dashboard
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
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
