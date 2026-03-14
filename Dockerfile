FROM python:3.11-slim

# Install system dependencies for OpenCV and YOLOv10
RUN apt-get update && apt-get install -y --no-install-recommends \
    libsm6 libxext6 libxrender-dev \
    libgomp1 libgl1 libglib2.0-0 \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy the entire project
COPY . .

# Install dependencies from the backend folder
RUN pip install --no-cache-dir -r backend/requirements.txt

# Hugging Face Spaces port
EXPOSE 8000

# Run using the root-level main.py proxy
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]