import React from "react";

export default function TelemetryCharts({ sensorHistory = [] }) {
  // Sort history by timestamp ascending
  const sortedHistory = [...sensorHistory].sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
  );

  // Helper to generate SVG path for a given key
  const generateSvgPath = (key, minVal, maxVal, width = 500, height = 150) => {
    if (sortedHistory.length < 2) return "";
    const points = sortedHistory.map((d, idx) => {
      const x = (idx / (sortedHistory.length - 1)) * width;
      const val = d[key];
      const y = height - ((val - minVal) / (maxVal - minVal || 1)) * height;
      return `${x},${y}`;
    });
    return `M ${points.join(" L ")}`;
  };

  const temps = sortedHistory.map((d) => d.temperature);
  const hums = sortedHistory.map((d) => d.humidity);

  const minTemp = Math.min(...temps, 20);
  const maxTemp = Math.max(...temps, 40);
  const minHum = Math.min(...hums, 30);
  const maxHum = Math.max(...hums, 90);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg mb-xl">
      {/* Temperature Chart */}
      <div className="bg-surface-container p-lg rounded-xl border border-outline-variant">
        <h3 className="font-headline-md text-headline-md text-on-surface mb-md flex items-center gap-sm">
          <span className="material-symbols-outlined text-primary">
            thermostat
          </span>
          Temperature History (24h)
        </h3>
        {sortedHistory.length > 1 ? (
          <div className="relative h-48 w-full">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 500 150"
              preserveAspectRatio="none"
            >
              {/* Grid lines */}
              <line
                x1="0"
                y1="0"
                x2="500"
                y2="0"
                stroke="#2d3449"
                strokeWidth="1"
                strokeDasharray="4"
              />
              <line
                x1="0"
                y1="75"
                x2="500"
                y2="75"
                stroke="#2d3449"
                strokeWidth="1"
                strokeDasharray="4"
              />
              <line
                x1="0"
                y1="150"
                x2="500"
                y2="150"
                stroke="#2d3449"
                strokeWidth="1"
                strokeDasharray="4"
              />
              {/* Line path */}
              <path
                d={generateSvgPath("temperature", minTemp, maxTemp)}
                fill="none"
                stroke="#ffc174"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex justify-between mt-2 text-[10px] text-outline">
              <span>
                {new Date(sortedHistory[0].timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <span>
                {new Date(
                  sortedHistory[sortedHistory.length - 1].timestamp,
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center text-on-surface-variant">
            No temperature data available
          </div>
        )}
      </div>

      {/* Humidity Chart */}
      <div className="bg-surface-container p-lg rounded-xl border border-outline-variant">
        <h3 className="font-headline-md text-headline-md text-on-surface mb-md flex items-center gap-sm">
          <span className="material-symbols-outlined text-secondary">
            humidity_percentage
          </span>
          Humidity History (24h)
        </h3>
        {sortedHistory.length > 1 ? (
          <div className="relative h-48 w-full">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 500 150"
              preserveAspectRatio="none"
            >
              {/* Grid lines */}
              <line
                x1="0"
                y1="0"
                x2="500"
                y2="0"
                stroke="#2d3449"
                strokeWidth="1"
                strokeDasharray="4"
              />
              <line
                x1="0"
                y1="75"
                x2="500"
                y2="75"
                stroke="#2d3449"
                strokeWidth="1"
                strokeDasharray="4"
              />
              <line
                x1="0"
                y1="150"
                x2="500"
                y2="150"
                stroke="#2d3449"
                strokeWidth="1"
                strokeDasharray="4"
              />
              {/* Line path */}
              <path
                d={generateSvgPath("humidity", minHum, maxHum)}
                fill="none"
                stroke="#c0c1ff"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex justify-between mt-2 text-[10px] text-outline">
              <span>
                {new Date(sortedHistory[0].timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <span>
                {new Date(
                  sortedHistory[sortedHistory.length - 1].timestamp,
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center text-on-surface-variant">
            No humidity data available
          </div>
        )}
      </div>
    </div>
  );
}
