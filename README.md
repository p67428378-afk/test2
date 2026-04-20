# Counter Application

This is a simple counter application built with FastAPI and React.

## Application Architecture

- **Backend**: FastAPI
- **Frontend**: React (Vite)
- **Styling**: Tailwind CSS

## Project Structure

```
.
├── backend
│   ├── main.py
│   ├── requirements.txt
│   └── tests
│       └── test_main.py
└── frontend
    ├── index.html
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js
    ├── vite.config.js
    └── src
        ├── App.jsx
        ├── App.test.jsx
        ├── index.css
        └── main.jsx
```

## Setup Instructions

### Backend

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Create a virtual environment:
    ```bash
    python -m venv venv
    ```
3.  Activate the virtual environment:
    -   **Windows**:
        ```bash
        venv\Scripts\activate
        ```
    -   **macOS/Linux**:
        ```bash
        source venv/bin/activate
        ```
4.  Install the dependencies:
    ```bash
    pip install -r requirements.txt
    ```
5.  Run the backend server:
    ```bash
    uvicorn main:app --reload
    ```

### Frontend

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Run the frontend development server:
    ```bash
    npm run dev
    ```

## Running Tests

### Backend

1.  Navigate to the `backend` directory.
2.  Run the tests:
    ```bash
    pytest
    ```

### Frontend

1.  Navigate to the `frontend` directory.
2.  Run the tests:
    ```bash
    npm test
    ```
