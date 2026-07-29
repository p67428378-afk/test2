import React, { useEffect, useState } from "react";
import { Search, Filter, AlertCircle } from "lucide-react";
import { itemService, claimService, authService } from "../services/api";
import ItemCard from "../components/items/ItemCard.jsx";
import Modal from "../components/common/Modal.jsx";
import Button from "../components/common/Button.jsx";

export default function BrowseFoundPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [selectedItemForClaim, setSelectedItemForClaim] = useState(null);
  const [claimDescription, setClaimDescription] = useState("");
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimError, setClaimError] = useState(null);
  const [claimSuccess, setClaimSuccess] = useState(false);

  const user = authService.getCurrentUser();

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;
      const data = await itemService.getFoundItems(params);
      setItems(data.items || []);
    } catch (err) {
      setError("Failed to load found items. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [search, category]);

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    if (!selectedItemForClaim) return;

    setClaimLoading(true);
    setClaimError(null);
    setClaimSuccess(false);

    try {
      await claimService.createClaim({
        item_id: selectedItemForClaim.id,
        claimant_description: claimDescription,
      });
      setClaimSuccess(true);
      setClaimDescription("");
      setTimeout(() => {
        setSelectedItemForClaim(null);
        setClaimSuccess(false);
        fetchItems();
      }, 2000);
    } catch (err) {
      setClaimError(
        err.response?.data?.detail ||
          "Failed to submit claim. Please try again.",
      );
    } finally {
      setClaimLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h2 className="text-3xl font-bold text-white">Browse Found Items</h2>
        <p className="text-sm text-slate-400 mt-1">
          Browse and search all reported found items to claim yours.
        </p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items..."
            className="w-full bg-[#0F172A] border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] outline-none"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Filter by category..."
            className="w-full bg-[#0F172A] border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] outline-none"
          />
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Items Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-[40vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6366F1]"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center text-slate-400">
          <p className="text-lg font-semibold">No found items found.</p>
          <p className="text-sm text-slate-500 mt-1">
            Try adjusting your search or filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              currentUserId={user?.id}
              onClaim={(item) => setSelectedItemForClaim(item)}
            />
          ))}
        </div>
      )}

      {/* Claim Modal */}
      <Modal
        isOpen={!!selectedItemForClaim}
        onClose={() => setSelectedItemForClaim(null)}
        title={`Claim: ${selectedItemForClaim?.name}`}
      >
        {claimSuccess ? (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm text-center">
            Claim submitted successfully! Pending admin verification.
          </div>
        ) : (
          <form onSubmit={handleClaimSubmit} className="space-y-4">
            {claimError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {claimError}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Proof of Ownership *
              </label>
              <textarea
                required
                value={claimDescription}
                onChange={(e) => setClaimDescription(e.target.value)}
                placeholder="Please describe unique features, serial numbers, or purchase details to verify ownership."
                rows="4"
                className="w-full bg-[#0F172A] border border-slate-800 rounded-lg px-4 py-2 text-white focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] outline-none resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <Button
                onClick={() => setSelectedItemForClaim(null)}
                variant="secondary"
                disabled={claimLoading}
              >
                Cancel
              </Button>
              <Button type="submit" variant="success" disabled={claimLoading}>
                {claimLoading ? "Submitting..." : "Submit Claim"}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
