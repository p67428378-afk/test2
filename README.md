# Credit Card Application with Tiered Options

This project is a full-stack application that allows users to apply for a credit card, have their credit history assessed, and be presented with suitable credit card tier options.

## Application Architecture

The application is built using a microservices architecture with a React frontend and a FastAPI backend.

### Tech Stack

- **Backend:** FastAPI, Python, SQLAlchemy, PostgreSQL
- **Frontend:** React, Vite, Tailwind CSS

### High-Level Diagram

```
+-----------------+      +-----------------+      +----------------------+
|   Frontend      |----->|   Backend       |----->|  Credit Bureau API   |
| (React, Vite)   |      | (FastAPI, Python) |      | (Experian, TransUnion) |
+-----------------+      +-----------------+      +----------------------+
                             |                      
                             v
                       +-----------------+
                       |   Database      |
                       | (PostgreSQL)    |
                       +-----------------+
```

## Project Structure

```
.
├── backend
│   ├── app
│   └── tests
├── frontend
│   ├── src
│   └── public
└── .gitignore
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
3.  Activate the virtual environment: `source venv/bin/activate` (on Unix) or `venv\Scripts\activate` (on Windows)
4.  Install the dependencies: `pip install -r requirements.txt`
5.  Run the application: `uvicorn app.main:app --reload`

### Frontend

1.  Navigate to the `frontend` directory.
2.  Install the dependencies: `npm install`
3.  Run the application: `npm run dev`

## API Documentation

- **POST /api/v1/applications**: Create a new credit card application.
- **GET /api/v1/credit-card-tiers?credit_score={score}**: Get the available credit card tiers based on the credit score.
- **POST /api/v1/applications/{application_id}/select-tier**: Select a credit card tier for an application.

## Running Tests

### Backend

1.  Navigate to the `backend` directory.
2.  Run the tests: `pytest`

### Frontend

1.  Navigate to the `frontend` directory.
2.  Run the tests: `npm test`
