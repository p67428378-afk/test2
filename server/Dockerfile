FROM python:3.12-slim

WORKDIR /app

# Install dependencies (paths are relative to repo root build context)
COPY server/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY server/ ./server/

# Cloud Run requires the container to listen on port 8080
ENV PORT=8080
EXPOSE 8080

# Fixed: Change to server directory before running uvicorn, or use correct module path
CMD ["sh", "-c", "cd server && python -m uvicorn main:app --host 0.0.0.0 --port ${PORT:-8080}"]
