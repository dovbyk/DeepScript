# Use the official Python 3.9 image (non-slim) as the base image
FROM python:3.9

# Install necessary system libraries including FontForge and its Python bindings
RUN apt-get update && apt-get install -y \
    fontforge \
    python3-fontforge \
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
