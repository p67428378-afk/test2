# Health Insurance Management Portal

This project is a health insurance management portal that allows policyholders to view, update, and cancel their health insurance policies.

## Application Architecture

The application is built with a full-stack architecture using FastAPI for the backend and React for the frontend.

- **Backend**: FastAPI with a PostgreSQL database.
- **Frontend**: React (Vite) with Tailwind CSS.
- **Database**: PostgreSQL

### Backend Architecture

The backend is a microservice that provides APIs for managing policies. It follows a standard layered architecture:

- **API Layer**: `routers/` for API endpoints.
- **Service Layer**: `services/` for business logic.
- **Data Access Layer**: `models/` and `db/` for database interaction.

### Frontend Architecture

The frontend is a single-page application (SPA) built with React. It communicates with the backend APIs to fetch and update data.

- **Components**: Reusable UI components are located in `src/components/`.
- **Pages**: Page-level components are in `src/pages/`.
- **Services**: API communication logic is in `src/services/`.

## Project Structure

```
.
├── backend
│   ├── app
│   │   ├── api
│   │   │   └── v1
│   │   │       └── policies.py
│   │   ├── core
│   │   │   └── config.py
│   │   ├── db
│   │   │   ├── base.py
│   │   │   └── session.py
│   │   ├── models
│   │   │   └── policy.py
│   │   ├── schemas
│   │   │   └── policy.py
│   │   ├── services
│   │   │   └── policy_service.py
│   │   └── main.py
│   ├── tests
│   │   ├── __init__.py
│   │   ├── conftest.py
│   │   └── test_policies.py
│   ├── .env
│   └── pytest.ini
├── frontend
│   ├── public
│   ├── src
│   │   ├── __tests__
│   │   │   └── PolicyDashboard.test.jsx
│   │   ├── components
│   │   │   ├── BottomNavBar.jsx
│   │   │   ├── CoverageCard.jsx
│   │   │   ├── DeductibleProgress.jsx
│   │   │   └── Header.jsx
│   │   ├── pages
│   │   │   ├── CancelPolicy.jsx
│   │   │   ├── PolicyDashboard.jsx
│   │   │   └── UpdatePolicy.jsx
│   │   ├── services
│   │   │   └── policyService.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
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

1.  **Create a virtual environment**:
    ```bash
    python -m venv venv
    source venv/bin/activate
    ```

2.  **Install dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

3.  **Set up the database**:
    - Make sure you have a running PostgreSQL server.
    - Create a `.env` file in the `backend` directory with the following content:
      ```
      DATABASE_URL=postgresql://user:password@localhost/db
      SECRET_KEY=a_very_secret_key
      ```

4.  **Run database migrations**:
    ```bash
    alembic upgrade head
    ```

5.  **Start the server**:
    ```bash
    uvicorn app.main:app --reload
    ```

### Frontend

1.  **Install dependencies**:
    ```bash
    cd frontend
    npm install
    ```

2.  **Start the development server**:
    ```bash
    npm run dev
    ```

## API Documentation

The API documentation is available at `/docs` when the backend server is running.

## Running Tests

### Backend

```bash
pytest
```

### Frontend

```bash
npm test
```
