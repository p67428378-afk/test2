import React from "react";
import FavoritesList from "../components/favorites/FavoritesList";

const FavoritesPage = ({
  favorites = [],
  onRemoveFavorite,
  onClearFavorites,
  onShowToast,
}) => {
  const handleCopy = (name) => {
    if (navigator && navigator.clipboard) {
      navigator.clipboard.writeText(name);
    }
    if (onShowToast) {
      onShowToast(`Copied "${name}" to clipboard!`, "info");
    }
  };

  return (
    <FavoritesList
      favorites={favorites}
      onRemoveFavorite={onRemoveFavorite}
      onClearFavorites={onClearFavorites}
      onCopy={handleCopy}
    />
  );
};

export default FavoritesPage;
