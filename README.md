# Account Balance Viewer

This project is a simple web application that allows users to view their account balances. It is built with a React frontend and a FastAPI backend.

## Application Architecture

- **Tech Stack**: FastAPI, React, SQLAlchemy, Pydantic
- **Database**: SQLite

## Project Structure

```
.
├── backend
│   ├── app
│   │   ├── api
│   │   │   ├── account.py
│   │   │   └── user.py
│   │   ├── core
│   │   │   ├── config.py
│   │   │   └── database.py
│   │   ├── models
│   │   │   ├── account.py
│   │   │   └── user.py
│   │   ├── schemas
│   │   │   ├── account.py
│   │   │   └── user.py
│   │   ├── services
│   │   │   ├── account_service.py
│   │   │   └── user_service.py
│   │   ├── tests
│   │   │   ├── test_account.py
│   │   │   └── test_user.py
│   │   └── main.py
│   └── requirements.txt
└── frontend
    ├── index.html
    ├── package.json
    ├── postcss.config.js
    ├── src
    │   ├── App.jsx
    │   ├── index.css
    │   ├── main.jsx
    │   ├── pages
    │   │   └── AccountBalance.jsx
    │   └── services
    │       └── api.js
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

-   **POST /api/v1/users/**: Create a new user.
-   **GET /api/v1/users/**: Get a list of users.
-   **GET /api/v1/users/{user_id}**: Get a specific user.
-   **POST /api/v1/users/{user_id}/accounts/**: Create a new account for a user.
-   **GET /api/v1/users/{user_id}/accounts/**: Get a list of accounts for a user.
