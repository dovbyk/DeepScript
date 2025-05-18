FROM ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive

# Install system dependencies and Python 3.10
RUN apt-get update && apt-get install -y \
    software-properties-common && \
    add-apt-repository ppa:deadsnakes/ppa -y && \
    apt-get update && apt-get install -y \
    python3.10 \
    python3.10-distutils \
    python3-pip \
    git \
    fontforge \
    python3-fontforge \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libfreetype6 \
    potrace \
    && rm -rf /var/lib/apt/lists/*

# Symlink python3.10 to python3 and python
RUN ln -sf /usr/bin/python3.10 /usr/bin/python3 && \
    ln -sf /usr/bin/python3.10 /usr/bin/python && \
    curl -sS https://bootstrap.pypa.io/get-pip.py | python3.10

WORKDIR /backend

COPY requirements.txt .
RUN pip3 install --upgrade pip setuptools && pip3 install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "server:app", "--timeout", "300"]
