# Email Classification System — Backend API

FastAPI-powered backend service for the **Email Classification System** (`SCRUM-256`).
Provides automated parsing for email text and file uploads (`.eml`, `.txt`, `.pdf`), AI classification into categories (`Work`, `Personal`, `Urgent`, `Promotional`), confidence scoring, and review/override management.

---

## 1. Features
- **Email Ingestion**: Ingests direct text submissions and parses RFC 822 `.eml`, `.txt`, and `.pdf` files.
- **AI Categorization Engine**: Classifies emails into `Work`, `Personal`, `Urgent`, `Promotional` with probabilistic confidence scores (0–100%).
- **Interactive Review & Override**: Persists original AI categories while supporting manual user overrides.
- **Filtering & Search**: Full pagination, keyword search across subject/body/sender, and category/confidence score filtering.
- **Full Test Suite**: High test coverage using `pytest` and in-memory SQLite isolation with `StaticPool`.

---

## 2. Tech Stack
- **Framework**: FastAPI (Python 3.11)
- **Database / ORM**: PostgreSQL / SQLite (tests), SQLAlchemy 2.x
- **File Parsing**: `email` (RFC 822), `pypdf`, UTF-8 text processing
- **Test Runner**: `pytest` + `httpx`

---

## 3. Environment Variables
Create a `.env` file based on `.env.example`:
```ini
# Database connection string
DATABASE_URL=sqlite:///./email_classification.db

# Allowed CORS origins (comma-separated)
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Secret key
JWT_SECRET_KEY=dev-secret-change-in-production
```

---

## 4. Local Setup & Running

### Step 1: Create and Activate Virtual Environment
```bash
python -m venv .venv
# On Linux/macOS:
source .venv/bin/activate
# On Windows:
.venv\Scripts\activate
```

### Step 2: Install Dependencies
```bash
pip install -r server/requirements.txt
```

### Step 3: Run the Development Server
Always start the server from the **repository root**:
```bash
python -m uvicorn server.main:app --reload --host 0.0.0.0 --port 8000
```
- Interactive API Docs (Swagger UI): `http://localhost:8000/docs`
- ReDoc Docs: `http://localhost:8000/redoc`

---

## 5. Running Tests
Run pytest across all backend test modules:
```bash
pytest server/tests -v
```

---

## 6. API Reference

| Method | Endpoint | Description | Status Code |
|---|---|---|---|
| `POST` | `/api/v1/emails/classify` | Classify email via JSON payload or file upload (`.eml`, `.txt`, `.pdf`) | `201 Created` |
| `GET` | `/api/v1/emails` | List classified emails with filters (`category`, `min_confidence`, `search`, `skip`, `limit`) | `200 OK` |
| `GET` | `/api/v1/emails/{id}` | Retrieve single email details and classification | `200 OK` |
| `PATCH` | `/api/v1/emails/{id}` | Override AI category (`Work`, `Personal`, `Urgent`, `Promotional`) | `200 OK` |
| `DELETE` | `/api/v1/emails/{id}` | Delete an email and its classification record | `204 No Content` |
| `GET` | `/health` | Service health status check | `200 OK` |

---

## 7. Full-Stack Local Development
To run both backend and frontend concurrently:
1. **Backend**:
   ```bash
   python -m uvicorn server.main:app --reload --host 0.0.0.0 --port 8000
   ```
2. **Frontend** (in `client/` directory):
   ```bash
   cd client
   npm install
   npm run dev
   ```
   Frontend runs at `http://localhost:5173` and connects to backend at `http://localhost:8000`.
