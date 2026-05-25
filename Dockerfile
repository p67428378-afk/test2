# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in requirements.txt
# If requirements.txt is not present, this step will be skipped or modified
# RUN pip install --no-cache-dir -r requirements.txt

# Make port 8080 available to the world outside this container
EXPOSE 8080

# Run the application (placeholder - actual command might vary)
CMD ["python", "-m", "flask", "run", "--host=0.0.0.0", "--port=8080"]
