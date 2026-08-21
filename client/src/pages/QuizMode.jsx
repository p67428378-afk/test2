import React, { useState, useEffect, useRef } from "react";
import { useLocation, useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Check, X, AlertCircle, HelpCircle } from "lucide-react";
import { getCards, submitQuiz } from "../services/api";
import ProgressBar from "../components/ProgressBar";
import Flashcard from "../components/Flashcard";

export default function QuizMode() {
  const location = useLocation();
  const navigate = useNavigate();
  const { quizId } = useParams();
  const [quizSession, setQuizSession] = useState(
    location.state?.quizSession || null,
  );
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Timer state
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!quizSession) {
      setError(
        "No active quiz session found. Please start a quiz from the dashboard.",
      );
      setLoading(false);
      return;
    }

    const loadQuizCards = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch full cards (with back content) for the deck
        const fullCards = await getCards(quizSession.deck_id);

        // Map the quiz session cards to include back content
        const mappedCards = quizSession.cards.map((sessionCard) => {
          const match = fullCards.find((c) => c.id === sessionCard.id);
          return {
            id: sessionCard.id,
            front: sessionCard.front,
            back: match ? match.back : "No answer content found.",
          };
        });

        setCards(mappedCards);

        // Start timer
        timerRef.current = setInterval(() => {
          setSecondsElapsed((prev) => prev + 1);
        }, 1000);
      } catch (err) {
        setError("Failed to load quiz cards. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadQuizCards();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [quizSession]);

  const handleAnswer = async (isCorrect) => {
    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore);

    if (currentIndex + 1 < cards.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // End of quiz - stop timer and submit results
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      try {
        setLoading(true);
        const result = await submitQuiz(quizId, newScore, cards.length);
        navigate(`/quizzes/${quizId}/results`, {
          state: {
            result,
            score: newScore,
            totalCards: cards.length,
            timeTaken: secondsElapsed,
          },
        });
      } catch (err) {
        setError("Failed to submit quiz results. Please try again.");
        setLoading(false);
      }
    }
  };

  const handleExitEarly = () => {
    if (
      window.confirm(
        "Are you sure you want to exit the quiz? Your progress will not be saved.",
      )
    ) {
      navigate("/");
    }
  };

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s`;
  };

  if (loading && cards.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto px-6 py-12 text-center bg-white border border-[#e3e8f0] rounded-2xl shadow-sm mt-8">
        <AlertCircle className="size-12 text-error mx-auto mb-4" />
        <h3 className="text-lg font-bold text-text_primary mb-2">Quiz Error</h3>
        <p className="text-text_secondary mb-6">{error}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-sm"
        >
          <ArrowLeft className="size-4" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  const currentCard = cards[currentIndex];

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 flex flex-col items-center">
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
        <button
          onClick={handleExitEarly}
          className="inline-flex items-center gap-2 text-text_secondary hover:text-primary font-medium text-sm transition-colors"
        >
          <ArrowLeft className="size-4" />
          <span>Exit Quiz</span>
        </button>
        <div className="text-sm font-semibold text-text_secondary bg-gray-100 px-3 py-1.5 rounded-lg">
          Time: {formatTime(secondsElapsed)}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full flex justify-center mb-8">
        <ProgressBar current={currentIndex + 1} total={cards.length} />
      </div>

      {/* Flashcard */}
      {currentCard && (
        <div className="w-full flex justify-center mb-10">
          <Flashcard front={currentCard.front} back={currentCard.back} />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-4 w-full max-w-md">
        <button
          onClick={() => handleAnswer(false)}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-red-50 hover:bg-red-100 border border-red-200 text-error font-bold rounded-2xl transition-all shadow-sm"
        >
          <X className="size-5" />
          <span>Incorrect</span>
        </button>
        <button
          onClick={() => handleAnswer(true)}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-green-50 hover:bg-green-100 border border-green-200 text-success font-bold rounded-2xl transition-all shadow-sm"
        >
          <Check className="size-5" />
          <span>Correct</span>
        </button>
      </div>
    </div>
  );
}
