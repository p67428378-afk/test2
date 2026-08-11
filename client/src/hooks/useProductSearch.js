import { useState, useEffect, useRef, useCallback } from "react";
import { productService } from "../services/api.js";

const RECENT_SEARCHES_KEY = "recent_search_queries";
const MAX_RECENT_SEARCHES = 5;

export function useProductSearch() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
        return saved
          ? JSON.parse(saved)
          : ["running shoes", "jackets", "denim", "hats", "socks"];
      }
    } catch (e) {
      console.error("Failed to load recent searches:", e);
    }
    return ["running shoes", "jackets", "denim", "hats", "socks"];
  });

  const [suggestions, setSuggestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // 300ms Input Debouncing
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  const saveRecentSearch = useCallback((searchString) => {
    if (!searchString || !searchString.trim()) return;
    const clean = searchString.trim();
    setRecentSearches((prev) => {
      const filtered = prev.filter(
        (item) => item.toLowerCase() !== clean.toLowerCase(),
      );
      const updated = [clean, ...filtered].slice(0, MAX_RECENT_SEARCHES);
      try {
        if (typeof window !== "undefined" && window.localStorage) {
          localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
        }
      } catch (e) {
        console.error("Failed to save recent search:", e);
      }
      return updated;
    });
  }, []);

  const removeRecentSearch = useCallback((searchString) => {
    setRecentSearches((prev) => {
      const updated = prev.filter((item) => item !== searchString);
      try {
        if (typeof window !== "undefined" && window.localStorage) {
          localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
        }
      } catch (e) {
        console.error("Failed to remove recent search:", e);
      }
      return updated;
    });
  }, []);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.removeItem(RECENT_SEARCHES_KEY);
      }
    } catch (e) {
      console.error("Failed to clear recent searches:", e);
    }
  }, []);

  const fetchSearchResults = useCallback(async (q, categoryId) => {
    if (!q || q.trim().length < 3) {
      setSuggestions([]);
      setCategories([]);
      setTotal(0);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await productService.searchProducts({
        q: q.trim(),
        category_id: categoryId === "all" ? "" : categoryId,
        limit: 10,
        page: 1,
      });

      setSuggestions(res.suggestions || []);
      setCategories(res.categories || []);
      setTotal(res.total || 0);
    } catch (err) {
      console.error("Error fetching product search suggestions:", err);
      setError("Unable to load suggestions. Retrying...");
    } finally {
      setLoading(false);
    }
  }, []);

  // Trigger search on debounced query or selected category change
  useEffect(() => {
    setSelectedIndex(-1);
    fetchSearchResults(debouncedQuery, selectedCategory);
  }, [debouncedQuery, selectedCategory, fetchSearchResults]);

  const handleKeyDown = (e) => {
    const isShowingSuggestions =
      debouncedQuery.trim().length >= 3 && suggestions.length > 0;
    const isShowingHistory =
      (!debouncedQuery.trim() || debouncedQuery.trim().length < 3) &&
      recentSearches.length > 0;

    const itemCount = isShowingSuggestions
      ? suggestions.length
      : isShowingHistory
        ? recentSearches.length
        : 0;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (itemCount === 0) return;
      setSelectedIndex((prev) => (prev + 1 >= itemCount ? 0 : prev + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (itemCount === 0) return;
      setSelectedIndex((prev) => (prev - 1 < 0 ? itemCount - 1 : prev - 1));
    } else if (e.key === "Enter") {
      if (selectedIndex >= 0 && selectedIndex < itemCount) {
        e.preventDefault();
        if (isShowingSuggestions) {
          const selectedItem = suggestions[selectedIndex];
          saveRecentSearch(selectedItem.title);
          setQuery(selectedItem.title);
          setIsFocused(false);
        } else if (isShowingHistory) {
          const selectedHistory = recentSearches[selectedIndex];
          setQuery(selectedHistory);
        }
      } else if (query.trim()) {
        saveRecentSearch(query);
        setIsFocused(false);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsFocused(false);
      setSelectedIndex(-1);
    }
  };

  const handleSelectCategory = (catId) => {
    setSelectedCategory(catId);
  };

  const handleSelectSuggestion = (item) => {
    saveRecentSearch(item.title);
    setQuery(item.title);
    setIsFocused(false);
  };

  const handleSelectRecentSearch = (searchStr) => {
    setQuery(searchStr);
  };

  const clearQuery = () => {
    setQuery("");
    setDebouncedQuery("");
    setSelectedIndex(-1);
  };

  return {
    query,
    setQuery,
    debouncedQuery,
    selectedCategory,
    setSelectedCategory: handleSelectCategory,
    recentSearches,
    suggestions,
    categories,
    total,
    loading,
    error,
    isFocused,
    setIsFocused,
    selectedIndex,
    setSelectedIndex,
    handleKeyDown,
    handleSelectSuggestion,
    handleSelectRecentSearch,
    saveRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
    clearQuery,
    retry: () => fetchSearchResults(debouncedQuery, selectedCategory),
  };
}
