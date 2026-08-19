# EB Maintenance Tracker

An Electricity Board Maintenance Tracker web application allowing users to create maintenance tasks, assign technicians, track estimated vs. actual costs, manage deadlines, and update task statuses to completion.

## 🚀 Tech Stack

- **Backend**: Python 3.11, FastAPI, SQLAlchemy 2.x, SQLite (dev/tests) / PostgreSQL (prod), Pydantic v2
- **Frontend**: React 18, Vite, Tailwind CSS, Axios, Lucide React
- **Testing**: pytest (backend)

---

## 🛠️ Server Setup & Development

### 1. Prerequisites
- Python 3.11+

### 2. Installation & Setup
```bash
# Navigate to repository root
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install backend dependencies
pip install -r server/requirements.txt
```

### 3. Environment Configuration
Create a `.env` file at the repository root or set environment variables:
```env
DATABASE_URL=sqlite:///./eb_maintenance.db
JWT_SECRET_KEY=dev-secret-change-in-production
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 4. Running the Development Server
```bash
# Start FastAPI server on port 8000
uvicorn server.main:app --reload --host 0.0.0.0 --port 8000
```
Interactive API documentation will be available at [http://localhost:8000/docs](http://localhost:8000/docs).

### 5. Running Tests
```bash
pytest server/tests
```

---

## 💻 Full-Stack Local Development

### Running Frontend
```bash
cd client
npm install
npm run dev
```
The Vite development server runs on [http://localhost:5173](http://localhost:5173).

---

## 🔑 Pre-Seeded Test Accounts

The backend automatically creates the following test accounts upon startup:

| Account Type | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| **Regular User / Manager** | `test@example.com` | `testpassword` | `Manager` |
| **Administrator** | `admin@example.com` | `adminpassword` | `Admin` |
| **Technician** | `john.doe@eb.gov` | `techpassword` | `Technician` |

---

## 📡 Key API Endpoints

- `POST /api/v1/tasks` - Record a new maintenance task
- `GET /api/v1/tasks` - List maintenance tasks (supports `skip`, `limit`, `status`, `priority`, `assigned_to_id` filters)
- `GET /api/v1/tasks/{id}` - Get maintenance task details
- `PUT /api/v1/tasks/{id}` - Update maintenance task
- `PUT /api/v1/tasks/{id}/assign` - Assign task to a technician
- `PUT /api/v1/tasks/{id}/complete` - Mark task completed with actual cost & resolution notes
- `DELETE /api/v1/tasks/{id}` - Delete maintenance task
- `GET /api/v1/technicians` - List active technicians
- `GET /api/v1/costs/summary` - Get aggregated cost metrics

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

