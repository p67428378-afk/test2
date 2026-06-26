import React, { useState, useEffect } from "react";
import { authService } from "../../services/api";

export default function TopNavBar({
  wishlistCount,
  cartCount,
  onSearch,
  onNavigate,
  currentPage,
  onOpenAuthModal,
  user,
  onLogout,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const allSuggestions = [
    "Summer Linen Shirt",
    "Denim Jacket",
    "Floral Summer Maxi Dress",
    "Cozy Cable-Knit Sweater",
    "Tailored High-Waist Trousers",
    "Elegance Silk Blouse",
  ];

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSuggestions([]);
    } else {
      const filtered = allSuggestions.filter((item) =>
        item.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setSuggestions(filtered);
    }
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  return (
    <header className="bg-surface-container-lowest border-b border-outline-variant docked full-width top-0 sticky z-50">
      <div className="flex justify-between items-center w-full px-margin-desktop h-[80px] max-w-container-max mx-auto duration-200 ease-in-out">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => onNavigate("catalog")}
            className="font-headline-md text-headline-md font-bold text-primary bg-transparent border-none cursor-pointer"
          >
            Aura Threads
          </button>

          {/* Center: Search Bar & Dropdown */}
          <form
            onSubmit={handleSearchSubmit}
            className="relative hidden md:block w-96 ml-8 group"
          >
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-on-surface-variant z-10 pointer-events-none">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-200 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/70"
                placeholder="Search for shirts, dresses, jeans..."
              />
            </div>

            {/* Search Dropdown Suggestion List */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 w-full mt-1 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-lg z-50 overflow-hidden">
                <ul className="py-2">
                  {suggestions.map((suggestion, index) => (
                    <li key={index}>
                      <button
                        type="button"
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full flex items-center px-4 py-2 hover:bg-surface-container-low transition-colors font-body-md text-body-md text-on-surface text-left"
                      >
                        <span className="material-symbols-outlined mr-3 text-on-surface-variant text-[20px]">
                          history
                        </span>
                        {suggestion}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </form>
        </div>

        {/* Right: Navigation Links & Icons */}
        <nav className="flex items-center gap-6">
          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6 mr-4 font-body-md text-body-md">
            <button
              onClick={() => onNavigate("catalog")}
              className={`py-1 bg-transparent border-none cursor-pointer ${currentPage === "catalog" ? "text-primary font-semibold border-b-2 border-primary" : "text-on-surface-variant hover:text-primary transition-colors"}`}
            >
              Collections
            </button>
            {user && user.role === "admin" && (
              <button
                onClick={() => onNavigate("admin")}
                className={`py-1 bg-transparent border-none cursor-pointer ${currentPage === "admin" ? "text-primary font-semibold border-b-2 border-primary" : "text-on-surface-variant hover:text-primary transition-colors"}`}
              >
                Admin Dashboard
              </button>
            )}
          </div>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate("wishlist")}
              aria-label="Wishlist"
              className="relative text-on-surface-variant hover:text-primary transition-colors p-1 bg-transparent border-none cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px]">
                favorite
              </span>
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-error text-on-error font-label-sm text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onNavigate("cart")}
              aria-label="Cart"
              className="relative text-on-surface-variant hover:text-primary transition-colors p-1 bg-transparent border-none cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px]">
                shopping_bag
              </span>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-error text-on-error font-label-sm text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-body-sm text-on-surface-variant hidden sm:inline">
                  {user.name}
                </span>
                <button
                  onClick={onLogout}
                  className="text-body-sm text-primary hover:underline bg-transparent border-none cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="bg-primary text-on-primary font-label-md text-label-md px-4 py-2 rounded-lg hover:bg-primary-fixed hover:text-on-primary-fixed transition-colors border-none cursor-pointer"
              >
                Login
              </button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
