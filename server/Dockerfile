FROM python:3.12-slim

WORKDIR /app

# Install dependencies (paths are relative to repo root build context)
COPY server/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY server/ ./server/

ENV PYTHONPATH=/app
ENV PORT=8080
EXPOSE 8080

CMD ["python", "-m", "server.main"]
