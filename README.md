# Parking Fine Management System - Backend (`server/`)

Production-ready RESTful API service built with Python 3.11, FastAPI, SQLAlchemy 2.x, and PostgreSQL / SQLite.

## Features
- **Public Citation Lookup**: Search parking fines by license plate or citation reference number.
- **Payment Status Verification**: Real-time status checks with dynamic overdue status transitions and penalty calculation.
- **Admin Fine Management (CRUD)**: Issue new fines, update fine details/payment status, and void citations with administrative justification notes.
- **Audit Logging**: Automatic recording of administrative actions in an audit log.
- **Role-Based Access Control (RBAC)**: Public endpoints accessible without authentication; administrative endpoints protected via JWT with `admin` role claim.

---

### 1. Environment & Dependencies
Python 3.11 is required.
```bash
cd server
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Environment Variables
Environment variables can be set via `.env` or system environment:
- `DATABASE_URL`: Connection string (Default: `sqlite:///./app.db`)
- `JWT_SECRET_KEY`: Secret key for JWT signing (Default: `dev-secret-change-in-production`)
- `ALLOWED_ORIGINS`: Comma-separated list of allowed CORS origins (Default: `http://localhost:5173,http://localhost:3000`)

### 3. Start Development Server
```bash
cd server
uvicorn main:app --reload --port 8000
```
The API documentation is available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### 4. Running Tests
```bash
cd server
pytest -v
```

---

## Full-Stack Local Development

To run the complete system locally:

1. **Backend Server** (Port 8000):
   ```bash
   cd server
   uvicorn main:app --reload --port 8000
   ```

2. **Frontend Client** (Port 5173):
   ```bash
   cd client
   npm install
   npm run dev
   ```

3. **Test Credentials**:
   - **Admin Portal**: `admin@example.com` / `adminpassword`
   - **User Account**: `test@example.com` / `testpassword`

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

