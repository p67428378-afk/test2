import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/layout/Navbar.jsx";
import HomePage from "./pages/HomePage.jsx";
import ProjectDetailPage from "./pages/ProjectDetailPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-[#F7FAFC] text-[#171C29]">
        <Navbar />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer className="bg-white border-t border-[#E3E8F0] py-8 text-center text-xs text-[#707A8C]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
            <p className="font-medium text-slate-700">
              DevPortfolio &copy; {new Date().getFullYear()} &mdash; Freelance
              Showcase &amp; Client Lead Capture
            </p>
            <p>Built with React 18, Vite, Tailwind CSS, and FastAPI.</p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
