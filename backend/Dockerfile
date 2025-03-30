# Use an Ubuntu base image which has better support for fontforge
FROM ubuntu:20.04

# Set environment variables to avoid interactive prompts during installation
ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONUNBUFFERED=1

# Install Python 3.9, pip, and necessary system dependencies
RUN apt-get update && apt-get install -y \
    python3.9 \
    python3.9-distutils \
    python3-pip \
    fontforge \
    python3-fontforge \
    libgl1 \
    libglib2.0-0 \
    wget \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# Set Python 3.9 as the default Python version
RUN update-alternatives --install /usr/bin/python python /usr/bin/python3.9 1 \
    && update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.9 1

# Ensure pip is available and updated
RUN curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py && python get-pip.py && rm get-pip.py

# Set the working directory
WORKDIR /backend

# Copy requirements file and install dependencies
COPY requirements.txt .
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

# Copy your application code
COPY . .

# Verify fontforge is available (for debugging, can be removed later)
RUN python3 -c "import sys; print(sys.path)"
RUN python3 -c "import fontforge; print('FontForge is available')"

# Expose the port your application uses
EXPOSE 5000

# Start the application
CMD ["python3", "-m", "gunicorn", "--bind", "0.0.0.0:5000", "server:app"]
