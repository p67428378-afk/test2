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
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: "2rem",
            color: "#ffb4ab",
            backgroundColor: "#0b1326",
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
            The application encountered an unexpected rendering error.
          </p>
          <pre
            style={{
              backgroundColor: "#171f33",
              padding: "1rem",
              borderRadius: "0.25rem",
              overflowX: "auto",
            }}
          >
            {this.state.error?.toString()}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: "1rem",
              backgroundColor: "#f59e0b",
              color: "#472a00",
              padding: "0.5rem 1rem",
              borderRadius: "0.25rem",
              fontWeight: "bold",
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
