import React, { useState, useEffect } from "react";
import PlantCard from "../components/garden/PlantCard.jsx";
import AddPlantModal from "../components/garden/AddPlantModal.jsx";
import {
  getUserPlants,
  waterUserPlant,
  deleteUserPlant,
  updateUserPlant,
} from "../services/api.js";
import {
  Plus,
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
  Sprout,
} from "lucide-react";

export default function GardenPage({ onGardenUpdated }) {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("All Rooms");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [plantToEdit, setPlantToEdit] = useState(null);

  const fetchGarden = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getUserPlants(
        selectedRoom === "All Rooms" ? "" : selectedRoom,
      );
      setPlants(data || []);
      if (onGardenUpdated) onGardenUpdated();
    } catch (err) {
      console.error("Failed to load garden:", err);
      setError(
        err.response?.data?.detail ||
          "Failed to retrieve personal plant collection.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGarden();
  }, [selectedRoom]);

  const handleWaterPlant = async (plantId) => {
    await waterUserPlant(plantId);
    await fetchGarden();
  };

  const handleDeletePlant = async (plantId) => {
    if (
      window.confirm(
        "Are you sure you want to remove this plant from your garden?",
      )
    ) {
      try {
        await deleteUserPlant(plantId);
        await fetchGarden();
      } catch (err) {
        alert(err.response?.data?.detail || "Failed to delete plant.");
      }
    }
  };

  const handleToggleNotifications = async (plant) => {
    try {
      await updateUserPlant(plant.id, {
        notifications_enabled: !plant.notifications_enabled,
      });
      await fetchGarden();
    } catch (err) {
      console.error("Failed to toggle notifications:", err);
    }
  };

  const handleEditPlant = (plant) => {
    setPlantToEdit(plant);
    setIsAddModalOpen(true);
  };

  const filteredPlants = plants.filter((plant) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const nicknameMatch = plant.nickname?.toLowerCase().includes(q);
    const speciesMatch =
      plant.species?.common_name?.toLowerCase().includes(q) ||
      plant.species_name?.toLowerCase().includes(q);
    const locationMatch = plant.location?.toLowerCase().includes(q);
    return nicknameMatch || speciesMatch || locationMatch;
  });

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Sprout className="w-7 h-7 text-[#1C8A5C]" />
            <span>My Garden Collection</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage your personal houseplants, track locations, and schedule
            watering
          </p>
        </div>

        <button
          onClick={() => {
            setPlantToEdit(null);
            setIsAddModalOpen(true);
          }}
          className="flex items-center space-x-2 px-4 py-2.5 bg-[#1C8A5C] text-white font-semibold text-sm rounded-xl hover:bg-[#0F4E34] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Plant to Garden</span>
        </button>
      </div>

      {/* Search & Location Filter Controls */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search my garden by nickname or species..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#1C8A5C] focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400 hidden sm:block" />
            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1C8A5C]"
            >
              <option value="All Rooms">All Rooms</option>
              <option value="Living Room">Living Room</option>
              <option value="Sunroom">Sunroom</option>
              <option value="Office">Office</option>
              <option value="Bedroom">Bedroom</option>
              <option value="Kitchen">Kitchen</option>
              <option value="Balcony">Balcony</option>
            </select>
          </div>
        </div>

        <button
          onClick={fetchGarden}
          className="p-2 border border-gray-200 text-gray-500 hover:text-gray-800 rounded-lg hover:bg-gray-50"
          title="Refresh Garden"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center space-x-2"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="text-center py-16">
          <RefreshCw className="w-8 h-8 text-[#1C8A5C] animate-spin mx-auto mb-2" />
          <p className="text-xs text-gray-500 font-medium">
            Fetching your houseplant collection...
          </p>
        </div>
      ) : filteredPlants.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center max-w-md mx-auto my-8">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#1C8A5C] flex items-center justify-center mx-auto mb-3 text-xl">
            🪴
          </div>
          <h3 className="font-bold text-gray-900 text-base mb-1">
            No plants found
          </h3>
          <p className="text-xs text-gray-500 mb-6">
            {searchQuery
              ? `No plants match "${searchQuery}". Try clearing search filters.`
              : "Your garden is empty. Add your first houseplant to get started!"}
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedRoom("All Rooms");
              setPlantToEdit(null);
              setIsAddModalOpen(true);
            }}
            className="px-4 py-2 bg-[#1C8A5C] text-white text-xs font-semibold rounded-lg hover:bg-[#0F4E34] transition-colors"
          >
            + Add First Plant
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlants.map((plant) => (
            <PlantCard
              key={plant.id}
              plant={plant}
              onWater={handleWaterPlant}
              onEdit={handleEditPlant}
              onDelete={handleDeletePlant}
              onToggleNotifications={handleToggleNotifications}
            />
          ))}
        </div>
      )}

      {isAddModalOpen && (
        <AddPlantModal
          plantToEdit={plantToEdit}
          onClose={() => {
            setIsAddModalOpen(false);
            setPlantToEdit(null);
          }}
          onSuccess={fetchGarden}
        />
      )}
    </div>
  );
}
