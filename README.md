# Product Recommendation System (SCRUM-244)

An intelligent e-commerce product recommendation platform enabling customers to browse products, configure personalized preferences, receive AI-driven vector similarity recommendations with custom filtering/sorting, bookmark items to a saved list, submit feedback, and review recommendation history.

---

## Architecture Overview

- **Backend**: Python 3.11, FastAPI, SQLAlchemy 2.x, SQLite (dev/test) / PostgreSQL (prod).
- **Frontend**: React 18, Vite, Tailwind CSS, Axios, Lucide React icons.

---

## Full-Stack Local Development

### 1. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Default variables:
```env
DATABASE_URL=sqlite:///./app.db
JWT_SECRET_KEY=dev-secret-change-in-production
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 2. Backend (Server) Setup & Start

Navigate to the project root and create a Python virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r server/requirements.txt
```

Run the backend development server on port `8000`:
```bash
uvicorn server.main:app --host 0.0.0.0 --port 8000 --reload
```

Run tests:
```bash
pytest
```

### 3. Frontend (Client) Setup & Start

Navigate to `client/` and install npm dependencies:
```bash
cd client
npm install
```

Start the Vite development server on port `5173`:
```bash
npm run dev
```

Run frontend tests:
```bash
npm run test
```

---

## API Endpoints Reference

| Method | Path | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Service health check |
| `GET` | `/api/v1/products` | Paginated product catalog listing with category search |
| `POST` | `/api/v1/products` | Create product in catalog |
| `GET` | `/api/v1/products/{product_id}` | Retrieve single product details |
| `POST` | `/api/v1/preferences` | Submit or update user preference profile |
| `GET` | `/api/v1/preferences/{user_id}` | Get active preference profile |
| `POST` | `/api/v1/recommendations/generate` | Generate AI recommendations with dynamic sorting and min_rating filter |
| `POST` | `/api/v1/recommendations/feedback` | Submit like/dislike feedback on a recommendation |
| `POST` | `/api/v1/recommendations/saved` | Bookmark product to saved items list (enforces 409 duplicate check) |
| `GET` | `/api/v1/recommendations/saved` | List bookmarked saved items |
| `DELETE` | `/api/v1/recommendations/saved/{saved_id}` | Remove item from saved list |
| `GET` | `/api/v1/recommendations/history` | Retrieve timestamped recommendation sessions and logs |

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

