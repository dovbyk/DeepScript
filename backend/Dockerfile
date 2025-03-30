# Use Alpine Linux with Python 3.9
FROM python:3.9-alpine

# Install fontforge and required dependencies
RUN apk add --no-cache \
    fontforge \
    fontforge-dev \
    python3-dev \
    py3-pip \
    gcc \
    musl-dev \
    jpeg-dev \
    zlib-dev \
    freetype-dev \
    lcms2-dev \
    openjpeg-dev \
    tiff-dev \
    tk-dev \
    tcl-dev \
    harfbuzz-dev \
    fribidi-dev \
    libffi-dev

# Make python-fontforge available in Python path
RUN ln -s /usr/lib/python3*/site-packages/fontforge.so /usr/local/lib/python3.9/site-packages/
RUN ln -s /usr/lib/python3*/site-packages/_fontforge.so /usr/local/lib/python3.9/site-packages/ || true
RUN ln -s /usr/lib/python3*/site-packages/fontforge.py /usr/local/lib/python3.9/site-packages/

# Set the working directory
WORKDIR /backend

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Verify fontforge is available
RUN python -c "import fontforge; print('FontForge is available')"

# Expose the port your application uses
EXPOSE 5000

# Start the application
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "server:app"]
