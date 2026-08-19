# Household Maintenance Tracker System (SCRUM-96)

A unified digital solution to record, assign, manage costs, track deadlines, and log completions for routine and recurring home maintenance tasks.

---

## ## Server Setup & Usage

### Prerequisites
- Python 3.11+
- Virtual environment tool (`venv` or `uv`)

### 1. Backend Installation
Navigate to the repository root and set up the Python environment:

```bash
python -m venv venv
# On Linux/macOS:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

pip install -r server/requirements.txt
```

### 2. Running Tests
Run the backend pytest suite:

```bash
pytest server/tests -v
```

### 3. Starting the Backend Server
Run the FastAPI application locally:

```bash
python -m server.main
# Or using uvicorn directly:
uvicorn server.main:app --host 0.0.0.0 --port 8000 --reload
```
The API documentation will be available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

---

## ## Full-Stack Local Development

To run both the backend server and frontend client simultaneously:

### Step 1: Start Backend
In terminal 1:
```bash
source venv/bin/activate
python -m server.main
```
Backend runs on **http://localhost:8000**.

### Step 2: Start Frontend Client
In terminal 2:
```bash
cd client
npm install
npm run dev
```
Frontend development server runs on **http://localhost:5173**.

---

## ## Test Credentials & Pre-seeded Accounts

The system automatically initializes default categories and ready-to-use household accounts on startup:

| Role | Email | Password | Purpose |
|---|---|---|---|
| **Member** | `test@example.com` | `testpassword` | Default household member account for task management |
| **Admin** | `admin@example.com` | `adminpassword` | Administrative household account with user management capabilities |
| **Member** | `john@example.com` | `password123` | Additional seeded household member |
| **Member** | `alice@example.com` | `password123` | Additional seeded household member |

---

## ## Environment Variables

See `.env.example` at the repository root for configurable environment variables:
- `DATABASE_URL`: Connection string (defaults to SQLite `sqlite:///./app.db`)
- `JWT_SECRET_KEY`: Secret key for JWT token signing
- `ALLOWED_ORIGINS`: Comma-separated list of CORS allowed origins (`http://localhost:5173,http://localhost:3000`)

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

