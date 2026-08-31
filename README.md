# Museum Tour Management System

A full-stack web application for managing guided museum tours, tour schedules, guide assignments, visitor ticket bookings with atomic capacity controls, and visitor attendance tracking.

## Features

- **Tour Schedule & Capacity Management**: Administrators create, update, and publish tour routes and schedule slots with maximum capacity limits.
- **Visitor Booking & Instant Confirmation**: Visitors browse real-time available tour slots and book tickets with instant capacity validation.
- **Guide Assignment & Conflict Resolution**: Administrators assign qualified guides while preventing overlapping schedule double-booking.
- **Attendance Tracker & Check-in Desk**: Guides and administrators record visitor check-ins on arrival and generate tour session attendance reports.

---

### Prerequisites
- Python 3.11+
- Virtual environment (`venv`)

### 1. Setup Virtual Environment & Install Dependencies
```bash
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install -r server/requirements.txt
```

### 2. Configure Environment Variables
Create a `.env` file at the root or set environment variables:
```bash
DATABASE_URL=sqlite:////tmp/museum_tours.db
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 3. Run the Backend API Server
```bash
python -m uvicorn server.main:app --reload --host 0.0.0.0 --port 8000
```
Interactive Swagger API documentation will be available at: `http://localhost:8000/docs`

### 4. Run Test Suite
```bash
pytest tests/ -v
```

---

## Full-Stack Local Development

### Starting the Backend
```bash
python -m uvicorn server.main:app --reload --host 0.0.0.0 --port 8000
```

### Starting the Frontend Client
```bash
cd client
npm install
npm run dev
```
The frontend dev server runs at `http://localhost:5173`.

---

## API Endpoints Summary

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/v1/tours` | List available tour routes |
| `POST` | `/api/v1/tours` | Create a new tour route definition |
| `GET` | `/api/v1/tours/{id}` | Retrieve tour details |
| `PUT` | `/api/v1/tours/{id}` | Update tour route details |
| `DELETE` | `/api/v1/tours/{id}` | Delete tour route |
| `GET` | `/api/v1/guides` | List tour guides |
| `POST` | `/api/v1/guides` | Register a new tour guide |
| `GET` | `/api/v1/guides/{id}` | Retrieve guide profile |
| `PUT` | `/api/v1/guides/{id}` | Update guide profile |
| `DELETE` | `/api/v1/guides/{id}` | Delete guide profile |
| `GET` | `/api/v1/schedules` | Browse published tour schedules with seat availability |
| `POST` | `/api/v1/schedules` | Create & publish tour schedule slot |
| `GET` | `/api/v1/schedules/{id}` | Retrieve schedule slot details |
| `PUT` | `/api/v1/schedules/{id}` | Update schedule details or capacity |
| `POST` | `/api/v1/schedules/{id}/assign-guide` | Assign guide with conflict overlap check |
| `GET` | `/api/v1/schedules/{id}/attendance-report` | Generate session attendance summary report |
| `GET` | `/api/v1/bookings` | List booking reservations |
| `POST` | `/api/v1/bookings` | Reserve tour tickets with atomic capacity locking |
| `GET` | `/api/v1/bookings/{id}` | Retrieve booking confirmation |
| `POST` | `/api/v1/bookings/{id}/cancel` | Cancel a booking reservation |
| `POST` | `/api/v1/attendance/check-in` | Record visitor check-in attendance |
| `GET` | `/api/v1/attendance` | List attendance check-in records |
| `GET` | `/health` | Health check endpoint |

## Server

### Prerequisites
- Python 3.9+
- pip and venv

### Setup

1. Create and activate virtual environment:
```bash
python -m venv server/.venv
# On Windows:
server\.venv\Scripts\activate
# On macOS/Linux:
source server/.venv/bin/activate
```

2. Install dependencies:
```bash
cd server
pip install -r requirements.txt
cd ..
```

### Running Tests
```bash
cd server
python -m pytest -v
cd ..
```

### Starting the Development Server
```bash
# Run from the repo root so that `from server.X` imports resolve correctly
python -m uvicorn server.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`
API documentation: `http://localhost:8000/docs`

## Full-Stack Local Development

To run both backend and frontend together locally:

### 1. Environment Setup
```bash
# Copy the example environment file
cp .env.example .env
```

### 2. Start the Backend (Terminal 1)
```bash
python -m venv server/.venv
source server/.venv/bin/activate  # On Windows: server\.venv\Scripts\activate
pip install -r server/requirements.txt
python -m uvicorn server.main:app --reload --host 0.0.0.0 --port 8000
```
Backend API: `http://localhost:8000` | API Docs: `http://localhost:8000/docs`

### 3. Start the Frontend (Terminal 2)
```bash
cd client
npm install
npm run dev
```
Frontend: `http://localhost:5173`

The frontend connects to the backend API at `http://localhost:8000` by default via the `VITE_API_BASE_URL` environment variable.

### 4. Test Credentials
If the app has authentication, the backend seeds ready-to-use accounts on startup
(idempotent). These are guaranteed logged-in-able — every activation/verification
gate (`is_active`, `is_verified`, `email_verified`, `disabled`) is set to the
permissive value, so no manual DB step is needed:
- **Regular user** — Email: `test@example.com`, Password: `testpassword`
- **Admin user** (only when the app has roles/RBAC) — Email: `admin@example.com`, Password: `adminpassword`, role: `admin`

Passwords are stored hashed with the app's own hashing utility (never in plaintext).

### Port Reference
| Service  | Port | URL                        |
|----------|------|----------------------------|
| Backend  | 8000 | http://localhost:8000      |
| Frontend | 5173 | http://localhost:5173      |
| API Docs | 8000 | http://localhost:8000/docs |

