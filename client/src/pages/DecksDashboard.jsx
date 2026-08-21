import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, BookOpen, Award, Layers, AlertCircle, X } from "lucide-react";
import {
  getDecks,
  createDeck,
  updateDeck,
  deleteDeck,
  getCards,
  startQuiz,
} from "../services/api";
import StatCard from "../components/StatCard";
import DeckCard from "../components/DeckCard";

export default function DecksDashboard() {
  const navigate = useNavigate();
  const [decks, setDecks] = useState([]);
  const [cardCounts, setCardCountMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create' or 'edit'
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [deckTitle, setDeckTitle] = useState("");
  const [deckDescription, setDeckDescription] = useState("");
  const [modalError, setModalError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedDecks = await getDecks();
      setDecks(fetchedDecks);

      // Fetch card counts for each deck
      const counts = {};
      await Promise.all(
        fetchedDecks.map(async (deck) => {
          try {
            const cards = await getCards(deck.id);
            counts[deck.id] = cards.length;
          } catch (err) {
            counts[deck.id] = 0;
          }
        }),
      );
      setCardCountMap(counts);
    } catch (err) {
      setError("Failed to load study decks. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleOpenCreateModal = () => {
    setModalMode("create");
    setSelectedDeck(null);
    setDeckTitle("");
    setDeckDescription("");
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (deck) => {
    setModalMode("edit");
    setSelectedDeck(deck);
    setDeckTitle(deck.title);
    setDeckDescription(deck.description || "");
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setDeckTitle("");
    setDeckDescription("");
    setSelectedDeck(null);
    setModalError(null);
  };

  const handleSaveDeck = async (e) => {
    e.preventDefault();
    if (!deckTitle.trim()) {
      setModalError("Deck title is required.");
      return;
    }

    try {
      setModalError(null);
      if (modalMode === "create") {
        await createDeck({ title: deckTitle, description: deckDescription });
      } else {
        await updateDeck(selectedDeck.id, {
          title: deckTitle,
          description: deckDescription,
        });
      }
      handleCloseModal();
      fetchDashboardData();
    } catch (err) {
      setModalError(
        err.response?.data?.detail ||
          "An error occurred while saving the deck.",
      );
    }
  };

  const handleDeleteDeck = async (deckId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this deck? All cards inside will be permanently deleted.",
      )
    ) {
      try {
        setError(null);
        await deleteDeck(deckId);
        fetchDashboardData();
      } catch (err) {
        setError("Failed to delete the deck. Please try again.");
      }
    }
  };

  const handleStartQuiz = async (deckId) => {
    try {
      setError(null);
      const quizSession = await startQuiz(deckId);
      navigate(`/quizzes/${quizSession.quiz_id}`, { state: { quizSession } });
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to start quiz session.");
    }
  };

  // Calculate stats
  const totalDecks = decks.length;
  const totalCards = Object.values(cardCounts).reduce(
    (sum, count) => sum + count,
    0,
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-text_primary tracking-tight">
            Study Decks
          </h1>
          <p className="text-text_secondary mt-1">
            Create decks, manage flashcards, and test your knowledge.
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-sm shrink-0"
        >
          <Plus className="size-5" />
          <span>Create New Deck</span>
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-error px-4 py-3 rounded-xl flex items-center gap-3 mb-8">
          <AlertCircle className="size-5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <StatCard
          title="Total Decks"
          value={totalDecks}
          icon={Layers}
          colorClass="text-primary bg-blue-50"
        />
        <StatCard
          title="Total Flashcards"
          value={totalCards}
          icon={BookOpen}
          colorClass="text-success bg-green-50"
        />
      </div>

      {/* Decks Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      ) : decks.length === 0 ? (
        <div className="bg-white border border-[#e3e8f0] rounded-2xl p-12 text-center max-w-xl mx-auto shadow-sm">
          <Layers className="size-12 text-text_secondary mx-auto mb-4" />
          <h3 className="text-lg font-bold text-text_primary mb-2">
            No Study Decks Yet
          </h3>
          <p className="text-text_secondary text-sm mb-6">
            Get started by creating your first study deck. You can then add
            flashcards and test your knowledge.
          </p>
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-sm"
          >
            <Plus className="size-5" />
            <span>Create Your First Deck</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.map((deck) => (
            <DeckCard
              key={deck.id}
              deck={deck}
              cardCount={cardCounts[deck.id] || 0}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteDeck}
              onStartQuiz={handleStartQuiz}
            />
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 p-1.5 text-text_secondary hover:text-text_primary hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="size-5" />
            </button>

            <h2 className="text-xl font-bold text-text_primary mb-4">
              {modalMode === "create"
                ? "Create New Study Deck"
                : "Edit Study Deck"}
            </h2>

            {modalError && (
              <div className="bg-red-50 border border-red-200 text-error px-4 py-2.5 rounded-xl flex items-center gap-2.5 mb-4">
                <AlertCircle className="size-4.5 shrink-0" />
                <p className="text-xs font-medium">{modalError}</p>
              </div>
            )}

            <form onSubmit={handleSaveDeck} className="space-y-4">
              <div>
                <label
                  htmlFor="deck-title"
                  className="block text-xs font-semibold text-text_primary uppercase tracking-wider mb-1.5"
                >
                  Deck Title *
                </label>
                <input
                  id="deck-title"
                  type="text"
                  value={deckTitle}
                  onChange={(e) => setDeckTitle(e.target.value)}
                  placeholder="e.g. JavaScript Basics"
                  className="w-full px-4 py-2.5 border border-[#e3e8f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="deck-desc"
                  className="block text-xs font-semibold text-text_primary uppercase tracking-wider mb-1.5"
                >
                  Description
                </label>
                <textarea
                  id="deck-desc"
                  value={deckDescription}
                  onChange={(e) => setDeckDescription(e.target.value)}
                  placeholder="e.g. Core concepts of JS including closures, scopes, and async programming."
                  rows="3"
                  className="w-full px-4 py-2.5 border border-[#e3e8f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-semibold text-text_secondary hover:text-text_primary hover:bg-gray-50 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-sm"
                >
                  {modalMode === "create" ? "Create Deck" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
