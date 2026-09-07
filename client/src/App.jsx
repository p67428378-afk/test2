import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Toast from "./components/common/Toast";
import DashboardPage from "./pages/DashboardPage";
import FavoritesPage from "./pages/FavoritesPage";
import GenresPage from "./pages/GenresPage";

function App() {
  const [selectedGenre, setSelectedGenre] = useState("cyberpunk");
  const [favorites, setFavorites] = useState([
    {
      name: "Kaelen Cross",
      genre: "cyberpunk",
      savedAt: new Date().toISOString(),
    },
    {
      name: "Eldrin Shadowweaver",
      genre: "fantasy",
      savedAt: new Date().toISOString(),
    },
    {
      name: "Vaelen Starstrider",
      genre: "sci-fi",
      savedAt: new Date().toISOString(),
    },
  ]);
  const [toast, setToast] = useState({ message: "", type: "info" });

  const showToast = (message, type = "info") => {
    setToast({ message, type });
  };

  const handleToggleFavorite = (name, genre) => {
    const exists = favorites.some((f) => f.name === name);
    if (exists) {
      setFavorites(favorites.filter((f) => f.name !== name));
      showToast(`Removed "${name}" from favorites`, "info");
    } else {
      const newItem = { name, genre, savedAt: new Date().toISOString() };
      setFavorites([...favorites, newItem]);
      showToast(`Saved "${name}" to session favorites!`, "success");
    }
  };

  const handleRemoveFavorite = (name) => {
    setFavorites(favorites.filter((f) => f.name !== name));
    showToast(`Removed "${name}" from favorites`, "info");
  };

  const handleClearFavorites = () => {
    setFavorites([]);
    showToast("Cleared all saved favorites", "info");
  };

  return (
    <div className="min-h-screen bg-[#051424] text-[#d4e4fa] font-sans">
      <Navbar favoritesCount={favorites.length} />

      <main className="max-w-7xl mx-auto p-6">
        <Routes>
          <Route
            path="/"
            element={
              <DashboardPage
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onShowToast={showToast}
                selectedGenre={selectedGenre}
                setSelectedGenre={setSelectedGenre}
              />
            }
          />
          <Route
            path="/favorites"
            element={
              <FavoritesPage
                favorites={favorites}
                onRemoveFavorite={handleRemoveFavorite}
                onClearFavorites={handleClearFavorites}
                onShowToast={showToast}
              />
            }
          />
          <Route
            path="/genres"
            element={<GenresPage setSelectedGenre={setSelectedGenre} />}
          />
        </Routes>
      </main>

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "info" })}
      />
    </div>
  );
}

export default App;
