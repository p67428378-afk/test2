# Board Game Scorer

A full-stack web application designed for board game enthusiasts to create game sessions, register players, enter scores per round or category, automatically tally final points, and view a dynamic leaderboard declaring the winner(s).

## Features
- **Game Session Management:** Create and track multiple board game sessions.
- **Player Management:** Add and manage participating players per session before or during scoring.
- **Score Tracking & Tallying:** Record points across rounds or categories with automated real-time aggregation.
- **Leaderboard & Winner Declaration:** Ranks players by total score from highest to lowest and highlights the winner (including co-winner tie handling).

---

## Architecture & Tech Stack
- **Backend:** Python 3.11, FastAPI, SQLAlchemy 2.x, Pydantic v2, SQLite / PostgreSQL
- **Frontend:** React 18, Vite, Tailwind CSS, Axios, Lucide React

---

### 1. Prerequisites
- Python 3.11+
- virtualenv / uv

### 2. Virtual Environment & Dependencies
```bash
cd server
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Environment Variables
Create a `.env` file in the root or server directory based on `.env.example`:
```bash
DATABASE_URL=sqlite:///./app.db
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 4. Running the Server
```bash
uvicorn server.main:app --host 0.0.0.0 --port 8000 --reload
```
API Documentation will be available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### 5. Running Tests
```bash
pytest server/tests/ -v
```

---

## Full-Stack Local Development
1. Start the FastAPI backend on port `8000`:
   ```bash
   uvicorn server.main:app --host 0.0.0.0 --port 8000 --reload
   ```
2. Start the Vite React frontend on port `5173`:
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

