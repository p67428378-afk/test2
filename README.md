# KYC Onboarding Microservice

This project is a full-stack application that provides a KYC (Know Your Customer) onboarding process for a retail bank. It allows customers to submit their Aadhaar and PAN card details for verification.

## Application Architecture

The application follows a microservices architecture with a React frontend and a FastAPI backend.

- **Frontend:** React (Vite) with Tailwind CSS
- **Backend:** FastAPI with PostgreSQL

### Project Structure

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
    │   ├── services
    │   └── tests
    ├── package.json
    └── ...
```

## Setup Instructions

### Prerequisites

- Python 3.10+
- Node.js 18+
- npm
- git

### Backend Setup

1.  Navigate to the `backend` directory.
2.  Create a virtual environment: `python -m venv venv`
3.  Activate the virtual environment: `source venv/bin/activate`
4.  Install the dependencies: `pip install -r requirements.txt`
5.  Create a `.env` file and set the `DATABASE_URL` environment variable.
6.  Run the application: `uvicorn app.main:app --reload`

### Frontend Setup

1.  Navigate to the `frontend` directory.
2.  Install the dependencies: `npm install`
3.  Run the development server: `npm run dev`

## Running Tests

### Backend

Navigate to the `backend` directory and run:

```
pytest
```

### Frontend

Navigate to the `frontend` directory and run:

```
npm test
```
