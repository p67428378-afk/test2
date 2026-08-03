# SCRUM-645 Features

## Feature Summary
User Story: Real-Time Bus Tracking and ETA

## User Stories
# User Story: Real-Time Bus Tracking and ETA

**Description:**
As a Commuter,
I want to see the real-time location of my bus on a map and know its estimated arrival time,
So that I can better plan my journey and reduce waiting time at the bus stop.

**Acceptance Criteria:**

- **Real-Time Map Display:**
  - **Explanation:** The app must display a map (e.g., Google Maps, OpenStreetMap) showing the live location of buses for selected routes. The bus icons should move smoothly on the map, updating every 5-10 seconds.
  - **Example:** A user selects Route 72, and the map shows two buses currently active on that route, with their icons moving along the designated path.

- **Estimated Time of Arrival (ETA) Calculation:**
  - **Explanation:** For any selected bus stop, the app must display the estimated arrival times for the next two buses on that route. The ETA should be dynamic, recalculating based on the bus's current location, speed, and historical traffic data for that segment.
  - **Example:** A user taps on the "Main Street & 1st Ave" stop and sees "5 min" and "25 min" for the next two arrivals. As the first bus gets closer, the ETA updates to "4 min," "3 min," and so on.

- **Bus & Route Selection:**
  - **Explanation:** Users must be able to easily search for and select specific bus routes to view on the map. The interface should allow filtering by route number or name.
  - **Example:** A user types "14" into a search bar, and the app displays "Route 14 - Downtown Express," which the user can then select to see its active buses.

- **User-Friendly Interface (UI/UX):**
  - **Explanation:** The map interface must be intuitive, allowing users to pan, zoom, and tap on bus stops or buses for more information without clutter.
  - **Example:** A user can pinch-to-zoom on the map to get a closer look at a specific intersection and tap a bus stop icon to bring up a small card with the stop name and upcoming ETAs.

**Technical Requirements:**
- **Backend:** A robust backend system (e.g., FastAPI on GCP) capable of ingesting and processing a high volume of real-time GPS location data from bus-mounted devices.
- **Frontend:** A responsive mobile client (e.g., React Native or a web app using React/Vite) that can render the map and update bus locations and ETAs efficiently.
- **API:** A secure RESTful API will be needed to send bus location data, route information, and ETAs to the client.
- **Database:** A database (e.g., PostgreSQL) to store route information, bus stop locations, and historical transit data for ETA calculations.
- **Map Integration:** Integration with a third-party mapping service API (e.g., Google Maps API, OpenStreetMap) is required.

## Acceptance Criteria
- The app must display a map (e.g., Google Maps, OpenStreetMap) showing the live location of buses for selected routes. The bus icons should move smoothly on the map, updating every 5-10 seconds.
- For any selected bus stop, the app must display the estimated arrival times for the next two buses on that route. The ETA should be dynamic, recalculating based on the bus's current location, speed, and historical traffic data for that segment.
- Users must be able to easily search for and select specific bus routes to view on the map. The interface should allow filtering by route number or name.
- The map interface must be intuitive, allowing users to pan, zoom, and tap on bus stops or buses for more information without clutter.

## Backend Tasks
- .env.example
- server/main.py
- server/models.py
- server/schemas.py
- server/database.py
- server/api/routes.py
- server/tests/test_routes.py

## Frontend Tasks
- client/.env.example
- client/.env
- client/package.json
- client/index.html
- client/vite.config.js
- client/tailwind.config.js
- client/postcss.config.js
- client/src/index.css
- client/src/main.jsx
- client/src/setup.js
- client/src/services/api.js
- client/src/components/layout/AppLayout.jsx
- client/src/components/layout/Sidebar.jsx
- client/src/components/layout/Header.jsx
- client/src/components/map/InteractiveMap.jsx
- client/src/components/map/StopDetailCard.jsx
- client/src/components/route/RouteSelector.jsx
- client/src/components/route/RouteTimeline.jsx
- client/src/components/admin/KPIGrid.jsx
- client/src/components/admin/RouteTable.jsx
- client/src/pages/CommuterDashboard.jsx
- client/src/pages/RouteDetail.jsx
- client/src/pages/AdminDashboard.jsx

## Database Changes
**tables**:
  - {"name": "routes", "columns": [{"name": "id", "type": "UUID", "primary_key": true, "nullable": false}, {"name": "route_number", "type": "VARCHAR(10)", "nullable": false, "unique": true}, {"name": "route_name", "type": "VARCHAR(255)", "nullable": false}, {"name": "created_at", "type": "TIMESTAMP", "nullable": false, "default": "NOW()"}, {"name": "updated_at", "type": "TIMESTAMP", "nullable": false, "default": "NOW()"}]}
  - {"name": "stops", "columns": [{"name": "id", "type": "UUID", "primary_key": true, "nullable": false}, {"name": "stop_name", "type": "VARCHAR(255)", "nullable": false}, {"name": "latitude", "type": "DOUBLE PRECISION", "nullable": false}, {"name": "longitude", "type": "DOUBLE PRECISION", "nullable": false}, {"name": "created_at", "type": "TIMESTAMP", "nullable": false, "default": "NOW()"}, {"name": "updated_at", "type": "TIMESTAMP", "nullable": false, "default": "NOW()"}]}
  - {"name": "route_stops", "columns": [{"name": "route_id", "type": "UUID", "primary_key": true, "nullable": false, "foreign_key": "routes.id"}, {"name": "stop_id", "type": "UUID", "primary_key": true, "nullable": false, "foreign_key": "stops.id"}, {"name": "stop_order", "type": "INTEGER", "nullable": false}]}
  - {"name": "buses", "columns": [{"name": "id", "type": "UUID", "primary_key": true, "nullable": false}, {"name": "vehicle_id", "type": "VARCHAR(50)", "nullable": false, "unique": true}, {"name": "route_id", "type": "UUID", "nullable": false, "foreign_key": "routes.id"}, {"name": "created_at", "type": "TIMESTAMP", "nullable": false, "default": "NOW()"}, {"name": "updated_at", "type": "TIMESTAMP", "nullable": false, "default": "NOW()"}]}
  - {"name": "bus_locations", "columns": [{"name": "id", "type": "UUID", "primary_key": true, "nullable": false}, {"name": "bus_id", "type": "UUID", "nullable": false, "foreign_key": "buses.id"}, {"name": "latitude", "type": "DOUBLE PRECISION", "nullable": false}, {"name": "longitude", "type": "DOUBLE PRECISION", "nullable": false}, {"name": "timestamp", "type": "TIMESTAMP", "nullable": false, "default": "NOW()"}]}
**relationships**:
  - route_stops.route_id → routes.id (many-to-one)
  - route_stops.stop_id → stops.id (many-to-one)
  - buses.route_id → routes.id (many-to-one)
  - bus_locations.bus_id → buses.id (many-to-one)

## API Endpoints
- `GET /api/v1/routes` — Get a list of all available bus routes.
- `GET /api/v1/routes/{route_id}/stops` — Get all bus stops for a specific route.
- `GET /api/v1/routes/{route_id}/buses` — Get the real-time location of all active buses on a route.
- `GET /api/v1/stops/{stop_id}/eta` — Get the estimated arrival times for a specific stop.

## UI Components
Not yet authored.

## Test Coverage
Not yet authored.

## Deployment Notes
Not yet authored.
