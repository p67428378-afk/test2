import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { itemService, claimService } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import Timeline from "../components/lost-found/Timeline";
import ClaimPanel from "../components/lost-found/ClaimPanel";
import {
  MapPin,
  Calendar,
  User,
  Phone,
  Sparkles,
  ArrowLeft,
  Image as ImageIcon,
  ShieldCheck,
} from "lucide-react";

export const ItemDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const [item, setItem] = useState(null);
  const [matches, setMatches] = useState([]);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("matches");
  const [loading, setLoading] = useState(true);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [claimLoading, setClaimLoading] = useState(false);
  const [threshold, setThreshold] = useState(60);
  const [error, setError] = useState("");

  const fetchItemDetails = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await itemService.getItemById(id);
      setItem(data);
    } catch (err) {
      console.error("Error fetching item details:", err);
      setError("Item not found or failed to load.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMatches = async () => {
    setMatchesLoading(true);
    try {
      const res = await itemService.getItemMatches(id, threshold);
      setMatches(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("Error fetching matches:", err);
      setMatches([]);
    } finally {
      setMatchesLoading(false);
    }
  };

  const fetchAuditHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await claimService.getItemHistory(id);
      setHistory(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("Error fetching audit history:", err);
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchItemDetails();
      fetchMatches();
      fetchAuditHistory();
    }
  }, [id, threshold]);

  const handleUserClaimSubmit = async (claimPayload) => {
    setClaimLoading(true);
    try {
      await claimService.submitClaim(claimPayload);
      await fetchItemDetails();
      await fetchAuditHistory();
    } catch (err) {
      throw err;
    } finally {
      setClaimLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block animate-spin w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full mb-3"></div>
        <p className="text-sm text-slate-500">Loading item details...</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800">Item Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">
          {error || "The requested item report does not exist."}
        </p>
        <Button onClick={() => navigate("/")} className="mt-6">
          Return to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/")}
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">{item.name}</h1>
            <span
              className={`px-2.5 py-0.5 rounded text-xs font-semibold uppercase ${
                item.type === "lost"
                  ? "bg-rose-100 text-rose-800"
                  : "bg-emerald-100 text-emerald-800"
              }`}
            >
              {item.type}
            </span>
            <Badge variant={item.status === "reunited" ? "success" : "info"}>
              {item.status}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Reported on {new Date(item.created_at).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-semibold text-slate-800 text-base border-b border-slate-100 pb-3">
              Item Information
            </h3>

            <p className="text-sm text-slate-700 whitespace-pre-wrap">
              {item.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
              <div className="flex items-center gap-2 text-slate-600 bg-slate-50 p-2.5 rounded-lg">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>
                  <strong>Location:</strong> {item.location}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 bg-slate-50 p-2.5 rounded-lg">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>
                  <strong>Incident Date:</strong>{" "}
                  {new Date(item.date_incident).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 bg-slate-50 p-2.5 rounded-lg">
                <User className="w-4 h-4 text-slate-400" />
                <span>
                  <strong>Category:</strong> {item.category}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 bg-slate-50 p-2.5 rounded-lg">
                <Phone className="w-4 h-4 text-slate-400" />
                <span>
                  <strong>Contact:</strong> {item.contact_info}
                </span>
              </div>
            </div>

            {item.images && item.images.length > 0 && (
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-slate-400" /> Attached
                  Photos
                </h4>
                <div className="flex flex-wrap gap-3">
                  {item.images.map((img, idx) => (
                    <a
                      key={idx}
                      href={img.image_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-24 h-24 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 hover:opacity-90 transition"
                    >
                      <img
                        src={img.image_url}
                        alt={`Item photo ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex border-b border-slate-200 bg-slate-50/50 px-6 pt-2">
              <button
                onClick={() => setActiveTab("matches")}
                className={`py-3 px-4 text-sm font-medium border-b-2 transition flex items-center gap-2 ${
                  activeTab === "matches"
                    ? "border-indigo-600 text-indigo-600 bg-white rounded-t-lg"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                AI Match Suggestions ({matches.length})
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`py-3 px-4 text-sm font-medium border-b-2 transition flex items-center gap-2 ${
                  activeTab === "history"
                    ? "border-indigo-600 text-indigo-600 bg-white rounded-t-lg"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-indigo-500" />
                Claim Audit Trail
              </button>
            </div>

            <div className="p-6">
              {activeTab === "matches" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-amber-50/50 p-3 rounded-lg border border-amber-100 text-xs text-amber-900">
                    <span className="font-medium flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-600" /> Similarity
                      Confidence Threshold: {threshold}%
                    </span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={threshold}
                      onChange={(e) => setThreshold(Number(e.target.value))}
                      className="w-32 accent-indigo-600"
                    />
                  </div>

                  {matchesLoading ? (
                    <p className="text-xs text-slate-400 py-6 text-center">
                      Evaluating vector feature similarity...
                    </p>
                  ) : matches.length === 0 ? (
                    <div className="py-8 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200">
                      <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <h4 className="text-sm font-medium text-slate-700">
                        No AI matches found yet
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                        No active reports exceeded the minimum {threshold}%
                        confidence score. Re-evaluation runs automatically as
                        new items are posted.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {matches.map((m, idx) => {
                        const matched = m.matched_item || {};
                        const score = Math.round(m.similarity_score || 0);
                        return (
                          <div
                            key={idx}
                            className="p-4 rounded-lg border border-slate-200 hover:border-indigo-300 transition bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-slate-800 text-sm">
                                  {matched.name}
                                </span>
                                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-100 text-indigo-700 uppercase">
                                  {score}% Match
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 line-clamp-1">
                                {matched.description}
                              </p>
                              <div className="text-[11px] text-slate-400 flex items-center gap-3">
                                <span>Location: {matched.location}</span>
                                <span>Category: {matched.category}</span>
                              </div>
                            </div>
                            <Link
                              to={`/items/${matched.id}`}
                              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-lg text-center transition"
                            >
                              View Item
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "history" && (
                <Timeline history={history} loading={historyLoading} />
              )}
            </div>
          </div>
        </div>

        <div>
          <ClaimPanel
            claim={item.current_claim || null}
            onSubmitClaim={handleUserClaimSubmit}
            loading={claimLoading}
            isAdmin={isAdmin}
            itemId={item.id}
          />
        </div>
      </div>
    </div>
  );
};

export default ItemDetailPage;
