import React, { useState, useEffect } from "react";
import { DriverLifecycleControls } from "../components/DriverLifecycleControls";
import { bookingsApi } from "../services/api";
import { wsService } from "../services/websocket";
import { Navigation, Clock } from "lucide-react";

export const DriverPage = () => {
  const [assignedBookings, setAssignedBookings] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDriverBookings = async () => {
    try {
      const data = await bookingsApi.list();
      setAssignedBookings(data);
      if (data.length > 0 && !selectedTask) {
        setSelectedTask(data[0]);
      } else if (selectedTask) {
        const updatedCurrent = data.find((b) => b.id === selectedTask.id);
        if (updatedCurrent) {
          setSelectedTask(updatedCurrent);
        }
      }
    } catch (err) {
      console.error("Failed to load driver tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDriverBookings();

    const unsubscribe = wsService.addListener((message) => {
      if (
        ["BOOKING_ASSIGNED", "DELIVERY_STATUS_UPDATED"].includes(message.event)
      ) {
        fetchDriverBookings();
      }
    });

    return () => unsubscribe();
  }, []);

  const handleStatusUpdated = (updatedBooking) => {
    setSelectedTask(updatedBooking);
    fetchDriverBookings();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400">
          <Navigation className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-100">
            Driver Portal & Route Dispatch
          </h1>
          <p className="text-slate-400 text-sm">
            Manage assigned delivery tasks and update lifecycle progress.
          </p>
        </div>
      </div>

      {assignedBookings.length > 1 && (
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-2">
          <span className="text-xs font-medium text-slate-400">
            Your Assigned Deliveries
          </span>
          <div className="flex flex-wrap gap-2">
            {assignedBookings.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setSelectedTask(b)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition ${
                  selectedTask?.id === b.id
                    ? "bg-amber-500/20 text-amber-300 border-amber-500"
                    : "bg-slate-900 text-slate-400 border-slate-700"
                }`}
              >
                #{b.id.substring(0, 8)} - {b.status}
              </button>
            ))}
          </div>
        </div>
      )}

      <DriverLifecycleControls
        booking={selectedTask}
        onStatusUpdated={handleStatusUpdated}
      />
    </div>
  );
};

export default DriverPage;
