# Health Insurance Policy Management Portal

This project is a health insurance management portal for policyholders. It allows users to view their current policy, request updates to their policy, and request to cancel their policy.

## Application Architecture

The application is built using a full-stack architecture with a React frontend and a FastAPI backend.

- **Frontend**: React (Vite), Tailwind CSS, React Router
- **Backend**: FastAPI, PostgreSQL

### Frontend

The frontend is a single-page application (SPA) that uses React Router for client-side routing. The main components are:

- `App.jsx`: The root component that sets up the routing.
- `Dashboard.jsx`: The main layout component that includes the sidebar and header.
- `PolicyDetails.jsx`: Displays the user's current policy details.
- `PolicyUpdateRequest.jsx`: A form to request updates to the policy.
- `PolicyCancelRequest.jsx`: A form to request cancellation of the policy.

### Backend

The backend is a FastAPI application that provides a RESTful API for the frontend. It is responsible for:

- Authenticating and authorizing users.
- Retrieving and updating policy information from the database.
- Handling policy update and cancellation requests.

## Project Structure

```
.
├── backend
│   ├── api
│   │   └── v1
│   │       └── policies.py
│   ├── crud.py
│   ├── database.py
│   ├── main.py
│   ├── models.py
│   ├── requirements.txt
│   └── schemas.py
├── frontend
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── src
│   │   ├── App.jsx
│   │   ├── components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── PolicyCancelRequest.jsx
│   │   │   ├── PolicyDetails.jsx
│   │   │   └── PolicyUpdateRequest.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   └── services
│   │       └── api.js
│   ├── tailwind.config.js
│   └── vite.config.js
└── tests
    ├── conftest.py
    └── test_policies.py
```

## Setup Instructions

### Backend

1.  Install dependencies: `pip install -r backend/requirements.txt`
2.  Run the server: `uvicorn backend.main:app --reload`

### Frontend

1.  Install dependencies: `npm install`
2.  Run the development server: `npm run dev`

## Running Tests

- **Backend**: `pytest`
- **Frontend**: `npm test`
