import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, AlertCircle, RefreshCw } from "lucide-react";
import {
  getEpisodeById,
  getPodcastById,
  getPodcastEpisodes,
} from "../services/api";
import ShowNotesCard from "../components/podcast/ShowNotesCard";
import PlayerDeckCard from "../components/podcast/PlayerDeckCard";

export default function EpisodeDetailPage() {
  const { id } = useParams();
  const [episode, setEpisode] = useState(null);
  const [podcast, setPodcast] = useState(null);
  const [relatedEpisodes, setRelatedEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEpisodeAndShow = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const epData = await getEpisodeById(id);
      setEpisode(epData);

      if (epData.podcast_id) {
        const [podData, epListData] = await Promise.all([
          getPodcastById(epData.podcast_id),
          getPodcastEpisodes(epData.podcast_id, { page: 1, limit: 10 }),
        ]);
        setPodcast(podData);
        setRelatedEpisodes(epListData.items || []);
      }
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to load episode details. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEpisodeAndShow();
  }, [fetchEpisodeAndShow]);

  if (loading && !episode) {
    return (
      <div className="space-y-6">
        <div className="h-6 bg-slate-200 rounded w-1/4 animate-pulse"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-[#e3e8f0] p-8 rounded-2xl animate-pulse space-y-4">
            <div className="h-6 bg-slate-200 rounded w-1/3"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            <div className="h-32 bg-slate-100 rounded"></div>
          </div>
          <div className="bg-white border border-[#e3e8f0] p-8 rounded-2xl animate-pulse h-80"></div>
        </div>
      </div>
    );
  }

  if (error && !episode) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center space-y-4">
        <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
        <h2 className="text-lg font-bold text-red-800">Episode Not Found</h2>
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
            onClick={fetchEpisodeAndShow}
            className="px-4 py-2 bg-[#2663eb] text-white text-xs font-semibold rounded-xl"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-[#707a8c]">
        <Link
          to="/"
          className="hover:text-[#2663eb] flex items-center gap-1 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <span>›</span>
        {podcast ? (
          <Link to={`/podcasts/${podcast.id}`} className="hover:text-[#2663eb]">
            {podcast.title}
          </Link>
        ) : (
          <span>Podcast</span>
        )}
        <span>›</span>
        <span className="text-[#171c29] font-semibold truncate max-w-sm">
          {episode?.title}
        </span>
      </div>

      {/* 2-Column Split View: Show Notes + Player Deck */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="flex-1 w-full">
          <ShowNotesCard episode={episode} show={podcast} />
        </div>
        <div className="w-full lg:w-auto shrink-0">
          <PlayerDeckCard
            episode={episode}
            show={podcast}
            relatedEpisodes={relatedEpisodes}
          />
        </div>
      </div>
    </div>
  );
}
