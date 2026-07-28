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
    // We can log the error to console in development
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: "2rem",
            backgroundColor: "#0F172A",
            color: "#ffb4ab",
            minHeight: "100vh",
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              marginBottom: "1rem",
            }}
          >
            Something went wrong.
          </h2>
          <p style={{ marginBottom: "1rem" }}>
            The application encountered an unexpected error.
          </p>
          <pre
            style={{
              backgroundColor: "#1E293B",
              padding: "1rem",
              borderRadius: "0.5rem",
              overflowX: "auto",
              color: "#dae2fd",
            }}
          >
            {this.state.error?.toString()}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: "1rem",
              backgroundColor: "#c0c1ff",
              color: "#07006c",
              padding: "0.5rem 1rem",
              borderRadius: "0.25rem",
              fontWeight: "600",
            }}
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
