import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CreditCard,
  Plus,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import {
  getSavedCards,
  deleteSavedCard,
  isAuthenticated,
} from "../services/api.js";
import SavedCardCard from "../components/payment/SavedCardCard.jsx";
import DeleteConfirmationModal from "../components/payment/DeleteConfirmationModal.jsx";

export default function SavedPaymentMethodsPage() {
  const [isLoggedIn] = useState(isAuthenticated());
  const [savedCards, setSavedCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cardToDelete, setCardToDelete] = useState(null);

  useEffect(() => {
    if (isLoggedIn) {
      fetchSavedCards();
    } else {
      setIsLoading(false);
    }
  }, [isLoggedIn]);

  const fetchSavedCards = async () => {
    setIsLoading(true);
    setError("");
    try {
      const cards = await getSavedCards();
      setSavedCards(cards);
    } catch {
      setError("Failed to load saved payment methods. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (card) => {
    setCardToDelete(card);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async (cardId) => {
    setIsModalOpen(false);
    setError("");
    setSuccessMessage("");
    try {
      const result = await deleteSavedCard(cardId);
      if (result.success) {
        setSuccessMessage("Card deleted successfully.");
        // Refresh list
        await fetchSavedCards();
      } else {
        setError(result.message || "Failed to delete card.");
      }
    } catch {
      setError("Failed to delete card. Please try again.");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex-grow w-full max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop py-2xl flex flex-col items-center justify-center gap-4 text-center">
        <AlertCircle className="text-amber-500 w-16 h-12" />
        <h2 className="text-2xl font-bold text-slate-100">Access Denied</h2>
        <p className="text-slate-400 max-w-md">
          You must be logged in to view and manage your saved payment methods.
          Please go back to the checkout page to log in.
        </p>
        <Link
          to="/"
          className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Back to Checkout
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-grow w-full max-w-5xl mx-auto px-margin-mobile md:px-margin-desktop py-2xl flex flex-col gap-lg">
      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="text-slate-400 hover:text-slate-200 transition-colors p-2 hover:bg-slate-800 rounded-lg"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-100">
            Saved Payment Methods
          </h1>
          <p className="text-sm text-slate-400">
            Manage your securely saved credit and debit cards
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4 flex items-center gap-3 text-red-400 text-sm">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-4 flex items-center gap-3 text-green-400 text-sm">
          <CheckCircle size={20} />
          <span>{successMessage}</span>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
          <p className="text-slate-400 text-sm">Loading saved cards...</p>
        </div>
      ) : (
        <>
          {savedCards.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-slate-700 rounded-xl bg-slate-800/30 text-center gap-4">
              <CreditCard className="text-slate-500 w-16 h-16" />
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-semibold text-slate-200">
                  No Saved Cards
                </h3>
                <p className="text-sm text-slate-400 max-w-sm">
                  You haven't saved any payment methods yet. You can save a card
                  during your next checkout.
                </p>
              </div>
              <Link
                to="/"
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2"
              >
                <Plus size={16} /> Go to Checkout
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedCards.map((card) => (
                <SavedCardCard
                  key={card.id}
                  card={card}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          )}
        </>
      )}

      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        card={cardToDelete}
      />
    </div>
  );
}
