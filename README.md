# Health Insurance Policy Management

This project is a full-stack application for managing health insurance policies, built with FastAPI and React.

## Application Architecture

- **Backend**: FastAPI, PostgreSQL
- **Frontend**: React, Vite, Tailwind CSS

### Backend

The backend is a FastAPI application with a PostgreSQL database. It provides a RESTful API for managing policies, policyholders, and other related data.

### Frontend

The frontend is a React application built with Vite. It uses Tailwind CSS for styling and communicates with the backend API to provide a user-friendly interface for managing policies.

## Project Structure

```
.
├── backend
│   ├── app
│   │   ├── api
│   │   │   └── v1
│   │   │       └── policies.py
│   │   ├── core
│   │   │   └── config.py
│   │   ├── db
│   │   │   ├── base.py
│   │   │   ├── base_class.py
│   │   │   └── session.py
│   │   ├── models
│   │   │   └── policy.py
│   │   ├── schemas
│   │   │   └── policy.py
│   │   ├── services
│   │   │   └── policy_service.py
│   │   └── main.py
│   └── tests
│       ├── conftest.py
│       └── test_policies.py
└── frontend
    ├── src
    │   ├── components
    │   │   └── Header.jsx
    │   ├── pages
    │   │   ├── __tests__
    │   │   │   └── PolicyDashboard.test.jsx
    │   │   ├── CancelPolicy.jsx
    │   │   ├── PolicyDashboard.jsx
    │   │   └── UpdatePolicy.jsx
    │   └── services
    │       └── policyService.js
    ├── index.html
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js
    └── vite.config.js
```

## Setup Instructions

### Backend

1.  Navigate to the `backend` directory.
2.  Create a virtual environment: `python -m venv venv`
3.  Activate the virtual environment: `source venv/bin/activate`
4.  Install the dependencies: `pip install -r requirements.txt`
5.  Run the application: `uvicorn app.main:app --reload`

### Frontend

1.  Navigate to the `frontend` directory.
2.  Install the dependencies: `npm install`
3.  Run the application: `npm run dev`

## API Documentation

The API documentation is available at `/docs` when the backend is running.

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
