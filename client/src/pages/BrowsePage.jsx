import React, { useState, useEffect } from "react";
import { petService } from "../services/api";
import FilterSidebar from "../components/pet/FilterSidebar";
import PetGrid from "../components/pet/PetGrid";
import Header from "../components/layout/Header";

export const BrowsePage = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    breed: "",
    age: "",
    location: "",
  });

  const fetchPets = async (currentFilters) => {
    setLoading(true);
    try {
      const data = await petService.getPets(currentFilters);
      setPets(data.items || []);
      setError("");
    } catch (err) {
      console.error("Error fetching pets:", err);
      setError("Failed to load pets. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets(filters);
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      breed: "",
      age: "",
      location: "",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Find Your New Best Friend
          </h1>
          <p className="mt-3 text-lg text-slate-500 max-w-2xl">
            Browse available pets in our shelter, filter by breed, age, or
            location, and start your adoption journey today.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <FilterSidebar
              filters={filters}
              onChange={handleFilterChange}
              onReset={handleResetFilters}
            />
          </div>
          <div className="lg:col-span-3">
            <PetGrid pets={pets} loading={loading} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default BrowsePage;
