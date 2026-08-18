import React from "react";
import { Plus, Trash2 } from "lucide-react";

export default function IngredientInputList({ ingredients = [], onChange }) {
  const handleItemChange = (index, field, value) => {
    const updated = [...ingredients];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleAddRow = () => {
    onChange([...ingredients, { name: "", quantity: "", unit: "" }]);
  };

  const handleRemoveRow = (index) => {
    const updated = ingredients.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-gray-700">
          Ingredients List
        </label>
        <button
          type="button"
          onClick={handleAddRow}
          className="text-xs bg-[#e05929]/10 text-[#e05929] hover:bg-[#e05929]/20 font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Ingredient
        </button>
      </div>

      {ingredients.length === 0 ? (
        <p className="text-xs text-gray-400 italic">
          No ingredients added yet. Click above to add rows.
        </p>
      ) : (
        <div className="space-y-2">
          {ingredients.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={item.quantity || ""}
                onChange={(e) =>
                  handleItemChange(index, "quantity", e.target.value)
                }
                placeholder="Qty (e.g. 2)"
                className="w-24 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#e05929]"
              />
              <input
                type="text"
                value={item.unit || ""}
                onChange={(e) =>
                  handleItemChange(index, "unit", e.target.value)
                }
                placeholder="Unit (e.g. cups)"
                className="w-28 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#e05929]"
              />
              <input
                type="text"
                value={item.name || ""}
                onChange={(e) =>
                  handleItemChange(index, "name", e.target.value)
                }
                placeholder="Ingredient Name (e.g. Flour)"
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#e05929]"
                required
              />
              <button
                type="button"
                onClick={() => handleRemoveRow(index)}
                className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition"
                title="Remove ingredient"
                aria-label="Remove ingredient"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
