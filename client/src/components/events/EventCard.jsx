import React from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin } from "lucide-react";
import Badge from "../common/Badge";

export default function EventCard({ event, onRegisterClick }) {
  const formattedDate = new Date(event.date_time).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const defaultImage =
    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=600&q=80";

  return (
    <article className="bg-surface-container-lowest rounded-lg shadow-[0_4px_12px_rgba(15,23,42,0.05)] hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)] hover:-translate-y-0.5 transition-all duration-300 overflow-hidden flex flex-col border border-outline-variant/20">
      <div className="relative w-full aspect-video bg-surface-container-low overflow-hidden">
        <img
          className="w-full h-full object-cover"
          src={event.image_url || defaultImage}
          alt={event.title}
          onError={(e) => {
            e.target.src = defaultImage;
          }}
        />
        <div className="absolute top-4 left-4">
          <Badge category={event.category} />
        </div>
      </div>
      <div className="p-lg flex flex-col gap-sm flex-grow">
        <h3 className="font-headline-sm text-headline-sm text-on-background font-bold line-clamp-2">
          {event.title}
        </h3>
        <div className="flex items-center gap-2 text-on-surface-variant font-label-md mt-2">
          <Calendar className="w-[18px] h-[18px] text-on-surface-variant" />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center gap-2 text-on-surface-variant font-label-md">
          <MapPin className="w-[18px] h-[18px] text-on-surface-variant" />
          <span>{event.location}</span>
        </div>
        <div className="mt-auto pt-md flex items-center justify-between gap-4">
          <Link
            className="text-[#0D9488] font-label-md font-bold hover:underline"
            to={`/events/${event.id}`}
          >
            View Details
          </Link>
          <button
            onClick={() => onRegisterClick(event)}
            className="bg-primary-container text-on-primary px-4 py-2 rounded-md font-label-md font-bold hover:bg-surface-tint transition-colors active:scale-95"
          >
            Register Now
          </button>
        </div>
      </div>
    </article>
  );
}
