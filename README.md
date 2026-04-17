
# KYC Onboarding Microservice

This project is a KYC (Know Your Customer) onboarding microservice for a retail bank. It allows customers to complete their KYC process by providing their Aadhaar and PAN card details.

## Application Architecture

The application follows a microservices architecture with a FastAPI backend and a React frontend.

- **Backend**: A FastAPI application that provides API endpoints for creating and validating KYC requests. It uses a PostgreSQL database to store KYC data and audit trails.
- **Frontend**: A React application that provides a user interface for customers to submit their KYC details and view the status of their request.

### Tech Stack

- **Backend**: FastAPI, SQLAlchemy, PostgreSQL
- **Frontend**: React, Vite, Tailwind CSS

## Project Structure

```
.
├── backend
│   ├── __init__.py
│   ├── database.py
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   └── services.py
├── frontend
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── src
│   │   ├── App.jsx
│   │   ├── components
│   │   │   ├── AadhaarInput.jsx
│   │   │   ├── AuditTrail.jsx
│   │   │   ├── DocumentPreview.jsx
│   │   │   ├── MainContent.jsx
│   │   │   ├── PanInput.jsx
│   │   │   ├── SideNavBar.jsx
│   │   │   ├── StatusIndicator.jsx
│   │   │   └── TopNavBar.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   └── services
│   │       └── api.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── requirements.txt
└── tests
    ├── __init__.py
    ├── conftest.py
    └── test_kyc.py
```

## Prerequisites

- Python 3.10+
- Node.js 18+
- npm
- git

## Setup Instructions

### Backend

1.  Create a virtual environment:
    ```bash
    python -m venv venv
    source venv/bin/activate
    ```
2.  Install the required packages:
    ```bash
    pip install -r requirements.txt
    ```
3.  Set up the database. Make sure you have a PostgreSQL server running and create a database named `kyc_db`.
4.  Set the `DATABASE_URL` environment variable:
    ```bash
    export DATABASE_URL="postgresql://user:password@localhost/kyc_db"
    ```
5.  Run the application:
    ```bash
    uvicorn backend.main:app --reload
    ```

### Frontend

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install the required packages:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```

## API Documentation

- `POST /kyc/`: Create a new KYC request.
- `GET /kyc/{request_id}`: Get the status of a KYC request.
- `POST /kyc/{request_id}/validate`: Validate a KYC request.

## Running Tests

To run the backend tests, run the following command from the root directory:

```bash
pytest
```
