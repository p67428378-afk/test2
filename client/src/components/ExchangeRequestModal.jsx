import React, { useState } from "react";
import {
  X,
  Send,
  AlertCircle,
  CheckCircle2,
  GraduationCap,
  BookOpen,
  User,
} from "lucide-react";

export default function ExchangeRequestModal({
  isOpen,
  onClose,
  matchData,
  userTeachSkills = [],
  onSubmitRequest,
}) {
  if (!isOpen || !matchData) return null;

  const [offeredSkillId, setOfferedSkillId] = useState(
    matchData.learns_skill?.user_skill_id || userTeachSkills[0]?.id || "",
  );
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const requestedSkill = matchData.teaches_skill;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!offeredSkillId) {
      setError("Please select a skill from your profile to offer in exchange.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmitRequest({
        recipient_id: matchData.partner_id,
        offered_skill_id: offeredSkillId,
        requested_skill_id: requestedSkill.user_skill_id,
        message: message.trim() || undefined,
      });

      onClose();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Failed to send exchange request.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Request Skill Exchange
              </h3>
              <p className="text-xs text-slate-500">
                Send an exchange proposal to {matchData.partner_name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div
              className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2"
              role="alert"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Requested Skill Detail (What Partner Teaches) */}
          <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-100 space-y-1">
            <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1">
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              Requested Skill (What {matchData.partner_name} teaches):
            </span>
            <div className="text-sm font-bold text-slate-900 flex items-center justify-between">
              <span>{requestedSkill.skill_name}</span>
              <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-200 text-emerald-900 rounded">
                {requestedSkill.proficiency}
              </span>
            </div>
          </div>

          {/* Offered Skill Selector (What You Teach) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
              <BookOpen className="w-4 h-4 text-blue-600" />
              Select Offered Skill (What You Will Teach) *
            </label>
            {userTeachSkills.length === 0 ? (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                You haven't added any skills to your "Teach" list yet. Please
                update your profile first.
              </div>
            ) : (
              <select
                value={offeredSkillId}
                onChange={(e) => setOfferedSkillId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {userTeachSkills.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.skill_name} ({s.proficiency})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Optional Note / Message */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Introductory Message (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Hi! I'd love to learn from you and share my expertise in Python..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-700 hover:bg-slate-100 text-sm font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || userTeachSkills.length === 0}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? "Sending..." : "Send Request"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
