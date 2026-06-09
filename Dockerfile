FROM python:3.9-slim

WORKDIR /app

# Copy the entire repository content
COPY . /app

# Install dependencies
RUN pip install --no-cache-dir -r server/requirements.txt

# Expose port 8080
EXPOSE 8080

# Set environment variable
ENV PORT=8080

# Run the application
CMD ["uvicorn", "server.main:app", "--host", "0.0.0.0", "--port", "8080"]
