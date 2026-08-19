import React, { useState, useEffect, useCallback } from "react";
import { Plus, Download, RefreshCw, AlertCircle } from "lucide-react";
import FilterBar from "../components/logs/FilterBar.jsx";
import MaintenanceTable from "../components/logs/MaintenanceTable.jsx";
import MaintenanceEventModal from "../components/logs/MaintenanceEventModal.jsx";
import Button from "../components/common/Button.jsx";
import api from "../services/api.js";

export default function LogsPage() {
  const [eventsData, setEventsData] = useState({
    items: [],
    total: 0,
    skip: 0,
    limit: 10,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const defaultFilters = {
    search: "",
    location: "",
    maintenance_type: "",
    start_date: "",
    end_date: "",
    min_cost: "",
    max_cost: "",
    skip: 0,
    limit: 10,
  };

  const [filters, setFilters] = useState(defaultFilters);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Delete State
  const [eventToDelete, setEventToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getMaintenanceEvents(filters);
      setEventsData(data);
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Failed to fetch maintenance logs",
      );
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleFilterChange = (newFilters) => {
    setFilters({ ...newFilters, skip: 0 });
  };

  const handleResetFilters = () => {
    setFilters(defaultFilters);
  };

  const handlePageChange = (newSkip) => {
    setFilters({ ...filters, skip: Math.max(newSkip, 0) });
  };

  const handleOpenCreateModal = () => {
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (evt) => {
    setSelectedEvent(evt);
    setIsModalOpen(true);
  };

  const handleSaveEvent = async (payload, id) => {
    if (id) {
      await api.updateMaintenanceEvent(id, payload);
    } else {
      await api.createMaintenanceEvent(payload);
    }
    await fetchEvents();
  };

  const handleDeleteConfirm = async () => {
    if (!eventToDelete) return;
    setDeleting(true);
    try {
      await api.deleteMaintenanceEvent(eventToDelete.id);
      setEventToDelete(null);
      await fetchEvents();
    } catch (err) {
      alert("Failed to delete maintenance event.");
    } finally {
      setDeleting(false);
    }
  };

  const handleExportCsv = async () => {
    try {
      const blob = await api.exportMaintenanceCsv(filters);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "wifi_maintenance_logs_export.csv");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      alert("Failed to export CSV logs");
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto py-6 px-4 md:px-8">
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#171c29]">
            WiFi Maintenance Logs
          </h1>
          <p className="text-sm text-[#707a8c] mt-0.5">
            Filter, search, and manage all recorded hardware and network
            maintenance activities
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" icon={Download} onClick={handleExportCsv}>
            Export CSV
          </Button>
          <Button icon={Plus} onClick={handleOpenCreateModal}>
            Record New Event
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-[#dc2626] p-4 rounded-xl text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
          <Button
            variant="secondary"
            size="sm"
            icon={RefreshCw}
            onClick={fetchEvents}
          >
            Retry
          </Button>
        </div>
      )}

      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Maintenance Table */}
      <MaintenanceTable
        events={eventsData.items}
        total={eventsData.total}
        skip={eventsData.skip}
        limit={eventsData.limit}
        loading={loading}
        onPageChange={handlePageChange}
        onEdit={handleOpenEditModal}
        onDelete={(evt) => setEventToDelete(evt)}
      />

      {/* Record/Edit Modal */}
      <MaintenanceEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEvent}
        initialData={selectedEvent}
        isEditing={Boolean(selectedEvent)}
      />

      {/* Delete Confirmation Modal */}
      {eventToDelete && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full border border-[#e3e8f0] shadow-xl flex flex-col gap-4">
            <h3 className="text-base font-bold text-[#171c29]">
              Confirm Delete Record
            </h3>
            <p className="text-xs text-[#707a8c]">
              Are you sure you want to delete the maintenance record for{" "}
              <strong className="text-[#171c29]">{eventToDelete.title}</strong>?
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2 border-t border-[#e3e8f0]">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setEventToDelete(null)}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleDeleteConfirm}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete Event"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
