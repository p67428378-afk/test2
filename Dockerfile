# ---------------------------------------------------------------------------
# Account Balance Certificate Generation microservice (FastAPI)
# Single-container image for Cloud Run. Serves the API on $PORT (default 8080).
# The app is imported as `server.main:app`, so the repo root must be the
# working directory (absolute `server.` imports).
# ---------------------------------------------------------------------------
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8080

WORKDIR /app

# Install Python dependencies first for better layer caching.
COPY server/requirements.txt ./server/requirements.txt
RUN pip install --no-cache-dir -r server/requirements.txt

# Copy the FastAPI application package.
COPY server/ ./server/

EXPOSE 8080

# Cloud Run injects $PORT; default to 8080 for local runs.
CMD ["sh", "-c", "uvicorn server.main:app --host 0.0.0.0 --port ${PORT:-8080}"]