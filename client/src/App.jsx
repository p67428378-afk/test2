import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import AuthModal from "./components/auth/AuthModal";
import ExplorePage from "./pages/ExplorePage";
import RecipeDetailPage from "./pages/RecipeDetailPage";
import RecipeFormPage from "./pages/RecipeFormPage";
import FavoritesPage from "./pages/FavoritesPage";
import { authService } from "./services/api";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    // Load initial user state
    const user = authService.getUser();
    if (user) {
      setCurrentUser(user);
    } else if (authService.getToken()) {
      // Validate token on load
      authService
        .getMe()
        .then((u) => setCurrentUser(u))
        .catch(() => authService.logout());
    }
  }, []);

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  return (
    <Router>
      <div className="min-h-screen bg-[#f7fafc] text-[#171c29] flex flex-col font-sans">
        <Navbar
          currentUser={currentUser}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onLogout={handleLogout}
        />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route
              path="/"
              element={
                <ExplorePage
                  currentUser={currentUser}
                  onOpenAuthModal={() => setIsAuthModalOpen(true)}
                />
              }
            />
            <Route
              path="/recipes/:id"
              element={
                <RecipeDetailPage
                  currentUser={currentUser}
                  onOpenAuthModal={() => setIsAuthModalOpen(true)}
                />
              }
            />
            <Route
              path="/recipes/create"
              element={
                <RecipeFormPage
                  currentUser={currentUser}
                  onOpenAuthModal={() => setIsAuthModalOpen(true)}
                />
              }
            />
            <Route
              path="/recipes/:id/edit"
              element={
                <RecipeFormPage
                  currentUser={currentUser}
                  onOpenAuthModal={() => setIsAuthModalOpen(true)}
                />
              }
            />
            <Route
              path="/favorites"
              element={
                <FavoritesPage
                  currentUser={currentUser}
                  onOpenAuthModal={() => setIsAuthModalOpen(true)}
                />
              }
            />
          </Routes>
        </main>

        <footer className="bg-white border-t border-[#e3e8f0] py-6 text-center text-xs text-gray-500">
          <p>
            © {new Date().getFullYear()} RecipeVault — All-in-One Recipe & Meal
            Management
          </p>
        </footer>

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={(user) => setCurrentUser(user)}
        />
      </div>
    </Router>
  );
}
