import React, { useState } from "react";
import {
  CheckCircle2,
  AlertOctagon,
  Link2,
  FileText,
  Save,
} from "lucide-react";

export default function PhotoshootCompletionModal({
  session,
  onSaveCompletion,
  isSubmitting = false,
}) {
  const [galleryUrl, setGalleryUrl] = useState(
    session?.photoshoot_record?.gallery_url ||
      "https://gallery.aurastudio.com/proofs/104-wedding",
  );
  const [notes, setNotes] = useState(
    session?.photoshoot_record?.notes ||
      "Outdoor garden shoot finished successfully at sunset. 120 raw proofs uploaded.",
  );
  const [isCompleted, setIsCompleted] = useState(true);

  const sessionId = session?.id || "Session #104";
  const remainingBalance = session?.remaining_balance ?? 875.0;
  const isUnpaid = remainingBalance > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveCompletion({
      gallery_url: galleryUrl,
      notes,
      is_completed: isCompleted,
    });
  };

  return (
    <div className="bg-white border border-stone-200 p-6 rounded-2xl shadow-lg">
      <div className="flex items-center justify-between mb-4 border-b border-stone-100 pb-3">
        <h3 className="text-lg font-serif font-bold text-stone-900 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          Mark Photoshoot Completed —{" "}
          <span className="text-[#775A19]">{sessionId}</span>
        </h3>
        {session?.status && (
          <span className="px-2.5 py-1 bg-stone-100 text-stone-700 text-xs font-bold rounded-full uppercase">
            {session.status}
          </span>
        )}
      </div>

      {/* Unpaid Balance Notice */}
      {isUnpaid && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-900 rounded-xl mb-5 text-xs flex items-start gap-2.5">
          <AlertOctagon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-red-950">
              ⚠️ Administrative Notice: Unpaid Balance Exists
            </p>
            <p className="mt-0.5 text-red-800">
              {sessionId} has a <strong>${remainingBalance.toFixed(2)}</strong>{" "}
              unpaid remaining balance. Completion record will be stored, but
              proof gallery download remains locked until full payment is
              logged.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-stone-700 mb-1 flex items-center gap-1">
            <Link2 className="w-3.5 h-3.5 text-[#C5A059]" />
            Proof Gallery URL
          </label>
          <input
            type="url"
            value={galleryUrl}
            onChange={(e) => setGalleryUrl(e.target.value)}
            required
            className="w-full border border-stone-300 p-2.5 rounded-lg font-mono text-xs bg-white focus:ring-2 focus:ring-[#C5A059] focus:outline-none"
            placeholder="https://gallery.aurastudio.com/proofs/..."
          />
        </div>

        <div>
          <label className="block font-semibold text-stone-700 mb-1 flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-[#C5A059]" />
            Photographer Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full border border-stone-300 p-2.5 rounded-lg text-xs bg-white focus:ring-2 focus:ring-[#C5A059] focus:outline-none"
            placeholder="Notes on shoot completion, lighting, photo counts..."
          />
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="markCompleted"
            checked={isCompleted}
            onChange={(e) => setIsCompleted(e.target.checked)}
            className="rounded text-[#C5A059] focus:ring-[#C5A059] h-4 w-4"
          />
          <label
            htmlFor="markCompleted"
            className="font-bold text-stone-800 cursor-pointer"
          >
            Confirm session status as Completed
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#775A19] hover:bg-[#5f4613] text-white font-bold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm mt-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isSubmitting ? "Saving Record..." : "Save Completion Record"}
        </button>
      </form>
    </div>
  );
}
