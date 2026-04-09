# Loan Repayment Monitoring Microservice

## Project Title & Description

This microservice is designed to automate the monitoring of loan repayment schedules, transaction history, and borrower behavior. It automatically detects missed or delayed payments, calculates appropriate penalties, determines the loan status (ON_TIME, DELAYED, or DEFAULT), and maintains a comprehensive, tamper-evident audit trail. This ensures compliance with RBI Loan Recovery Guidelines and Basel III Norms.

## Application Architecture

The application is built as a full-stack solution comprising a Python FastAPI backend and a React frontend.

-   **Backend**: Developed with FastAPI, providing RESTful APIs for managing loans, repayment schedules, transactions, penalties, and audit logs. It interacts with a PostgreSQL database.
-   **Frontend**: A React application built with Vite, consuming the backend APIs to display loan monitoring dashboards and related information.
-   **Database**: PostgreSQL is used as the primary operational data store.

### High-Level Component Diagram

```mermaid
graph TD
    A[Frontend: React App] -->|API Calls| B(Backend: FastAPI Microservice)
    B --> C(PostgreSQL Database)
    B --> D(Immutable Audit Log Store)
    E[External Systems: Core Banking, Payment Gateway] -->|Data Ingestion| B
    B --> F[External Systems: Document Service, Regulatory Reporting]
```

### Database Schema Overview

-   **Loan**: Stores core loan information (ID, borrower, amount, interest rate, term, dates, current status).
-   **RepaymentSchedule**: Details of each scheduled payment for a loan (ID, loan ID, due date, amount, status).
-   **Transaction**: Records actual payments made (ID, loan ID, payment date, amount, method).
-   **Penalty**: Stores calculated penalties (ID, loan ID, transaction ID, type, amount, date applied, reason).
-   **AuditLog**: Immutable records of all significant events and changes (ID, loan ID, event type, timestamp, entity ID, old/new state, actor, context, hash signature).

## Project Structure

```
.gitignore
README.md
requirements.txt
backend/
├── app/
│   ├── __init__.py
│   ├── config.py
│   ├── database.py
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── audit_router.py
│   │   └── loan_router.py
│   └── services/
│       ├── __init__.py
│       ├── audit_service.py
│       └── loan_service.py
└── tests/
    ├── conftest.py
    ├── test_loan_api.py
    └── test_loan_service.py
frontend/
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── src/
    ├── App.jsx
    ├── index.css
    ├── components/
    │   ├── ComplianceRadar.jsx
    │   ├── DRPanel.jsx
    │   ├── KFSPanel.jsx
    │   ├── LoanTable.jsx
    │   ├── MetricCard.jsx
    │   ├── PaymentStatusSummary.jsx
    │   ├── RepaymentTrendsChart.jsx
    │   ├── SideNavBar.jsx
    │   └── TopNavBar.jsx
    └── pages/
        └── Dashboard.jsx
```

## Prerequisites

-   Python 3.10+
-   Node.js 18+
-   npm
-   git
-   PostgreSQL database instance

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/p67428378-afk/test2.git
cd test2
```

### 2. Backend Setup

Navigate to the `backend` directory, create a virtual environment, install dependencies, and set up the database.

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

#### Database Configuration

Create a `.env` file in the `backend/app` directory with your PostgreSQL connection string:

```
# backend/app/.env
DATABASE_URL="postgresql+psycopg2://user:password@host:port/database_name"
SECRET_KEY="your-super-secret-key"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

Replace `user`, `password`, `host`, `port`, and `database_name` with your PostgreSQL credentials.

#### Run Migrations (Optional, for initial schema creation)

For simplicity in this setup, the `Base.metadata.create_all(bind=engine)` call in `main.py` will create tables on startup if they don't exist. For production, you would typically use Alembic for migrations.

#### Start the Backend Server

```bash
uvicorn backend.app.main:app --reload
```

The backend API will be available at `http://127.0.0.1:8000`.

### 3. Frontend Setup

Navigate to the `frontend` directory, install dependencies, and start the development server.

```bash
cd ../frontend
npm install
npm run dev
```

The frontend application will be available at `http://localhost:5173` (or another port if 5173 is in use).

## API Documentation

The FastAPI backend automatically generates OpenAPI (Swagger UI) documentation. Once the backend server is running, you can access it at:

-   **Swagger UI**: `http://127.0.0.1:8000/docs`
-   **ReDoc**: `http://127.0.0.1:8000/redoc`

### Key Endpoints

-   **Loans**
    -   `POST /loans/`: Create a new loan.
    -   `GET /loans/`: Get all loans.
    -   `GET /loans/{loan_id}`: Get a specific loan by ID.
    -   `POST /loans/{loan_id}/repayment-schedule`: Add a repayment schedule for a loan.
    -   `POST /loans/{loan_id}/transaction`: Record a transaction for a loan.
    -   `POST /loans/{loan_id}/check-status`: Manually trigger status check and penalty calculation for a loan.
-   **Audit**
    -   `POST /audit/`: Create an audit log entry (primarily for internal use by services).
    -   `GET /audit/`: Get all audit logs.
    -   `GET /audit/{loan_id}`: Get audit logs for a specific loan.

## Running Tests

### Backend Tests

Navigate to the `backend` directory and run pytest:

```bash
cd backend
source .venv/bin/activate # On Windows: .venv\Scripts\activate
pytest
```

### Frontend Tests

(Note: Frontend tests are not implemented in this initial version but can be added using Jest/Vitest.)

```bash
cd frontend
npm test
```

## Deployment Notes

This microservice is designed for deployment in a containerized environment using Docker and orchestrated with Kubernetes (e.g., Google Kubernetes Engine - GKE), as outlined in the High-Level Design (HLD). It leverages PostgreSQL for data persistence and integrates with centralized logging and monitoring systems.
