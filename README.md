# Food Delivery Platform Backend

A system that allows users to browse restaurants, place food orders, make online payments, and track deliveries in real time. It connects customers, restaurants, and delivery partners on a single platform for efficient order management.

## Server

### Prerequisites
- Python 3.11+
- pip and venv

### Setup

1. Create and activate virtual environment:
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
python -m pytest server/tests/ -v
```

### Starting the Development Server
```bash
python -m uvicorn server.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`
API documentation: `http://localhost:8000/docs`
