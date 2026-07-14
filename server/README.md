# TaskFlow API

This is the backend service for the TaskFlow Todo Application, built with FastAPI and SQLAlchemy.

## Setup and Installation

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```

2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the development server:
   ```bash
   uvicorn server.main:app --reload
   ```

## Running Tests

To run the backend test suite:
```bash
pytest
```
