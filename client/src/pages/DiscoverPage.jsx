import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { quotesService, favoritesService, authService } from "../services/api";
import QuoteCard from "../components/quotes/QuoteCard";
import Card from "../components/common/Card";
import Button from "../components/common/Button";

export default function DiscoverPage() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const [qotd, setQotd] = useState(null);
  const [randomQuote, setRandomQuote] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loadingQotd, setLoadingQotd] = useState(true);
  const [loadingRandom, setLoadingRandom] = useState(false);
  const [error, setError] = useState(null);
  const [discoveredCount, setDiscoveredCount] = useState(0);

  // Load initial data
  useEffect(() => {
    fetchQotd();
    if (user) {
      fetchFavorites();
    }
    // Load discovered count from localStorage
    const count = localStorage.getItem("discoveredCount") || 0;
    setDiscoveredCount(parseInt(count, 10));
  }, []);

  const fetchQotd = async () => {
    setLoadingQotd(true);
    setError(null);
    try {
      const data = await quotesService.getDailyQuote();
      setQotd(data);
      incrementDiscovered();
    } catch (err) {
      console.error("Error fetching QOTD:", err);
      setError("Failed to load Quote of the Day. Showing fallback quote.");
      // Fallback quote
      setQotd({
        id: "fallback-qotd",
        text: "The only limit to our realization of tomorrow is our doubts of today.",
        author: "Franklin D. Roosevelt",
        category: "Motivation",
      });
    } finally {
      setLoadingQotd(false);
    }
  };

  const fetchRandomQuote = async () => {
    setLoadingRandom(true);
    try {
      const data = await quotesService.getRandomQuote();
      setRandomQuote(data);
      incrementDiscovered();
    } catch (err) {
      console.error("Error fetching random quote:", err);
      // Fallback random quote
      setRandomQuote({
        id: "fallback-random",
        text: "Act as if what you do makes a difference. It does.",
        author: "William James",
        category: "Wisdom",
      });
    } finally {
      setLoadingRandom(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const data = await favoritesService.getFavorites();
      setFavorites(data);
    } catch (err) {
      console.error("Error fetching favorites:", err);
    }
  };

  const incrementDiscovered = () => {
    setDiscoveredCount((prev) => {
      const next = prev + 1;
      localStorage.setItem("discoveredCount", next);
      return next;
    });
  };

  const handleFavoriteToggle = async (quote) => {
    if (!user) {
      navigate("/login");
      return;
    }

    const existingFav = favorites.find((f) => f.quote_id === quote.id);

    if (existingFav) {
      try {
        await favoritesService.removeFavorite(existingFav.id);
        setFavorites((prev) => prev.filter((f) => f.id !== existingFav.id));
      } catch (err) {
        console.error("Error removing favorite:", err);
      }
    } else {
      try {
        const newFav = await favoritesService.addFavorite(quote.id);
        setFavorites((prev) => [...prev, newFav]);
      } catch (err) {
        console.error("Error adding favorite:", err);
      }
    }
  };

  const isQuoteFavorite = (quoteId) => {
    return favorites.some((f) => f.quote_id === quoteId);
  };

  return (
    <div className="flex flex-col gap-6 items-start w-full">
      <div className="flex flex-col gap-1 items-start w-full">
        <h1 className="font-bold text-[#171c29] text-3xl">
          Discover Daily Inspiration
        </h1>
        <p className="text-[#707a8c] text-sm">
          Start your day with a powerful quote or generate random ones on
          demand.
        </p>
      </div>

      {error && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg text-sm w-full">
          ⚠️ {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start">
        {/* Main Column */}
        <div className="lg:col-span-8 flex flex-col gap-6 w-full">
          {/* Quote of the Day */}
          <Card title="Quote of the Day">
            {loadingQotd ? (
              <div className="py-12 text-center text-[#707a8c]">
                Loading daily inspiration...
              </div>
            ) : (
              <QuoteCard
                quote={qotd}
                isFavorite={isQuoteFavorite(qotd?.id)}
                onFavoriteToggle={() => handleFavoriteToggle(qotd)}
                badgeText="DAILY INSPIRATION"
                updatedText="Updated 2h ago"
              />
            )}
          </Card>

          {/* Discover Random Quotes */}
          <Card title="Discover Random Quotes">
            <div className="flex flex-col gap-4 w-full">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <p className="text-[#707a8c] text-sm">
                  Click below to fetch a new random quote from our library.
                </p>
                <Button
                  variant="primary"
                  onClick={fetchRandomQuote}
                  disabled={loadingRandom}
                >
                  <span>🔄</span>
                  <span>
                    {loadingRandom ? "Fetching..." : "Discover Another"}
                  </span>
                </Button>
              </div>

              {randomQuote ? (
                <QuoteCard
                  quote={randomQuote}
                  isFavorite={isQuoteFavorite(randomQuote.id)}
                  onFavoriteToggle={() => handleFavoriteToggle(randomQuote)}
                />
              ) : (
                <div className="bg-white border border-dashed border-[#e3e8f0] rounded-2xl p-8 text-center text-[#707a8c] text-sm">
                  No random quote loaded yet. Click "Discover Another" to start!
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Side Column */}
        <div className="lg:col-span-4 flex flex-col gap-6 w-full">
          {/* Inspiration Stats */}
          <Card title="Your Inspiration Stats">
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="bg-white border border-[#e3e8f0] rounded-2xl p-4 flex flex-col gap-1 shadow-sm">
                <p className="text-[#707a8c] text-xs font-medium">
                  Total Favorites
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="font-bold text-[#171c29] text-2xl">
                    {favorites.length}
                  </p>
                  <span className="bg-[#17a34a] text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                    Active
                  </span>
                </div>
              </div>

              <div className="bg-white border border-[#e3e8f0] rounded-2xl p-4 flex flex-col gap-1 shadow-sm">
                <p className="text-[#707a8c] text-xs font-medium">
                  Quotes Discovered
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="font-bold text-[#171c29] text-2xl">
                    {discoveredCount}
                  </p>
                  <span className="bg-[#17a34a] text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                    + {discoveredCount}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#f2f5fa] border border-[#e3e8f0] p-3 rounded-xl flex flex-col gap-1 w-full">
              <p className="font-bold text-[#eb9917] text-sm">
                🔥 5-Day Inspiration Streak!
              </p>
              <p className="text-[#707a8c] text-xs">
                Keep discovering quotes daily to maintain your streak.
              </p>
            </div>
          </Card>

          {/* Recently Favorited */}
          <Card title="Recently Favorited">
            <div className="flex flex-col gap-3 w-full">
              {favorites.length > 0 ? (
                favorites
                  .slice(-2)
                  .reverse()
                  .map((fav) => (
                    <div
                      key={fav.id}
                      className="bg-[#f2f5fa] border border-[#e3e8f0] p-3 rounded-xl flex flex-col gap-1"
                    >
                      <p className="font-medium text-[#171c29] text-xs line-clamp-2">
                        “{fav.quote?.text}”
                      </p>
                      <p className="text-[#707a8c] text-[10px]">
                        — {fav.quote?.author}
                      </p>
                    </div>
                  ))
              ) : (
                <p className="text-[#707a8c] text-xs text-center py-4">
                  No favorites saved yet.
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
