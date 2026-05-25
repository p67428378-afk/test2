# Credit Card Application Platform

## Project Title & Description

This project implements a Credit Card Application Platform, allowing users to browse available credit cards and apply for them online. The platform securely collects personal, financial, and employment information from applicants, validates the data, and stores it. It is designed to be a user-friendly, responsive web application with a robust backend.

## Application Architecture

The system follows a **Microservices Architecture** with a clear separation of concerns between the frontend and backend.

**Tech Stack:**
- **Backend:** Python, FastAPI, SQLAlchemy, PostgreSQL
- **Frontend:** React (Vite), Tailwind CSS, React Router DOM

**High-level Component Diagram:**
```mermaid
graph LR
    User[Credit Card Applicant] -- Access UI --> Frontend[Frontend Application (React)];
    Frontend -- API Calls (REST/HTTPS) --> Backend[Backend Microservices (FastAPI)];
    Backend -- Read/Write Application Data --> Database[Application Database (PostgreSQL)];
    Backend -- Upload/Retrieve Account Statements --> DocumentStorage[Document Storage (Cloud Storage - Placeholder)];
    Backend -- Credit Score Check --> ExternalCreditBureau[External Credit Bureau API];
    Backend -- Bank Account Verification --> ExternalBankVerification[External Bank Verification API];
```

**Communication:**
- The frontend communicates with the backend via RESTful API endpoints over HTTPS.
- The backend interacts with a PostgreSQL database and external APIs for credit checks and bank verification.

**Database Schema Overview:**
- **Applicant:** Stores personal details (`applicant_id`, `user_id`, `full_name`, `address`, `phone_number`, `email_address`, `date_of_birth`).
- **Application:** Stores application details (`application_id`, `applicant_id`, `credit_card_product_id`, `submission_date`, `status`, `last_updated`).
- **FinancialInfo:** Stores financial details (`financial_info_id`, `application_id`, `annual_income`, `credit_score`, `account_statement_document_id`).
- **EmploymentInfo:** Stores employment details (`employment_info_id`, `application_id`, `employer_name`, `employer_address`, `job_title`, `employment_start_date`).

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
│   ├── applicants.py
│   └── applications.py
├── schemas.py
├── services.py
frontend/
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── src/
    ├── App.jsx
    ├── index.css
    ├── main.jsx
    └── pages/
        ├── ApplicationForm.jsx
        ├── ConfirmationPage.jsx
        └── CreditCardList.jsx
tests/
├── conftest.py
├── test_applicants.py
├── test_applications.py
└── test_main.py
```

- `backend/`: Contains the FastAPI application.
  - `database.py`: SQLAlchemy engine and session setup.
  - `models.py`: SQLAlchemy ORM models.
  - `schemas.py`: Pydantic schemas for data validation and serialization.
  - `services.py`: Business logic for interacting with the database.
  - `routers/`: FastAPI APIRouters for different modules.
  - `main.py`: Main FastAPI application instance, includes routers.
  - `requirements.txt`: Python dependencies.
- `frontend/`: Contains the React application.
  - `index.html`: Main HTML file.
  - `package.json`: Node.js dependencies and scripts.
  - `vite.config.js`: Vite configuration.
  - `tailwind.config.js`, `postcss.config.js`, `src/index.css`: Tailwind CSS configuration and main stylesheet.
  - `src/main.jsx`: React application entry point.
  - `src/App.jsx`: Main React component with routing.
  - `src/pages/`: React components for different application pages.
- `tests/`: Contains pytest tests for the backend.
  - `conftest.py`: Pytest fixtures for database setup and FastAPI test client.
  - `test_*.py`: Test files for backend modules.

## Prerequisites

- Python 3.10+
- Node.js 18+
- npm
- Git
- PostgreSQL database (for production/development, SQLite in-memory for tests)

## Setup Instructions

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/p67428378-afk/test2.git
    cd test2
    ```

2.  **Backend Setup:**
    a.  **Create a Python virtual environment:**
        ```bash
        python -m venv venv
        source venv/bin/activate  # On Windows: .venv\Scripts\activate
        ```
    b.  **Install Python dependencies:**
        ```bash
        pip install -r backend/requirements.txt
        ```
    c.  **Environment Variables:**
        Create a `.env` file in the project root (or configure environment variables directly) with your PostgreSQL connection string. Example:
        ```
        DATABASE_URL="postgresql://user:password@localhost:5432/credit_card_app"
        ```
        For local development, you might use a local PostgreSQL instance or Docker.
    d.  **Run the Backend Server:**
        ```bash
        uvicorn backend.main:app --reload
        ```
        The API will be available at `http://127.0.0.1:8000`.

3.  **Frontend Setup:**
    a.  **Navigate to the frontend directory:**
        ```bash
        cd frontend
        ```
    b.  **Install Node.js dependencies:**
        ```bash
        npm install
        ```
    c.  **Start the Frontend Development Server:**
        ```bash
        npm run dev
        ```
        The frontend application will be available at `http://localhost:5173` (or another port if 5173 is in use).

## API Documentation

The FastAPI backend automatically generates interactive API documentation (Swagger UI) at:
- `http://127.0.0.1:8000/docs`
- `http://127.0.0.1:8000/redoc`

**Key Endpoints:**

- **Applicants:**
  - `POST /applicants/`: Create a new applicant.
    - Request Body: `schemas.ApplicantCreate`
    - Response: `schemas.Applicant`
  - `GET /applicants/{applicant_id}`: Retrieve applicant details by ID.
    - Response: `schemas.Applicant`

- **Applications:**
  - `POST /applications/`: Create a new application.
    - Request Body: `schemas.ApplicationCreate`
    - Response: `schemas.Application`
  - `GET /applications/{application_id}`: Retrieve application details by ID.
    - Response: `schemas.Application`
  - `POST /applications/{application_id}/financial-info`: Add financial information to an application.
    - Request Body: `schemas.FinancialInfoCreate`
    - Response: `schemas.FinancialInfo`
  - `POST /applications/{application_id}/employment-info`: Add employment information to an application.
    - Request Body: `schemas.EmploymentInfoCreate`
    - Response: `schemas.EmploymentInfo`

## Running Tests

**Backend Tests:**

1.  Ensure your Python virtual environment is activated.
2.  Navigate to the project root directory.
3.  Run pytest:
    ```bash
    pytest tests/
    ```

**Frontend Tests:**

(Currently, only a placeholder `jest` script is in `package.json`. Detailed frontend tests would be added here.)

1.  Navigate to the `frontend` directory.
2.  Run npm test:
    ```bash
    npm test
    ```

## Deployment Notes

This application is designed for deployment on Google Cloud Platform (GCP) using Google Kubernetes Engine (GKE) for microservices orchestration and Cloud SQL (PostgreSQL) for the database. Cloud Storage would be used for document storage. A CI/CD pipeline should be configured to automate builds, tests, and deployments to development, staging, and production environments.
