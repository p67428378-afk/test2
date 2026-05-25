# Vehicle Insurance Premium Calculator API

This project provides a RESTful API to calculate vehicle insurance premiums based on a set of rules.

## Architecture

- **Tech Stack:** Python, FastAPI
- **Database:** None (stateless application)
- **Testing:** Pytest

## Project Structure

```
.
├── backend
│   ├── __init__.py
│   ├── app
│   │   ├── __init__.py
│   │   ├── api.py
│   │   ├── schemas.py
│   │   └── services.py
│   └── main.py
├── requirements.txt
└── tests
    ├── __init__.py
    ├── conftest.py
    └── test_premium_calculator.py
```

## Prerequisites

- Python 3.9+
- pip

## Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/p67428378-afk/test2.git
    cd test2
    ```

2.  **Create and activate a virtual environment:**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    ```

3.  **Install the dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Run the application:**
    ```bash
    uvicorn backend.main:app --reload
    ```
    The application will be available at `http://127.0.0.1:8000`.

## API Endpoint Reference

### Calculate Premium

- **POST** `/api/v1/insurance/premium`

Calculates the vehicle insurance premium.

**Request Body:**

```json
{
  "base_rate": 500.0,
  "ncb": 0.3,
  "vehicle_multiplier": 1.2
}
```

- `base_rate` (float, required): The base premium rate.
- `ncb` (float, required): No Claims Bonus (NCB) as a decimal (e.g., 0.3 for 30%).
- `vehicle_multiplier` (float, required): Vehicle-specific multiplier.

**Response:**

```json
{
  "calculated_premium": 420.0
}
```

- `calculated_premium` (float): The calculated insurance premium.

## Running Tests

To run the tests, execute the following command from the root directory:

```bash
pytest
```
