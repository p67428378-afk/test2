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
    // We can log the error to an analytics service here if needed
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: "2rem",
            backgroundColor: "#1E293B",
            color: "#dae2fd",
            minHeight: "100vh",
          }}
        >
          <h2 className="text-2xl font-bold text-red-400 mb-4">
            Something went wrong.
          </h2>
          <p className="text-sm text-slate-400 mb-4">
            The application encountered an unexpected error.
          </p>
          <pre className="bg-slate-900 p-4 rounded text-xs overflow-auto max-w-full">
            {this.state.error?.toString()}
          </pre>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm font-medium transition-colors"
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
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
