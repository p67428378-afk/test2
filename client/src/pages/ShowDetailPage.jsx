import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Radio, AlertCircle, RefreshCw, ListMusic } from "lucide-react";
import { getPodcastById, getPodcastEpisodes } from "../services/api";
import ShowHeaderBanner from "../components/podcast/ShowHeaderBanner";
import EpisodeRow from "../components/podcast/EpisodeRow";

export default function ShowDetailPage() {
  const { id } = useParams();
  const [podcast, setPodcast] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEpisodes, setTotalEpisodes] = useState(0);

  const fetchShowAndEpisodes = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const [podcastData, episodesData] = await Promise.all([
        getPodcastById(id),
        getPodcastEpisodes(id, { page, limit: 10 }),
      ]);
      setPodcast(podcastData);
      setEpisodes(episodesData.items || []);
      setTotalPages(episodesData.pages || 1);
      setTotalEpisodes(episodesData.total || 0);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to load podcast show details or episodes. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, [id, page]);

  useEffect(() => {
    fetchShowAndEpisodes();
  }, [fetchShowAndEpisodes]);

  if (loading && !podcast) {
    return (
      <div className="space-y-6">
        <div className="bg-white border border-[#e3e8f0] p-8 rounded-2xl animate-pulse flex gap-6">
          <div className="w-40 h-40 bg-slate-200 rounded-2xl"></div>
          <div className="flex-1 space-y-4">
            <div className="h-6 bg-slate-200 rounded w-1/3"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            <div className="h-16 bg-slate-100 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !podcast) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center space-y-4">
        <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
        <h2 className="text-lg font-bold text-red-800">Show Not Found</h2>
        <p className="text-xs text-red-600">{error}</p>
        <div className="flex items-center justify-center gap-3">
          <Link
            to="/"
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-[#171c29] text-xs font-semibold rounded-xl"
          >
            &larr; Back to Catalog
          </Link>
          <button
            type="button"
            onClick={fetchShowAndEpisodes}
            className="px-4 py-2 bg-[#2663eb] text-white text-xs font-semibold rounded-xl"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Show Header Hero Banner */}
      <ShowHeaderBanner podcast={podcast} episodeCount={totalEpisodes} />

      {/* Episodes Feed Section */}
      <section className="bg-white border border-[#e3e8f0] p-6 md:p-8 rounded-2xl shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-[#e3e8f0] pb-4">
          <div className="flex items-center gap-2">
            <ListMusic className="w-5 h-5 text-[#2663eb]" />
            <h2 className="font-bold text-[#171c29] text-lg">
              Recent Episodes
            </h2>
            <span className="text-xs bg-[#f2f5fa] text-[#2663eb] font-semibold px-2.5 py-0.5 rounded-full">
              {totalEpisodes}
            </span>
          </div>
          <span className="text-xs text-[#707a8c]">
            Sorted by date (newest first)
          </span>
        </div>

        {/* Empty episodes check */}
        {episodes.length === 0 ? (
          <div className="py-12 text-center text-[#707a8c] space-y-2">
            <p className="text-sm font-medium">
              No episodes published yet for this show.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {episodes.map((ep) => (
              <EpisodeRow
                key={ep.id}
                episode={ep}
                show={podcast}
                allEpisodes={episodes}
              />
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4 border-t border-[#e3e8f0]">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-[#e3e8f0] text-[#171c29] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors shadow-sm"
            >
              &larr; Previous
            </button>
            <span className="text-xs font-medium text-[#707a8c] px-3">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-[#e3e8f0] text-[#171c29] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors shadow-sm"
            >
              Next &rarr;
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
