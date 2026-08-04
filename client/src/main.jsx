import React from "react";
import ReactDOM from "react-dom/client";
import Dashboard from "./components/Dashboard";
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
    // structured error handling
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center text-on-surface bg-dg-navy min-h-screen flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">
            Something went wrong
          </h2>
          <p className="text-on-surface-variant mb-4">
            An error occurred while rendering the dashboard.
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 bg-primary-container text-dg-navy font-bold rounded"
          >
            Try Again
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
      <Dashboard />
    </ErrorBoundary>
  </React.StrictMode>,
);
