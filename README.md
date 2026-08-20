# 🐝 Smart Beehive Monitoring System & Analytics Dashboard

A full-stack beehive monitoring and management application for beekeepers and apiary managers to track real-time telemetry (temperature, humidity, weight), log honey production, estimate bee population, manage disease reports and health alerts, schedule field inspections, and analyze seasonal trends.

---

## ## Server (Backend Setup)

The backend is built with **FastAPI**, **SQLAlchemy 2.x**, and **SQLite/PostgreSQL**.

### Prerequisites
- Python 3.11+
- Virtual environment tool (`venv` or `uv`)

### Setup & Installation
1. Navigate to the `server/` directory:
   ```bash
   cd server
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### Running the Development Server
Start the FastAPI application on `http://localhost:8000`:
```bash
uvicorn server.main:app --reload --port 8000
```
Interactive API documentation will be available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Running Backend Tests
Execute unit and integration tests using `pytest`:
```bash
pytest server/tests -v
```

---

## Full-Stack Local Development

### Running Backend & Frontend Together
1. **Start Backend**:
   ```bash
   cd server
   uvicorn server.main:app --reload --port 8000
   ```
2. **Start Frontend**:
   ```bash
   cd client
   npm install
   npm run dev -- --port 5173
   ```
   Open `http://localhost:5173` in your browser.

---

## API Summary
- `GET /api/v1/apiaries` & `POST /api/v1/apiaries` - Apiary site management
- `GET /api/v1/hives` & `POST /api/v1/hives` - Beehive inventory & population tracking
- `POST /api/v1/telemetry` & `GET /api/v1/telemetry` - Real-time temperature, humidity, weight telemetry ingestion & history
- `GET /api/v1/harvests` & `POST /api/v1/harvests` - Honey harvest yield logging & batch tracking
- `GET /api/v1/diseases/reports` & `POST /api/v1/diseases/reports` - Disease & pest detection reports with automated health alerts
- `GET /api/v1/inspections` & `POST /api/v1/inspections` - Field inspection scheduling & checklist activity logs
- `GET /api/v1/analytics/seasonal` - Aggregated seasonal yield trends, temperature/humidity curves, and population estimates

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

