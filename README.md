
# The Vault - Online Banking Application

This project is an online banking application that allows customers to view their account balances, transfer funds, and pay bills.

## Application Architecture

The application is built using a microservices architecture with a React frontend, a FastAPI backend, and a PostgreSQL database.

- **Frontend:** The frontend is a single-page application built with React and Vite. It uses Tailwind CSS for styling.
- **Backend:** The backend is a FastAPI application with a PostgreSQL database. It exposes a RESTful API for the frontend to consume.
- **Database:** The application uses a PostgreSQL database to store user and account information.

## Project Structure

```
.
├── backend
│   ├── app
│   │   ├── api
│   │   │   └── v1
│   │   │       ├── endpoints
│   │   │       │   ├── accounts.py
│   │   │       │   └── users.py
│   │   │       └── api.py
│   │   ├── crud.py
│   │   ├── database.py
│   │   ├── main.py
│   │   ├── models.py
│   │   └── schemas.py
│   ├── tests
│   │   ├── conftest.py
│   │   └── test_accounts.py
│   └── requirements.txt
└── frontend
    ├── index.html
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js
    ├── vite.config.js
    └── src
        ├── App.jsx
        ├── index.css
        ├── main.jsx
        ├── components
        │   ├── AccountCard.jsx
        │   ├── Header.jsx
        │   ├── Portfolio.jsx
        │   └── Sidebar.jsx
        └── services
            └── api.js
```

## Setup Instructions

### Backend

1.  Navigate to the `backend` directory.
2.  Create a virtual environment: `python -m venv venv`
3.  Activate the virtual environment: `source venv/bin/activate`
4.  Install the dependencies: `pip install -r requirements.txt`
5.  Create a `.env` file and add the `DATABASE_URL` environment variable.
6.  Run the application: `uvicorn app.main:app --reload`

### Frontend

1.  Navigate to the `frontend` directory.
2.  Install the dependencies: `npm install`
3.  Run the application: `npm run dev`

## API Documentation

### GET /api/v1/accounts/

Returns a list of all accounts.

### GET /api/v1/users/{user_id}/accounts/

Returns a list of all accounts for a specific user.

### POST /api/v1/users/

Creates a new user.

