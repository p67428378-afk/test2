# Credit Card Application Platform

This project is a full-stack application that allows users to browse and apply for credit cards.

## Application Architecture

The application is built using a microservices architecture, with a React frontend and a FastAPI backend.

- **Frontend**: React (Vite) with Tailwind CSS
- **Backend**: FastAPI with Python
- **Database**: SQLite for development and testing, PostgreSQL for production

### High-Level Diagram

```
+-----------------+      +-----------------+      +--------------------+
|   React         |      |   FastAPI       |      |   Database         |
|   Frontend      |----->|   Backend       |----->|   (PostgreSQL)     |
|   (Vite)        |      |   (Python)      |      |                    |
+-----------------+      +-----------------+      +--------------------+
```

## Project Structure

```
.
├── backend
│   ├── api
│   │   ├── __init__.py
│   │   ├── applications.py
│   │   └── credit_cards.py
│   ├── __init__.py
│   ├── crud.py
│   ├── database.py
│   ├── main.py
│   ├── models.py
│   ├── requirements.txt
│   └── schemas.py
├── frontend
│   ├── public
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
└── tests
    ├── __init__.py
    ├── conftest.py
    ├── test_applications.py
    └── test_credit_cards.py
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
    -   **Windows**:
        ```bash
        venv\Scripts\activate
        ```
    -   **macOS/Linux**:
        ```bash
        source venv/bin/activate
        ```
4.  Install the required packages:
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
2.  Install the required packages:
    ```bash
    npm install
    ```
3.  Start the frontend development server:
    ```bash
    npm run dev
    ```

## API Documentation

### Credit Cards

-   **GET /api/credit-cards/**: Get a list of all credit card offerings.
-   **POST /api/credit-cards/**: Create a new credit card offering.

### Applications

-   **POST /api/applications/**: Create a new credit card application.

## Running Tests

### Backend

1.  Navigate to the `backend` directory.
2.  Run the tests:
    ```bash
    pytest
    ```
