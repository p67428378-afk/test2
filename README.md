
# Instant Debit Card Blocking Microservice

**Description:**

As a retail bank customer, I want to instantly block my debit card, so that I can prevent unauthorized transactions and secure my account in case of loss or theft.

## Architecture

- **Backend:** Python (FastAPI)
- **Frontend:** React (Vite)
- **Database:** SQLite (for local development)

## Project Structure

```
.
├── backend
│   ├── __init__.py
│   ├── database.py
│   ├── main.py
│   ├── models.py
│   ├── requirements.txt
│   ├── routers
│   │   ├── __init__.py
│   │   └── card.py
│   ├── schemas.py
│   ├── services
│   │   ├── __init__.py
│   │   └── card_service.py
│   └── tests
│       ├── conftest.py
│       └── test_card_service.py
└── frontend
    ├── index.html
    ├── package.json
    ├── postcss.config.js
    ├── src
    │   ├── App.jsx
    │   ├── components
    │   │   ├── CardBlockForm.jsx
    │   │   ├── Footer.jsx
    │   │   ├── Header.jsx
    │   │   └── Sidebar.jsx
    │   ├── index.css
    │   ├── main.jsx
    │   └── services
    │       └── api.js
    ├── tailwind.config.js
    └── vite.config.js
```

## Prerequisites

- Python 3.9+
- Node.js 16+
- npm
- git

## Setup

1.  **Backend:**
    ```bash
    python -m venv venv
    source venv/bin/activate
    pip install -r backend/requirements.txt
    uvicorn backend.main:app --reload
    ```

2.  **Frontend:**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

## API Endpoints

- **POST /api/card/block:** Blocks a debit card.
  - **Request Body:** `{ "card_number": "...", "account_number": "..." }`
  - **Response:** `{ "status": "BLOCKED", "reference_number": "..." }`

## Running Tests

- **Backend:**
  ```bash
  pytest
  ```

- **Frontend:**
  ```bash
  cd frontend
  npm test
  ```
