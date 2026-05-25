# Credit Card Application Portal

## Project Title & Description

This project implements a Credit Card Application Portal, allowing users to view available credit cards and apply for a selected one by providing personal, financial, and employment information securely. The system is designed to be a secure, scalable, and user-friendly platform for accessing financial services.

## Application Architecture

The application follows a **Microservices Architecture** with an **API-first approach**. It consists of a FastAPI backend and a React frontend.

- **Backend:** Developed with FastAPI (Python), handling API endpoints, business logic, and database interactions.
- **Frontend:** Developed with React (JavaScript/JSX) using Vite, providing the user interface.
- **Database:** PostgreSQL for structured data (applicants, credit card products, applications, financial information, employment information).
- **Object Storage:** GCP Cloud Storage (conceptual) for unstructured data like uploaded account statements.

**High-Level Component Diagram:**

```mermaid
graph LR
    A[Credit Card Applicant] -->|Access Portal| B(Web Browser - React App)
    B -->|HTTP/S Requests| C[API Gateway]
    C -->|Get Card List| D[Credit Card Catalog Service]
    C -->|Submit Application| E[Application Submission Service]
    C -->|Manage Profile| F[User Profile Service]
    D -->|Read Card Data| G[(Database - PostgreSQL)]
    E -->|Write Application Data| G
    E -->|Store Account Statements| H[Object Storage - GCP Cloud Storage]
    E -->|Verify Credit Score| I[Credit Bureau API]
    E -->|Validate Account| J[Financial Institution API]
    F -->|Read/Write User Data| G
```

## Project Structure

```
.gitignore
README.md
backend/
├── app/
│   ├── api/
│   │   ├── endpoints/
│   │   │   ├── __init__.py
│   │   └── credit_card_products.py
│   ├── core/
│   │   ├── __init__.py
│   │   └── config.py
│   ├── db/
│   │   ├── __init__.py
│   │   └── database.py
│   ├── models/
│   │   ├── __init__.py
│   │   └── models.py
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── schemas.py
│   ├── services/
│   │   ├── __init__.py
│   │   └── crud.py
│   └── main.py
├── tests/
│   ├── __init__.py
│   ├── conftest.py
│   └── test_credit_card_products.py
└── requirements.txt
frontend/
├── public/
├── src/
│   ├── assets/
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── main.jsx
│   ├── App.jsx
│   └── index.css
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

## Prerequisites

- Python 3.10+
- Node.js 18+
- npm
- Git
- PostgreSQL database

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/p67428378-afk/test2.git
cd test2
```

### 2. Backend Setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows, use `.venv\Scripts\activate`
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` directory with your database connection string:

```
DATABASE_URL="postgresql+psycopg2://user:password@host:port/dbname"
SECRET_KEY="your-secret-key"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

Run the backend server:

```bash
uvicorn app.main:app --reload
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

The frontend application will be available at `http://localhost:5173` (or another port if 5173 is in use).

## API Documentation

The backend API documentation (Swagger UI) will be available at `http://localhost:8000/docs` when the backend server is running.

**Key Endpoints:**

- `POST /credit_card_products/`: Create a new credit card product.
- `GET /credit_card_products/`: Retrieve a list of all credit card products.
- `GET /credit_card_products/{product_id}`: Retrieve a single credit card product by ID.

## Running Tests

### Backend Tests

```bash
cd backend
source .venv/bin/activate # Activate your virtual environment
pytest
```

### Frontend Tests

(Currently, no specific frontend tests are implemented beyond basic setup verification.)

## Deployment Notes

The application is designed for deployment on Google Cloud Platform (GCP) using Google Kubernetes Engine (GKE) for backend microservices, Cloud SQL for PostgreSQL, and GCP Cloud Storage for frontend hosting and object storage. Refer to the HLD for more details on the deployment architecture.
