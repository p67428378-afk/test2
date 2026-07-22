import React, { useEffect, useState } from "react";
import { hiveService } from "../services/api";
import HiveCard from "../components/hives/HiveCard";
import Button from "../components/common/Button";
import InputField from "../components/common/InputField";
import Badge from "../components/common/Badge";

export default function DashboardPage() {
  const [hives, setHives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("healthy");
  const [honeyCapacity, setHoneyCapacity] = useState(0);

  const fetchHives = async () => {
    try {
      const data = await hiveService.getHives();
      setHives(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load hives.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHives();
  }, []);

  const handleAddHive = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await hiveService.createHive({
        name,
        location,
        status,
        honey_capacity_pct: parseFloat(honeyCapacity),
      });
      setShowAddModal(false);
      setName("");
      setLocation("");
      setStatus("healthy");
      setHoneyCapacity(0);
      fetchHives();
    } catch (err) {
      console.error(err);
      setError("Failed to create hive.");
    }
  };

  // Calculate stats
  const totalHives = hives.length;
  const activeAlerts = hives.filter(
    (h) =>
      h.status === "alert" || h.status === "danger" || h.status === "unhealthy",
  ).length;
  const totalHoney = hives.reduce(
    (acc, h) => acc + h.honey_capacity_pct * 4,
    0,
  ); // Mocked total honey harvested
  const totalPopulation = hives.length * 40000; // Mocked total population

  return (
    <div className="flex flex-col gap-lg">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs">
            Apiary Overview
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Real-time monitoring and analytics for all active hives.
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[18px]">add</span>{" "}
            Add Hive
          </span>
        </Button>
      </header>

      {error && (
        <div className="p-md rounded-lg bg-error/10 text-error border border-error/20">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
        <div className="bg-surface-container p-lg rounded-lg border border-outline-variant hover:border-outline transition-colors group">
          <div className="flex justify-between items-start mb-md">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
              Total Hives
            </span>
            <span className="material-symbols-outlined text-primary-container opacity-80 group-hover:opacity-100 transition-opacity">
              grid_view
            </span>
          </div>
          <div className="flex items-baseline gap-sm">
            <span className="font-headline-lg text-headline-lg text-on-surface">
              {totalHives}
            </span>
            <span className="font-label-md text-label-md text-tertiary-container bg-tertiary-fixed/10 px-2 py-0.5 rounded-full">
              All active
            </span>
          </div>
        </div>

        <div className="bg-surface-container p-lg rounded-lg border border-error/30 hover:border-error transition-colors group relative overflow-hidden">
          <div className="absolute inset-0 bg-error/5 pointer-events-none"></div>
          <div className="flex justify-between items-start mb-md relative z-10">
            <span className="font-label-md text-label-md text-error uppercase tracking-wider">
              Active Alerts
            </span>
            <span className="material-symbols-outlined text-error opacity-80 group-hover:opacity-100 transition-opacity">
              warning
            </span>
          </div>
          <div className="flex flex-col gap-xs relative z-10">
            <span className="font-headline-lg text-headline-lg text-on-surface">
              {activeAlerts}
            </span>
          </div>
        </div>

        <div className="bg-surface-container p-lg rounded-lg border border-outline-variant hover:border-outline transition-colors group">
          <div className="flex justify-between items-start mb-md">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
              Honey Harvested
            </span>
            <span className="material-symbols-outlined text-primary-container opacity-80 group-hover:opacity-100 transition-opacity">
              water_drop
            </span>
          </div>
          <div className="flex items-baseline gap-sm">
            <span className="font-headline-lg text-headline-lg text-on-surface">
              {totalHoney.toFixed(1)}{" "}
              <span className="text-headline-md text-on-surface-variant">
                kg
              </span>
            </span>
          </div>
        </div>

        <div className="bg-surface-container p-lg rounded-lg border border-outline-variant hover:border-outline transition-colors group">
          <div className="flex justify-between items-start mb-md">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
              Est. Population
            </span>
            <span className="material-symbols-outlined text-primary-container opacity-80 group-hover:opacity-100 transition-opacity">
              hive
            </span>
          </div>
          <div className="flex items-baseline gap-sm">
            <span className="font-headline-lg text-headline-lg text-on-surface">
              {(totalPopulation / 1000).toFixed(0)}k
            </span>
          </div>
        </div>
      </section>

      {/* Hives Grid */}
      <section className="bg-surface-container rounded-xl border border-outline-variant overflow-hidden flex flex-col">
        <div className="p-lg border-b border-outline-variant flex justify-between items-center bg-surface-container-high/50">
          <h3 className="font-headline-md text-headline-md text-on-surface">
            Apiary Map & Hive Status Overview
          </h3>
        </div>
        {loading ? (
          <div className="p-lg text-center text-on-surface-variant">
            Loading hives...
          </div>
        ) : hives.length > 0 ? (
          <div className="p-lg grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
            {hives.map((hive) => (
              <HiveCard key={hive.id} hive={hive} />
            ))}
          </div>
        ) : (
          <div className="p-lg text-center text-on-surface-variant">
            No hives registered yet. Click "Add Hive" to get started.
          </div>
        )}
      </section>

      {/* Add Hive Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-md">
          <div className="bg-surface-container p-lg rounded-xl border border-outline-variant w-full max-w-md flex flex-col gap-lg">
            <div className="flex justify-between items-center">
              <h3 className="font-headline-md text-headline-md text-primary">
                Add New Hive
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleAddHive} className="flex flex-col gap-md">
              <InputField
                label="Hive Name"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <InputField
                label="Location"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
              <div className="flex flex-col gap-xs">
                <label
                  htmlFor="status"
                  className="font-label-md text-label-md text-on-surface-variant"
                >
                  Status
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="healthy">Healthy</option>
                  <option value="alert">Alert</option>
                  <option value="unhealthy">Unhealthy</option>
                </select>
              </div>
              <InputField
                label="Honey Capacity (%)"
                id="honeyCapacity"
                type="number"
                value={honeyCapacity}
                onChange={(e) => setHoneyCapacity(e.target.value)}
                required
              />
              <div className="flex gap-md mt-md">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Create Hive
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
