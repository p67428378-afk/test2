# CareFlow HMS - Hospital Management System

CareFlow HMS is a comprehensive Hospital Management System integrating patient registration, doctor appointments, medical records, billing, and pharmacy management.

## Server Setup & Usage

### Prerequisites
- Python 3.11+
- virtualenv / venv

### Setup

1. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r server/requirements.txt
```

### Running Tests
```bash
pytest
```

### Starting the Development Server
Always run the server from the repository root to ensure correct import resolution:
```bash
python -m uvicorn server.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`
Interactive API documentation (Swagger UI): `http://localhost:8000/docs`
