import React, { useState } from "react";
import { UserPlus, AlertCircle, CheckCircle, X } from "lucide-react";
import { playerService } from "../services/api";

export default function PlayerRegistrationForm({
  activeTournamentId = null,
  onPlayerRegistered,
  onClose,
}) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(1200);
  const [fideId, setFideId] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!fullName.trim() || !email.trim()) {
      setErrorMsg("Full name and email are mandatory.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        full_name: fullName.trim(),
        email: email.trim(),
        rating: Number(rating) || 1200,
        fide_id: fideId.trim() || null,
        tournament_id: activeTournamentId || null,
      };

      const result = await playerService.registerPlayer(
        payload,
        activeTournamentId,
      );

      setSuccessMsg(`Player ${result.full_name} registered successfully!`);
      setFullName("");
      setEmail("");
      setRating(1200);
      setFideId("");

      if (onPlayerRegistered) {
        onPlayerRegistered(result);
      }
    } catch (err) {
      const detail =
        err.response?.data?.detail ||
        "Failed to register player. Please check inputs.";
      setErrorMsg(typeof detail === "string" ? detail : JSON.stringify(detail));
      // NOTE: We do NOT clear inputs on error so the user can correct them!
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-xl relative text-slate-100">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      <div className="flex items-center space-x-2 mb-4">
        <UserPlus className="w-5 h-5 text-indigo-400" />
        <h3 className="text-lg font-bold text-white">Register Player</h3>
      </div>

      {errorMsg && (
        <div
          role="alert"
          className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start space-x-2 text-red-400 text-sm"
        >
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-start space-x-2 text-emerald-400 text-sm">
          <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="full-name-input"
            className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1"
          >
            Full Name *
          </label>
          <input
            id="full-name-input"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. Magnus Carlsen"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div>
          <label
            htmlFor="email-input"
            className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1"
          >
            Email Address *
          </label>
          <input
            id="email-input"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. player@example.com"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="rating-input"
              className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1"
            >
              Initial Rating
            </label>
            <input
              id="rating-input"
              type="number"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              placeholder="1200"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              Defaults to 1200 if unrated
            </span>
          </div>

          <div>
            <label
              htmlFor="fide-id-input"
              className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1"
            >
              FIDE ID (Optional)
            </label>
            <input
              id="fide-id-input"
              type="text"
              value={fideId}
              onChange={(e) => setFideId(e.target.value)}
              placeholder="e.g. 1500015"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end space-x-3">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-semibold rounded-lg shadow transition-colors flex items-center space-x-2"
          >
            {loading ? "Registering..." : "Submit Registration"}
          </button>
        </div>
      </form>
    </div>
  );
}
