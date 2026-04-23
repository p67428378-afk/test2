# Credit Card Approval System

This project is a full-stack web application that allows users to apply for a credit card and receive a decision on their eligibility and credit limit.

## Application Architecture

- **Tech Stack**: FastAPI (Python) for the backend, React (Vite) for the frontend, and PostgreSQL for the database.
- **High-Level Diagram**:

```
+-----------------+      +-----------------+      +-----------------------+
|   Web Browser   |----->|  React Frontend |----->|   FastAPI Backend     |
+-----------------+      +-----------------+      +-----------------------+
                                                     |           |
                                                     |           v
                                                     |      +-----------------+
                                                     +----->|   PostgreSQL DB |
                                                            +-----------------+
```

- **Communication**: The frontend communicates with the backend via a RESTful API.
- **Database Schema**: The database consists of an `applicants` table to store application data.

## Project Structure

```
.
├── backend
│   ├── app
│   │   ├── api
│   │   │   ├── endpoints
│   │   │   │   └── applicants.py
│   │   │   └── api.py
│   │   ├── core
│   │   │   └── config.py
│   │   ├── models
│   │   │   └── applicant.py
│   │   ├── schemas
│   │   │   └── applicant.py
│   │   ├── services
│   │   │   └── decision_engine.py
│   │   ├── tests
│   │   │   ├── conftest.py
│   │   │   ├── test_applicant_api.py
│   │   │   └── test_main.py
│   │   ├── database.py
│   │   └── main.py
│   └── requirements.txt
└── frontend
    ├── public
    ├── src
    │   ├── components
    │   │   ├── ApplicationForm.jsx
    │   │   ├── InputField.jsx
    │   │   ├── PrimaryButton.jsx
    │   │   └── SelectField.jsx
    │   ├── pages
    │   │   └── CreditCardApplicationPage.jsx
    │   ├── services
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── index.html
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js
    └── vite.config.js
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
5.  Create a `.env` file and set the `DATABASE_URL`.
6.  Run the application: `uvicorn app.main:app --reload`

### Frontend

1.  Navigate to the `frontend` directory.
2.  Install dependencies: `npm install`
3.  Start the development server: `npm run dev`

## API Documentation

- **POST /api/v1/applications/**: Submit a new credit card application.
  - **Request Body**: `ApplicantCreate` schema.
  - **Response**: `ApplicationStatus` schema.

## Running Tests

### Backend

- Navigate to the `backend` directory.
- Run tests: `pytest`

### Frontend

- Navigate to the `frontend` directory.
- Run tests: `npm test`
