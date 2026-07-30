import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { MapPin, Navigation, Compass, AlertTriangle, Info } from "lucide-react";
import Button from "../common/Button";

const InteractiveMap = ({
  enclosures = [],
  facilities = [],
  paths = [],
  onSelectEnclosure,
}) => {
  const [visitorLocation, setVisitorLocation] = useState(null);
  const [gpsError, setGpsError] = useState(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Track online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Get visitor location
  const getVisitorLocation = () => {
    if (!navigator.geolocation) {
      setGpsError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Map real GPS coordinates to our 0-100 map grid coordinates
        // For demo purposes, we generate random coordinates within our grid
        const mockX = 30 + Math.random() * 40;
        const mockY = 30 + Math.random() * 40;
        setVisitorLocation({ x: mockX, y: mockY });
        setGpsError(null);
      },
      (error) => {
        console.error("Error getting location:", error);
        setGpsError("GPS signal unavailable. Using static map fallback.");
        // Fallback to center of map
        setVisitorLocation({ x: 50, y: 50 });
      },
    );
  };

  useEffect(() => {
    getVisitorLocation();
  }, []);

  return (
    <div className="flex flex-col h-full bg-slate-50 rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Map Header / Controls */}
      <div className="p-4 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-primary" />
          <span className="font-semibold text-slate-800">
            Zoo Interactive Map
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isOffline && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
              <AlertTriangle className="w-3 h-3" /> Offline Mode
            </span>
          )}
          {gpsError && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
              Static Fallback
            </span>
          )}
          <Button
            variant="outline"
            className="flex items-center gap-2 text-xs py-1.5 px-3"
            onClick={getVisitorLocation}
          >
            <Navigation className="w-3.5 h-3.5" />
            Locate Me
          </Button>
        </div>
      </div>

      {/* Map Canvas Area */}
      <div className="flex-1 relative min-h-[400px] bg-emerald-50/30 p-6 flex items-center justify-center overflow-auto">
        {/* Grid Map Container */}
        <div className="relative w-[600px] h-[400px] bg-emerald-100/40 border-2 border-dashed border-emerald-200 rounded-2xl shadow-inner overflow-hidden flex-shrink-0">
          {/* Paths SVG Layer */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {paths.map((path, idx) => {
              const pointsStr = path.points
                .map((p) => `${(p[0] / 100) * 600},${(p[1] / 100) * 400}`)
                .join(" ");
              return (
                <polyline
                  key={path.id || idx}
                  points={pointsStr}
                  fill="none"
                  stroke="#CBD5E1"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-60"
                />
              );
            })}
          </svg>

          {/* Enclosures Pins */}
          {enclosures.map((enc) => (
            <button
              key={enc.id}
              onClick={() => onSelectEnclosure(enc)}
              className="absolute group flex flex-col items-center -translate-x-1/2 -translate-y-1/2 transition-transform duration-150 hover:scale-110 focus:outline-none"
              style={{
                left: `${enc.location_x}%`,
                top: `${enc.location_y}%`,
              }}
            >
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-md border-2 border-white">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="mt-1 px-2 py-0.5 bg-slate-900/90 text-white text-[10px] font-semibold rounded shadow-sm whitespace-nowrap opacity-80 group-hover:opacity-100 transition-opacity">
                {enc.name}
              </span>
            </button>
          ))}

          {/* Facilities Pins */}
          {facilities.map((fac) => (
            <div
              key={fac.id}
              className="absolute flex flex-col items-center -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${fac.location_x}%`,
                top: `${fac.location_y}%`,
              }}
            >
              <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-sm border border-white">
                <span className="text-[10px] font-bold">
                  {fac.type?.substring(0, 1).toUpperCase()}
                </span>
              </div>
              <span className="mt-0.5 px-1.5 py-0.5 bg-slate-700/80 text-white text-[8px] rounded whitespace-nowrap">
                {fac.name}
              </span>
            </div>
          ))}

          {/* Visitor Current Location Pin */}
          {visitorLocation && (
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
              style={{
                left: `${visitorLocation.x}%`,
                top: `${visitorLocation.y}%`,
              }}
            >
              <div className="relative flex items-center justify-center">
                <div className="absolute w-8 h-8 bg-sky-400 rounded-full animate-ping opacity-75"></div>
                <div className="w-5 h-5 bg-sky-500 rounded-full border-2 border-white shadow-md flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <span className="absolute top-6 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-sky-600 text-white text-[8px] font-bold rounded shadow-sm whitespace-nowrap">
                You
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Map Legend */}
      <div className="p-4 bg-white border-t border-slate-200 flex flex-wrap gap-4 text-xs text-slate-600">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-primary"></div>
          <span>Enclosure</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          <span>Facility (R = Restroom, F = Food, etc.)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-sky-500"></div>
          <span>Your Location</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-1 bg-slate-300"></div>
          <span>Walking Path</span>
        </div>
      </div>
    </div>
  );
};

InteractiveMap.propTypes = {
  enclosures: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      location_x: PropTypes.number.isRequired,
      location_y: PropTypes.number.isRequired,
      description: PropTypes.string,
    }),
  ),
  facilities: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      location_x: PropTypes.number.isRequired,
      location_y: PropTypes.number.isRequired,
    }),
  ),
  paths: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      points: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
    }),
  ),
  onSelectEnclosure: PropTypes.func.isRequired,
};

export default InteractiveMap;
