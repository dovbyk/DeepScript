FROM python:3.9-slim

# Set noninteractive mode
ENV DEBIAN_FRONTEND=noninteractive

# Install system dependencies (only essentials now)
RUN apt-get update && apt-get install -y \
    potrace \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies (including fontTools/svgpathtools)
WORKDIR /backend
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt \
    && pip install fonttools svgpathtools

# Copy code and run
COPY . .
EXPOSE 5000
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "server:app", "--timeout", "300"]
