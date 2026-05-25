# Loan Eligibility Decision System

This application provides a loan eligibility decision system. Users can enter their financial details to determine if they are eligible for a loan and at what interest rate.

## Application Architecture

- **Tech Stack**: FastAPI (Python) for the backend, React (Vite) for the frontend, and PostgreSQL for the database.
- **High-level component diagram**:

```mermaid
graph TD
    A[Frontend] --> B{API Gateway}
    B --> C[Backend]
    C --> D[Database]
```

- **Communication**: The frontend communicates with the backend via RESTful API endpoints. The backend runs on port 8000, and the frontend on port 5173.
- **Database Schema**: The database consists of a single table `loan_applications` to store user application data.

## Project Structure

```
.gitignore
README.md
backend/
  __init__.py
  database.py
  main.py
  models.py
  requirements.txt
  schemas.py
  tests/
    conftest.py
    test_main.py
frontend/
  index.html
  package.json
  postcss.config.js
  src/
    App.jsx
    App.test.jsx
    components/
      LoanForm.jsx
      Results.jsx
    index.css
    main.jsx
    test/
      setup.js
  tailwind.config.js
  vite.config.js
```

## Prerequisites

- Python 3.10+
- Node.js 18+
- npm
- git

## Setup Instructions

1.  **Clone the repo**:
    ```bash
    git clone https://github.com/p67428378-afk/test2
    cd test2
    ```

2.  **Backend setup**:
    ```bash
    cd backend
    python -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    uvicorn main:app --reload
    ```

3.  **Frontend setup**:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

4.  **Environment variables**: Create a `.env` file in the `backend` directory with the following content:
    ```
    DATABASE_URL=postgresql://user:password@host:port/database
    ```

## API Documentation

- **Endpoint**: `/api/v1/loans/eligibility`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "credit_score": 700,
    "annual_income": 60000,
    "monthly_debts": 1000
  }
  ```
- **Response**:
  ```json
  {
    "eligible": true,
    "interest_rate": 5.5,
    "message": "Congratulations! You are eligible for a loan."
  }
  ```

## Running Tests

- **Backend tests**:
  ```bash
  cd backend
  pytest
  ```

- **Frontend tests**:
  ```bash
  cd frontend
  npm test
  ```

## Deployment Notes

N/A
