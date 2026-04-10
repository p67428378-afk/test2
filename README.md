# Vehicle Insurance Premium Calculator

This project is a Vehicle Insurance Premium Calculator that provides an API to calculate insurance premiums based on a base rate, No Claims Bonus (NCB), and vehicle multipliers.

## Application Architecture

- **Tech Stack**: FastAPI, PostgreSQL, React
- **Architecture**: Microservices
- **Communication**: RESTful API

## Project Structure

```
.
├── backend
│   ├── app
│   │   ├── api
│   │   │   └── premium_calculator.py
│   │   ├── core
│   │   │   └── config.py
│   │   ├── db
│   │   │   └── database.py
│   │   ├── models
│   │   │   └── policy.py
│   │   ├── schemas
│   │   │   └── policy.py
│   │   ├── services
│   │   │   └── premium_calculator_service.py
│   │   ├── dependencies.py
│   │   └── main.py
│   ├── tests
│   │   ├── __init__.py
│   │   ├── conftest.py
│   │   └── test_premium_calculator.py
│   └── requirements.txt
└── frontend
    ├── index.html
    ├── package.json
    ├── postcss.config.js
    ├── src
    │   ├── App.jsx
    │   ├── index.css
    │   ├── main.jsx
    │   ├── components
    │   │   └── PremiumCalculator.jsx
    │   └── services
    │       └── api.js
    ├── tailwind.config.js
    └── vite.config.js
```

## Prerequisites

- Python 3.10+
- Node.js 18+
- npm
- git

## Setup Instructions

### Backend

1.  Navigate to the `backend` directory.
2.  Create a virtual environment: `python -m venv venv`
3.  Activate the virtual environment: `source venv/bin/activate` (on Unix) or `venv\Scripts\activate` (on Windows).
4.  Install dependencies: `pip install -r requirements.txt`
5.  Create a `.env` file and set the `DATABASE_URL`.
6.  Run the application: `uvicorn app.main:app --reload`

### Frontend

1.  Navigate to the `frontend` directory.
2.  Install dependencies: `npm install`
3.  Run the development server: `npm run dev`

## API Documentation

### Calculate Premium

- **Endpoint**: `/api/calculate-premium`
- **Method**: `POST`
- **Request Body**:

```json
{
  "baseRate": 500,
  "claimFreeYears": 3,
  "vehicleMultiplier": 1.2
}
```

- **Response**:

```json
{
  "premium": 390.0
}
```

## Running Tests

### Backend

Navigate to the `backend` directory and run:

```
pytest
```

### Frontend

Navigate to the `frontend` directory and run:

```
npm test
```
