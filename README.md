# Credit Card Approval Application

This project is a full-stack web application that allows users to apply for a credit card. The application collects user information, processes it to determine eligibility, and assigns a credit limit if the applicant is approved.

## Application Architecture

The application is built using a microservices-oriented architecture, with a React frontend and a FastAPI backend.

- **Frontend**: React (Vite) with Tailwind CSS for styling.
- **Backend**: FastAPI (Python) with PostgreSQL for data storage.
- **Communication**: The frontend communicates with the backend via a RESTful API.

### Tech Stack

- **Backend**: FastAPI, Python, SQLAlchemy, PostgreSQL
- **Frontend**: React, Vite, Tailwind CSS
- **Testing**: Pytest (backend), Jest/Vitest (frontend)

## Project Structure

```
.
├── backend
│   ├── app
│   │   ├── api
│   │   ├── core
│   │   ├── models
│   │   ├── schemas
│   │   ├── services
│   │   └── tests
│   ├── requirements.txt
│   └── ...
└── frontend
    ├── public
    ├── src
    │   ├── components
    │   ├── pages
    │   └── services
    ├── package.json
    └── ...
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
4.  Install dependencies: `pip install -r requirements.txt`
5.  Set up the database and environment variables (see `.env.example`).
6.  Run the application: `uvicorn app.main:app --reload`

### Frontend

1.  Navigate to the `frontend` directory.
2.  Install dependencies: `npm install`
3.  Start the development server: `npm run dev`

## API Documentation

- **POST /api/v1/applicants/**: Submit a new credit card application.
  - **Request Body**: `ApplicantCreate` schema.
  - **Response**: `Applicant` schema.

## Running Tests

- **Backend**: `pytest`
- **Frontend**: `npm test`
