FROM python:3.9-slim

# Set noninteractive mode
ENV DEBIAN_FRONTEND=noninteractive

# Install system dependencies (ADD xz-utils to handle .tar.xz)
RUN apt-get update && apt-get install -y \
    wget \
    xz-utils \
    git \
    build-essential \
    autoconf \
    automake \
    libtool \
    pkg-config \
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
    libxml2-dev \
    libreadline-dev \
    zlib1g-dev \
    libgl1-mesa-glx \
    libglib2.0-0 \
    potrace \
    && rm -rf /var/lib/apt/lists/*

# Download LATEST FontForge release tarball (correct URL)
RUN wget https://github.com/fontforge/fontforge/releases/download/20230101/fontforge-20230101.tar.xz \
    && tar -xJf fontforge-20230101.tar.xz \
    && cd fontforge-20230101 \
    && ./configure --enable-pyextension --with-python=python3.9 \
    && make -j$(nproc) \
    && make install \
    && ldconfig \
    && cd .. \
    && rm -rf fontforge-20230101 fontforge-20230101.tar.xz


# Install Python dependencies
WORKDIR /backend
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy code and run
COPY . .
EXPOSE 5000
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "server:app", "--timeout", "300"]
