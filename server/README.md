# Gym Membership Value Analyzer Backend

This is the backend service for the Gym Membership Value Analyzer, built with Python, FastAPI, and SQLAlchemy.

## Server Setup and Usage

### Prerequisites
- Python 3.11+
- virtualenv / pip

### Setup

1. Create and activate a virtual environment:
```bash
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate
```

2. Install dependencies:
```bash
pip install -r server/requirements.txt
```

### Running Tests
```bash
python -m pytest
```

### Starting the Development Server
Always run the server from the repository root to ensure correct import resolution:
```bash
python -m uvicorn server.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`
Interactive API documentation (Swagger UI): `http://localhost:8000/docs`
