from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import boto3
import os
import logging
from train.train import ChineseBERTTrainer
import tempfile

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
    model_output_url: str
    num_labels: int = 2
    batch_size: int = 16
    epochs: int = 3
    learning_rate: float = 2e-5

def parse_s3_url(url: str) -> tuple:
    """Parse S3 URL to get bucket and prefix."""
    if not url.startswith('s3://'):
        raise ValueError("URL must be an S3 URL starting with 's3://'")
    
    path = url[5:]  # Remove 's3://'
    bucket = path.split('/')[0]
    prefix = '/'.join(path.split('/')[1:])
    
    return bucket, prefix

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}

@app.post("/train")
async def train_model(request: TrainingRequest):
    """
    Endpoint to start model training using dataset from S3.
    
    Args:
        request: TrainingRequest containing the S3 URLs and training parameters
    """
    try:
        # Parse S3 URLs
        dataset_bucket, dataset_prefix = parse_s3_url(request.dataset_url)
        output_bucket, output_prefix = parse_s3_url(request.model_output_url)
        
        # Initialize trainer
        trainer = ChineseBERTTrainer(num_labels=request.num_labels)
        
        # Download and prepare data
        texts, labels = trainer.download_and_prepare_data(dataset_bucket, dataset_prefix)
        
        if not texts:
            raise HTTPException(
                status_code=404,
                detail="No valid data found in the specified S3 location"
            )
        
        # Create temporary directory for model output
        with tempfile.TemporaryDirectory() as temp_dir:
            # Train model
            training_result = trainer.train(
                texts=texts,
                labels=labels,
                output_dir=temp_dir,
                batch_size=request.batch_size,
                epochs=request.epochs,
                learning_rate=request.learning_rate
            )
            
            # Save model to S3
            trainer.save_model_to_s3(temp_dir, output_bucket, output_prefix)
        
        return {
            "status": "success",
            "training_result": training_result,
            "model_location": request.model_output_url
        }
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error during training: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 