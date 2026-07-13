import React from "react";

export default function SizeSelector({ selectedSize, onChange }) {
  const sizes = [
    {
      id: "Small",
      name: "The Taster",
      chocolates: "12 artisanal chocolates",
      price: 25.0,
      discountedPrice: 22.5,
      icon: "deployed_code",
    },
    {
      id: "Medium",
      name: "The Connoisseur",
      chocolates: "24 artisanal chocolates",
      price: 45.0,
      discountedPrice: 40.5,
      icon: "view_in_ar",
      popular: true,
    },
    {
      id: "Large",
      name: "The Chocolatier",
      chocolates: "48 artisanal chocolates",
      price: 80.0,
      discountedPrice: 72.0,
      icon: "package_2",
    },
  ];

  return (
    <div>
      <h2 className="font-headline-sm text-headline-sm text-on-surface mb-6 flex items-center gap-3">
        <span className="material-symbols-outlined text-surface-tint">
          inventory_2
        </span>
        Step 1: Choose Box Size
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sizes.map((size) => {
          const isSelected = selectedSize === size.id;
          return (
            <label
              key={size.id}
              className={`relative flex flex-col p-6 rounded-xl border cursor-pointer transition-all shadow-sm ${
                isSelected
                  ? "border-primary-container bg-surface-container-highest/20 shadow-md"
                  : "border-outline-variant/30 bg-surface-container-lowest hover:border-primary-container"
              }`}
            >
              {size.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary-fixed-dim text-on-secondary-fixed-variant px-3 py-1 rounded-full font-label-sm text-label-sm shadow-sm whitespace-nowrap">
                  Most Popular
                </div>
              )}
              <input
                className="sr-only"
                name="box-size"
                type="radio"
                value={size.id}
                checked={isSelected}
                onChange={() => onChange(size.id)}
              />
              <div className="flex justify-between items-start mb-4">
                <span
                  className={`material-symbols-outlined text-3xl ${isSelected ? "text-primary-container icon-fill" : "text-surface-tint"}`}
                >
                  {size.icon}
                </span>
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                    isSelected
                      ? "border-primary-container bg-primary-container"
                      : "border-outline-variant"
                  }`}
                >
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-surface-container-lowest"></div>
                  )}
                </div>
              </div>
              <h3 className="font-label-md text-label-md text-on-surface mb-2 mt-auto">
                {size.name}
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-4 text-sm">
                {size.chocolates}
              </p>
              <div className="font-label-md text-label-md text-primary">
                ${size.discountedPrice.toFixed(2)}{" "}
                <span className="font-body-md text-body-md text-on-surface-variant text-sm font-normal">
                  / box{" "}
                  <span className="line-through text-xs ml-1">
                    ${size.price.toFixed(2)}
                  </span>
                </span>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
