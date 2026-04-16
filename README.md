# Credit Card Application Platform

This project is a credit card application platform that allows users to view and apply for credit cards.

## Application Architecture

- **Backend**: FastAPI
- **Frontend**: React (Vite)
- **Database**: PostgreSQL (SQLite for testing)

## Project Structure

```
.
├── backend
│   ├── api
│   │   ├── __init__.py
│   │   ├── applications.py
│   │   └── credit_cards.py
│   ├── __init__.py
│   ├── crud.py
│   ├── database.py
│   ├── main.py
│   ├── models.py
│   ├── requirements.txt
│   └── schemas.py
└── frontend
    ├── index.html
    ├── package.json
    ├── postcss.config.js
    ├── src
    │   ├── App.jsx
    │   ├── index.css
    │   ├── main.jsx
    │   └── pages
    │       ├── CardComparison.jsx
    │       └── SecureApplication.jsx
    ├── tailwind.config.js
    └── vite.config.js
```

## Setup Instructions

### Backend

1.  `cd backend`
2.  `python -m venv venv`
3.  `source venv/bin/activate`
4.  `pip install -r requirements.txt`
5.  `uvicorn main:app --reload`

### Frontend

1.  `cd frontend`
2.  `npm install`
3.  `npm run dev`

## Running Tests

### Backend

`pytest`

### Frontend

`npm test`
