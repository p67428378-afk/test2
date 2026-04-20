# Real-time UPI Transaction Monitoring Service

This project is a full-stack application for monitoring UPI transactions in real-time to detect and prevent fraudulent activities.

## Application Architecture

The application follows a microservices architecture with a React frontend and a FastAPI backend.

- **Frontend**: A React-based dashboard for monitoring transactions, viewing alerts, and manually reviewing held transactions.
- **Backend**: A FastAPI application that provides a REST API for transaction processing and data retrieval. It uses a PostgreSQL database for data storage and is designed to integrate with a real-time data processing engine like Kafka and machine learning models for fraud detection.

### Tech Stack

- **Backend**: FastAPI, Python, SQLAlchemy, PostgreSQL, Kafka, Scikit-learn
- **Frontend**: React, Vite, Tailwind CSS, Axios

## Project Structure

```
.gitignore
backend/
  __init__.py
  main.py
  database.py
  models.py
  schemas.py
  services.py
  requirements.txt
  routers/
    __init__.py
    transactions.py
frontend/
  package.json
  vite.config.js
  tailwind.config.js
  postcss.config.js
  index.html
  src/
    index.css
    main.jsx
    App.jsx
    components/
      Dashboard.jsx
    services/
      api.js
tests/
  __init__.py
  conftest.py
  test_transactions.py
README.md
```

## Prerequisites

- Python 3.10+
- Node.js 18+
- npm
- git

## Setup Instructions

### Backend

1.  Navigate to the `backend` directory.
2.  Create a virtual environment: `python -m venv venv`
3.  Activate the virtual environment: `source venv/bin/activate`
4.  Install the dependencies: `pip install -r requirements.txt`
5.  Set up the database and environment variables.
6.  Run the application: `uvicorn main:app --reload`

### Frontend

1.  Navigate to the `frontend` directory.
2.  Install the dependencies: `npm install`
3.  Run the development server: `npm run dev`

## API Documentation

The API documentation is available at `/docs` when the backend is running.

## Running Tests

To run the backend tests, navigate to the `backend` directory and run:

```
pytest
```
