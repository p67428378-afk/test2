# Portfolio Risk Assessment Microservice

This project is a full-stack application that provides a portfolio risk assessment microservice for wealth managers. It includes a Python backend built with FastAPI and a React frontend.

## Application Architecture

- **Backend**: FastAPI
- **Frontend**: React (Vite)
- **Database**: PostgreSQL (or SQLite for testing)

The backend exposes a REST API that the frontend consumes to create portfolios, retrieve portfolio data, and run risk assessments.

## Project Structure

```
.
├── backend
│   ├── app
│   │   ├── api
│   │   │   └── routers
│   │   │       └── portfolio.py
│   │   ├── core
│   │   │   └── config.py
│   │   ├── models
│   │   │   └── portfolio.py
│   │   ├── schemas
│   │   │   └── portfolio.py
│   │   ├── services
│   │   │   └── risk_assessment.py
│   │   ├── database.py
│   │   └── main.py
│   ├── tests
│   │   ├── conftest.py
│   │   └── test_portfolio.py
│   └── requirements.txt
└── frontend
    ├── public
    ├── src
    │   ├── components
    │   ├── pages
    │   ├── services
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── index.html
    ├── package.json
    ├── postcss.config.js
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
3.  Activate the virtual environment: `source venv/bin/activate`
4.  Install the dependencies: `pip install -r requirements.txt`
5.  Create a `.env` file and set the `DATABASE_URL` environment variable.
6.  Run the application: `uvicorn app.main:app --reload`

### Frontend

1.  Navigate to the `frontend` directory.
2.  Install the dependencies: `npm install`
3.  Run the development server: `npm run dev`

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
