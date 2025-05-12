from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import boto3
import os
from typing import List
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Model Training Service")

# Initialize S3 client
s3_client = boto3.client(
    's3',
    aws_access_key_id=os.getenv('S3_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('S3_SECRET_ACCESS_KEY'),
    region_name=os.getenv('S3_REGION', 'us-east-1')
)

class TrainingRequest(BaseModel):
    dataset_url: str

def parse_s3_url(url: str) -> tuple:
    """Parse S3 URL to get bucket and prefix."""
    if not url.startswith('s3://'):
        raise ValueError("URL must be an S3 URL starting with 's3://'")
    
    path = url[5:]  # Remove 's3://'
    bucket = path.split('/')[0]
    prefix = '/'.join(path.split('/')[1:])
    
    return bucket, prefix

def get_dataset_files(bucket: str, prefix: str) -> List[str]:
    """Get all .txt files from the specified S3 prefix."""
    try:
        response = s3_client.list_objects_v2(
            Bucket=bucket,
            Prefix=prefix
        )
        
        files = []
        for obj in response.get('Contents', []):
            if obj['Key'].endswith('.txt'):
                files.append(obj['Key'])
        
        return files
    except Exception as e:
        logger.error(f"Error listing S3 objects: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error accessing S3: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}

@app.post("/train")
async def train_model(request: TrainingRequest):
    """
    Endpoint to start model training using dataset from S3.
    
    Args:
        request: TrainingRequest containing the S3 URL to the dataset folder
    """
    try:
        # Parse S3 URL
        bucket, prefix = parse_s3_url(request.dataset_url)
        
        # Get dataset files
        dataset_files = get_dataset_files(bucket, prefix)
        
        if not dataset_files:
            raise HTTPException(
                status_code=404,
                detail="No .txt files found in the specified S3 location"
            )
        
        # TODO: Implement your model training logic here
        # This is where you would:
        # 1. Download the files from S3
        # 2. Process the data
        # 3. Train your model
        # 4. Save the model
        
        return {
            "status": "training_started",
            "dataset_files": dataset_files,
            "message": "Model training process initiated"
        }
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error during training: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 