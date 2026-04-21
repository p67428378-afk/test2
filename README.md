
# Loan Eligibility and Interest Rate Decision System

This project is a loan eligibility and interest rate decision system. It provides a simple web interface for users to enter their financial details and check if they are eligible for a loan. If they are eligible, the system will also provide them with an estimated interest rate.

## Application Architecture

The application is built using a full-stack architecture with a React frontend and a FastAPI backend.

- **Frontend**: The frontend is a single-page application built with React and Vite. It uses Tailwind CSS for styling.
- **Backend**: The backend is a RESTful API built with FastAPI. It uses a PostgreSQL database to store loan application data.
- **Database**: The application uses a PostgreSQL database to store loan application data. The database schema is defined using SQLAlchemy.

## Project Structure

```
.
├── backend
│   ├── __init__.py
│   ├── database.py
│   ├── main.py
│   ├── models.py
│   ├── requirements.txt
│   ├── schemas.py
│   └── tests
│       ├── __init__.py
│       ├── conftest.py
│       └── test_main.py
└── frontend
    ├── index.html
    ├── package.json
    ├── postcss.config.js
    ├── src
    │   ├── App.jsx
    │   ├── App.test.jsx
    │   ├── components
    │   │   ├── LoanForm.jsx
    │   │   └── Results.jsx
    │   ├── index.css
    │   ├── main.jsx
    │   └── test
    │       └── setup.js
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
5.  Create a `.env` file and add the following environment variable:
    ```
    DATABASE_URL=postgresql://user:password@host:port/database
    ```
6.  Start the backend server:
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

To run the backend tests, navigate to the `backend` directory and run the following command:

```bash
pytest
```

### Frontend

To run the frontend tests, navigate to the `frontend` directory and run the following command:

```bash
npm test
```
