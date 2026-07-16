FROM python:3.12-slim

WORKDIR /app

COPY server/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY server/ ./server/
COPY test.db .

EXPOSE 8080

# Cloud Run injects PORT (8080). Use shell form so ${PORT} expands; default to 8080 locally.
CMD ["sh", "-c", "uvicorn server.main:app --host 0.0.0.0 --port ${PORT:-8080}"]
