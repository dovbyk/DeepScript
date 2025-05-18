FROM python:3.10-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    fontforge \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libfreetype6 \
    potrace \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /backend

# Install Python dependencies
COPY requirements.txt .
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

# Copy app code
COPY . .

# Expose port
EXPOSE 5000

# Start server
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "server:app", "--timeout", "300"]
