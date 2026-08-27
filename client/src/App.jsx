import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import EditorPage from "./pages/EditorPage";
import DocumentsPage from "./pages/DocumentsPage";

function AppContent() {
  const navigate = useNavigate();

  const handleNewDocument = () => {
    navigate("/?new=" + Date.now());
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7FAFC]">
      <Navbar onNewDocument={handleNewDocument} />
      <main className="flex-1 flex flex-col min-h-0">
        <Routes>
          <Route path="/" element={<EditorPage />} />
          <Route path="/editor" element={<EditorPage />} />
          <Route path="/editor/:id" element={<EditorPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="*" element={<EditorPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
