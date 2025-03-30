# Use the official Python 3.11 slim image as the base image
FROM python:3.11-slim

# Install necessary system libraries including fontforge for its Python module
RUN apt-get update -qq && apt-get install -y --no-install-recommends \
    fontforge \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory inside the container
WORKDIR /backend

# Copy the requirements file and install Python dependencies
COPY requirements.txt .
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

# Copy your backend code into the container
COPY . .

# Expose the port that your Flask app listens on
EXPOSE 5000

# Start the application using Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "server:app"]
