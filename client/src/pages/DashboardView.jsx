import React, { useState, useEffect } from "react";
import { watchlistService, ratingService } from "../services/api";
import WatchlistItem from "../components/WatchlistItem";
import RatedItem from "../components/RatedItem";

export default function DashboardView() {
  const [activeTab, setActiveTab] = useState("watchlist"); // 'watchlist' or 'ratings'
  const [watchlist, setWatchlist] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [wlData, ratData] = await Promise.all([
        watchlistService.getWatchlist(),
        ratingService.getRatings(),
      ]);
      setWatchlist(wlData);
      setRatings(ratData);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRemoveFromWatchlist = async (filmId) => {
    await watchlistService.removeFromWatchlist(filmId);
    // Refresh data
    const wlData = await watchlistService.getWatchlist();
    setWatchlist(wlData);
  };

  const handleRate = async (filmId, rating) => {
    await ratingService.rateFilm(filmId, rating);
    // Refresh data
    const ratData = await ratingService.getRatings();
    setRatings(ratData);
  };

  const handleClearRating = async (filmId) => {
    await ratingService.clearRating(filmId);
    // Refresh data
    const ratData = await ratingService.getRatings();
    setRatings(ratData);
  };

  const getFilmRating = (filmId) => {
    const ratingEntry = ratings.find((entry) => entry.film.id === filmId);
    return ratingEntry ? ratingEntry.rating : 0;
  };

  // Calculate stats
  const totalRated = ratings.length;
  const averageRating =
    totalRated > 0
      ? (ratings.reduce((sum, r) => sum + r.rating, 0) / totalRated).toFixed(1)
      : "0.0";

  // Sort ratings by updated_at or created_at desc for recent ratings
  const recentRatings = [...ratings]
    .sort(
      (a, b) =>
        new Date(b.updated_at || b.created_at) -
        new Date(a.updated_at || a.created_at),
    )
    .slice(0, 3);

  return (
    <div
      className="bg-[#0f1729] content-stretch flex flex-col gap-[24px] items-start p-[32px] relative min-h-screen w-full"
      data-node-id="1:91"
      data-name="Dashboard View"
    >
      {/* Header */}
      <div
        className="[word-break:break-word] content-stretch flex flex-col gap-[8px] items-start leading-[normal] not-italic overflow-clip relative shrink-0 w-full whitespace-nowrap"
        data-node-id="1:102"
        data-name="Header"
      >
        <h1
          className="font-bold relative shrink-0 text-[#f7fafc] text-[32px]"
          data-node-id="1:103"
        >
          My Dashboard
        </h1>
        <p
          className="font-normal relative shrink-0 text-[#94a3b8] text-[16px]"
          data-node-id="1:104"
        >
          Manage your personal watchlist and view your movie ratings.
        </p>
      </div>

      {/* Tab Bar */}
      <div
        className="content-stretch flex gap-[16px] items-start overflow-clip relative shrink-0 w-full border-b border-[#334054]"
        data-node-id="1:105"
        data-name="TabBar"
      >
        <button
          onClick={() => setActiveTab("watchlist")}
          className="content-stretch flex flex-col gap-[4px] items-center overflow-clip p-[8px] relative shrink-0 focus:outline-none"
          data-node-id="1:106"
          data-name="Tab"
        >
          <p
            className={`[word-break:break-word] font-bold leading-[normal] not-italic relative shrink-0 text-[14px] whitespace-nowrap ${
              activeTab === "watchlist"
                ? "text-[#6173f5]"
                : "text-[#94a3b8] hover:text-white"
            }`}
            data-node-id="1:107"
          >
            My Watchlist
          </p>
          {activeTab === "watchlist" && (
            <div
              className="bg-[#6173f5] h-[3px] relative rounded-[999px] shrink-0 w-[24px]"
              data-node-id="1:108"
              data-name="ActiveIndicator"
            />
          )}
        </button>
        <button
          onClick={() => setActiveTab("ratings")}
          className="content-stretch flex flex-col gap-[4px] items-center overflow-clip p-[8px] relative shrink-0 focus:outline-none"
          data-node-id="1:109"
          data-name="Tab"
        >
          <p
            className={`[word-break:break-word] font-bold leading-[normal] not-italic relative shrink-0 text-[14px] whitespace-nowrap ${
              activeTab === "ratings"
                ? "text-[#6173f5]"
                : "text-[#94a3b8] hover:text-white"
            }`}
            data-node-id="1:110"
          >
            My Ratings
          </p>
          {activeTab === "ratings" && (
            <div
              className="bg-[#6173f5] h-[3px] relative rounded-[999px] shrink-0 w-[24px]"
              data-node-id="1:108"
              data-name="ActiveIndicator"
            />
          )}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div
          className="bg-red-900/20 border border-red-500 text-red-200 p-4 rounded-[10px] w-full"
          role="alert"
        >
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center w-full py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6173f5]"></div>
        </div>
      ) : (
        <div
          className="content-stretch flex flex-col lg:flex-row gap-[24px] items-start overflow-clip relative shrink-0 w-full"
          data-node-id="1:171"
          data-name="SplitLayout"
        >
          {/* Main Column */}
          <div
            className="content-stretch flex flex-col lg:flex-[6_0_0] items-start min-w-px overflow-clip relative w-full"
            data-node-id="1:172"
            data-name="MainColumn"
          >
            {activeTab === "watchlist" ? (
              <div
                className="bg-[#1f293b] border border-[#334054] border-solid content-stretch flex flex-col gap-[12px] items-start overflow-clip p-[24px] relative rounded-[14px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08)] shrink-0 w-full"
                data-node-id="1:137"
                data-name="Card"
              >
                <h2
                  className="[word-break:break-word] font-bold leading-[normal] not-italic relative shrink-0 text-[#f7fafc] text-[18px] whitespace-nowrap"
                  data-node-id="1:138"
                >
                  My Watchlist ({watchlist.length}{" "}
                  {watchlist.length === 1 ? "film" : "films"})
                </h2>
                {watchlist.length > 0 ? (
                  <div className="flex flex-col gap-3 w-full">
                    {watchlist.map((entry) => (
                      <WatchlistItem
                        key={entry.id}
                        entry={entry}
                        currentRating={getFilmRating(entry.film.id)}
                        onRemove={handleRemoveFromWatchlist}
                        onRate={handleRate}
                        onClearRating={handleClearRating}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-[#94a3b8] text-[14px] py-4">
                    Your watchlist is empty. Start searching for films to add
                    them!
                  </p>
                )}
              </div>
            ) : (
              <div
                className="bg-[#1f293b] border border-[#334054] border-solid content-stretch flex flex-col gap-[12px] items-start overflow-clip p-[24px] relative rounded-[14px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08)] shrink-0 w-full"
                data-node-id="1:137"
                data-name="Card"
              >
                <h2
                  className="[word-break:break-word] font-bold leading-[normal] not-italic relative shrink-0 text-[#f7fafc] text-[18px] whitespace-nowrap"
                  data-node-id="1:138"
                >
                  My Rated Movies ({ratings.length}{" "}
                  {ratings.length === 1 ? "film" : "films"})
                </h2>
                {ratings.length > 0 ? (
                  <div className="flex flex-col gap-3 w-full">
                    {ratings.map((entry) => (
                      <RatedItem
                        key={entry.id}
                        entry={entry}
                        onClearRating={handleClearRating}
                        onRate={handleRate}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-[#94a3b8] text-[14px] py-4">
                    You haven't rated any movies yet.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Side Column */}
          <div
            className="content-stretch flex flex-col lg:flex-[4_0_0] items-start min-w-px overflow-clip relative w-full"
            data-node-id="1:173"
            data-name="SideColumn"
          >
            <div
              className="bg-[#1f293b] border border-[#334054] border-solid content-stretch flex flex-col gap-[12px] items-start overflow-clip p-[24px] relative rounded-[14px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08)] shrink-0 w-full"
              data-node-id="1:169"
              data-name="Card"
            >
              <h2
                className="[word-break:break-word] font-bold leading-[normal] not-italic relative shrink-0 text-[#f7fafc] text-[18px] whitespace-nowrap"
                data-node-id="1:170"
              >
                My Ratings Overview
              </h2>

              {/* Stat Card */}
              <div
                className="bg-[#1f293b] border border-[#334054] border-solid content-stretch flex flex-col gap-[4px] items-start overflow-clip p-[16px] relative rounded-[14px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08)] shrink-0 w-full"
                data-node-id="1:139"
                data-name="Stat"
              >
                <p
                  className="[word-break:break-word] font-medium leading-[normal] not-italic relative shrink-0 text-[#94a3b8] text-[12px] whitespace-nowrap"
                  data-node-id="1:140"
                >
                  Total Rated Movies
                </p>
                <div
                  className="content-stretch flex gap-[8px] items-baseline overflow-clip relative shrink-0"
                  data-node-id="1:141"
                  data-name="ValueRow"
                >
                  <p
                    className="[word-break:break-word] font-bold leading-[normal] not-italic relative shrink-0 text-[#f7fafc] text-[24px] whitespace-nowrap"
                    data-node-id="1:142"
                  >
                    {totalRated} {totalRated === 1 ? "film" : "films"}
                  </p>
                  {totalRated > 0 && (
                    <div
                      className="bg-[#f04545] content-stretch flex items-center justify-center overflow-clip px-[8px] py-[4px] relative rounded-[999px] shrink-0"
                      data-node-id="1:143"
                      data-name="Badge"
                    >
                      <p
                        className="[word-break:break-word] font-medium leading-[normal] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap"
                        data-node-id="1:144"
                      >
                        Average: {averageRating} ★
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div
                className="bg-[#334054] h-px relative shrink-0 w-full"
                data-node-id="1:145"
                data-name="Divider"
              />

              {/* Recent Ratings */}
              <p
                className="[word-break:break-word] font-bold leading-[normal] min-w-full not-italic relative shrink-0 text-[#f7fafc] text-[14px] w-[min-content]"
                data-node-id="1:146"
              >
                Recent Ratings
              </p>
              {recentRatings.length > 0 ? (
                <div className="flex flex-col gap-3 w-full">
                  {recentRatings.map((entry) => (
                    <div
                      key={entry.id}
                      className="bg-[#1f293b] border border-[#334054] border-solid content-stretch flex gap-[12px] items-center overflow-clip p-[12px] relative rounded-[10px] shrink-0 w-full"
                    >
                      <div className="bg-[#141c2b] content-stretch flex flex-col h-[48px] items-center justify-center overflow-clip relative rounded-[6px] shrink-0 w-[36px]">
                        <p className="[word-break:break-word] font-normal leading-[normal] not-italic relative shrink-0 text-[#f7fafc] text-[12px] whitespace-nowrap">
                          🎬
                        </p>
                      </div>
                      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
                        <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] h-full items-start leading-[normal] min-w-px not-italic overflow-clip relative whitespace-nowrap">
                          <p className="font-bold relative shrink-0 text-[#f7fafc] text-[14px] truncate max-w-[120px]">
                            {entry.film.title}
                          </p>
                          <p className="font-normal relative shrink-0 text-[#94a3b8] text-[10px]">
                            {entry.film.genre}
                          </p>
                        </div>
                      </div>
                      <div className="bg-[#141c2b] px-2 py-1 rounded-[6px] border border-[#334054] text-xs font-bold text-[#f5a826]">
                        {entry.rating} ★
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[#94a3b8] text-[12px]">No recent ratings.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
