import React, { useState, useEffect } from "react";
import { petsApi, appointmentsApi, remindersApi } from "../services/api";
import PetRegistryTable from "../components/pets/PetRegistryTable";
import PetFormModal from "../components/pets/PetFormModal";
import { Dog, Calendar, Bell, AlertTriangle } from "lucide-react";

export default function DashboardPage() {
  const [pets, setPets] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [petsData, apptData, remData] = await Promise.all([
        petsApi.getPets().catch(() => []),
        appointmentsApi.getAppointments().catch(() => []),
        remindersApi.getReminders().catch(() => []),
      ]);
      setPets(petsData || []);
      setAppointments(apptData || []);
      setReminders(remData || []);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreatePet = async (petPayload) => {
    await petsApi.createPet(petPayload);
    fetchData();
  };

  const scheduledCount = appointments.filter(
    (a) => a.status === "SCHEDULED",
  ).length;
  const pendingRemindersCount = reminders.filter(
    (r) => r.status === "PENDING" || r.status === "SENT",
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Clinic Overview & Pet Registry
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage pet profiles, monitor visit schedules, and track reminders
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

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
            <Dog className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Total Registered Pets
            </span>
            <span className="text-2xl font-bold text-slate-900 mt-0.5 block">
              {loading ? "..." : pets.length}
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Scheduled Visits
            </span>
            <span className="text-2xl font-bold text-slate-900 mt-0.5 block">
              {loading ? "..." : scheduledCount}
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl">
            <Bell className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Active Reminders
            </span>
            <span className="text-2xl font-bold text-slate-900 mt-0.5 block">
              {loading ? "..." : pendingRemindersCount}
            </span>
          </div>
        </div>
      </div>

      {/* Pet Registry Table */}
      <PetRegistryTable
        pets={pets}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {/* Register Pet Modal */}
      <PetFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreatePet}
      />
    </div>
  );
}
