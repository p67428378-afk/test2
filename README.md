# CalcAPI - Simple Calculator with Basic Operations

This is the backend microservice for the CalcAPI application, built with FastAPI.

## Features

- **POST /api/v1/calculate**: Performs arithmetic calculations (+, -, *, /) using a JSON request body.
- **GET /api/v1/calculate**: Performs arithmetic calculations (+, -, *, /) using query parameters.
- **Password Reset Microservice**: Existing password reset endpoints are fully preserved.

## Tech Stack

- **Language**: Python 3.11
- **Framework**: FastAPI
- **ORM**: SQLAlchemy 2.x
- **Database**: SQLite (in-memory for tests)
- **Test Runner**: pytest

## Setup and Installation

1. Clone the repository and navigate to the `server` directory:
   ```bash
   cd server
   ```

2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the development server:
   ```bash
   uvicorn main:app --reload --port 8180
   ```

## Running Tests

To run the test suite:
```bash
pytest
```
