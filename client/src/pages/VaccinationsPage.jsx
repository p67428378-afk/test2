import React, { useState, useEffect } from "react";
import { vaccinationsApi, remindersApi, petsApi } from "../services/api";
import VaccinationTrackerTable from "../components/vaccinations/VaccinationTrackerTable";
import VaccinationModal from "../components/vaccinations/VaccinationModal";
import ReminderDispatchCard from "../components/vaccinations/ReminderDispatchCard";

export default function VaccinationsPage() {
  const [vaccinations, setVaccinations] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVaccineModalOpen, setIsVaccineModalOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [petsData, remData] = await Promise.all([
        petsApi.getPets().catch(() => []),
        remindersApi.getReminders().catch(() => []),
      ]);
      setPets(petsData || []);
      setReminders(remData || []);

      // Gather vaccinations across all pets
      if (petsData && petsData.length > 0) {
        const vaxPromises = petsData.map((p) =>
          vaccinationsApi.getPetVaccinations(p.id).catch(() => []),
        );
        const allVaxArrays = await Promise.all(vaxPromises);
        const flattened = allVaxArrays.flat();
        setVaccinations(flattened);
      } else {
        setVaccinations([]);
      }
    } catch (err) {
      console.error("Failed to load vaccinations data:", err);
      setError("Failed to load vaccinations data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateVaccine = async (payload) => {
    await vaccinationsApi.createVaccination(payload);
    fetchData();
  };

  const handleProcessReminders = async () => {
    const res = await remindersApi.processReminders();
    fetchData();
    return res;
  };

  const petsMap = pets.reduce((acc, p) => {
    acc[p.id] = p;
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Vaccinations & Reminders Tracker
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Monitor pet immunization schedules and run automated alert dispatches
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="p-4 bg-red-50 text-red-800 rounded-xl border border-red-200 text-sm"
        >
          {error}
        </div>
      )}

      <ReminderDispatchCard
        reminders={reminders}
        onProcessReminders={handleProcessReminders}
        petsMap={petsMap}
      />

      <VaccinationTrackerTable
        vaccinations={vaccinations}
        petsMap={petsMap}
        onOpenVaccineModal={() => setIsVaccineModalOpen(true)}
      />

      <VaccinationModal
        isOpen={isVaccineModalOpen}
        onClose={() => setIsVaccineModalOpen(false)}
        onSubmit={handleCreateVaccine}
        pets={pets}
      />
    </div>
  );
}
