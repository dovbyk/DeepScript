# Use Ubuntu 20.04 as the base image
FROM ubuntu:20.04

# Set noninteractive mode for apt-get
ENV DEBIAN_FRONTEND=noninteractive

# Update package lists and install Python, pip, FontForge, and required libraries
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    fontforge \
    python3-fontforge \
    libgl1 \
    libglib2.0-0 \
    libfreetype6 \
    && rm -rf /var/lib/apt/lists/*

# Create a symlink for python
RUN ln -s /usr/bin/python3 /usr/bin/python

# Set the working directory inside the container
WORKDIR /backend

# Copy the requirements file and install Python dependencies
COPY requirements.txt .
RUN pip3 install --upgrade pip && pip3 install --no-cache-dir -r requirements.txt

# Copy the rest of your backend code into the container
COPY . .

# Expose the port your Flask app listens on
EXPOSE 5000

# Start the application using Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "server:app"]
