import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Calendar, Heart } from "lucide-react";
import Badge from "../common/Badge";

export const PetCard = ({ pet }) => {
  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "available":
        return "success";
      case "pending":
        return "warning";
      case "adopted":
        return "neutral";
      default:
        return "info";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-slate-100 hover:shadow-lg transition-shadow duration-200 flex flex-col h-full">
      <div className="relative h-48 bg-slate-100 flex items-center justify-center overflow-hidden">
        {pet.photo_url ? (
          <img
            src={pet.photo_url}
            alt={pet.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-slate-400 flex flex-col items-center">
            <Heart className="w-12 h-12 mb-1 text-slate-300" />
            <span className="text-xs">No Photo Available</span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <Badge variant={getStatusVariant(pet.status)}>{pet.status}</Badge>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-slate-800">{pet.name}</h3>
          <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
            {pet.breed}
          </span>
        </div>

        <p className="text-slate-600 text-sm mb-4 line-clamp-2 flex-grow">
          {pet.description || "No description provided."}
        </p>

        <div className="space-y-2 mb-5 text-sm text-slate-500 border-t border-slate-50 pt-3">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-slate-400" />
            <span>
              Age: {pet.age} {pet.age === 1 ? "year" : "years"}
            </span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-slate-400" />
            <span>{pet.location}</span>
          </div>
        </div>

        <Link
          to={`/adopt/${pet.id}`}
          className="w-full text-center bg-indigo-600 text-white py-2 rounded-md font-medium hover:bg-indigo-700 transition-colors duration-200 block"
        >
          Adopt {pet.name}
        </Link>
      </div>
    </div>
  );
};

export default PetCard;
