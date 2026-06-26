import React, { useState, useEffect } from "react";
import { leaveService } from "../services/api";
import CalendarGrid from "../components/leave/CalendarGrid";

export default function TeamCalendar() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await leaveService.getTeamRequests();
        setRequests(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load team calendar.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-body-lg font-body-lg text-secondary">
          Loading calendar...
        </p>
      </div>
    );
  }

  return (
    <div className="p-margin-page flex-1 max-w-[1440px] mx-auto w-full">
      {error && (
        <div
          className="mb-6 p-4 bg-error-container text-on-error-container rounded-lg text-body-md font-body-md"
          role="alert"
        >
          {error}
        </div>
      )}

      <CalendarGrid requests={requests} />
    </div>
  );
}
