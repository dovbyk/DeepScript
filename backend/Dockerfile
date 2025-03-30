# Use the official Python 3.9 image (non-slim) as the base image
FROM python:3.9

# Install necessary system libraries including FontForge and its Python bindings
RUN apt-get update && apt-get install -y \
    fontforge \
    python3-fontforge \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Create a symlink to make python-fontforge available to Python
RUN ln -s /usr/lib/python3/dist-packages/fontforge.so /usr/local/lib/python3.9/site-packages/
RUN ln -s /usr/lib/python3/dist-packages/fontforge.py /usr/local/lib/python3.9/site-packages/

# Set the working directory inside the container
WORKDIR /backend

# Copy the requirements file and install Python dependencies
COPY requirements.txt .
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

# Copy your backend code into the container
COPY . .

# Test if fontforge is importable
RUN python -c "import fontforge; print('FontForge is available')"

# Expose the port that your Flask app listens on
EXPOSE 5000

# Start the application using Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "server:app"]
