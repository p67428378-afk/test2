# KYC Onboarding Microservice

This project is a full-stack application that provides a KYC (Know Your Customer) onboarding process using Aadhaar and PAN validation. It is designed to be a secure and scalable microservice for a retail bank.

## Application Architecture

The application follows a microservices architecture with a FastAPI backend and a React frontend.

- **Backend**: A FastAPI application that provides API endpoints for KYC verification. It integrates with third-party services for Aadhaar and PAN validation and checks against RBI sanction lists.
- **Frontend**: A React application built with Vite that provides a user interface for customers to submit their KYC details.
- **Database**: A PostgreSQL database is used to store KYC data and audit trails.

### System Diagram

```mermaid
graph TD
    A[Client Browser] --> B{React Frontend};
    B --> C{FastAPI Backend};
    C --> D[UIDAI API];
    C --> E[NSDL API];
    C --> F[RBI Sanctions API];
    C --> G[PostgreSQL Database];
```

## Project Structure

```
.
├── backend
│   ├── app
│   │   ├── api
│   │   │   └── v1
│   │   │       └── endpoints
│   │   │           └── kyc.py
│   │   ├── core
│   │   │   └── config.py
│   │   ├── db
│   │   │   ├── database.py
│   │   │   └── models.py
│   │   ├── schemas
│   │   │   └── kyc.py
│   │   ├── services
│   │   │   └── kyc_service.py
│   │   ├── tests
│   │   │   ├── conftest.py
│   │   │   └── test_kyc.py
│   │   └── main.py
│   ├── alembic
│   ├── pyproject.toml
│   └── requirements.txt
├── frontend
│   ├── public
│   ├── src
│   │   ├── components
│   │   │   ├── AadhaarInput.jsx
│   │   │   ├── AuditTrail.jsx
│   │   │   ├── PanInput.jsx
│   │   │   ├── SideNavBar.jsx
│   │   │   ├── StatusIndicator.jsx
│   │   │   └── TopNavBar.jsx
│   │   ├── test
│   │   │   ├── App.test.jsx
│   │   │   └── setup.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
└── .gitignore
```

## Prerequisites

- Python 3.9+
- Node.js 18+
- npm
- git

## Setup Instructions

### Backend

1.  **Create a virtual environment**:

    ```bash
    python -m venv venv
    source venv/bin/activate
    ```

2.  **Install dependencies**:

    ```bash
    pip install -r backend/requirements.txt
    ```

3.  **Set up environment variables**:

    Create a `.env` file in the `backend` directory and add the following:

    ```
    DATABASE_URL=postgresql://user:password@localhost/kyc_db
    ```

4.  **Run database migrations**:

    ```bash
    alembic upgrade head
    ```

5.  **Start the server**:

    ```bash
    uvicorn app.main:app --reload
    ```

### Frontend

1.  **Install dependencies**:

    ```bash
    npm install
    ```

2.  **Start the development server**:

    ```bash
    npm run dev
    ```

## API Documentation

### POST /api/v1/kyc

Creates a new KYC record.

**Request Body**:

```json
{
  "aadhaar_number": "123456789012",
  "pan_number": "ABCDE1234F"
}
```

**Response**:

```json
{
  "id": "...",
  "aadhaar_number": "123456789012",
  "pan_number": "ABCDE1234F",
  "status": "PENDING",
  "failure_reason": null,
  "sanctions_match": null,
  "created_at": "...",
  "updated_at": "..."
}
```

## Running Tests

### Backend

```bash
pytest backend/app/tests
```

### Frontend

```bash
npm test
```
