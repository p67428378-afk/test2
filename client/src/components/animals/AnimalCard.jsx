import React from "react";
import PropTypes from "prop-types";
import Badge from "../common/Badge";
import Button from "../common/Button";
import { Compass, Heart, Info } from "lucide-react";

const AnimalCard = ({ animal, onSelect }) => {
  const { name, species, status, habitat, conservation_status, image_url } =
    animal;

  const getStatusVariant = (statusStr) => {
    switch (statusStr?.toLowerCase()) {
      case "active":
      case "healthy":
        return "success";
      case "resting":
      case "sleeping":
        return "info";
      case "treatment":
      case "sick":
        return "warning";
      default:
        return "neutral";
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col h-full">
      {/* Image / Fallback */}
      <div className="h-48 bg-slate-100 relative overflow-hidden flex items-center justify-center">
        {image_url ? (
          <img
            src={image_url}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center text-slate-400">
            <Compass className="w-12 h-12 mb-2 stroke-1" />
            <span className="text-xs">No image available</span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <Badge variant={getStatusVariant(status)}>{status}</Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-2">
          <h3 className="text-lg font-bold text-slate-800 leading-tight">
            {name}
          </h3>
          <p className="text-sm text-slate-500 italic">{species}</p>
        </div>

        {habitat && (
          <p className="text-sm text-slate-600 line-clamp-2 mb-4 flex-1">
            <span className="font-semibold text-slate-700">Habitat:</span>{" "}
            {habitat}
          </p>
        )}

        {conservation_status && (
          <div className="mb-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Conservation Status
            </span>
            <Badge
              variant={
                conservation_status.toLowerCase() === "endangered"
                  ? "error"
                  : "neutral"
              }
            >
              {conservation_status}
            </Badge>
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 flex gap-2">
          <Button
            variant="outline"
            className="flex-1 flex items-center justify-center gap-2 text-sm py-2"
            onClick={() => onSelect(animal)}
          >
            <Info className="w-4 h-4" />
            Details
          </Button>
        </div>
      </div>
    </div>
  );
};

AnimalCard.propTypes = {
  animal: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    species: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    enclosure_id: PropTypes.string.isRequired,
    habitat: PropTypes.string,
    diet: PropTypes.string,
    conservation_status: PropTypes.string,
    image_url: PropTypes.string,
    qr_code: PropTypes.string,
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default AnimalCard;
