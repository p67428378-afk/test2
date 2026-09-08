# Visitor Management System for Residential Communities (SCRUM-228)

Full-stack application for residential community visitor pre-approvals, QR token gate validation, courier package tracking, security alerts, recurring service passes, and overstay/parking slot monitoring.

## Tech Stack
- **Backend**: Python 3.11, FastAPI, SQLAlchemy 2.0, SQLite / PostgreSQL, PyJWT, passlib, qrcode
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, Axios

## Backend Setup & Local Development
1. Navigate to the `server` directory (or use workspace root):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r server/requirements.txt
   ```

2. Environment Variables:
   Copy `.env.example` to `.env`:
   ```bash
   DATABASE_URL=sqlite:////tmp/app.db
   JWT_SECRET_KEY=dev-secret-change-in-production
   ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
   ```

3. Run Backend Development Server:
   ```bash
   uvicorn server.main:app --reload --port 8000
   ```

4. Run Backend Tests:
   ```bash
   pytest server/tests
   ```

## Full-Stack Local Development
1. Run backend server on port 8000:
   ```bash
   uvicorn server.main:app --reload --port 8000
   ```
2. In a separate terminal, navigate to `client` and start Vite dev server on port 5173:
   ```bash
   cd client
   npm install
   npm run dev
   ```

## Test Credentials
- **Resident**: `test@example.com` / `testpassword` (Unit 4B)
- **Admin**: `admin@example.com` / `adminpassword`
- **Guard**: `guard@example.com` / `guardpassword`

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

