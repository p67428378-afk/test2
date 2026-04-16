
# E-commerce Cart Functionality

This project is a simple e-commerce cart functionality implementation using FastAPI and React.

## Application Architecture

- **Backend**: FastAPI, SQLAlchemy, SQLite
- **Frontend**: React, Vite, Tailwind CSS

### Backend

The backend is a FastAPI application with the following structure:

- `main.py`: The main application file, which initializes the FastAPI app, includes the routers, and handles startup events.
- `database.py`: Contains the database connection and session management logic.
- `models.py`: Defines the SQLAlchemy database models (`Product` and `CartItem`).
- `schemas.py`: Defines the Pydantic schemas for data validation and serialization.
- `crud.py`: Contains the CRUD (Create, Read, Update, Delete) operations for the database models.
- `api/endpoints/cart.py`: Defines the API endpoints for the cart functionality.
- `tests/`: Contains the tests for the backend application.

### Frontend

The frontend is a React application built with Vite. It communicates with the backend API to add items to the cart and display the cart contents.

## Project Structure

```
.
├── backend
│   ├── api
│   │   └── endpoints
│   │       └── cart.py
│   ├── tests
│   │   ├── __init__.py
│   │   ├── conftest.py
│   │   └── test_cart.py
│   ├── __init__.py
│   ├── crud.py
│   ├── database.py
│   ├── main.py
│   ├── models.py
│   ├── requirements.txt
│   └── schemas.py
├── frontend
│   ├── src
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Setup Instructions

### Backend

1.  Navigate to the `backend` directory.
2.  Create a virtual environment: `python -m venv venv`
3.  Activate the virtual environment: `source venv/bin/activate`
4.  Install the dependencies: `pip install -r requirements.txt`
5.  Run the application: `uvicorn main:app --reload`

### Frontend

1.  Navigate to the `frontend` directory.
2.  Install the dependencies: `npm install`
3.  Run the development server: `npm run dev`

## Running Tests

### Backend

1.  Navigate to the `backend` directory.
2.  Run the tests: `pytest`
