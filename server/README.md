# Lost & Found Management System - Backend

This is the FastAPI backend for the Lost & Found Management System.

## Tech Stack
- **Language**: Python 3.11
- **Framework**: FastAPI
- **ORM**: SQLAlchemy 2.x
- **Database**: PostgreSQL (production) / SQLite (local/tests)
- **Test Runner**: pytest

## Setup & Installation

1. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   Create a `.env` file in the `server/` directory or set them in your environment:
   ```env
   DATABASE_URL=sqlite:////tmp/app.db
   JWT_SECRET_KEY=dev-secret-change-in-production
   ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
   ```

## Running the Server

Start the development server from the **repo root**:
```bash
python -m uvicorn server.main:app --reload --host 0.0.0.0 --port 8000
```

The API documentation will be available at `http://localhost:8000/docs`.

## Running Tests

Run the test suite using pytest:
```bash
pytest
```

## Test Credentials

The database is automatically seeded with the following test accounts on startup:

- **Regular User**:
  - **Email**: `test@example.com`
  - **Password**: `testpassword`
- **Admin User**:
  - **Email**: `admin@example.com`
  - **Password**: `adminpassword`

## Full-Stack Local Development

To run both the backend and frontend together:

1. **Backend**:
   - Port: `8000`
   - Command: `python -m uvicorn server.main:app --reload --host 0.0.0.0 --port 8000`
2. **Frontend**:
   - Port: `5173`
   - Command: `npm run dev` (inside `client/` directory)
