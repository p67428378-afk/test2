
# Bank Account Statement Generation

This project is a full-stack application that allows users to generate bank account statements in PDF and Excel formats.

## Application Architecture

- **Backend**: FastAPI, PostgreSQL, SQLAlchemy
- **Frontend**: React, Vite, Tailwind CSS

## Project Structure

```
├── backend
│   ├── app
│   │   ├── api
│   │   ├── core
│   │   ├── db
│   │   ├── models
│   │   ├── schemas
│   │   └── services
│   ├── requirements.txt
│   └── tests
└── frontend
    ├── public
    ├── src
    │   ├── components
    │   ├── pages
    │   └── services
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## Setup Instructions

### Backend

1.  `cd backend`
2.  `python -m venv venv`
3.  `source venv/bin/activate`
4.  `pip install -r requirements.txt`
5.  `uvicorn app.main:app --reload`

### Frontend

1.  `cd frontend`
2.  `npm install`
3.  `npm run dev`

## Running Tests

### Backend

`pytest`

### Frontend

`npm test`
