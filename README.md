# E-commerce Cart Functionality

This project implements a simple e-commerce cart functionality using FastAPI for the backend and React for the frontend.

## Application Architecture

The application follows a microservices-based architecture with a separate frontend and backend.

- **Backend**: A FastAPI application that provides a RESTful API for managing the shopping cart. It uses PostgreSQL for the database and SQLAlchemy as the ORM.
- **Frontend**: A React application built with Vite that consumes the backend API to provide a user interface for adding items to the cart.

### High-Level Diagram

```mermaid
graph TD
    A[Frontend (React)] --> B{API Gateway}
    B --> C[Cart Service (FastAPI)]
    C --> D[Database (PostgreSQL)]
```

## Project Structure

```
.
├── backend
│   ├── alembic
│   ├── alembic.ini
│   ├── crud.py
│   ├── database.py
│   ├── __init__.py
│   ├── main.py
│   ├── models.py
│   ├── requirements.txt
│   ├── schemas.py
│   └── tests
│       ├── __init__.py
│       └── test_cart.py
├── frontend
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── src
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── App.test.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── tailwind.config.js
│   └── vite.config.js
└── .gitignore
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
4.  Install the dependencies:
    ```bash
    pip install -r requirements.txt
    ```
5.  Set up the database. Make sure you have a running PostgreSQL instance and create a database. Then, set the `DATABASE_URL` environment variable:
    ```bash
    export DATABASE_URL="postgresql://user:password@postgresserver/db"
    ```
6.  Run the database migrations:
    ```bash
    alembic upgrade head
    ```
7.  Start the backend server:
    ```bash
    uvicorn main:app --reload
    ```

### Frontend

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Start the frontend development server:
    ```bash
    npm run dev
    ```

## API Documentation

### Add Item to Cart

- **Endpoint**: `POST /api/cart/add`
- **Request Body**:
  ```json
  {
    "product_id": 1,
    "quantity": 1
  }
  ```
- **Response**:
  ```json
  {
    "id": 1,
    "product_id": 1,
    "quantity": 1
  }
  ```

### Get Cart Items

- **Endpoint**: `GET /api/cart/`
- **Response**:
  ```json
  [
    {
      "id": 1,
      "product_id": 1,
      "quantity": 1
    }
  ]
  ```

## Running Tests

### Backend

To run the backend tests, navigate to the `backend` directory and run:

```bash
pytest
```

### Frontend

To run the frontend tests, navigate to the `frontend` directory and run:

```bash
npm test
```
