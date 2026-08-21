import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import DecksDashboard from "./pages/DecksDashboard";
import DeckDetail from "./pages/DeckDetail";
import QuizMode from "./pages/QuizMode";
import QuizResults from "./pages/QuizResults";
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
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#f7fafc] flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-2xl font-bold text-error mb-2">
            Something went wrong.
          </h2>
          <p className="text-text_secondary mb-6">
            Please refresh the page or return to the dashboard.
          </p>
          <a
            href="/"
            className="px-5 py-2.5 bg-primary text-white font-semibold rounded-xl shadow-sm hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </a>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#f7fafc] flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<DecksDashboard />} />
            <Route path="/decks/:deckId" element={<DeckDetail />} />
            <Route path="/quizzes/:quizId" element={<QuizMode />} />
            <Route path="/quizzes/:quizId/results" element={<QuizResults />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
