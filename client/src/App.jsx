import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TopNavBar from "./components/layout/TopNavBar.jsx";
import Footer from "./components/layout/Footer.jsx";
import PortfolioPage from "./pages/PortfolioPage.jsx";
import BookingPage from "./pages/BookingPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import ConfirmationPage from "./pages/ConfirmationPage.jsx";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-background text-on-background font-body-md antialiased">
        <TopNavBar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<PortfolioPage />} />
            <Route path="/book" element={<BookingPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/confirmation" element={<ConfirmationPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
