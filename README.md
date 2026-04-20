# Counter Application

This is a simple counter application with a frontend and a backend.

## Application Architecture

- **Backend**: FastAPI (Python)
- **Frontend**: React (Vite)

The frontend is configured to communicate with the backend via API calls.

## Project Structure

```
.
├── backend
│   ├── __init__.py
│   ├── main.py
│   ├── requirements.txt
│   └── tests
│       └── test_main.py
└── frontend
    ├── index.html
    ├── package.json
    ├── postcss.config.js
    ├── src
    │   ├── App.jsx
    │   ├── App.test.jsx
    │   ├── index.css
    │   └── main.jsx
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
4.  Install the dependencies: `pip install -r requirements.txt`
5.  Run the backend server: `uvicorn main:app --reload`

### Frontend

1.  Navigate to the `frontend` directory.
2.  Install the dependencies: `npm install`
3.  Start the frontend development server: `npm run dev`

## API Documentation

- `GET /`: Get the current count.
- `POST /increment`: Increment the count by 1.

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
