import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/common/Header";
import CurationDetailHero from "../components/boxes/CurationDetailHero";
import CurationItemBreakdown from "../components/boxes/CurationItemBreakdown";
import ReviewListAndSummary from "../components/reviews/ReviewListAndSummary";
import WriteReviewModal from "../components/reviews/WriteReviewModal";
import { getBoxDetail, getBoxReviews } from "../services/api";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";

export default function BoxDetailPage() {
  const { id } = useParams();
  const [box, setBox] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const boxData = await getBoxDetail(id);
      setBox(boxData);

      const reviewData = await getBoxReviews(id);
      setReviews(reviewData.reviews || []);
    } catch (err) {
      console.error("Failed to fetch box detail:", err);
      setError(
        "Failed to load subscription box curation details. The box may not exist or the server is unavailable.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fcf9f8] flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
          <p className="text-slate-600 text-sm font-medium">
            Loading Curation Details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !box) {
    return (
      <div className="min-h-screen bg-[#fcf9f8] flex flex-col">
        <Header />
        <div className="flex-1 max-w-xl mx-auto my-12 p-8 bg-white rounded-3xl border border-red-100 shadow-sm text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h2 className="font-serif text-2xl font-bold text-slate-900 mb-2">
            Box Not Found
          </h2>
          <p className="text-slate-600 text-sm mb-6">
            {error || "The requested subscription box could not be found."}
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-slate-800 text-white font-semibold text-sm rounded-full transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Catalog</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcf9f8] flex flex-col">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* Back Link */}
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-primary transition-colors bg-white px-4 py-2 rounded-full border border-slate-200 shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Curation Catalog</span>
          </Link>
        </div>

        {/* Hero Details */}
        <CurationDetailHero
          box={box}
          onOpenReviewModal={() => setIsReviewModalOpen(true)}
        />

        {/* Curation Breakdown */}
        <CurationItemBreakdown curations={box.curations || []} />

        {/* Subscriber Reviews */}
        <ReviewListAndSummary
          reviews={reviews.length > 0 ? reviews : box.reviews || []}
          averageRating={box.average_rating || 0}
          totalReviews={box.total_reviews || reviews.length}
          onOpenReviewModal={() => setIsReviewModalOpen(true)}
        />
      </main>

      {/* Review Modal */}
      <WriteReviewModal
        boxId={box.id}
        boxTitle={box.title}
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onReviewSubmitted={fetchData}
      />

      <footer className="bg-primary text-slate-400 py-8 text-center text-xs mt-12 border-t border-slate-800">
        <p className="font-serif font-bold text-slate-200 text-base mb-1">
          CrateCurate
        </p>
        <p>© 2026 CrateCurate Subscription Box Finder.</p>
      </footer>
    </div>
  );
}
