# Vehicle Insurance Premium Calculator

This project is a full-stack application that provides a vehicle insurance premium calculator. The backend is built with FastAPI and the frontend is built with React.

## Application Architecture

- **Backend:** FastAPI
- **Frontend:** React (Vite)
- **Database:** PostgreSQL (or SQLite for local development)

## Project Structure

```
.
├── backend
│   ├── __init__.py
│   ├── database.py
│   ├── main.py
│   ├── models.py
│   ├── routers
│   │   ├── __init__.py
│   │   └── premium.py
│   ├── schemas.py
│   └── services.py
├── frontend
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── src
│   │   ├── App.jsx
│   │   ├── components
│   │   │   └── PremiumCalculatorForm.jsx
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
    └── test_premium.py
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
2.  Install the dependencies:
    ```bash
    pip install -r requirements.txt
    ```
3.  Create a `.env` file in the root directory with the following content:
    ```
    DATABASE_URL=postgresql://user:password@localhost/db
    ```
4.  Run the backend server:
    ```bash
    uvicorn backend.main:app --reload
    ```

### Frontend

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Run the frontend development server:
    ```bash
    npm run dev
    ```

## API Documentation

### POST /api/v1/insurance/premium/calculate

Calculates the insurance premium based on the provided data.

**Request Body:**

```json
{
  "driver_age": 30,
  "ncb_years": 2,
  "vehicle_make": "Toyota",
  "vehicle_model": "Camry",
  "vehicle_year": 2020,
  "vehicle_risk_factor": 1.0
}
```

**Response Body:**

```json
{
  "calculated_premium": 400.0
}
```

## Running Tests

### Backend

```bash
pytest
```

### Frontend

```bash
npm test
```
