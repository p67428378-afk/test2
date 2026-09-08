import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import TopNavbar from "./components/TopNavbar";
import DashboardPage from "./pages/DashboardPage";
import TransactionsPage from "./pages/TransactionsPage";
import BudgetsPage from "./pages/BudgetsPage";
import ReportsPage from "./pages/ReportsPage";
import { authApi } from "./services/api";
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
    // Handled by Error Boundary
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 max-w-lg mx-auto my-12 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 shadow-sm">
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p className="text-sm text-rose-700 mb-4">
            An unexpected error occurred while rendering the application.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            Reload Application
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [currentUser, setCurrentUser] = useState(authApi.getUser());

  useEffect(() => {
    const initAuth = async () => {
      const token = authApi.getToken();
      if (!token) {
        try {
          const data = await authApi.login("test@example.com", "testpassword");
          setCurrentUser(data.user || authApi.getUser());
        } catch {
          // Unauthenticated / offline mode
        }
      } else {
        try {
          const user = await authApi.getMe();
          setCurrentUser(user);
        } catch {
          authApi.logout();
          setCurrentUser(null);
        }
      }
    };

    initAuth();
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <TopNavbar currentUser={currentUser} onAuthChange={setCurrentUser} />
        <main className="flex-1">
          <Routes>
            <Route
              path="/"
              element={<DashboardPage currentUser={currentUser} />}
            />
            <Route
              path="/transactions"
              element={<TransactionsPage currentUser={currentUser} />}
            />
            <Route
              path="/budgets"
              element={<BudgetsPage currentUser={currentUser} />}
            />
            <Route
              path="/reports"
              element={<ReportsPage currentUser={currentUser} />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-400">
          FinTrack Pro • Core Expense Management & Reporting • SCRUM-232
        </footer>
      </div>
    </BrowserRouter>
  );
}

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>,
  );
}
