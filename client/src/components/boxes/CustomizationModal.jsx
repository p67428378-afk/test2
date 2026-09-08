import React, { useState, useEffect } from "react";
import {
  X,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  getBoxCustomizations,
  submitBoxCustomization,
} from "../../services/api";

export default function CustomizationModal({
  boxId,
  boxTitle,
  isOpen,
  onClose,
  onCustomizationConfirmed,
}) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [curationTheme, setCurationTheme] = useState("");
  const [currentItems, setCurrentItems] = useState([]);
  const [availableReplacements, setAvailableReplacements] = useState([]);

  const [selectedOriginalId, setSelectedOriginalId] = useState("");
  const [selectedReplacementId, setSelectedReplacementId] = useState("");

  useEffect(() => {
    if (isOpen && boxId) {
      fetchCustomizationData();
    }
  }, [isOpen, boxId]);

  const fetchCustomizationData = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    setSelectedOriginalId("");
    setSelectedReplacementId("");
    try {
      const data = await getBoxCustomizations(boxId);
      setCurationTheme(data.curation_theme || "Current Curation");
      setCurrentItems(data.current_items || []);
      setAvailableReplacements(data.available_replacements || []);
    } catch (err) {
      console.error("Failed to load box customization options:", err);
      const detail =
        err.response?.data?.detail ||
        err.message ||
        "Failed to load item swap options.";
      setError(typeof detail === "string" ? detail : JSON.stringify(detail));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Filter replacements eligible for the selected original item
  const eligibleReplacements = availableReplacements.filter((rep) => {
    if (!selectedOriginalId) return true;
    if (rep.for_item_id && rep.for_item_id !== selectedOriginalId) return false;
    return true;
  });

  const selectedOriginalItem = currentItems.find(
    (item) => (item.id || item.name) === selectedOriginalId,
  );
  const selectedReplacementItem = availableReplacements.find(
    (rep) => (rep.id || rep.name) === selectedReplacementId,
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOriginalId || !selectedReplacementId) {
      setError(
        "Please select both an item to swap out and an eligible replacement.",
      );
      return;
    }

    if (selectedReplacementItem && selectedReplacementItem.in_stock === false) {
      setError(
        `Selected replacement "${selectedReplacementItem.name}" is currently out of stock.`,
      );
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const resp = await submitBoxCustomization(boxId, {
        original_item_id: selectedOriginalId,
        replacement_item_id: selectedReplacementId,
      });
      setSuccess(resp);
      if (onCustomizationConfirmed) {
        onCustomizationConfirmed(resp);
      }
    } catch (err) {
      console.error("Error submitting customization:", err);
      const detail =
        err.response?.data?.detail ||
        err.message ||
        "Failed to save curation customization.";
      setError(typeof detail === "string" ? detail : JSON.stringify(detail));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-slate-100 my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-full transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
          <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-700">
            <RefreshCw className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-slate-900">
              Customize Your Curation (1 Swap Allowed)
            </h2>
            <p className="text-xs text-slate-500">
              Personalize {boxTitle ? `"${boxTitle}"` : "your box"} for the{" "}
              {curationTheme || "upcoming"} theme
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-emerald-700 animate-spin mb-3" />
            <p className="text-xs font-semibold text-slate-500">
              Loading available item swap options...
            </p>
          </div>
        ) : success ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-xl font-bold text-emerald-900">
              Customization Saved!
            </h3>
            <p className="text-emerald-800 text-sm">
              Your box curation has been updated. You swapped{" "}
              <span className="font-semibold text-slate-900">
                {selectedOriginalItem?.name || selectedOriginalId}
              </span>{" "}
              for{" "}
              <span className="font-semibold text-slate-900">
                {selectedReplacementItem?.name || selectedReplacementId}
              </span>
              .
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl text-xs transition-colors shadow-sm"
              >
                Continue to Checkout
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-emerald-50/80 border border-emerald-200 p-3.5 rounded-xl text-emerald-900 text-xs font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>
                Swap 1 item in your{" "}
                {curationTheme ? `"${curationTheme}"` : "monthly"} curation
                before checkout.
              </span>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded-xl flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Step 1: Choose Original Item */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                1. Select Item in Current Curation to Swap Out:
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {currentItems.length === 0 ? (
                  <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-xl">
                    No items found in curation.
                  </p>
                ) : (
                  currentItems.map((item, idx) => {
                    const itemId = item.id || item.name || `item-${idx}`;
                    const isSelected = selectedOriginalId === itemId;
                    return (
                      <div
                        key={itemId}
                        onClick={() => setSelectedOriginalId(itemId)}
                        className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          isSelected
                            ? "bg-emerald-50/60 border-emerald-500 ring-1 ring-emerald-500 shadow-2xs"
                            : "bg-slate-50/70 border-slate-200 hover:bg-slate-100/70"
                        }`}
                      >
                        <div>
                          <p className="font-semibold text-slate-900 text-sm">
                            {item.name || item.title || `Item ${idx + 1}`}
                            {item.value ? ` (${item.value} value)` : ""}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {item.description || "Currently in box"}
                          </p>
                        </div>
                        <button
                          type="button"
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                            isSelected
                              ? "bg-emerald-700 text-white"
                              : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          {isSelected ? "Swapping" : "Swap This"}
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Step 2: Choose Replacement Item */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                2. Select Eligible Replacement:
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {eligibleReplacements.length === 0 ? (
                  <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-xl">
                    No eligible replacement items available for selection.
                  </p>
                ) : (
                  eligibleReplacements.map((rep, idx) => {
                    const repId = rep.id || rep.name || `rep-${idx}`;
                    const isSelected = selectedReplacementId === repId;
                    const inStock = rep.in_stock !== false;
                    return (
                      <div
                        key={repId}
                        onClick={() => {
                          if (inStock) setSelectedReplacementId(repId);
                        }}
                        className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                          !inStock
                            ? "opacity-60 bg-slate-100 border-slate-200 cursor-not-allowed"
                            : isSelected
                              ? "bg-emerald-50/60 border-emerald-500 ring-1 ring-emerald-500 shadow-2xs cursor-pointer"
                              : "bg-white border-slate-200 hover:border-emerald-300 hover:bg-slate-50 cursor-pointer"
                        }`}
                      >
                        <div>
                          <p className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                            <span>{rep.name || `Replacement ${idx + 1}`}</span>
                            {rep.value && (
                              <span className="text-xs text-slate-500 font-normal">
                                ({rep.value} value)
                              </span>
                            )}
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                inStock
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {inStock ? "In Stock" : "Out of Stock"}
                            </span>
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {rep.description || "Eligible substitution"}
                          </p>
                        </div>
                        <button
                          type="button"
                          disabled={!inStock}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                            !inStock
                              ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                              : isSelected
                                ? "bg-emerald-700 text-white"
                                : "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
                          }`}
                        >
                          {isSelected ? "Selected" : "Select"}
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Modal Footer / Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
              <div className="text-xs font-medium text-slate-600">
                {selectedOriginalId && selectedReplacementId ? (
                  <span className="flex items-center gap-1.5 text-emerald-800">
                    <span>
                      Swapping{" "}
                      {selectedOriginalItem?.name || selectedOriginalId} →{" "}
                      {selectedReplacementItem?.name || selectedReplacementId}
                    </span>
                    <span className="ml-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px]">
                      1/1 Swap Used
                    </span>
                  </span>
                ) : (
                  <span className="text-slate-400">
                    Select 1 item to swap out and 1 replacement.
                  </span>
                )}
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    submitting || !selectedOriginalId || !selectedReplacementId
                  }
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-sm transition-all disabled:opacity-50 flex items-center gap-1.5"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Customization & Continue</span>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
