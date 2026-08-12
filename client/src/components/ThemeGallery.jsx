import React from "react";
import { Palette, Check } from "lucide-react";

export default function ThemeGallery({
  selectedTheme = "antique_brass",
  onSelectTheme,
}) {
  const themes = [
    {
      id: "antique_brass",
      name: "Antique Brass",
      description:
        "Warm brass reflections, pocket watch Roman dial with golden hands.",
      bgPreview: "from-amber-950 via-stone-900 to-amber-950",
      accentBorder: "border-amber-500",
      textColor: "text-amber-200",
    },
    {
      id: "wooden_mantle",
      name: "Wooden Mantle",
      description: "Dark mahogany grain with warm ivory clock faces.",
      bgPreview: "from-amber-900 via-yellow-950 to-stone-900",
      accentBorder: "border-amber-700",
      textColor: "text-amber-100",
    },
    {
      id: "retro_neon",
      name: "Retro Neon Glow",
      description:
        "Glowing amber nixie tube aesthetics over deep dark background.",
      bgPreview: "from-slate-950 via-black to-slate-900",
      accentBorder: "border-amber-400",
      textColor: "text-amber-400",
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto bg-stone-900/90 border border-amber-500/30 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-md space-y-4">
      <div className="flex items-center gap-2 border-b border-amber-500/20 pb-3 text-amber-200">
        <Palette className="w-5 h-5 text-amber-400" />
        <h3 className="font-serif text-lg font-bold">Vintage Themes Gallery</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {themes.map((theme) => {
          const isSelected = selectedTheme === theme.id;

          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => onSelectTheme && onSelectTheme(theme.id)}
              className={`relative p-4 rounded-xl border text-left transition-all duration-300 flex flex-col justify-between space-y-3 ${
                isSelected
                  ? `bg-stone-950 border-2 ${theme.accentBorder} shadow-[0_0_20px_rgba(212,175,55,0.3)]`
                  : "bg-stone-950/60 border-stone-800 hover:border-amber-500/40 opacity-80 hover:opacity-100"
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`font-serif font-bold text-base ${theme.textColor}`}
                >
                  {theme.name}
                </span>
                {isSelected && (
                  <span className="p-1 bg-amber-500 text-stone-950 rounded-full">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>

              <div
                className={`w-full h-12 rounded-lg bg-gradient-to-r ${theme.bgPreview} border border-white/10 flex items-center justify-center font-mono text-xs ${theme.textColor}`}
              >
                10 : 42 AM
              </div>

              <p className="text-xs text-amber-200/60 font-serif leading-relaxed">
                {theme.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
