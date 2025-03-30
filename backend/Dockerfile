FROM python:3.9

# Install FontForge and related libraries, including Python bindings.
RUN apt-get update && apt-get install -y \
    fontforge \
    python3-fontforge \
    libfontforge-dev \
    libglib2.0-0 \
    libfreetype6 \
    && rm -rf /var/lib/apt/lists/*

# Ensure that the directory containing the fontforge Python module is in PYTHONPATH
ENV PYTHONPATH="/usr/lib/python3/dist-packages:$PYTHONPATH"

# Set the working directory
WORKDIR /backend

# Copy and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your backend code
COPY . .

# Expose the port your app listens on
EXPOSE 5000

# Start the application using Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "server:app"]
