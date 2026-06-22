import React, { useState, useEffect } from "react";
import Header from "../components/layout/Header.jsx";
import Sidebar from "../components/layout/Sidebar.jsx";
import GreetingsGrid from "../components/greetings/GreetingsGrid.jsx";
import { getGreetings } from "../services/api.js";

const GREETING_LANGUAGES = {
  Namaste: "Hindi",
  Vanakkam: "Tamil",
  "Sat Sri Akaal": "Punjabi",
  Aadab: "Urdu",
  Nomoskar: "Bengali",
};

export default function DashboardPage() {
  const [greetings, setGreetings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [selectedLanguages, setSelectedLanguages] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGreeting, setNewGreeting] = useState({
    greeting: "",
    region: "North India",
    description: "",
  });
  const [suggestSuccess, setSuggestSuccess] = useState(false);

  useEffect(() => {
    const fetchGreetingsData = async () => {
      try {
        setIsLoading(true);
        const data = await getGreetings();
        setGreetings(data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch greetings from the server.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGreetingsData();
  }, []);

  const handleSuggestSubmit = (e) => {
    e.preventDefault();
    if (!newGreeting.greeting || !newGreeting.description) return;

    // Simulate adding the greeting locally
    const suggested = {
      id: Math.random().toString(36).substr(2, 9),
      greeting: newGreeting.greeting,
      region: newGreeting.region,
      description: newGreeting.description,
    };

    setGreetings([suggested, ...greetings]);
    setSuggestSuccess(true);
    setNewGreeting({ greeting: "", region: "North India", description: "" });

    setTimeout(() => {
      setIsModalOpen(false);
      setSuggestSuccess(false);
    }, 2000);
  };

  // Filter greetings
  const filteredGreetings = greetings.filter((item) => {
    // Search filter
    const matchesSearch =
      item.greeting.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Region filter
    const matchesRegion =
      selectedRegion === "All" || item.region === selectedRegion;

    // Language filter
    const mappedLang = GREETING_LANGUAGES[item.greeting] || "Local Language";
    const matchesLanguage =
      selectedLanguages.length === 0 || selectedLanguages.includes(mappedLang);

    return matchesSearch && matchesRegion && matchesLanguage;
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSuggestClick={() => setIsModalOpen(true)}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          selectedRegion={selectedRegion}
          setSelectedRegion={setSelectedRegion}
          selectedLanguages={selectedLanguages}
          setSelectedLanguages={setSelectedLanguages}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-container-margin md:p-8 bg-[#F8FAFC]">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-[#FF9933] to-[#FFB366] rounded-xl p-8 md:p-12 shadow-md relative overflow-hidden text-white flex flex-col justify-center min-h-[240px]">
              <div className='absolute inset-0 opacity-10 bg-[url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmYiLz48L3N2Zz4=")] bg-repeat'></div>
              <div className="relative z-10 max-w-2xl">
                <h1 className="font-display-lg text-display-lg md:text-5xl font-bold mb-4 drop-shadow-sm">
                  Greetings of India
                </h1>
                <p className="font-body-lg text-body-lg md:text-xl text-white/90 font-medium">
                  Discover the diverse ways people say hello across the
                  subcontinent.
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-[#E2E8F0] flex items-center gap-4 hover:shadow-md transition-shadow duration-200">
                <div className="w-12 h-12 rounded-full bg-primary-container/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-2xl">
                    record_voice_over
                  </span>
                </div>
                <div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Total Greetings
                  </p>
                  <p className="font-headline-md text-headline-md font-bold text-on-surface">
                    {greetings.length}
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm border border-[#E2E8F0] flex items-center gap-4 hover:shadow-md transition-shadow duration-200">
                <div className="w-12 h-12 rounded-full bg-[#10B981]/10 flex items-center justify-center text-[#059669]">
                  <span className="material-symbols-outlined text-2xl">
                    map
                  </span>
                </div>
                <div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Regions Represented
                  </p>
                  <p className="font-headline-md text-headline-md font-bold text-on-surface">
                    {new Set(greetings.map((g) => g.region)).size}
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm border border-[#E2E8F0] flex items-center gap-4 hover:shadow-md transition-shadow duration-200">
                <div className="w-12 h-12 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center text-[#6D28D9]">
                  <span className="material-symbols-outlined text-2xl">
                    translate
                  </span>
                </div>
                <div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Languages
                  </p>
                  <p className="font-headline-md text-headline-md font-bold text-on-surface">
                    15+
                  </p>
                </div>
              </div>
            </div>

            {/* Greetings Grid Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                  Featured Greetings
                </h2>
                <div className="flex gap-2">
                  <button className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-lg hover:bg-surface-variant">
                    <span className="material-symbols-outlined">grid_view</span>
                  </button>
                  <button className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-lg hover:bg-surface-variant">
                    <span className="material-symbols-outlined">view_list</span>
                  </button>
                </div>
              </div>

              <GreetingsGrid
                greetings={filteredGreetings}
                isLoading={isLoading}
                error={error}
              />
            </div>
          </div>

          {/* Footer */}
          <footer className="bg-surface-container-high w-full py-8 mt-12 border-t border-outline-variant flex flex-col md:flex-row justify-between items-center px-container-margin rounded-lg">
            <div className="font-headline-sm text-headline-sm text-on-surface mb-4 md:mb-0">
              Namaste India
            </div>
            <div className="flex gap-6 mb-4 md:mb-0">
              <a
                className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors"
                href="#"
              >
                Privacy Policy
              </a>
              <a
                className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors"
                href="#"
              >
                Terms of Service
              </a>
              <a
                className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors"
                href="#"
              >
                Contact Us
              </a>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              © 2024 Namaste India. All Rights Reserved.
            </p>
          </footer>
        </main>
      </div>

      {/* Suggest a Greeting Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <h3 className="text-xl font-bold text-primary mb-4">
              Suggest a Greeting
            </h3>

            {suggestSuccess ? (
              <div className="text-center py-8 text-green-600">
                <span className="material-symbols-outlined text-5xl mb-2">
                  check_circle
                </span>
                <p className="font-semibold">Thank you for your suggestion!</p>
                <p className="text-sm text-gray-500">
                  It has been added to the dashboard.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSuggestSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Greeting Phrase
                  </label>
                  <input
                    type="text"
                    required
                    value={newGreeting.greeting}
                    onChange={(e) =>
                      setNewGreeting({
                        ...newGreeting,
                        greeting: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g. Kem Cho"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Region
                  </label>
                  <select
                    value={newGreeting.region}
                    onChange={(e) =>
                      setNewGreeting({ ...newGreeting, region: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="North India">North India</option>
                    <option value="South India">South India</option>
                    <option value="East India">East India</option>
                    <option value="West India">West India</option>
                    <option value="Northeast India">Northeast India</option>
                    <option value="Widespread">Widespread</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    required
                    rows="3"
                    value={newGreeting.description}
                    onChange={(e) =>
                      setNewGreeting({
                        ...newGreeting,
                        description: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Describe how and when this greeting is used..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-white font-semibold py-2 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Submit Suggestion
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
