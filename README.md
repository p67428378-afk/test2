# 🩺 Interactive Digital Learning Platform for 1st Year MBBS Students

An interactive web-based digital learning platform designed specifically for 1st-year MBBS medical students. The platform delivers high-resolution interactive medical images with multi-layer toggling and hotspot annotations, alongside digital learning animations with interactive in-stream quiz checkpoints across Anatomy, Physiology, and Biochemistry.

---

## 🚀 Full-Stack Local Development

### Prerequisites
- **Python**: 3.11+
- **Node.js**: 18+ & **npm**
- **Virtual Environment**: `venv` or `uv`

---

### 1. Backend Setup & Startup (Port 8000)

```bash
# Navigate to repository root
cd /path/to/repo

# Create and activate virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install backend dependencies
pip install -r server/requirements.txt

# Start FastAPI development server
uvicorn server.main:app --host 0.0.0.0 --port 8000 --reload
```

The REST API will be accessible at `http://localhost:8000`.  
Interactive API Docs (Swagger UI): `http://localhost:8000/docs`

---

### 2. Frontend Setup & Startup (Port 5173)

```bash
# Navigate to client directory
cd client

# Install frontend dependencies
npm install

# Start Vite development server
npm run dev
```

The frontend application will be accessible at `http://localhost:5173`.

---

## 🔑 Test Credentials (Pre-seeded Idempotently)

| Role | Email | Password | Access / Permissions |
| :--- | :--- | :--- | :--- |
| **Student** | `test@example.com` | `testpassword` | Full student access: modules, canvas viewer, quizzes, progress tracking |
| **Administrator** | `admin@example.com` | `adminpassword` | Administrative access to learning modules, layers, and curriculum |

---

## 🧪 Running Backend Test Suite

```bash
# Ensure virtual environment is active and run pytest
TESTING=true pytest server/tests -v --cov=server
```

---

## 🌐 API Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Service health status check |
| `POST` | `/api/v1/auth/register` | Register new student or faculty account |
| `POST` | `/api/v1/auth/login` | Authenticate and obtain JWT access token |
| `GET` | `/api/v1/auth/me` | Fetch authenticated user profile |
| `GET` | `/api/v1/modules` | List learning modules (filter by `subject=anatomy\|physiology\|biochemistry`) |
| `GET` | `/api/v1/modules/{id}` | Retrieve comprehensive module details with layers and checkpoints |
| `GET` | `/api/v1/annotations/module/{module_id}` | Retrieve multi-layer image metadata and hotspot pin coordinates |
| `GET` | `/api/v1/quizzes/module/{module_id}` | Retrieve video animation checkpoints and embedded quiz questions |
| `POST` | `/api/v1/quizzes/evaluate` | Evaluate student answer against a checkpoint question |
| `POST` | `/api/v1/progress` | Record module completion, checkpoint progress, and score |
| `GET` | `/api/v1/progress/summary` | Retrieve student dashboard performance KPIs and recent activity |

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

