# Health Insurance Management Portal

This project is a health insurance management portal that allows policyholders to view, update, and cancel their health insurance policies.

## Application Architecture

The application follows a microservices architecture with a React frontend and a FastAPI backend.

- **Frontend**: React (Vite)
- **Backend**: FastAPI (Python)
- **Database**: PostgreSQL

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
│   ├── schemas.py
│   └── requirements.txt
├── frontend
│   ├── public
│   ├── src
│   │   ├── components
│   │   │   ├── PolicyCancelRequest.jsx
│   │   │   ├── PolicyDetails.jsx
│   │   │   └── PolicyUpdateRequest.jsx
│   │   ├── services
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
└── tests
    ├── conftest.py
    └── test_policies.py
```

## Setup Instructions

### Backend

1.  Create a virtual environment:

    ```bash
    python -m venv venv
    source venv/bin/activate
    ```

2.  Install the dependencies:

    ```bash
    pip install -r backend/requirements.txt
    ```

3.  Run the application:

    ```bash
    uvicorn backend.main:app --reload
    ```

### Frontend

1.  Install the dependencies:

    ```bash
    npm install
    ```

2.  Run the application:

    ```bash
    npm run dev
    ```

## Running Tests

### Backend

```bash
pytest
```

### Frontend

```bash
npm test
```
