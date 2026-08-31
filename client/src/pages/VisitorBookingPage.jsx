import React, { useState, useEffect } from "react";
import { Sparkles, ShieldCheck, Clock, RefreshCw } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import TourCatalog from "../components/tours/TourCatalog";
import TicketBookingForm from "../components/tours/TicketBookingForm";
import { getSchedules } from "../services/api";

export default function VisitorBookingPage() {
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSchedules = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getSchedules({ status: "Published" });
      setSchedules(res.data || []);
      // If selected schedule is still in list, update it; otherwise select the first available
      if (res.data && res.data.length > 0) {
        if (!selectedSchedule) {
          setSelectedSchedule(res.data[0]);
        } else {
          const updated = res.data.find((s) => s.id === selectedSchedule.id);
          if (updated) setSelectedSchedule(updated);
        }
      }
    } catch (err) {
      setError(
        "Unable to load tour schedules. Please check backend connection.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleBookingSuccess = () => {
    // Refresh schedule data to update remaining capacities
    fetchSchedules();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white py-10 px-4 sm:px-6 lg:px-8 shadow-inner">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-700/60 text-blue-200 text-xs font-semibold backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Curated Museum Expeditions</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Experience History with Expert Guides
              </h1>
              <p className="text-blue-100 text-sm leading-relaxed">
                Browse official guided museum tours, verify real-time seat
                availability, and reserve your tickets instantly.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-blue-200 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Strict Capacity Controls</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-300" />
                <span>Instant Ticket Issuance</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area: Split Pane */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Available Guided Tours
            </h2>
            <p className="text-xs text-slate-500">
              Select a schedule slot below to reserve your tickets
            </p>
          </div>
          <button
            type="button"
            onClick={fetchSchedules}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition shadow-sm"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </button>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center justify-between"
          >
            <span>{error}</span>
            <button
              onClick={fetchSchedules}
              className="underline font-semibold ml-4"
            >
              Retry
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <TourCatalog
              schedules={schedules}
              selectedSchedule={selectedSchedule}
              onSelectSchedule={setSelectedSchedule}
              isLoading={isLoading}
            />
          </div>

          <div className="lg:col-span-5 sticky top-24 self-start">
            <TicketBookingForm
              selectedSchedule={selectedSchedule}
              onBookingSuccess={handleBookingSuccess}
            />
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <p>
            © {new Date().getFullYear()} Museum Tour Management System. All
            rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
