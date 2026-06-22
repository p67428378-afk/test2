import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
} from "lucide-react";
import { getAvailability } from "../../services/api";

export default function CalendarWidget({ selectedDateTime, onSelect }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookedSlots, setBookedSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(false);

  const timeSlots = ["09:00", "11:00", "14:00", "16:00"];

  // Fetch availability for the current month
  useEffect(() => {
    const fetchMonthAvailability = async () => {
      setLoading(true);
      try {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const start = new Date(year, month, 1).toISOString().split("T")[0];
        const end = new Date(year, month + 1, 0).toISOString().split("T")[0];
        const booked = await getAvailability(start, end);
        setBookedSlots(booked);
      } catch {
        // Fallback to empty booked slots if API fails
        setBookedSlots([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMonthAvailability();
  }, [currentDate]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay();
    return { days, firstDayIndex };
  };

  const { days, firstDayIndex } = getDaysInMonth(currentDate);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handlePrevMonth = () => {
    const prev = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1,
    );
    // Don't go before current month
    if (prev >= new Date(new Date().getFullYear(), new Date().getMonth(), 1)) {
      setCurrentDate(prev);
      setSelectedDate(null);
    }
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
    setSelectedDate(null);
  };

  const handleDateClick = (day) => {
    const clickedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    );
    // Don't allow selecting past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (clickedDate >= today) {
      setSelectedDate(clickedDate);
    }
  };

  const isSlotBooked = (date, slot) => {
    if (!date) return false;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;
    const slotDateTime = `${dateStr}T${slot}:00Z`;
    return bookedSlots.includes(slotDateTime);
  };

  const handleSlotClick = (slot) => {
    if (!selectedDate) return;
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;
    const slotDateTime = `${dateStr}T${slot}:00Z`;
    onSelect(slotDateTime);
  };

  const renderDays = () => {
    const dayElements = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Empty cells for padding
    for (let i = 0; i < firstDayIndex; i++) {
      dayElements.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Days of the month
    for (let day = 1; day <= days; day++) {
      const dateObj = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day,
      );
      const isPast = dateObj < today;
      const isSelected =
        selectedDate &&
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === currentDate.getMonth();

      dayElements.push(
        <button
          key={`day-${day}`}
          onClick={() => handleDateClick(day)}
          disabled={isPast}
          className={`p-3 rounded-lg text-center font-body-md transition-all duration-200 ${
            isPast
              ? "text-outline-variant/40 cursor-not-allowed"
              : isSelected
                ? "bg-primary text-on-primary font-semibold shadow-md"
                : "hover:bg-surface-container-high text-on-surface"
          }`}
        >
          {day}
        </button>,
      );
    }

    return dayElements;
  };

  return (
    <div className="bg-surface border border-outline-variant/30 rounded-xl p-6 shadow-sm max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-headline-sm text-headline-sm text-primary flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-tertiary-fixed-dim" />
          Select Date & Time
        </h3>
        <div className="flex gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-full hover:bg-surface-container-high text-primary transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-full hover:bg-surface-container-high text-primary transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="text-center font-semibold text-primary mb-4">
        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 text-center mb-6">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <div
                key={d}
                className="font-label-caps text-label-caps text-on-surface-variant py-2"
              >
                {d}
              </div>
            ))}
            {renderDays()}
          </div>

          {/* Time Slots */}
          {selectedDate && (
            <div className="border-t border-outline-variant/20 pt-6 animate-fade-in">
              <h4 className="font-body-lg font-semibold text-primary mb-4 flex items-center gap-2">
                <Clock className="h-4 w-4 text-tertiary-fixed-dim" />
                Available Slots for {selectedDate.toLocaleDateString()}
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {timeSlots.map((slot) => {
                  const booked = isSlotBooked(selectedDate, slot);
                  const isSelected =
                    selectedDateTime &&
                    selectedDateTime.endsWith(`${slot}:00Z`) &&
                    selectedDateTime.startsWith(
                      selectedDate.toISOString().split("T")[0],
                    );

                  return (
                    <button
                      key={slot}
                      onClick={() => handleSlotClick(slot)}
                      disabled={booked}
                      className={`py-3 px-4 rounded-lg font-body-md text-center transition-all duration-200 ${
                        booked
                          ? "bg-surface-container-low text-outline-variant/40 cursor-not-allowed line-through"
                          : isSelected
                            ? "bg-tertiary-fixed-dim text-on-tertiary-fixed font-semibold shadow-sm"
                            : "bg-surface-container hover:bg-surface-container-high text-primary border border-outline-variant/20"
                      }`}
                    >
                      {slot} {booked ? "(Booked)" : ""}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

CalendarWidget.propTypes = {
  selectedDateTime: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
};
