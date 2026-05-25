# Health Insurance Policy Management Portal

This project is a health insurance management portal for policyholders. Users can view their current policy, update their policy, or cancel their policy.

## Application Architecture

The application is built using a microservices architecture with a FastAPI backend and a React frontend.

- **Backend**: FastAPI with a PostgreSQL database.
- **Frontend**: React with Vite.

## Project Structure

```
.
├── backend
│   ├── app
│   │   ├── api
│   │   │   └── policy.py
│   │   ├── core
│   │   │   └── config.py
│   │   ├── db
│   │   │   └── database.py
│   │   ├── models
│   │   │   └── policy.py
│   │   ├── schemas
│   │   │   └── policy.py
│   │   ├── services
│   │   │   └── policy.py
│   │   └── main.py
│   └── tests
│       ├── conftest.py
│       └── test_policy_api.py
├── frontend
│   ├── public
│   ├── src
│   │   ├── components
│   │   │   ├── Footer.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── PolicyCancellation.jsx
│   │   │   ├── PolicyDetails.jsx
│   │   │   ├── SecurityTips.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── TrustIndicators.jsx
│   │   │   └── UpdatePolicyInformation.jsx
│   │   ├── pages
│   │   │   └── PolicyManagement.jsx
│   │   ├── services
│   │   │   └── policyService.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── .env
├── .gitignore
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
3.  Activate the virtual environment: `source venv/bin/activate`
4.  Install the dependencies: `pip install -r requirements.txt`
5.  Create a `.env` file in the root directory and add the following:

    ```
    DATABASE_URL=postgresql://user:password@host:port/database
    SECRET_KEY=your_secret_key
    ALGORITHM=HS256
    ACCESS_TOKEN_EXPIRE_MINUTES=30
    ```

6.  Run the application: `uvicorn app.main:app --reload`

### Frontend

1.  Navigate to the `frontend` directory.
2.  Install the dependencies: `npm install`
3.  Run the development server: `npm run dev`

## API Documentation

- `GET /api/v1/policies/`: Get all policies.
- `POST /api/v1/policies/`: Create a new policy.
- `GET /api/v1/policies/{policy_id}`: Get a specific policy.
- `PUT /api/v1/policies/{policy_id}`: Update a specific policy.
- `DELETE /api/v1/policies/{policy_id}`: Delete a specific policy.

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

## Deployment Notes

This application is designed to be deployed using Docker and a cloud provider like GCP or AWS.
