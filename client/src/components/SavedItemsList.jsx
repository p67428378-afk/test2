import React, { useState, useEffect, useCallback } from "react";
import {
  Bookmark,
  Trash2,
  ShoppingCart,
  Star,
  Tag,
  Loader2,
  AlertCircle,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { api } from "../services/api";
import PaginationBar from "./PaginationBar";

export default function SavedItemsList({
  userId = "user-123",
  onAddToCart,
  onItemsUpdated,
}) {
  const [savedItems, setSavedItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [limit] = useState(12);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const fetchSavedItems = useCallback(async () => {
    if (!userId.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.getSavedItems({
        user_id: userId.trim(),
        skip,
        limit,
      });
      setSavedItems(data.items || []);
      setTotal(data.total || 0);
      if (onItemsUpdated) {
        onItemsUpdated(data.total || 0);
      }
    } catch (err) {
      const detail =
        err.response?.data?.detail ||
        err.message ||
        "Failed to load saved recommendations.";
      setError(typeof detail === "string" ? detail : JSON.stringify(detail));
    } finally {
      setLoading(false);
    }
  }, [userId, skip, limit, onItemsUpdated]);

  useEffect(() => {
    fetchSavedItems();
  }, [fetchSavedItems]);

  const handleDelete = async (savedId, productName) => {
    setDeletingId(savedId);
    setError(null);
    try {
      await api.deleteSavedItem(savedId);
      setToastMessage(
        `Removed "${productName || "Item"}" from your saved recommendations.`,
      );
      setTimeout(() => setToastMessage(""), 4000);
      fetchSavedItems();
    } catch (err) {
      const detail =
        err.response?.data?.detail ||
        err.message ||
        "Failed to remove saved item.";
      setError(typeof detail === "string" ? detail : JSON.stringify(detail));
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Recently";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-2 text-emerald-800 text-xs font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-3 text-rose-800 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Error loading saved items</p>
            <p className="text-xs text-rose-700 mt-0.5">{error}</p>
            <button
              type="button"
              onClick={fetchSavedItems}
              className="mt-2 text-xs font-bold text-rose-700 underline hover:text-rose-900"
            >
              Retry Loading
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 space-y-3">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <p className="text-sm font-semibold text-slate-600">
            Fetching saved recommendations...
          </p>
        </div>
      ) : savedItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-slate-200 text-center p-6 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <Bookmark className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            No Saved Items Yet
          </h3>
          <p className="text-xs text-slate-500 max-w-sm">
            You have not bookmarked any product recommendations yet. Click the
            heart icon on any recommendation card to save it for later.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedItems.map((item) => {
              const product = item.product || {};
              const isDeleting = deletingId === item.id;
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header */}
                    <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-white text-indigo-700 shadow-sm border border-indigo-100">
                        {product.category || "General"}
                      </span>

                      <div className="flex items-center space-x-1.5 text-xs text-slate-500">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-[11px]">
                          {formatDate(item.created_at)}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-3">
                      <div>
                        <h3
                          className="font-bold text-base text-slate-900"
                          title={product.name}
                        >
                          {product.name || "Saved Product"}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                          {product.description ||
                            "Bookmarked from your personalized AI recommendations."}
                        </p>
                      </div>

                      {/* Tags */}
                      {product.tags && product.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {product.tags.map((tag) => (
                            <span
                              key={`${item.id}-tag-${tag}`}
                              className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200"
                            >
                              <Tag className="w-2.5 h-2.5 mr-1 text-slate-400" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Rating */}
                      <div className="flex items-center space-x-1 text-amber-500 text-xs font-bold pt-1">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>
                          {product.rating ? product.rating.toFixed(1) : "4.8"} /
                          5.0
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-5 pt-0">
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <span className="text-lg font-extrabold text-slate-900">
                        ${(product.price || 0).toFixed(2)}
                      </span>

                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          disabled={isDeleting}
                          onClick={() => handleDelete(item.id, product.name)}
                          className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-colors"
                          title="Remove from saved items"
                          aria-label="Remove saved item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onAddToCart && onAddToCart(product)}
                          className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 active:scale-95 transition-all"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <PaginationBar
            total={total}
            skip={skip}
            limit={limit}
            onPageChange={(newSkip) => setSkip(newSkip)}
          />
        </>
      )}
    </div>
  );
}
