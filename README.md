# Health Insurance Policy Management System

## Project Title & Description

This project implements a Health Insurance Policy Management System, allowing policyholders to view, update, and cancel their health insurance policies through a dedicated portal. The system aims to provide efficient coverage management and ensure accurate, up-to-date information for policyholders.

## Application Architecture

The application follows a microservices architecture with a clear separation of concerns between the frontend and backend.

**Tech Stack:**
- **Backend:** FastAPI (Python) with SQLAlchemy and PostgreSQL.
- **Frontend:** React (Vite) with Tailwind CSS.
- **Database:** PostgreSQL.

**High-level Component Diagram:**
```mermaid
graph TD
    A[Policyholder] -->|Uses| B(Frontend Web Portal)
    B -->|REST/HTTPS| C(API Gateway)
    C -->|REST/HTTPS| D[Policy Management Service]
    C -->|REST/HTTPS| E[User Service]
    C -->|REST/HTTPS| F[Payment Service]
    D -->|JDBC/ORM| G(PostgreSQL Database)
    E -->|JDBC/ORM| G
    F -->|JDBC/ORM| G
    D -->|API/MQ| H[Existing Backend Policy Management Systems]
    E -->|API/MQ| H
    F -->|API/MQ| I[Core Banking Systems]
    D -->|Event/MQ| J[Notification Service]
    E -->|Event/MQ| J
    F -->|Event/MQ| J
    J -->|WebSockets/Push| B
```

**How Frontend and Backend Communicate:**
The frontend (React Web Portal) communicates with the backend (FastAPI services) via RESTful API calls over HTTPS. An API Gateway acts as a single entry point, routing requests to the appropriate microservices. The Notification Service can push real-time updates to the frontend using WebSockets.

**Database Schema Overview:**
- **Policy:** Stores details of health insurance policies (policy number, plan type, deductibles, premiums, dates, status, linked to policyholder).
- **PolicyHolder:** Stores policyholder personal information (name, email, phone, address).
- **Beneficiary:** Stores details of beneficiaries under a policy (name, relationship, DOB, linked to policy).
- **Claim:** Stores claim history (service date, provider, amount, status, linked to policy).
- **PaymentMethod:** Stores payment details (type, tokenized details, last four digits, expiration, linked to policyholder).

## Project Structure

```
.gitignore
README.md
requirements.txt
backend/
├── app/
│   ├── __init__.py
│   ├── api/
│   │   ├── __init__.py
│   │   └── v1/
│   │       ├── __init__.py
│   │       └── endpoints.py
│   ├── database.py
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   ├── services/
│   │   ├── __init__.py
│   │   └── policy_service.py
│   └── tests/
│       ├── __init__.py
│       ├── conftest.py
│       └── test_policies.py
frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

- `backend/`: Contains all backend-related code.
  - `app/`: The main FastAPI application.
    - `api/v1/`: API endpoints for version 1.
    - `database.py`: SQLAlchemy database configuration.
    - `main.py`: FastAPI application entry point.
    - `models.py`: SQLAlchemy ORM models.
    - `schemas.py`: Pydantic schemas for data validation and serialization.
    - `services/`: Business logic for various functionalities.
    - `tests/`: Pytest unit and integration tests for the backend.
- `frontend/`: Contains all frontend-related code.
  - `public/`: Static assets.
  - `src/`: React source code.
  - `index.html`: Main HTML file for the React application.
  - `package.json`: Frontend dependencies and scripts.
  - `postcss.config.js`, `tailwind.config.js`, `vite.config.js`: Frontend build and styling configurations.

## Prerequisites

- Python 3.10+
- Node.js 18+
- npm (Node Package Manager)
- git
- PostgreSQL (for production/development database, SQLite for testing)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/p67428378-afk/test2.git
cd test2
```

### 2. Backend Setup

```bash
# Create and activate a Python virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install backend dependencies
pip install -r requirements.txt

# Set up environment variables (create a .env file in the backend/app directory)
# Example .env content:
# DATABASE_URL="postgresql://user:password@host:port/database_name"
# If not set, it defaults to a SQLite database file named test.db

# Run database migrations (if using a persistent database)
# For development, tables are created on app startup. For production, use a migration tool like Alembic.

# Start the FastAPI backend server
uvicorn backend.app.main:app --reload
```

The backend API will be accessible at `http://127.0.0.1:8000`.

### 3. Frontend Setup

```bash
cd frontend

# Install frontend dependencies
npm install

# Start the React development server
npm run dev
```

The frontend application will typically be accessible at `http://localhost:5173` (or another port if 5173 is in use).

## API Documentation

The FastAPI backend automatically generates interactive API documentation using Swagger UI.
Once the backend server is running, navigate to:
- **Swagger UI:** `http://127.0.0.1:8000/docs`
- **ReDoc:** `http://127.0.0.1:8000/redoc`

Key API Endpoints (prefix with `/api/v1`):

- **Policy Holders:**
  - `POST /policy_holders/`: Create a new policy holder.
  - `GET /policy_holders/`: Get a list of all policy holders.
  - `GET /policy_holders/{user_id}`: Get details of a specific policy holder.
  - `PUT /policy_holders/{user_id}`: Update a policy holder's information.
  - `DELETE /policy_holders/{user_id}`: Delete a policy holder.
  - `POST /policy_holders/{user_id}/policies/`: Create a new policy for a specific policy holder.
  - `GET /policy_holders/{user_id}/policies/`: Get all policies for a specific policy holder.

- **Policies:**
  - `GET /policies/{policy_id}`: Get details of a specific policy.
  - `PUT /policies/{policy_id}`: Update a policy's information.
  - `DELETE /policies/{policy_id}`: Delete a policy.

## Running Tests

### Backend Tests

From the project root directory, with your virtual environment activated:

```bash
pytest backend/app/tests/
```

### Frontend Tests

(To be implemented)

## Deployment Notes

This application is designed for deployment on Google Cloud Platform (GCP) using Google Kubernetes Engine (GKE) for microservices orchestration, Cloud SQL for PostgreSQL, and Cloud Pub/Sub for messaging. A CI/CD pipeline should be configured for automated deployments.
