
# Manage Health Insurance Policy

This project is a full-stack application that allows policyholders to manage their health insurance policies. It provides features to view, update, and cancel policies.

## Application Architecture

The application follows a microservices architecture with a React frontend and a FastAPI backend.

- **Frontend**: React (Vite)
- **Backend**: FastAPI, PostgreSQL
- **Database**: SQLite (for local development and testing)

### System Diagram

```mermaid
graph TD
    A[Frontend (React)] --> B{API Gateway}
    B --> C[Policy Management API (FastAPI)]
    C --> D[Policy Database (PostgreSQL)]
    C --> E[Audit Log Database]
    C --> F[Authentication Service]
    C --> G[PAS Adapter Service]
    G --> H[External Policy Administration System (PAS)]
```

## Project Structure

```
.
├── backend
│   ├── __init__.py
│   ├── database.py
│   ├── main.py
│   ├── models.py
│   └── schemas.py
├── frontend
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── src
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── tailwind.config.js
│   └── vite.config.js
├── requirements.txt
└── tests
    ├── __init__.py
    ├── conftest.py
    ├── test_api.py
    └── test_main.py
```

## Prerequisites

- Python 3.10+
- Node.js 18+
- npm
- git

## Setup Instructions

### Backend

1.  **Clone the repository**

    ```bash
    git clone https://github.com/p67428378-afk/test2.git
    cd test2
    ```

2.  **Create a virtual environment and install dependencies**

    ```bash
    python -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    ```

3.  **Run the backend server**

    ```bash
    uvicorn backend.main:app --reload
    ```

### Frontend

1.  **Navigate to the frontend directory**

    ```bash
    cd frontend
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Run the frontend development server**

    ```bash
    npm run dev
    ```

## API Documentation

- `GET /policies/{policy_id}`: Get policy details.
- `PUT /policies/{policy_id}`: Update a policy.
- `DELETE /policies/{policy_id}/cancel`: Cancel a policy.

## Running Tests

### Backend

```bash
pytest
```

### Frontend

```bash
cd frontend
npm test
```
