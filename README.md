# Balance Certificate Generation Service

This project is a full-stack application that allows retail bank customers to generate a balance certificate for a specific account and purpose.

## Architecture

- **Backend**: FastAPI, Python, SQLAlchemy, PostgreSQL
- **Frontend**: React, Vite, Tailwind CSS
- **Deployment**: Docker, Kubernetes

### API

The backend exposes a RESTful API for generating certificates.

- `POST /api/v1/certificates/balance`: Generate a new balance certificate.

### Database Schema

- **certificate_requests**:
  - `requestId` (UUID, PK)
  - `accountNumber` (String)
  - `purpose` (Enum)
  - `requestTimestamp` (DateTime)
  - `status` (Enum)
  - `generatedPdfPath` (String)

## Project Structure

```
.
├── backend
│   ├── __init__.py
│   ├── certificate_router.py
│   ├── config.py
│   ├── database.py
│   ├── main.py
│   ├── models.py
│   ├── requirements.txt
│   ├── schemas.py
│   ├── services.py
│   └── tests
│       ├── __init__.py
│       ├── conftest.py
│       └── test_certificate.py
└── frontend
    ├── index.html
    ├── package.json
    ├── postcss.config.js
    ├── src
    │   ├── App.jsx
    │   ├── components
    │   │   ├── BalanceCertificateForm.jsx
    │   │   └── CertificateStatus.jsx
    │   ├── index.css
    │   ├── main.jsx
    │   ├── services
    │   │   └── api.js
    │   └── tests
    │       ├── BalanceCertificateForm.test.jsx
    │       └── setup.js
    ├── tailwind.config.js
    └── vite.config.js
```

## Prerequisites

- Python 3.10+
- Node.js 18+
- npm
- git

## Setup

**Backend**

1.  Create a virtual environment:
    ```bash
    python -m venv .venv
    source .venv/bin/activate
    ```
2.  Install dependencies:
    ```bash
    pip install -r backend/requirements.txt
    ```
3.  Set up environment variables. Create a `.env` file in the root directory:
    ```
    DATABASE_URL=postgresql://user:password@host:port/database
    ```
4.  Run the application:
    ```bash
    uvicorn backend.main:app --reload
    ```

**Frontend**

1.  Install dependencies:
    ```bash
    cd frontend
    npm install
    ```
2.  Run the development server:
    ```bash
    npm run dev
    ```

## Running Tests

**Backend**

```bash
pytest backend/
```

**Frontend**

```bash
cd frontend
npm test
```
