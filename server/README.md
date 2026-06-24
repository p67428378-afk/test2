# Product Portfolio Optimizer API

Backend services for retail banking product portfolio decision-support.

## API Endpoints

### 1. Get Dashboard Data
- **Method**: `GET`
- **Path**: `/api/v1/dashboard-data`
- **Description**: Fetches all necessary data for the initial dashboard view, including KPIs, products, scenarios, and guardrail checks.
- **Response**: `schemas.DashboardDataResponse`

### 2. Submit Decision
- **Method**: `POST`
- **Path**: `/api/v1/decisions`
- **Description**: Submits the selected scenario and product actions for approval, performing guardrail checks and logging the audit trail.
- **Request Body**: `schemas.DecisionRequest`
- **Response**: `schemas.DecisionResponse`

## Setup and Usage

### Prerequisites
- Python 3.11+
- pip

### Setup

1. Create and activate virtual environment:
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r server/requirements.txt
```

### Running Tests
```bash
pytest -v
```

### Starting the Development Server
```bash
python -m uvicorn server.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`
API documentation: `http://localhost:8000/docs`
