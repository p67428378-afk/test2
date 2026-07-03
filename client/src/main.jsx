import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import TeacherAttendancePage from "./pages/TeacherAttendancePage";
import PrincipalDashboardPage from "./pages/PrincipalDashboardPage";
import StudentProfilePage from "./pages/StudentProfilePage";
import "./index.css";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 max-w-md mx-auto mt-12 bg-rose-50 border border-rose-200 rounded-xl text-rose-700">
          <h2 className="text-lg font-bold mb-2">Something went wrong.</h2>
          <p className="text-sm">
            Please check the console or reload the page.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-8 max-w-7xl mx-auto">
        <Routes>
          <Route path="/" element={<TeacherAttendancePage />} />
          <Route path="/principal" element={<PrincipalDashboardPage />} />
          <Route path="/student/:studentId" element={<StudentProfilePage />} />
        </Routes>
      </main>
    </div>
  );
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
