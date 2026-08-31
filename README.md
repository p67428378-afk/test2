# Museum Tour Management System

A full-stack web application enabling visitors to browse and book guided museum tours with real-time seat availability, allowing administrators to manage tour schedules, assign tour guides, enforce capacity limits, and record visitor attendance.

## Features
- **Tour Schedule & Capacity Management**: Admin creation, modification, and publishing of tour routes, time slots, and visitor capacity limits.
- **Visitor Tour Booking & Instant Confirmation**: Real-time remaining seat calculation and atomic reservation processing.
- **Tour Guide Assignment & Availability Conflict Check**: Guide assignment with automatic detection of overlapping tour slots.
- **Visitor Attendance Recording & Check-in Tracker**: Check in visitors upon arrival and generate comprehensive session attendance reports.

## Tech Stack
- **Backend**: Python 3.11, FastAPI, SQLAlchemy 2.x, SQLite (dev/test) / PostgreSQL (prod), Pytest
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Axios

### 1. Prerequisites
- Python 3.11+
- Virtualenv or `venv`

### 2. Installation
```bash
cd server
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Running the Backend Server
```bash
# From the repository root or server directory
uvicorn server.main:app --host 0.0.0.0 --port 8000 --reload
```
API Documentation will be available at `http://localhost:8000/docs`.

### 4. Running Backend Tests
```bash
pytest tests/ -v --cov=server
```

## Full-Stack Local Development
1. Start the Backend server on port `8000`:
   ```bash
   uvicorn server.main:app --host 0.0.0.0 --port 8000 --reload
   ```
2. Start the Frontend dev server on port `5173`:
   ```bash
   cd client
   npm install
   npm run dev
   ```
3. Open `http://localhost:5173` in your browser.

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

