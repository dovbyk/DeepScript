# Use the official Python 3.11 slim image as the base image
FROM python:3.11-slim

# Install system dependencies required by fontforge and potrace
RUN apt-get update && apt-get install -y --no-install-recommends \
    fontforge \
    potrace \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory in the container (you can name it /backend or any other name)
WORKDIR /backend

# Copy the requirements file and install Python dependencies
COPY requirements.txt .
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

# Copy your backend code into the container
COPY . .

# Expose the port that your Flask app listens on (default is 5000)
EXPOSE 5000

# Set the entrypoint command to run your app with Gunicorn
CMD ["gunicorn", "server:app"]
