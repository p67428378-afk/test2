# Credit Card Application System

This project is a credit card application and approval system. Users can apply for a credit card by providing their personal and financial information. The system then checks if the user is eligible for a card and shows their available options.

## Architecture

The application is built using a full-stack architecture with a FastAPI backend and a React/Vite frontend.

- **Backend**: FastAPI, SQLAlchemy, Pydantic
- **Frontend**: React, Vite, TailwindCSS
- **Database**: SQLite (for development)

### Project Structure

```
.
├── app
│   ├── api
│   ├── core
│   ├── crud
│   ├── db
│   ├── models
│   ├── schemas
│   └── services
├── main.py
├── requirements.txt
├── tests
├── frontend
└── .gitignore
```

## Prerequisites

- Python 3.10+
- Node.js 18+
- npm
- git

## Setup

1.  **Backend**

    ```bash
    python -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    uvicorn main:app --reload
    ```

2.  **Frontend**

    ```bash
    cd frontend
    npm install
    npm run dev
    ```

## API Endpoints

- **POST /api/v1/applications/**: Create a new credit card application.
- **GET /api/v1/applications/{application_id}/status**: Get the eligibility status of an application.

## Running Tests

- **Backend**: `pytest`
- **Frontend**: `npm test`
