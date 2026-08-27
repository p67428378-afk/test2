import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import DocumentLibraryPage from "./pages/DocumentLibraryPage";
import EditorWorkspacePage from "./pages/EditorWorkspacePage";

export default function App() {
  return (
    <div className="min-h-screen bg-[#F7FAFC] flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<DocumentLibraryPage />} />
          <Route path="/library" element={<DocumentLibraryPage />} />
          <Route path="/editor" element={<EditorWorkspacePage />} />
          <Route path="/editor/:id" element={<EditorWorkspacePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
