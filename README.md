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

## Client

### Prerequisites
- Node.js 16+ and npm 7+

### Setup

1. Install dependencies:
```bash
cd client
npm install
cd ..
```

### Available Commands

**Development Server:**
```bash
cd client
npm run dev
cd ..
```
Opens the app at `http://localhost:5173`

**Production Build:**
```bash
cd client
npm run build
cd ..
```
Creates optimized build in `client/dist/`

**Run Tests:**
```bash
cd client
npm test
cd ..
```

**Build & Preview:**
```bash
cd client
npm run preview
cd ..
```
Preview production build locally

### Environment Variables

Create a `.env.local` file in the `client/` directory:
```
VITE_API_BASE_URL=http://localhost:8180
```

The frontend will connect to the backend API at this URL.

