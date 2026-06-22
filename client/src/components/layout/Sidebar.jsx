import React from "react";

const REGIONS = [
  { id: "All", name: "All Regions", icon: "map" },
  { id: "North India", name: "North India", icon: "location_on" },
  { id: "South India", name: "South India", icon: "explore" },
  { id: "East India", name: "East India", icon: "terrain" },
  { id: "West India", name: "West India", icon: "waves" },
  { id: "Northeast India", name: "Northeast India", icon: "landscape" },
  { id: "Widespread", name: "Widespread", icon: "public" },
];

const LANGUAGES = ["Hindi", "Tamil", "Punjabi", "Bengali", "Urdu", "Marathi"];

export default function Sidebar({
  selectedRegion,
  setSelectedRegion,
  selectedLanguages,
  setSelectedLanguages,
}) {
  const handleLanguageChange = (lang) => {
    if (selectedLanguages.includes(lang)) {
      setSelectedLanguages(selectedLanguages.filter((l) => l !== lang));
    } else {
      setSelectedLanguages([...selectedLanguages, lang]);
    }
  };

  return (
    <aside className="w-[280px] h-screen sticky left-0 overflow-y-auto border-r border-outline-variant bg-surface-container-low shadow-sm hidden md:flex flex-col gap-base p-gutter">
      <div className="mb-6">
        <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-1">
          Filters
        </h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Explore Heritage
        </p>
      </div>

      {/* Filter by Region */}
      <div className="mb-8">
        <h3 className="font-label-md text-label-md text-on-surface-variant uppercase mb-3">
          Filter by Region
        </h3>
        <ul className="flex flex-col gap-2">
          {REGIONS.map((region) => {
            const isActive = selectedRegion === region.id;
            return (
              <li key={region.id}>
                <button
                  onClick={() => setSelectedRegion(region.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-left ${
                    isActive
                      ? "text-primary font-bold bg-primary-container/10"
                      : "text-on-surface-variant hover:bg-surface-variant"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined ${isActive ? "text-primary" : ""}`}
                  >
                    {region.icon}
                  </span>
                  {region.name}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Filter by Language */}
      <div className="mb-8">
        <h3 className="font-label-md text-label-md text-on-surface-variant uppercase mb-3">
          Filter by Language
        </h3>
        <div className="flex flex-col gap-3">
          {LANGUAGES.map((lang) => (
            <label
              key={lang}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selectedLanguages.includes(lang)}
                onChange={() => handleLanguageChange(lang)}
                className="rounded border-[#E2E8F0] text-[#FF9933] focus:ring-[#FF9933]"
              />
              <span className="text-body-sm text-on-surface group-hover:text-primary transition-colors">
                {lang}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Cultural Trivia */}
      <div className="mt-auto bg-[#FFFBEB] border border-dashed border-[#F59E0B] rounded-lg p-4">
        <div className="flex items-start gap-2 text-[#D97706]">
          <span className="material-symbols-outlined text-lg mt-0.5">
            lightbulb
          </span>
          <p className="font-trivia-text text-trivia-text text-[#B45309]">
            <strong>Did you know?</strong> The word Namaste comes from Sanskrit
            and means "I bow to the divine in you."
          </p>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-outline-variant flex flex-col gap-2">
        <a
          className="flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:text-primary transition-colors duration-200"
          href="#"
        >
          <span className="material-symbols-outlined text-lg">help</span>
          <span className="font-body-sm text-body-sm">Help</span>
        </a>
        <a
          className="flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:text-primary transition-colors duration-200"
          href="#"
        >
          <span className="material-symbols-outlined text-lg">settings</span>
          <span className="font-body-sm text-body-sm">Settings</span>
        </a>
      </div>
    </aside>
  );
}
