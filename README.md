
# KYC Onboarding Microservice

This project is a Know Your Customer (KYC) onboarding microservice for a retail bank. It is designed to accept Aadhaar and PAN card details, validate document authenticity, screen the customer against RBI sanctions lists, and return an APPROVED or FLAGGED status with a full audit trail.

## Application Architecture

The application is built with a full-stack architecture using FastAPI for the backend and React for the frontend.

- **Backend**: A RESTful API built with FastAPI that handles the KYC process. It integrates with external services for document verification and sanctions screening. All data is stored in a PostgreSQL database, and an audit trail is maintained in DynamoDB.
- **Frontend**: A single-page application built with React and Vite that provides a user interface for the KYC onboarding process.

### Tech Stack

- **Backend**: Python, FastAPI, SQLAlchemy, PostgreSQL, DynamoDB, Boto3
- **Frontend**: React, Vite, Tailwind CSS

## Project Structure

```
.
├── backend
│   ├── app
│   │   ├── api
│   │   │   └── v1
│   │   │       ├── api.py
│   │   │       └── endpoints
│   │   │           └── kyc.py
│   │   ├── core
│   │   │   └── config.py
│   │   ├── db
│   │   │   ├── base.py
│   │   │   ├── base_class.py
│   │   │   └── session.py
│   │   ├── models
│   │   │   ├── audit_trail.py
│   │   │   └── customer.py
│   │   ├── schemas
│   │   │   ├── audit_trail.py
│   │   │   └── customer.py
│   │   ├── services
│   │   │   └── kyc_service.py
│   │   └── main.py
│   ├── tests
│   │   ├── api
│   │   │   └── v1
│   │   │       └── test_kyc.py
│   │   ├── services
│   │   │   └── test_kyc_service.py
│   │   ├── conftest.py
│   │   └── test_main.py
│   └── requirements.txt
└── frontend
    ├── src
    │   ├── components
    │   │   ├── AuditTrail.jsx
    │   │   ├── DocumentInput.jsx
    │   │   ├── FloatingActionPanel.jsx
    │   │   ├── Header.jsx
    │   │   ├── MainContent.jsx
    │   │   ├── SideNav.jsx
    │   │   └── StatusPanel.jsx
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── index.html
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js
    └── vite.config.js
```

## Setup Instructions

### Prerequisites

- Python 3.10+
- Node.js 18+
- npm
- git

### Backend Setup

1.  Navigate to the `backend` directory.
2.  Create a virtual environment: `python -m venv venv`
3.  Activate the virtual environment: `source venv/bin/activate` (on Unix/macOS) or `venv\Scripts\activate` (on Windows).
4.  Install the dependencies: `pip install -r requirements.txt`
5.  Set up the environment variables by creating a `.env` file with the necessary values (see the `.env.example` file for reference).
6.  Run the application: `uvicorn app.main:app --reload`

### Frontend Setup

1.  Navigate to the `frontend` directory.
2.  Install the dependencies: `npm install`
3.  Start the development server: `npm run dev`

## API Documentation

### POST /api/v1/kyc/onboard

Onboards a new customer.

**Request Body:**

```json
{
  "aadhaar_number": "string",
  "pan_number": "string"
}
```

**Response:**

```json
{
  "id": "uuid",
  "aadhaar_number": "string",
  "pan_number": "string",
  "status": "string",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

## Running Tests

### Backend

Navigate to the `backend` directory and run:

```bash
pytest
```

