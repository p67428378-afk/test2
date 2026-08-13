import React, { useEffect, useState } from "react";
import { getPerformances, getArtists, getStages } from "../services/api";
import PerformanceScheduleTimeline from "../components/scheduling/PerformanceScheduleTimeline";

export default function SchedulingPage() {
  const [performances, setPerformances] = useState([]);
  const [artists, setArtists] = useState([]);
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pRes, aRes, sRes] = await Promise.all([
        getPerformances(),
        getArtists(),
        getStages(),
      ]);
      setPerformances(pRes || []);
      setArtists(aRes || []);
      setStages(sRes || []);
    } catch (err) {
      console.error("Failed to load scheduling data", err);
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
          Loading Festival Schedule & Stages...
        </div>
      ) : (
        <PerformanceScheduleTimeline
          performances={performances}
          artists={artists}
          stages={stages}
          onRefresh={fetchData}
        />
      )}
    </div>
  );
}
