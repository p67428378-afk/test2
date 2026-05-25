# Use an official Python runtime as a parent image
FROM python:3.9-slim-buster

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in requirements.txt
# If requirements.txt doesn't exist, this command will fail,
# but for a basic Python app, it might not be strictly necessary
# if all dependencies are built-in or handled otherwise.
# For now, I'll include it as a standard practice.
RUN pip install --no-cache-dir -r requirements.txt || echo "requirements.txt not found, skipping pip install"

# Make port 8080 available to the world outside this container
EXPOSE 8080

# Define environment variable for port
ENV PORT 8080

# Run the application
# Assuming a main.py or app.py exists and can be run with python
CMD ["python", "main.py"]
