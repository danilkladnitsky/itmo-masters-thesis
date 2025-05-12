# Model Training Service

A FastAPI service that allows fetching datasets from S3 and running model training.

## Setup

### Option 1: Local Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set up environment variables:
```bash
export AWS_ACCESS_KEY_ID=your_access_key
export AWS_SECRET_ACCESS_KEY=your_secret_key
export AWS_REGION=your_region  # optional, defaults to us-east-1
```

3. Run the service:
```bash
python main.py
```

### Option 2: Docker Setup

1. Build the Docker image:
```bash
docker build -t model-training-service .
```

2. Run the container:
```bash
docker run -p 8000:8000 \
  -e AWS_ACCESS_KEY_ID=your_access_key \
  -e AWS_SECRET_ACCESS_KEY=your_secret_key \
  -e AWS_REGION=your_region \
  model-training-service
```

The service will be available at `http://localhost:8000`

## API Endpoints

### Health Check
- **GET** `/health`
- Returns the health status of the service

### Train Model
- **POST** `/train`
- Request body:
```json
{
    "dataset_url": "s3://your-bucket/path/to/dataset/"
}
```
- The dataset URL should point to a folder containing .txt files
- Returns the list of dataset files found and training status

## API Documentation

Once the service is running, you can access the interactive API documentation at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc` 