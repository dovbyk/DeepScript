FROM ubuntu:20.04
ENV DEBIAN_FRONTEND=noninteractive
# Install build dependencies for Python and FontForge
RUN apt-get update && apt-get install -y \
    build-essential \
    wget \
    curl \
    git \
    libssl-dev \
    zlib1g-dev \
    libbz2-dev \
    libreadline-dev \
    libsqlite3-dev \
    libffi-dev \
    libncurses5-dev \
    libgdbm-dev \
    libgdbm-compat-dev \
    liblzma-dev \
    tk-dev \
    uuid-dev \
    libpng-dev \
    libjpeg-dev \
    libtiff-dev \
    libfreetype6-dev \
    libx11-dev \
    libxext-dev \
    libxi-dev \
    libxrender-dev \
    libxcb1-dev \
    libcairo2-dev \
    libpango1.0-dev \
    libxml2-dev \
    libspiro-dev \
    python3-cairo-dev \
    cmake \
    pkg-config \
    potrace \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libfreetype6 \
    gettext \
    libgtk-3-dev

# Install Python 3.9.19 from source
WORKDIR /opt
RUN wget https://www.python.org/ftp/python/3.9.19/Python-3.9.19.tgz && \
    tar xzf Python-3.9.19.tgz && \
    cd Python-3.9.19 && \
    ./configure --enable-optimizations && \
    make -j$(nproc) && \
    make altinstall
# Symlink python3 and pip3 to our custom Python
RUN ln -sf /usr/local/bin/python3.9 /usr/bin/python3 && \
    ln -sf /usr/local/bin/pip3.9 /usr/bin/pip3
# Build FontForge from source with Python 3.9 bindings
WORKDIR /opt
RUN git clone --depth=1 https://github.com/fontforge/fontforge.git && \
    cd fontforge && \
    mkdir build && cd build && \
    cmake .. -DPYTHON_EXECUTABLE=/usr/local/bin/python3.9 -DENABLE_PYTHON_SCRIPTING=ON -DENABLE_PYTHON_EXTENSION=ON && \
    make -j$(nproc) && \
    make install
RUN ldconfig
WORKDIR /backend
COPY requirements.txt .
RUN pip3 install --upgrade pip && pip3 install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "server:app", "--timeout", "300"]
