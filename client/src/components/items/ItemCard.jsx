import React from "react";
import { MapPin, Calendar, Tag, CheckCircle, HelpCircle } from "lucide-react";
import Badge from "../common/Badge.jsx";
import Button from "../common/Button.jsx";

export default function ItemCard({
  item,
  onClaim,
  onViewMatches,
  currentUserId,
}) {
  const isLost = item.status === "reported_lost";
  const isReporter = item.user_id === currentUserId;

  return (
    <div className="glass-card rounded-xl p-5 flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <Badge variant={isLost ? "danger" : "success"}>
            {isLost ? "Lost" : "Found"}
          </Badge>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {item.item_date}
          </span>
        </div>

        {/* Image */}
        {item.images && item.images.length > 0 && (
          <div className="w-full h-40 rounded-lg overflow-hidden mb-4 border border-slate-800">
            <img
              src={item.images[0].image_url}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Title & Description */}
        <h4 className="text-lg font-semibold text-white mb-1 truncate">
          {item.name}
        </h4>
        <p className="text-sm text-slate-400 mb-4 line-clamp-2 h-10">
          {item.description || "No description provided."}
        </p>

        {/* Details */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Tag className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="truncate">Category: {item.category}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="truncate">Location: {item.location_text}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2 border-t border-slate-800/50">
        {isLost && isReporter && onViewMatches && (
          <Button
            onClick={() => onViewMatches(item)}
            variant="primary"
            className="w-full text-xs py-1.5"
          >
            <HelpCircle className="w-4 h-4" />
            View Matches
          </Button>
        )}
        {!isLost && !isReporter && onClaim && (
          <Button
            onClick={() => onClaim(item)}
            variant="success"
            className="w-full text-xs py-1.5"
          >
            <CheckCircle className="w-4 h-4" />
            Claim Item
          </Button>
        )}
      </div>
    </div>
  );
}
