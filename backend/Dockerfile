# Use Python 3.9 slim as the base image
FROM python:3.9-slim

# Install necessary system libraries including FontForge and its Python bindings
RUN apt-get update -qq && apt-get install -y --no-install-recommends \
    fontforge \
    python3-fontforge \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Add the directory containing the FontForge Python module to PYTHONPATH
ENV PYTHONPATH="/usr/lib/python3/dist-packages:${PYTHONPATH}"

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
