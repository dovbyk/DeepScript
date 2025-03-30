# Use a lightweight Python image
FROM python:3.11-slim

# Set the working directory inside the container
WORKDIR /backend

# Copy only necessary files first to optimize Docker caching
COPY backend/requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend code
COPY . .

# Expose the port your Flask app runs on
EXPOSE 5000

# Run the application using Gunicorn
CMD ["gunicorn", "server:app", "--bind", "0.0.0.0:5000"]
