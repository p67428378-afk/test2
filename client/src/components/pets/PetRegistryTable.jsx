import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Dog, Cat, Eye, Plus } from "lucide-react";

export default function PetRegistryTable({ pets, onOpenAddModal }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecies, setSelectedSpecies] = useState("");

  const filteredPets = pets.filter((pet) => {
    const matchesSearch =
      pet.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.breed?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.microchip_number?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecies =
      !selectedSpecies ||
      pet.species?.toLowerCase() === selectedSpecies.toLowerCase();
    return matchesSearch && matchesSpecies;
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Pet Directory</h2>
          <p className="text-sm text-slate-500">
            Manage registered pets and owner profiles
          </p>
        </div>
        <button
          onClick={onOpenAddModal}
          className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Register New Pet</span>
        </button>
      </div>

      <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, breed, or microchip #..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-slate-500" />
          <select
            value={selectedSpecies}
            onChange={(e) => setSelectedSpecies(e.target.value)}
            className="border border-slate-300 rounded-lg py-2 px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Species</option>
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
            <option value="bird">Bird</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-600 text-xs font-semibold uppercase tracking-wider">
              <th className="py-3 px-4">Pet Name</th>
              <th className="py-3 px-4">Species & Breed</th>
              <th className="py-3 px-4">Age & Gender</th>
              <th className="py-3 px-4">Weight</th>
              <th className="py-3 px-4">Microchip #</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm">
            {filteredPets.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-8 text-center text-slate-500">
                  No pets found matching criteria.
                </td>
              </tr>
            ) : (
              filteredPets.map((pet) => (
                <tr
                  key={pet.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 rounded-full bg-blue-50 text-blue-600">
                        {pet.species?.toLowerCase() === "dog" ? (
                          <Dog className="h-4 w-4" />
                        ) : (
                          <Cat className="h-4 w-4" />
                        )}
                      </div>
                      <span>{pet.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    <span className="capitalize">{pet.species}</span>
                    {pet.breed && (
                      <span className="text-slate-500 text-xs block">
                        {pet.breed}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    {pet.age !== null ? `${pet.age} yrs` : "N/A"}{" "}
                    {pet.gender && (
                      <span className="text-slate-500 capitalize">
                        ({pet.gender})
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    {pet.weight ? `${pet.weight} kg` : "N/A"}
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-mono text-xs">
                    {pet.microchip_number || "Unchipped"}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      to={`/pets/${pet.id}`}
                      className="inline-flex items-center space-x-1 text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>View Profile</span>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
