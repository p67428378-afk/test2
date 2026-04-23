# Vehicle Insurance Premium Calculator API

This project implements a RESTful API to calculate vehicle insurance premiums based on a base rate, No Claims Bonus (NCB), and vehicle-specific multipliers.

## Architecture

- **Tech Stack:** Python, FastAPI
- **API Port:** 8000
- **Database:** In-memory (no database required for this implementation)

## Project Structure

```
.
├── backend
│   ├── app
│   │   ├── __init__.py
│   │   ├── api.py
│   │   ├── schemas.py
│   │   └── services.py
│   ├── __init__.py
│   └── main.py
├── tests
│   ├── __init__.py
│   ├── conftest.py
│   └── test_premium_calculator.py
├── .gitignore
├── README.md
└── requirements.txt
```

## Prerequisites

- Python 3.9+
- pip

## Setup

1.  **Create a virtual environment:**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    ```

2.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

3.  **Start the application:**
    ```bash
    uvicorn backend.main:app --reload
    ```

## API Endpoint Reference

### Calculate Premium

- **Method:** `POST`
- **Path:** `/api/v1/insurance/premium`
- **Request Body:**

  ```json
  {
    "base_rate": 500.0,
    "ncb": 0.3,
    "vehicle_multiplier": 1.2
  }
  ```

- **Response:**

  ```json
  {
    "calculated_premium": 420.0
  }
  ```

## Running Tests

```bash
pytest
```
