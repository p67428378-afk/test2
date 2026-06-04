# test2

This project is a simple Todo API.

## Backend

### Setup

```bash
python -m venv venv
source venv/bin/activate
pip install -r server/requirements.txt
```

### Running the server

```bash
DB_URL=sqlite:///./test.db uvicorn server.main:app --reload
```

### Running tests

```bash
pytest
```
