# Real-time UPI Transaction Monitoring Service

This project is a full-stack application designed to monitor UPI transactions in real-time, detect fraudulent activities, and ensure regulatory compliance. The backend is built with FastAPI and the frontend is built with React.

## Application Architecture

- **Backend**: FastAPI
- **Frontend**: React (Vite)
- **Database**: SQLite (for local development and testing)

## Project Structure

```
.
├── backend
│   ├── __init__.py
│   ├── database.py
│   ├── main.py
│   ├── models.py
│   ├── requirements.txt
│   ├── routers
│   │   ├── __init__.py
│   │   └── transactions.py
│   ├── schemas.py
│   └── services.py
├── frontend
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── src
│   │   ├── App.jsx
│   │   ├── components
│   │   │   └── Dashboard.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   └── services
│   │       └── api.js
│   ├── tailwind.config.js
│   └── vite.config.js
└── tests
    ├── __init__.py
    ├── conftest.py
    └── test_transactions.py
```

## Prerequisites

- Python 3.10+
- Node.js 18+
- npm
- git

## Setup Instructions

### Backend

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Create a virtual environment:
    ```bash
    python -m venv venv
    ```
3.  Activate the virtual environment:
    -   On Windows:
        ```bash
        venv\Scripts\activate
        ```
    -   On macOS and Linux:
        ```bash
        source venv/bin/activate
        ```
4.  Install the required dependencies:
    ```bash
    pip install -r requirements.txt
    ```
5.  Start the backend server:
    ```bash
    uvicorn main:app --reload
    ```

### Frontend

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install the required dependencies:
    ```bash
    npm install
    ```
3.  Start the frontend development server:
    ```bash
    npm run dev
    ```

## Running Tests

### Backend

Navigate to the root of the project and run:

```bash
pytest
```

### Frontend

Navigate to the `frontend` directory and run:

```bash
npm test
```
