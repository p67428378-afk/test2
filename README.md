# Account Balance Viewer

This project is a simple Account Balance Viewer application. It allows users to view their account balances for different account types.

## Application Architecture

- **Backend**: FastAPI
- **Frontend**: React (Vite)
- **Database**: SQLite

## Project Structure

```
.
├── backend
│   └── app
│       ├── api
│       │   └── v1
│       │       └── endpoints
│       │           └── accounts.py
│       ├── core
│       │   └── config.py
│       ├── crud
│       │   └── crud_account.py
│       ├── db
│       │   ├── base.py
│       │   └── session.py
│       ├── models
│       │   └── account.py
│       ├── schemas
│       │   └── account.py
│       ├── tests
│       │   ├── conftest.py
│       │   └── test_accounts.py
│       └── main.py
├── frontend
│   ├── src
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── .gitignore
└── requirements.txt
```

## Setup Instructions

### Backend

1.  Install dependencies: `pip install -r requirements.txt`
2.  Run the application: `uvicorn backend.app.main:app --reload`

### Frontend

1.  Install dependencies: `npm install`
2.  Run the application: `npm run dev`

## API Documentation

- `GET /api/v1/accounts/`: Get all accounts.
- `POST /api/v1/accounts/`: Create a new account.
- `GET /api/v1/accounts/{account_id}`: Get a specific account by ID.
