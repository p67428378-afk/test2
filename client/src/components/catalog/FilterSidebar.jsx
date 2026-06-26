import React from "react";

export default function FilterSidebar({
  categories,
  selectedCategory,
  onSelectCategory,
  selectedSizes,
  onToggleSize,
  selectedColors,
  onToggleColor,
  priceRange,
  onPriceChange,
  selectedBrands,
  onToggleBrand,
  onClearAll,
}) {
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const colors = [
    { name: "Black", value: "#000000" },
    { name: "White", value: "#ffffff" },
    { name: "Navy", value: "#000080" },
    { name: "Emerald", value: "#50C878" },
    { name: "Rose", value: "#FF007F" },
    { name: "Beige", value: "#F5F5DC" },
  ];
  const brands = ["Aura Basic", "Luxe Denim", "Urban Knit"];

  return (
    <aside className="hidden lg:flex flex-col p-6 gap-y-stack-md bg-surface-container-low h-full w-[280px] sticky top-[100px] rounded-lg border border-outline-variant flat no shadows">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
            Filters
          </h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            Refine your selection
          </p>
        </div>
        <button
          onClick={onClearAll}
          className="font-label-md text-label-md text-primary hover:text-primary-fixed-dim transition-colors pb-0.5 bg-transparent border-none cursor-pointer"
        >
          Clear All
        </button>
      </div>

      {/* Category */}
      <div className="py-4 border-t border-outline-variant">
        <div className="flex items-center justify-between mb-3 cursor-pointer group">
          <h3 className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant">
              category
            </span>{" "}
            Category
          </h3>
        </div>
        <div className="space-y-2 ml-7">
          <label
            className={`flex items-center gap-3 cursor-pointer font-body-sm text-body-sm transition-colors ${!selectedCategory ? "text-primary font-medium" : "text-on-surface-variant hover:text-primary"}`}
          >
            <input
              type="radio"
              name="category"
              checked={!selectedCategory}
              onChange={() => onSelectCategory(null)}
              className="w-4 h-4 border-outline-variant rounded-full text-primary focus:ring-primary bg-surface-container-lowest"
            />
            All Clothing
          </label>
          {categories.map((cat) => (
            <div key={cat.id} className="space-y-1">
              <label
                className={`flex items-center gap-3 cursor-pointer font-body-sm text-body-sm transition-colors ${selectedCategory === cat.id ? "text-primary font-medium" : "text-on-surface-variant hover:text-primary"}`}
              >
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === cat.id}
                  onChange={() => onSelectCategory(cat.id)}
                  className="w-4 h-4 border-outline-variant rounded-full text-primary focus:ring-primary bg-surface-container-lowest"
                />
                {cat.name}
              </label>
              {cat.subcategories && cat.subcategories.length > 0 && (
                <div className="ml-7 space-y-1 border-l-2 border-surface-container-highest pl-4 my-1">
                  {cat.subcategories.map((sub) => (
                    <label
                      key={sub.id}
                      onClick={() => onSelectCategory(sub.id)}
                      className={`flex items-center gap-2 cursor-pointer font-body-sm text-body-sm transition-colors ${selectedCategory === sub.id ? "text-primary font-medium" : "text-on-surface-variant hover:text-primary"}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${selectedCategory === sub.id ? "bg-primary" : "bg-surface-container-highest"}`}
                      ></span>
                      {sub.name}
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Size */}
      <div className="py-4 border-t border-outline-variant">
        <h3 className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-[20px] text-on-surface-variant">
            straighten
          </span>{" "}
          Size
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {sizes.map((size) => {
            const isSelected = selectedSizes.includes(size);
            return (
              <button
                key={size}
                onClick={() => onToggleSize(size)}
                className={`w-full text-center py-2 border rounded-md font-body-sm text-body-sm transition-all cursor-pointer ${isSelected ? "bg-primary-container text-on-primary border-primary" : "border-outline-variant text-on-surface-variant hover:bg-surface-container-highest"}`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Color */}
      <div className="py-4 border-t border-outline-variant">
        <h3 className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-[20px] text-on-surface-variant">
            palette
          </span>{" "}
          Color
        </h3>
        <div className="flex flex-wrap gap-3">
          {colors.map((color) => {
            const isSelected = selectedColors.includes(color.name);
            return (
              <button
                key={color.name}
                onClick={() => onToggleColor(color.name)}
                aria-label={color.name}
                style={{ backgroundColor: color.value }}
                className={`w-8 h-8 rounded-full border border-outline-variant ring-2 ring-offset-2 transition-all cursor-pointer flex items-center justify-center ${isSelected ? "ring-primary" : "ring-transparent"}`}
              >
                {isSelected && (
                  <span
                    className={`material-symbols-outlined text-[16px] ${color.name === "White" || color.name === "Beige" ? "text-black" : "text-white"}`}
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div className="py-4 border-t border-outline-variant">
        <h3 className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-[20px] text-on-surface-variant">
            payments
          </span>{" "}
          Price Range
        </h3>
        <div className="px-2">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant font-body-sm">
                $
              </span>
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) =>
                  onPriceChange([Number(e.target.value), priceRange[1]])
                }
                className="w-full pl-6 pr-2 py-1.5 bg-surface-container-lowest border border-outline-variant rounded text-center font-body-sm text-body-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
            <span className="text-on-surface-variant">-</span>
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant font-body-sm">
                $
              </span>
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) =>
                  onPriceChange([priceRange[0], Number(e.target.value)])
                }
                className="w-full pl-6 pr-2 py-1.5 bg-surface-container-lowest border border-outline-variant rounded text-center font-body-sm text-body-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Brands */}
      <div className="py-4 border-t border-outline-variant">
        <h3 className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-[20px] text-on-surface-variant">
            check_circle
          </span>{" "}
          Brands
        </h3>
        <div className="space-y-3">
          {brands.map((brand) => {
            const isSelected = selectedBrands.includes(brand);
            return (
              <label
                key={brand}
                className="flex items-center gap-3 cursor-pointer font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors"
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggleBrand(brand)}
                  className="w-4 h-4 border-outline-variant rounded text-primary focus:ring-primary bg-surface-container-lowest"
                />
                {brand}
              </label>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
