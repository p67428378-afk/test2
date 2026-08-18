import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/common/Header";
import TourCard from "../components/tours/TourCard";
import BookingModal from "../components/tours/BookingModal";
import { toursAPI, schedulesAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Search, Compass, AlertCircle, RefreshCw } from "lucide-react";

export default function CatalogPage() {
  const [tours, setTours] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [selectedTour, setSelectedTour] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [toursData, schedulesData] = await Promise.all([
        toursAPI.listTours(),
        schedulesAPI.listSchedules(),
      ]);
      setTours(toursData || []);
      setSchedules(schedulesData || []);
    } catch (err) {
      setError(
        "Failed to load museum tours or schedules. Please check your connection.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBookClick = (schedule, tour) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setSelectedSchedule(schedule);
    setSelectedTour(tour);
    setIsBookingOpen(true);
  };

  const filteredTours = tours.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.description &&
        t.description.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      {/* Hero Banner */}
      <section className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full text-xs font-semibold mb-4">
            <Compass className="w-4 h-4" />
            <span>Museum Guided Experiences</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Discover & Book Guided Museum Tours
          </h1>
          <p className="mt-3 text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            Explore world-class exhibitions with expert art historians and
            guides. Real-time capacity control ensures intimate, small-group
            experiences.
          </p>

          <div className="mt-8 max-w-xl mx-auto relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search tours by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm shadow-inner"
            />
          </div>
        </div>
      </section>

      {/* Content Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchData}
              className="flex items-center gap-1 text-xs font-semibold bg-rose-100 hover:bg-rose-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 animate-pulse space-y-4"
              >
                <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                <div className="h-4 bg-slate-100 rounded w-full"></div>
                <div className="h-4 bg-slate-100 rounded w-2/3"></div>
                <div className="h-10 bg-slate-200 rounded w-full mt-4"></div>
              </div>
            ))}
          </div>
        ) : filteredTours.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <Compass className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No Tours Found</h3>
            <p className="text-slate-500 text-sm mt-1">
              {searchTerm
                ? "Try adjusting your search criteria."
                : "No tours available at the moment."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTours.map((tour) => (
              <TourCard
                key={tour.id}
                tour={tour}
                schedules={schedules}
                onBook={handleBookClick}
              />
            ))}
          </div>
        )}
      </main>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        schedule={selectedSchedule}
        tour={selectedTour}
        onSuccess={fetchData}
      />
    </div>
  );
}
