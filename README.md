# Policyholder Self-Service: Health Insurance Management

## Project Title & Description

This project implements a Policyholder Self-Service portal, enabling health insurance policyholders to securely view their current policy details, update coverage options, and initiate policy cancellations. The application aims to provide an efficient, secure, and user-friendly digital experience for managing health insurance policies.

## Application Architecture

The system adopts a microservices-oriented architecture with a clear separation of concerns between the frontend and backend services.

**Tech Stack:**
- **Backend:** Python, FastAPI, SQLAlchemy, PostgreSQL (for production), SQLite (for testing)
- **Frontend:** React (Vite), Tailwind CSS

**High-level Component Diagram:**
```mermaid
graph TD
    A[Policyholder UI (React)] -->|RESTful API Calls| B(Policy Management API)
    B --> C{Authentication/Authorization Service}
    B --> D[Business Logic]
    D --> E[Policy Database (PostgreSQL)]
    D --> F[Audit Log Database]
    D --> G[Email Notification Service]
    G --> H[External Email Provider]
```

**Communication:**
- The frontend communicates with the backend via RESTful API endpoints.
- Backend services communicate internally via direct function calls or message queues (not explicitly implemented in this initial version but part of the HLD).

**Database Schema Overview:**
- **Policyholder:** Stores personal information of policyholders.
- **Policy:** Stores details of health insurance policies, linked to a policyholder.
- **CoverageOption:** Stores details of coverage options for each policy.
- **PolicyHistory:** Logs all significant actions performed on a policy.

## Project Structure

```
.gitignore
README.md
backend/
├── __init__.py
├── database.py
├── main.py
├── models.py
├── requirements.txt
├── routers/
│   ├── __init__.py
│   └── policy.py
├── schemas.py
└── services/
    ├── __init__.py
    └── policy_service.py
frontend/
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── src/
    ├── App.css
    ├── App.jsx
    ├── components/
    │   └── PolicyDashboard.jsx
    ├── index.css
    ├── main.jsx
    └── services/
        └── policyService.js
tests/
├── conftest.py
├── __init__.py
└── test_policy_api.py
```

## Prerequisites

- Python 3.10+
- Node.js 18+
- npm
- git

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/p67428378-afk/test2.git
   cd test2
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   python -m venv .venv
   source .venv/bin/activate  # On Windows, use `.venv\Scripts\activate`
   pip install -r requirements.txt
   ```
   Create a `.env` file in the `backend/` directory with your database URL (e.g., for PostgreSQL):
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/policy_db"
   ```
   For local development with SQLite (in-memory), you can omit the `.env` file or set `DATABASE_URL="sqlite:///./test.db"`.

   **Run the backend server:**
   ```bash
   uvicorn main:app --reload
   ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   ```
   Create a `.env` file in the `frontend/` directory to point to your backend API:
   ```
   VITE_API_BASE_URL="http://localhost:8000"
   ```

   **Run the frontend development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   Open your browser to `http://localhost:5173` (or the port indicated by Vite).

## API Documentation

The backend exposes the following RESTful API endpoints:

- **`GET /policy/{policyId}`**
  - **Description:** Retrieve all details of an active health insurance policy.
  - **Response:** `PolicyResponse` object.

- **`PUT /policy/{policyId}/coverage`**
  - **Description:** Update coverage options for a policy. Changes take effect after the next billing date.
  - **Request Body:** `CoverageOptionUpdate` object.
  - **Response:** `PolicyResponse` object.

- **`DELETE /policy/{policyId}`**
  - **Description:** Initiate cancellation of a policy.
  - **Response:** `PolicyResponse` object with updated status.

## Running Tests

**Backend Tests:**
```bash
cd backend
source .venv/bin/activate # On Windows, use `.venv\Scripts\activate`
pytest
```

**Frontend Tests:**
(Not implemented in this version, but would typically use `npm test` with Jest/Vitest)

## Deployment Notes

- The application is designed for containerization using Docker and orchestration with Kubernetes (e.g., Google Kubernetes Engine).
- PostgreSQL is recommended for production databases.
- Environment variables should be managed securely (e.g., Kubernetes Secrets, GCP Secret Manager).
