import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
  BookOpen,
  Play,
  X,
} from "lucide-react";
import {
  getDeck,
  getCards,
  createCard,
  updateCard,
  deleteCard,
  startQuiz,
} from "../services/api";

export default function DeckDetail() {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create' or 'edit'
  const [selectedCard, setSelectedCard] = useState(null);
  const [cardFront, setCardFront] = useState("");
  const [cardBack, setCardBack] = useState("");
  const [modalError, setModalError] = useState(null);

  const fetchDeckAndCards = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedDeck = await getDeck(deckId);
      setDeck(fetchedDeck);
      const fetchedCards = await getCards(deckId);
      setCards(fetchedCards);
    } catch (err) {
      setError("Failed to load deck details or flashcards.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeckAndCards();
  }, [deckId]);

  const handleOpenCreateModal = () => {
    setModalMode("create");
    setSelectedCard(null);
    setCardFront("");
    setCardBack("");
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (card) => {
    setModalMode("edit");
    setSelectedCard(card);
    setCardFront(card.front);
    setCardBack(card.back);
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCardFront("");
    setCardBack("");
    setSelectedCard(null);
    setModalError(null);
  };

  const handleSaveCard = async (e) => {
    e.preventDefault();
    if (!cardFront.trim() || !cardBack.trim()) {
      setModalError("Both front and back content are required.");
      return;
    }

    try {
      setModalError(null);
      if (modalMode === "create") {
        await createCard(deckId, { front: cardFront, back: cardBack });
      } else {
        await updateCard(selectedCard.id, { front: cardFront, back: cardBack });
      }
      handleCloseModal();
      fetchDeckAndCards();
    } catch (err) {
      setModalError(
        err.response?.data?.detail ||
          "An error occurred while saving the card.",
      );
    }
  };

  const handleDeleteCard = async (cardId) => {
    if (window.confirm("Are you sure you want to delete this flashcard?")) {
      try {
        setError(null);
        await deleteCard(cardId);
        fetchDeckAndCards();
      } catch (err) {
        setError("Failed to delete the card. Please try again.");
      }
    }
  };

  const handleStartQuiz = async () => {
    try {
      setError(null);
      const quizSession = await startQuiz(deckId);
      navigate(`/quizzes/${quizSession.quiz_id}`, { state: { quizSession } });
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to start quiz session.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error && !deck) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-8 text-center">
        <AlertCircle className="size-12 text-error mx-auto mb-4" />
        <h3 className="text-lg font-bold text-text_primary mb-2">
          Error Loading Deck
        </h3>
        <p className="text-text_secondary mb-6">{error}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
        >
          <ArrowLeft className="size-4" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Back Link */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-text_secondary hover:text-primary font-medium text-sm mb-6 transition-colors"
      >
        <ArrowLeft className="size-4" />
        <span>Back to Decks</span>
      </Link>

      {/* Deck Header */}
      <div className="bg-white border border-[#e3e8f0] rounded-2xl p-6 md:p-8 shadow-sm mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-text_primary tracking-tight">
            {deck.title}
          </h1>
          <p className="text-text_secondary mt-2 text-sm md:text-base">
            {deck.description || "No description provided."}
          </p>
          <div className="flex items-center gap-2 mt-4 text-xs font-semibold text-primary bg-blue-50 px-3 py-1.5 rounded-full w-fit">
            <BookOpen className="size-4" />
            <span>
              {cards.length} {cards.length === 1 ? "card" : "cards"} total
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-[#e3e8f0] hover:bg-gray-50 text-text_primary font-semibold rounded-xl transition-all shadow-sm text-sm"
          >
            <Plus className="size-4" />
            <span>Add Card</span>
          </button>
          {cards.length > 0 ? (
            <button
              onClick={handleStartQuiz}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-sm text-sm"
            >
              <Play className="size-4 fill-current" />
              <span>Start Quiz</span>
            </button>
          ) : (
            <button
              disabled
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-400 font-semibold rounded-xl cursor-not-allowed text-sm"
              title="Add cards first to start quiz"
            >
              <Play className="size-4" />
              <span>Start Quiz</span>
            </button>
          )}
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-error px-4 py-3 rounded-xl flex items-center gap-3 mb-8">
          <AlertCircle className="size-5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Cards List */}
      <h2 className="text-xl font-bold text-text_primary mb-4">Flashcards</h2>
      {cards.length === 0 ? (
        <div className="bg-white border border-[#e3e8f0] rounded-2xl p-12 text-center max-w-xl mx-auto shadow-sm">
          <BookOpen className="size-12 text-text_secondary mx-auto mb-4" />
          <h3 className="text-lg font-bold text-text_primary mb-2">
            No Flashcards Yet
          </h3>
          <p className="text-text_secondary text-sm mb-6">
            This deck is currently empty. Add flashcards with questions and
            answers to start studying.
          </p>
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-sm"
          >
            <Plus className="size-5" />
            <span>Add Your First Card</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card, index) => (
            <div
              key={card.id}
              className="bg-white border border-[#e3e8f0] rounded-xl p-6 shadow-sm flex flex-col justify-between h-full"
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold text-text_secondary uppercase tracking-wider">
                    Card #{index + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(card)}
                      className="p-1.5 text-text_secondary hover:text-primary hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Card"
                    >
                      <Edit2 className="size-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCard(card.id)}
                      className="p-1.5 text-text_secondary hover:text-error hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Card"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider block mb-1">
                      Front (Question)
                    </span>
                    <p className="text-text_primary text-sm font-medium leading-relaxed line-clamp-3">
                      {card.front}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-gray-50">
                    <span className="text-[10px] font-bold text-success uppercase tracking-wider block mb-1">
                      Back (Answer)
                    </span>
                    <p className="text-text_secondary text-sm leading-relaxed line-clamp-3">
                      {card.back}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Card Modal */}
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
              {modalMode === "create" ? "Add New Flashcard" : "Edit Flashcard"}
            </h2>

            {modalError && (
              <div className="bg-red-50 border border-red-200 text-error px-4 py-2.5 rounded-xl flex items-center gap-2.5 mb-4">
                <AlertCircle className="size-4.5 shrink-0" />
                <p className="text-xs font-medium">{modalError}</p>
              </div>
            )}

            <form onSubmit={handleSaveCard} className="space-y-4">
              <div>
                <label
                  htmlFor="card-front"
                  className="block text-xs font-semibold text-text_primary uppercase tracking-wider mb-1.5"
                >
                  Front Side (Question / Prompt) *
                </label>
                <textarea
                  id="card-front"
                  value={cardFront}
                  onChange={(e) => setCardFront(e.target.value)}
                  placeholder="e.g. What is a closure in JavaScript?"
                  rows="3"
                  className="w-full px-4 py-2.5 border border-[#e3e8f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all resize-none"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="card-back"
                  className="block text-xs font-semibold text-text_primary uppercase tracking-wider mb-1.5"
                >
                  Back Side (Answer / Explanation) *
                </label>
                <textarea
                  id="card-back"
                  value={cardBack}
                  onChange={(e) => setCardBack(e.target.value)}
                  placeholder="e.g. A closure is the combination of a function bundled together with references to its surrounding state."
                  rows="4"
                  className="w-full px-4 py-2.5 border border-[#e3e8f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all resize-none"
                  required
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
                  {modalMode === "create" ? "Add Card" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
