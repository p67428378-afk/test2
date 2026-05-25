
# Health Insurance Management Portal

This project is a health insurance management portal for policyholders. Users can view their current policy, update their policy, and cancel their policy.

## Application Architecture

- **Tech Stack**: FastAPI (Python) for the backend, React (Vite) for the frontend, and PostgreSQL for the database.
- **High-level component diagram**:

```mermaid
graph TD;
    A[Frontend] --> B{API Gateway};
    B --> C[Policy Management Service];
    C --> D[Database];
```

- **Communication**: The frontend communicates with the backend via a REST API.
- **Database Schema**: The database schema includes `PolicyHolder` and `Policy` tables.

## Project Structure

```
.
├── backend
│   ├── __init__.py
│   ├── config.py
│   ├── database.py
│   ├── main.py
│   ├── models.py
│   ├── requirements.txt
│   ├── routers
│   │   ├── __init__.py
│   │   └── policies.py
│   ├── schemas.py
│   ├── services
│   │   ├── __init__.py
│   │   └── policy_service.py
│   └── tests
│       ├── __init__.py
│       ├── conftest.py
│       └── test_policies.py
└── frontend
    ├── index.html
    ├── package.json
    ├── postcss.config.js
    ├── src
    │   ├── App.jsx
    │   ├── components
    │   │   ├── CancelPolicy.jsx
    │   │   ├── Header.jsx
    │   │   ├── ManagePolicy.jsx
    │   │   └── PolicyDetails.jsx
    │   ├── index.css
    │   ├── main.jsx
    │   └── services
    │       └── api.js
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

1.  Create a virtual environment: `python -m venv venv`
2.  Activate the virtual environment: `source venv/bin/activate`
3.  Install dependencies: `pip install -r backend/requirements.txt`
4.  Create a `.env` file in the `backend` directory with the following content:
    ```
    DATABASE_URL=postgresql://user:password@localhost/db
    ```
5.  Start the server: `uvicorn backend.main:app --reload`

### Frontend

1.  Install dependencies: `npm install`
2.  Start the dev server: `npm run dev`

## API Documentation

- `POST /api/policy-holders`: Create a new policy holder.
- `GET /api/policy-holders/{policy_holder_id}`: Get a policy holder.
- `PUT /api/policy-holders/{policy_holder_id}`: Update a policy holder.
- `POST /api/policy-holders/{policy_holder_id}/policies`: Create a new policy for a policy holder.
- `GET /api/policies/{policy_id}`: Get a policy.
- `PUT /api/policies/{policy_id}/cancel`: Cancel a policy.

## Running Tests

### Backend

`pytest backend/tests`
