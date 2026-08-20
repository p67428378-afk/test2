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

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#edf2fa] p-8 text-center">
          <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md">
            <h2 className="text-2xl font-bold text-error mb-4">
              Oops! Something went wrong. 😢
            </h2>
            <p className="text-[#63738c] mb-6">
              Don't worry, we can try reloading the page or going back to the
              dashboard.
            </p>
            <button
              onClick={() => (window.location.href = "/")}
              className="bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-opacity-90 transition-colors"
            >
              Go to Dashboard 🌟
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
