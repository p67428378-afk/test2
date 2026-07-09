import React from "react";
import { Search, Filter, RotateCcw } from "lucide-react";
import Input from "../common/Input";
import Button from "../common/Button";

export const FilterSidebar = ({ filters, onChange, onReset }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...filters, [name]: value });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100 h-fit">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-800 flex items-center">
          <Filter className="w-5 h-5 mr-2 text-indigo-600" />
          Filter Pets
        </h2>
        <button
          onClick={onReset}
          className="text-sm text-slate-500 hover:text-indigo-600 flex items-center transition-colors"
        >
          <RotateCcw className="w-4 h-4 mr-1" />
          Reset
        </button>
      </div>

      <div className="space-y-4">
        <Input
          label="Breed"
          name="breed"
          value={filters.breed || ""}
          onChange={handleInputChange}
          placeholder="e.g. Golden Retriever"
        />

        <Input
          label="Age (years)"
          name="age"
          type="number"
          step="any"
          value={filters.age || ""}
          onChange={handleInputChange}
          placeholder="e.g. 2"
        />

        <Input
          label="Location"
          name="location"
          value={filters.location || ""}
          onChange={handleInputChange}
          placeholder="e.g. San Francisco"
        />
      </div>
    </div>
  );
};

export default FilterSidebar;
