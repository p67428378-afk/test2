# Health Insurance Policy Management

This project is a full-stack application for managing health insurance policies. The user can view their current policy, update their personal information and beneficiaries, and cancel their policy.

## Application Architecture

- **Backend**: FastAPI with a PostgreSQL database.
- **Frontend**: React application using Vite.

## Project Structure

```
.
├── backend
│   ├── app
│   │   ├── api
│   │   │   └── endpoints
│   │   │       └── policies.py
│   │   ├── __init__.py
│   │   ├── crud.py
│   │   ├── database.py
│   │   ├── main.py
│   │   ├── models.py
│   │   └── schemas.py
│   ├── requirements.txt
│   └── tests
│       ├── __init__.py
│       ├── conftest.py
│       └── test_policies.py
├── frontend
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── src
│   │   ├── App.jsx
│   │   ├── components
│   │   │   ├── Beneficiaries.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── PolicyCancellation.jsx
│   │   │   └── PolicyManagement.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   └── services
│   │       └── api.js
│   ├── tailwind.config.js
│   └── vite.config.js
└── .gitignore
```

## Setup Instructions

### Backend

1.  Install dependencies: `pip install -r backend/requirements.txt`
2.  Run the application: `uvicorn app.main:app --reload`

### Frontend

1.  Install dependencies: `npm install`
2.  Run the application: `npm run dev`

## Running Tests

-   **Backend**: `pytest`
