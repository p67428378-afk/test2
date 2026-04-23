# Credit Card Application and Approval System

This project is a full-stack application that allows users to apply for a credit card and receive a decision on their eligibility and credit limit.

## Application Architecture

The application follows a microservices-oriented architecture with a React frontend and a FastAPI backend.

### Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Formik, Yup, Axios
- **Backend**: FastAPI, Python, SQLAlchemy, PostgreSQL, Pytest

### High-Level Component Diagram

```
[Frontend (React)] -> [Backend (FastAPI)] -> [PostgreSQL Database]
```

- The frontend communicates with the backend via a RESTful API.
- The backend handles business logic, data validation, and database interactions.
- The database stores applicant data, application status, and decision details.

### Database Schema

- **Applicant**:
  - `applicant_id` (Primary Key)
  - `full_name`
  - `ssn` (Encrypted)
  - `date_of_birth`
  - `address`
  - `annual_income`
  - `employment_status`
  - `credit_score`
  - `application_date`
  - `status` (e.g., 'Pending', 'Approved', 'Rejected', 'Referred')
  - `credit_limit` (if approved)

## Project Structure

```
.
├── backend
│   ├── app
│   │   ├── api
│   │   ├── core
│   │   ├── db
│   │   ├── models
│   │   ├── schemas
│   │   ├── services
│   │   └── main.py
│   ├── tests
│   └── requirements.txt
└── frontend
    ├── public
    ├── src
    │   ├── components
    │   ├── pages
    │   ├── services
    │   └── main.jsx
    ├── index.html
    └── package.json
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
5.  Create a `.env` file and add the following environment variables:
    ```
    DATABASE_URL=postgresql://user:password@localhost/db
    ```
6.  Start the server: `uvicorn app.main:app --reload`

### Frontend

1.  Navigate to the `frontend` directory.
2.  Install the dependencies: `npm install`
3.  Start the development server: `npm run dev`

## API Documentation

- **POST /api/v1/applications/**: Submit a new credit card application.
  - **Request Body**: See `backend/app/schemas/applicant.py` for the `ApplicantCreate` schema.
  - **Response Body**: See `backend/app/schemas/applicant.py` for the `ApplicationStatus` schema.

## Running Tests

### Backend

1.  Navigate to the `backend` directory.
2.  Run the tests: `pytest`

### Frontend

1.  Navigate to the `frontend` directory.
2.  Run the tests: `npm test`
