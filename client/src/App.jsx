import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AudioProvider } from "./context/AudioContext";
import Navbar from "./components/layout/Navbar";
import StickyAudioPlayer from "./components/layout/StickyAudioPlayer";
import CatalogPage from "./pages/CatalogPage";
import ShowDetailPage from "./pages/ShowDetailPage";
import EpisodeDetailPage from "./pages/EpisodeDetailPage";

export default function App() {
  return (
    <AudioProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-[#f7fafc] text-[#171c29]">
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 pb-32">
            <Routes>
              <Route path="/" element={<CatalogPage />} />
              <Route path="/podcasts/:id" element={<ShowDetailPage />} />
              <Route path="/episodes/:id" element={<EpisodeDetailPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <StickyAudioPlayer />
        </div>
      </BrowserRouter>
    </AudioProvider>
  );
}
