import React, { useState, useEffect } from "react";
import { Search, Calendar, MapPin, Filter, RefreshCw } from "lucide-react";
import { eventService } from "../services/api";
import EventCard from "../components/events/EventCard";
import RegistrationModal from "../components/events/RegistrationModal";

export default function EventDiscoveryPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [dateFilter, setDateFilter] = useState("");

  // Modal state
  const [selectedEvent, setSelectedEvent] = useState(null);

  const fetchEvents = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (category !== "All Categories") params.category = category;
      if (dateFilter) {
        params.start_date = `${dateFilter}T00:00:00Z`;
      }
      const data = await eventService.getEvents(params);
      setEvents(data);
    } catch (err) {
      setError("Failed to load events. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleApplyFilters = (e) => {
    e.preventDefault();
    fetchEvents();
  };

  return (
    <div className="flex-grow flex flex-col w-full max-w-max-width mx-auto px-margin-mobile md:px-gutter py-xl md:py-3xl gap-xl md:gap-3xl">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center gap-sm">
        <h1 className="font-display text-display font-bold text-on-background max-w-3xl">
          Discover Local Events in Your Community
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mt-4">
          Find workshops, sports, music, and more happening near you.
        </p>
      </section>

      {/* Filter Bar */}
      <form
        onSubmit={handleApplyFilters}
        className="bg-surface-container-lowest rounded-xl shadow-[0_8px_24px_rgba(15,23,42,0.08)] border border-outline-variant/30 p-lg w-full max-w-4xl mx-auto flex flex-col md:flex-row gap-md items-end"
      >
        <div className="w-full md:w-1/3 flex flex-col gap-base">
          <label
            className="font-label-sm text-label-sm text-on-surface-variant"
            htmlFor="search-input"
          >
            Search Events
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
            <input
              id="search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body-md text-on-background"
              placeholder="e.g. Yoga class"
            />
          </div>
        </div>

        <div className="w-full md:w-1/4 flex flex-col gap-base">
          <label
            className="font-label-sm text-label-sm text-on-surface-variant"
            htmlFor="category-select"
          >
            Category
          </label>
          <div className="relative">
            <select
              id="category-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full pl-4 pr-10 py-2 bg-surface-container-lowest border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body-md text-on-background appearance-none cursor-pointer"
            >
              <option>All Categories</option>
              <option>Music</option>
              <option>Sports</option>
              <option>Workshop</option>
              <option>Arts</option>
            </select>
          </div>
        </div>

        <div className="w-full md:w-1/4 flex flex-col gap-base">
          <label
            className="font-label-sm text-label-sm text-on-surface-variant"
            htmlFor="date-input"
          >
            Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
            <input
              id="date-input"
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body-md text-on-background cursor-pointer"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full md:w-auto bg-primary-container text-on-primary px-6 py-2 rounded-md font-label-md font-bold hover:bg-surface-tint hover:shadow-[0_4px_12px_rgba(16,185,129,0.2)] transition-all active:scale-95 whitespace-nowrap h-[42px]"
        >
          Apply Filters
        </button>
      </form>

      {/* Event Grid / Content Area */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <RefreshCw className="w-10 h-10 text-primary animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-20 text-error font-bold">{error}</div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 text-on-surface-variant font-body-lg">
          No events found matching your criteria. Try adjusting your filters!
        </div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onRegisterClick={(evt) => setSelectedEvent(evt)}
            />
          ))}
        </section>
      )}

      {/* Registration Modal */}
      {selectedEvent && (
        <RegistrationModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}
