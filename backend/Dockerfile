FROM python:3.9-slim
# Set noninteractive mode to avoid tzdata prompt
ENV DEBIAN_FRONTEND=noninteractive

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    fontforge \
    python3-fontforge \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libfreetype6 \
    potrace \
    && rm -rf /var/lib/apt/lists/*

# Symlink python3 to python
RUN ln -s /usr/bin/python3 /usr/bin/python

# Set working directory
WORKDIR /backend

# Install Python dependencies
COPY requirements.txt .
RUN pip3 install --upgrade pip && pip3 install --no-cache-dir -r requirements.txt

# Copy code
COPY . .

# Expose port
EXPOSE 5000

# Run the app
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "server:app", "--timeout", "300"]
