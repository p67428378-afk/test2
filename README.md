# KYC Onboarding Microservice

This project is a full-stack application for a Know Your Customer (KYC) onboarding process for a retail bank.

## Application Architecture

- **Backend**: FastAPI (Python)
- **Frontend**: React (Vite)
- **Database**: SQLite (for simplicity, would be PostgreSQL in production)

### Backend

The backend is a FastAPI application that provides the following endpoints:

- `POST /kyc/`: Create a new KYC record.
- `GET /kyc/{kyc_id}/status`: Get the status of a KYC record.
- `GET /kyc/{kyc_id}/audit`: Get the audit trail for a KYC record.

### Frontend

The frontend is a React application that provides a user interface for submitting KYC details and viewing the status and audit trail.

## Project Structure

```
.
├── backend
│   ├── app
│   │   ├── api
│   │   │   └── kyc.py
│   │   ├── core
│   │   │   └── config.py
│   │   ├── db
│   │   │   └── database.py
│   │   ├── models
│   │   │   └── kyc.py
│   │   ├── schemas
│   │   │   └── kyc.py
│   │   ├── services
│   │   │   └── kyc_service.py
│   │   └── main.py
│   ├── requirements.txt
│   └── tests
│       ├── conftest.py
│       └── test_kyc.py
└── frontend
    ├── src
    │   ├── components
    │   │   └── KycForm.jsx
    │   └── App.jsx
    ├── index.html
    ├── package.json
    └── ...
```

## Setup Instructions

### Backend

1.  `cd backend`
2.  `python -m venv venv`
3.  `source venv/bin/activate`
4.  `pip install -r requirements.txt`
5.  `uvicorn app.main:app --reload`

### Frontend

1.  `cd frontend`
2.  `npm install`
3.  `npm run dev`

## Running Tests

### Backend

1.  `cd backend`
2.  `pytest`

### Frontend

1.  `cd frontend`
2.  `npm test`
