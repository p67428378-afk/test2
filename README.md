# Credit Card Application Platform

This project is a full-stack application that allows users to browse and apply for credit cards.

## Application Architecture

- **Tech Stack**: FastAPI (Python) for the backend, React (Vite) for the frontend, and PostgreSQL for the database.
- **High-Level Component Diagram**:

```mermaid
graph TD
    A[User] --> B{Frontend (React)};
    B --> C{Backend (FastAPI)};
    C --> D[Database (PostgreSQL)];
```

- **Database Schema**:
    - `applicants`: Stores personal information of the applicants.
    - `employments`: Stores employment details of the applicants.
    - `credit_card_offers`: Stores information about the available credit cards.
    - `applications`: Stores the credit card applications.

## Project Structure

```
.
├── backend
│   ├── core
│   │   ├── __init__.py
│   │   └── config.py
│   ├── __init__.py
│   ├── database.py
│   ├── main.py
│   ├── models.py
│   ├── requirements.txt
│   ├── routers
│   │   └── __init__.py
│   ├── schemas.py
│   ├── services
│   │   └── __init__.py
│   └── tests
│       ├── __init__.py
│       └── test_main.py
└── frontend
    ├── index.html
    ├── package.json
    ├── postcss.config.js
    ├── src
    │   ├── App.css
    │   ├── App.jsx
    │   ├── App.test.jsx
    │   ├── index.css
    │   └── main.jsx
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

1.  **Clone the repo**
2.  **Create a virtual environment**: `python -m venv venv`
3.  **Activate the virtual environment**: `source venv/bin/activate`
4.  **Install dependencies**: `pip install -r backend/requirements.txt`
5.  **Create a `.env` file** in the `backend` directory with the following content:
    ```
    DATABASE_URL=postgresql://user:password@localhost/dbname
    ```
6.  **Run the server**: `uvicorn backend.main:app --reload`

### Frontend

1.  **Navigate to the `frontend` directory**: `cd frontend`
2.  **Install dependencies**: `npm install`
3.  **Start the dev server**: `npm run dev`

## API Documentation

- `POST /api/offers/`: Create a new credit card offer.
- `GET /api/offers/`: Get a list of all credit card offers.
- `POST /api/applications/`: Create a new credit card application.
- `GET /api/applications/`: Get a list of all credit card applications.

## Running Tests

### Backend

`pytest backend/tests`

### Frontend

`npm test -- --run`
