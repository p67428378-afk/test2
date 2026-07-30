import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Compass, Map, Landmark, ArrowRight, AlertCircle } from "lucide-react";
import { getAnimals, getEnclosures, getMapData } from "../services/api";
import AnimalCard from "../components/animals/AnimalCard";
import Button from "../components/common/Button";

const DashboardPage = ({ onSelectAnimal }) => {
  const [stats, setStats] = useState({
    animals: 0,
    enclosures: 0,
    facilities: 0,
  });
  const [featuredAnimals, setFeaturedAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [animalsData, enclosuresData, mapData] = await Promise.all([
          getAnimals(),
          getEnclosures(),
          getMapData(),
        ]);

        setStats({
          animals: animalsData.length,
          enclosures: enclosuresData.length,
          facilities: mapData.facilities?.length || 0,
        });

        // Select up to 3 featured animals
        setFeaturedAnimals(animalsData.slice(0, 3));
        setError(null);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-8 text-white shadow-sm relative overflow-hidden">
        <div className="max-w-md relative z-10">
          <h1 className="text-3xl font-bold mb-2">Welcome to ZooVisitor!</h1>
          <p className="text-teal-100 mb-6">
            Explore our interactive map, discover amazing animals, and plan your
            perfect day at the zoo.
          </p>
          <div className="flex gap-3">
            <Link to="/map">
              <Button variant="accent" className="flex items-center gap-2">
                <Map className="w-4 h-4" />
                Open Map
              </Button>
            </Link>
            <Link to="/animals">
              <Button
                variant="secondary"
                className="bg-white/10 hover:bg-white/20 text-white border-none"
              >
                Browse Animals
              </Button>
            </Link>
          </div>
        </div>
        {/* Decorative background shape */}
        <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-white/5 rounded-l-full -skew-x-12 hidden md:block"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 rounded-lg bg-teal-50 flex items-center justify-center text-primary">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <span className="text-sm text-slate-500 block">Total Animals</span>
            <span className="text-2xl font-bold text-slate-800">
              {loading ? "..." : stats.animals}
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center text-accent">
            <Map className="w-6 h-6" />
          </div>
          <div>
            <span className="text-sm text-slate-500 block">Enclosures</span>
            <span className="text-2xl font-bold text-slate-800">
              {loading ? "..." : stats.enclosures}
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <span className="text-sm text-slate-500 block">Facilities</span>
            <span className="text-2xl font-bold text-slate-800">
              {loading ? "..." : stats.facilities}
            </span>
          </div>
        </div>
      </div>

      {/* Featured Animals Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800">Featured Animals</h2>
          <Link
            to="/animals"
            className="text-primary hover:text-primary-dark font-semibold text-sm flex items-center gap-1"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-white border border-slate-200 rounded-xl h-80 animate-pulse"
              ></div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 text-center text-rose-700 flex flex-col items-center gap-2">
            <AlertCircle className="w-8 h-8" />
            <p>{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredAnimals.map((animal) => (
              <AnimalCard
                key={animal.id}
                animal={animal}
                onSelect={onSelectAnimal}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
