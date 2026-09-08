import React, { useState, useEffect } from "react";
import {
  BedDouble,
  Plus,
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { roomsApi } from "../services/api.js";
import RoomCard from "../components/RoomCard.jsx";

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchType, setSearchType] = useState("");
  const [updatingRoomId, setUpdatingRoomId] = useState(null);

  // New Room Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRoomNumber, setNewRoomNumber] = useState("");
  const [newRoomType, setNewRoomType] = useState("Single Deluxe");
  const [newDailyRate, setNewDailyRate] = useState("120");
  const [newStatus, setNewStatus] = useState("Available");
  const [isCreating, setIsCreating] = useState(false);

  const fetchRooms = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = {};
      if (selectedStatus) params.status = selectedStatus;
      if (searchType) params.room_type = searchType;
      const data = await roomsApi.getRooms(params);
      setRooms(data);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Failed to fetch rooms inventory.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [selectedStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRooms();
  };

  const handleStatusChange = async (roomId, newStatusValue) => {
    setUpdatingRoomId(roomId);
    setError(null);
    try {
      await roomsApi.updateRoomStatus(roomId, newStatusValue);
      setSuccessMsg(`Room status updated to ${newStatusValue}`);
      setTimeout(() => setSuccessMsg(""), 3000);
      await fetchRooms();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to update room status.");
    } finally {
      setUpdatingRoomId(null);
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    setError(null);
    try {
      await roomsApi.createRoom({
        room_number: newRoomNumber.trim(),
        room_type: newRoomType,
        daily_rate: parseFloat(newDailyRate),
        status: newStatus,
      });
      setIsModalOpen(false);
      setNewRoomNumber("");
      setSuccessMsg("Room created successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
      await fetchRooms();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create room.");
    } finally {
      setIsCreating(false);
    }
  };

  // KPI Calculations
  const totalCount = rooms.length;
  const availableCount = rooms.filter((r) => r.status === "Available").length;
  const occupiedCount = rooms.filter((r) => r.status === "Occupied").length;
  const cleaningCount = rooms.filter((r) => r.status === "Cleaning").length;
  const maintenanceCount = rooms.filter(
    (r) => r.status === "Maintenance",
  ).length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0b1c30]">
            Room Inventory & Housekeeping
          </h1>
          <p className="text-sm text-slate-500">
            Monitor real-time room availability, housekeeping states, and
            operational inventory.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchRooms}
            className="p-2 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 rounded-lg shadow-sm hover:bg-slate-50 transition"
            title="Refresh Rooms"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow transition"
          >
            <Plus className="w-4 h-4" /> Add Room
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Stat KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Total Rooms
          </span>
          <p className="text-2xl font-bold text-slate-900 mt-1">{totalCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm">
          <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">
            Available
          </span>
          <p className="text-2xl font-bold text-emerald-700 mt-1">
            {availableCount}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
            Occupied
          </span>
          <p className="text-2xl font-bold text-blue-700 mt-1">
            {occupiedCount}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-amber-100 shadow-sm">
          <span className="text-xs font-semibold text-amber-600 uppercase tracking-wide">
            Cleaning
          </span>
          <p className="text-2xl font-bold text-amber-700 mt-1">
            {cleaningCount}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-rose-100 shadow-sm">
          <span className="text-xs font-semibold text-rose-600 uppercase tracking-wide">
            Maintenance
          </span>
          <p className="text-2xl font-bold text-rose-700 mt-1">
            {maintenanceCount}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Status:
          </span>
          {["", "Available", "Occupied", "Cleaning", "Maintenance"].map(
            (st) => (
              <button
                key={st || "all"}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  selectedStatus === st
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {st || "All Rooms"}
              </button>
            ),
          )}
        </div>

        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center gap-2 w-full md:w-72"
        >
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter by Room Type..."
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-lg hover:bg-slate-900 transition"
          >
            Search
          </button>
        </form>
      </div>

      {/* Room Grid */}
      {isLoading ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent" />
          <p className="mt-2 text-sm text-slate-500">
            Loading room inventory...
          </p>
        </div>
      ) : rooms.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <BedDouble className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <h3 className="text-base font-semibold text-slate-700">
            No Rooms Matching Filters
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Try resetting the status filter or search query.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {rooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onStatusChange={handleStatusChange}
              isUpdating={updatingRoomId === room.id}
            />
          ))}
        </div>
      )}

      {/* Add Room Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div className="bg-[#041627] text-white p-5 flex justify-between items-center">
              <h3 className="font-bold text-lg">Add New Room</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateRoom} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Room Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 301"
                  value={newRoomNumber}
                  onChange={(e) => setNewRoomNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Room Type *
                </label>
                <select
                  value={newRoomType}
                  onChange={(e) => setNewRoomType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Single Deluxe">Single Deluxe</option>
                  <option value="Double Suite">Double Suite</option>
                  <option value="Executive Suite">Executive Suite</option>
                  <option value="Presidential Suite">Presidential Suite</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Daily Rate ($/night) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={newDailyRate}
                  onChange={(e) => setNewDailyRate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Initial Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Available">Available</option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg shadow transition"
                >
                  {isCreating ? "Saving..." : "Save Room"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
