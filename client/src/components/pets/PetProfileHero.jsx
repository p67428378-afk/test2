import React from "react";
import {
  Dog,
  Cat,
  ShieldCheck,
  Tag,
  Calendar,
  User,
  Edit3,
} from "lucide-react";

export default function PetProfileHero({ pet, onEdit }) {
  if (!pet) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-start space-x-5">
          <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-2xl shadow-inner">
            {pet.species?.toLowerCase() === "dog" ? (
              <Dog className="h-8 w-8" />
            ) : (
              <Cat className="h-8 w-8" />
            )}
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-slate-900">{pet.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 capitalize border border-blue-200">
                {pet.species}
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-0.5">
              {pet.breed || "Unknown Breed"}
            </p>
          </div>
        </div>

        {onEdit && (
          <button
            onClick={onEdit}
            className="inline-flex items-center space-x-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg transition-colors"
          >
            <Edit3 className="h-4 w-4" />
            <span>Edit Profile</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
          <span className="text-xs text-slate-500 font-medium block">
            Age & Gender
          </span>
          <span className="text-sm font-semibold text-slate-800 mt-1 block">
            {pet.age !== null ? `${pet.age} Years` : "Unknown"}{" "}
            {pet.gender ? `(${pet.gender})` : ""}
          </span>
        </div>

        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
          <span className="text-xs text-slate-500 font-medium block">
            Weight
          </span>
          <span className="text-sm font-semibold text-slate-800 mt-1 block">
            {pet.weight ? `${pet.weight} kg` : "N/A"}
          </span>
        </div>

        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
          <span className="text-xs text-slate-500 font-medium block">
            Microchip ID
          </span>
          <span className="text-sm font-semibold text-slate-800 font-mono mt-1 block">
            {pet.microchip_number || "None"}
          </span>
        </div>

        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
          <span className="text-xs text-slate-500 font-medium block">
            Owner ID
          </span>
          <span className="text-sm font-semibold text-slate-800 font-mono text-xs truncate mt-1 block">
            {pet.owner_id}
          </span>
        </div>
      </div>
    </div>
  );
}
