import React, { useEffect, useState } from "react";
import { getShifts, getVolunteers } from "../services/api";
import VolunteerShiftRoster from "../components/volunteers/VolunteerShiftRoster";

export default function VolunteersPage() {
  const [shifts, setShifts] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [sRes, vRes] = await Promise.all([getShifts(), getVolunteers()]);
      setShifts(sRes || []);
      setVolunteers(vRes || []);
    } catch (err) {
      console.error("Failed to load volunteer roster data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6">
      {loading ? (
        <div className="text-center py-20 text-slate-400 text-sm">
          Loading Volunteer Roster & Shifts...
        </div>
      ) : (
        <VolunteerShiftRoster
          shifts={shifts}
          volunteers={volunteers}
          onRefresh={fetchData}
        />
      )}
    </div>
  );
}
