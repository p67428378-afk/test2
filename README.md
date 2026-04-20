# Bank Account Statement Generation Service

This project is a bank account statement generation service. It allows users to select an account, specify a date range, and download a statement in PDF or Excel format.

## Application Architecture

- **Backend**: FastAPI
- **Frontend**: React (Vite)
- **Database**: PostgreSQL (using SQLAlchemy)

### System Components

- **Frontend**: A React application that provides the user interface for selecting an account, date range, and download format.
- **Backend**: A FastAPI application that handles the business logic, including:
    - Fetching transaction history from a (mocked) Core Banking System.
    - Categorizing transactions as debit or credit.
    - Calculating opening and closing balances.
    - Generating downloadable statements in PDF and Excel formats.

### Project Structure

```
.
├── backend
│   ├── app
│   │   ├── api
│   │   │   └── statements.py
│   │   ├── core
│   │   ├── db
│   │   │   └── database.py
│   │   ├── models
│   │   │   └── transaction.py
│   │   ├── schemas
│   │   │   └── statement.py
│   │   ├── services
│   │   │   └── statement_service.py
│   │   └── main.py
│   ├── requirements.txt
│   └── tests
│       ├── conftest.py
│       └── test_statement.py
└── frontend
    ├── public
    ├── src
    │   ├── components
    │   │   ├── AccountSelector.jsx
    │   │   ├── DateRangePicker.jsx
    │   │   ├── DownloadOptions.jsx
    │   │   ├── DownloadSuccess.jsx
    │   │   └── StatementPreview.jsx
    │   ├── pages
    │   │   └── StatementPage.jsx
    │   ├── services
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
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

### POST /statements/

Generates a bank account statement.

**Request Body:**

```json
{
  "account_number": "1234567890",
  "start_date": "2023-01-01",
  "end_date": "2023-01-31",
  "format": "pdf"
}
```

**Response:**

A downloadable file in the specified format (PDF or Excel).
