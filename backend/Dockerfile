# Replace your existing Dockerfile with:
FROM python:3.9-slim

# Set noninteractive mode
ENV DEBIAN_FRONTEND=noninteractive

# Install system dependencies
RUN apt-get update && apt-get install -y \
    wget \
    git \
    build-essential \
    autoconf \
    automake \
    libtool \
    libjpeg-dev \
    libtiff5-dev \
    libpng-dev \
    libgif-dev \
    libxt-dev \
    libfreetype6-dev \
    libfontconfig1-dev \
    libpango1.0-dev \
    libcairo2-dev \
    libspiro-dev \
    libuninameslist-dev \
    libgl1-mesa-glx \
    libglib2.0-0 \
    potrace \
    && rm -rf /var/lib/apt/lists/*

# Clone and build FontForge for Python 3.9
RUN git clone https://github.com/fontforge/fontforge.git \
    && cd fontforge \
    && ./bootstrap \
    && ./configure --enable-pyextension --with-python=python3.9 \
    && make -j$(nproc) \
    && make install \
    && ldconfig

# Install Python dependencies
WORKDIR /backend
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy code and run
COPY . .
EXPOSE 5000
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "server:app", "--timeout", "300"]
