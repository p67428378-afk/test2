# Vehicle Insurance Premium Calculator

This project is a full-stack application that calculates vehicle insurance premiums based on vehicle details and driving history.

## Application Architecture

- **Backend**: FastAPI, PostgreSQL, SQLAlchemy
- **Frontend**: React, Vite, Tailwind CSS

The frontend and backend are in separate directories, `frontend` and `backend` respectively.

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
│   └── main.py
├── frontend
│   ├── public
│   └── src
└── README.md
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
5.  Create a `.env` file and set the `DATABASE_URL` environment variable.
6.  Run the application: `uvicorn app.main:app --reload`

### Frontend

1.  Navigate to the `frontend` directory.
2.  Install the dependencies: `npm install`
3.  Run the development server: `npm run dev`

## API Documentation

The API documentation is available at `/docs` when the backend is running.

### `POST /api/v1/calculate-premium`

Calculates the insurance premium.

**Request Body:**

```json
{
  "vehicle_make": "string",
  "vehicle_model": "string",
  "vehicle_year": 0,
  "ncb_level": 0
}
```

**Response Body:**

```json
{
  "premium_amount": 0
}
```

## Running Tests

### Backend

Navigate to the `backend` directory and run:

```
pytest
```
