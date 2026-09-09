# Product Recommendation System (SCRUM-244)

An intelligent e-commerce product recommendation platform featuring catalog browsing, user preference capturing, content vector-based AI recommendations, and interactive feedback loops.

---

## Architecture & Features

- **Product Catalog Service**: Browse, search, filter by category, and paginate through products.
- **User Preference Engine**: Capture and persist user interest categories, price bounds, and feature tags.
- **AI Recommendation Engine**: Score candidate products against preference vectors using weighted category, price, tag matching, and dynamic feedback adjustments.
- **Interactive Feedback System**: Record user `like` / `dislike` responses on recommendations to continuously adapt user scoring profiles.
- **RESTful API**: Built with FastAPI, Pydantic v2, and SQLAlchemy 2.x.

---

### 1. Prerequisites
- Python 3.11+
- Virtual environment (`venv`)

### 2. Environment Configuration
Copy the `.env.example` file to create your `.env`:
```bash
cp .env.example .env
```

### 3. Installation
Create and activate a virtual environment, then install dependencies:
```bash
python -m venv .venv
# On macOS/Linux:
source .venv/bin/activate
# On Windows:
.venv\Scripts\activate

pip install -r server/requirements.txt
```

### 4. Running the Backend Server
Start the development server with Uvicorn:
```bash
uvicorn server.main:app --host 0.0.0.0 --port 8000 --reload
```
Interactive API docs will be available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### 5. Running Backend Tests
Execute the pytest suite:
```bash
pytest server/tests -v
```

---

## Full-Stack Local Development

### Starting Both Backend & Frontend
1. **Start Backend (Port 8000)**:
   ```bash
   uvicorn server.main:app --host 0.0.0.0 --port 8000 --reload
   ```
2. **Start Frontend (Port 5173)**:
   ```bash
   cd client
   npm install
   npm run dev
   ```
3. Open `http://localhost:5173` in your browser.

---

## API Summary

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/products` | Paginated product catalog with category and search filters |
| `GET` | `/api/v1/products/{id}` | Get product details by ID |
| `POST` | `/api/v1/preferences` | Create or update user preference profile |
| `GET` | `/api/v1/preferences/{user_id}` | Fetch active user preferences |
| `POST` | `/api/v1/recommendations/generate` | Generate AI-driven product recommendations |
| `POST` | `/api/v1/recommendations/feedback` | Submit like/dislike feedback for a recommendation |
| `GET` | `/health` | Service health check |

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

