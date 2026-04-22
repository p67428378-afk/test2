
# Instant Debit Card Blocking Microservice

This project is a full-stack application that provides a microservice for instantly blocking debit cards. It includes a FastAPI backend and a React frontend.

## Architecture

- **Backend**: FastAPI, Python, SQLAlchemy, PostgreSQL
- **Frontend**: React, Vite, Tailwind CSS
- **Database**: PostgreSQL (or SQLite for local development)

### Tech Stack

- Python 3.9+
- Node.js 16+
- npm

### Project Structure

```
.
├── backend
│   ├── database.py
│   ├── main.py
│   ├── models.py
│   ├── requirements.txt
│   ├── routers
│   │   ├── __init__.py
│   │   └── card.py
│   ├── schemas.py
│   ├── services
│   │   ├── __init__.py
│   │   └── card_service.py
│   └── tests
│       ├── __init__.py
│       ├── conftest.py
│       └── test_card_service.py
└── frontend
    ├── index.html
    ├── package.json
    ├── postcss.config.js
    ├── src
    │   ├── App.jsx
    │   ├── components
    │   │   ├── CardBlockForm.jsx
    │   │   ├── Footer.jsx
    │   │   ├── Header.jsx
    │   │   └── Sidebar.jsx
    │   ├── index.css
    │   ├── main.jsx
    │   └── services
    │       └── api.js
    ├── tailwind.config.js
    └── vite.config.js
```

## Prerequisites

- Python 3.9+
- Node.js 16+
- npm
- git

## Setup

### Backend

1.  Create a virtual environment:
    ```bash
    python -m venv venv
    source venv/bin/activate
    ```
2.  Install dependencies:
    ```bash
    pip install -r backend/requirements.txt
    ```
3.  Set up environment variables. Create a `.env` file in the `backend` directory with the following content:
    ```
    DATABASE_URL=postgresql://user:password@host:port/database
    ```
    For local development, you can use SQLite:
    ```
    DATABASE_URL=sqlite:///./test.db
    ```
4.  Run the application:
    ```bash
    uvicorn backend.main:app --reload
    ```

### Frontend

1.  Install dependencies:
    ```bash
    npm install --prefix frontend
    ```
2.  Run the application:
    ```bash
    npm run dev --prefix frontend
    ```

## API Endpoint Reference

- **Method**: `POST`
- **Path**: `/api/v1/cards/block`
- **Request Body**:
  ```json
  {
    "identifier": {
      "card_number": "string",
      "account_number": "string"
    },
    "otp": "string"
  }
  ```
- **Response**:
  ```json
  {
    "status": "BLOCKED",
    "reference_number": "string"
  }
  ```

## Running Tests

### Backend

```bash
pytest backend/tests
```

### Frontend

```bash
npm test --prefix frontend
```
