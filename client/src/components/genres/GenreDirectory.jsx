import React, { useState } from "react";

const GENRE_CATALOG = [
  {
    code: "fantasy",
    display_name: "Fantasy",
    description: "Mythical, medieval, and magic-inspired character names.",
    sample: "Eldrin Shadowweaver",
    prefix_count: 40,
    base_count: 50,
    suffix_count: 30,
    sub_tags: ["High Fantasy", "Dark Fantasy", "Elven", "Dwarven"],
  },
  {
    code: "cyberpunk",
    display_name: "Cyberpunk",
    description:
      "Futuristic, high-tech, neon, and subterranean character names.",
    sample: "Kaelen Cross",
    prefix_count: 35,
    base_count: 45,
    suffix_count: 25,
    sub_tags: ["Netrunner", "Street", "Corporate", "Augmented"],
  },
  {
    code: "sci-fi",
    display_name: "Sci-Fi",
    description:
      "Interstellar, cosmic, spacefaring, and alien character names.",
    sample: "Vaelen Starstrider",
    prefix_count: 50,
    base_count: 60,
    suffix_count: 35,
    sub_tags: ["Galactic", "Alien", "Android", "Explorer"],
  },
  {
    code: "mystery",
    display_name: "Mystery",
    description: "Noir, detective, investigative, and gothic character names.",
    sample: "Arthur Pendelton",
    prefix_count: 25,
    base_count: 35,
    suffix_count: 20,
    sub_tags: ["Detective", "Victorian", "Noir", "Gothic"],
  },
  {
    code: "historical",
    display_name: "Historical",
    description:
      "Classical, epoch, ancient, and historical era character names.",
    sample: "Marcus Aurelius",
    prefix_count: 45,
    base_count: 55,
    suffix_count: 30,
    sub_tags: ["Roman", "Norse", "Feudal", "Renaissance"],
  },
  {
    code: "general",
    display_name: "General",
    description: "Versatile, contemporary, and modern character names.",
    sample: "Alex Mercer",
    prefix_count: 60,
    base_count: 70,
    suffix_count: 40,
    sub_tags: ["Modern", "Casual", "Heroic", "Neutral"],
  },
];

const GenreDirectory = ({ onSelectGenreAndNavigate }) => {
  const [selectedDetailModal, setSelectedDetailModal] = useState(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#d4e4fa]">
          Genre Reference Directory
        </h1>
        <p className="text-sm text-[#849495] mt-1">
          Explore predefined genre rules, sample outputs, and component assembly
          pools.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {GENRE_CATALOG.map((g) => (
          <div
            key={g.code}
            className="p-6 bg-[#122131] border border-[#273647] rounded-xl space-y-4 hover:border-[#3b494b] transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-[#00f0ff]">
                  {g.display_name}
                </h3>
                <span className="px-2 py-0.5 bg-[#051424] border border-[#273647] text-[10px] text-[#849495] rounded uppercase">
                  {g.code}
                </span>
              </div>
              <p className="text-xs text-[#849495] leading-relaxed">
                {g.description}
              </p>

              <div className="p-3 bg-[#051424] rounded-lg text-sm border border-[#273647]/50">
                <span className="text-[11px] text-[#849495] block mb-0.5">
                  Sample Name Output:
                </span>
                <span className="font-semibold text-[#d4e4fa]">{g.sample}</span>
              </div>

              <div className="text-xs text-[#849495]">
                <span className="text-[#00dbe9] font-semibold">
                  Component Pool:{" "}
                </span>
                {g.prefix_count + g.base_count + g.suffix_count}+ combinations
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {g.sub_tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-[#1c2b3c] text-[10px] text-[#d4e4fa] rounded-full border border-[#273647]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setSelectedDetailModal(g)}
                className="flex-1 py-2 bg-[#1c2b3c] hover:bg-[#273647] text-[#d4e4fa] font-medium text-xs rounded-lg transition-colors border border-[#273647]"
              >
                View Pool Specs
              </button>
              <button
                type="button"
                onClick={() => onSelectGenreAndNavigate(g.code)}
                className="flex-1 py-2 bg-[#273647] hover:bg-[#00f0ff] hover:text-[#00363a] font-medium text-xs rounded-lg transition-colors"
              >
                Select Genre
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Pool Specs */}
      {selectedDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="p-6 bg-[#122131] border border-[#273647] rounded-xl max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#273647] pb-3">
              <h3 className="text-lg font-bold text-[#00f0ff]">
                {selectedDetailModal.display_name} Component Pool
              </h3>
              <button
                type="button"
                onClick={() => setSelectedDetailModal(null)}
                className="text-xs text-[#849495] hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 text-sm text-[#d4e4fa]">
              <p className="text-xs text-[#849495]">
                {selectedDetailModal.description}
              </p>
              <div className="grid grid-cols-3 gap-2 text-center p-3 bg-[#051424] rounded-lg border border-[#273647]">
                <div>
                  <div className="text-xs text-[#849495]">Prefixes</div>
                  <div className="font-bold text-[#00f0ff]">
                    {selectedDetailModal.prefix_count}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[#849495]">Bases</div>
                  <div className="font-bold text-[#00f0ff]">
                    {selectedDetailModal.base_count}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[#849495]">Suffixes</div>
                  <div className="font-bold text-[#00f0ff]">
                    {selectedDetailModal.suffix_count}
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[#849495] uppercase mb-1">
                  Sub-tag Attributes
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedDetailModal.sub_tags.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-1 bg-[#1c2b3c] text-xs text-[#00dbe9] rounded border border-[#273647]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  const code = selectedDetailModal.code;
                  setSelectedDetailModal(null);
                  onSelectGenreAndNavigate(code);
                }}
                className="px-4 py-2 bg-[#00f0ff] text-[#00363a] font-bold text-xs rounded-lg hover:opacity-90"
              >
                Use {selectedDetailModal.display_name} Genre
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenreDirectory;
