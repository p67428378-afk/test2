# test2

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
python -m pytest
```

### Starting the Development Server
```bash
python -m uvicorn server.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`
API documentation: `http://localhost:8000/docs`
