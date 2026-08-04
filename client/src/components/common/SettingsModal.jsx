import React, { useState } from "react";
import { X, Save, Sliders, CheckCircle } from "lucide-react";

export default function SettingsModal({ isOpen, onClose }) {
  const [minPbShare, setMinPbShare] = useState(25.0);
  const [minInstockSafety, setMinInstockSafety] = useState(95.0);
  const [autoApprove, setAutoApprove] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-6 relative">
        <div className="flex items-center justify-between border-b border-slate-700 pb-4">
          <div className="flex items-center gap-2 text-amber-400">
            <Sliders className="h-5 w-5" />
            <h3 className="font-bold text-lg text-slate-100">
              Assortment Guardrail Settings
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {savedSuccess && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-sm flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>Guardrail settings saved successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
              Minimum Private Brand Share Target (%)
            </label>
            <input
              type="number"
              step="0.5"
              value={minPbShare}
              onChange={(e) => setMinPbShare(parseFloat(e.target.value))}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
              In-Stock Safety Threshold (%)
            </label>
            <input
              type="number"
              step="0.5"
              value={minInstockSafety}
              onChange={(e) => setMinInstockSafety(parseFloat(e.target.value))}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              id="autoApprove"
              type="checkbox"
              checked={autoApprove}
              onChange={(e) => setAutoApprove(e.target.checked)}
              className="h-4 w-4 accent-amber-500 rounded bg-slate-900 border-slate-700"
            />
            <label htmlFor="autoApprove" className="text-sm text-slate-300">
              Enable Auto-Approval for Balanced Scenario if all guardrails pass
            </label>
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-4 bg-amber-500 hover:bg-amber-400 text-slate-900 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
