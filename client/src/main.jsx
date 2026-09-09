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
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
          <div className="bg-white p-8 rounded-xl border shadow-sm max-w-md w-full space-y-4">
            <h2 className="text-xl font-bold text-red-600">
              Something went wrong
            </h2>
            <p className="text-sm text-slate-600">
              {this.state.error?.toString()}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-teal-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-900"
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
