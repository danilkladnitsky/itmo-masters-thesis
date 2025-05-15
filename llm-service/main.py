from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
import logging
from llm.inference import ChineseSentenceGenerator
from s3.loader import ModelS3Loader
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Model Training Service")

class TrainingRequest(BaseModel):
    dataset_url: str
    model_output_url: str
    num_labels: int = 2
    batch_size: int = 16
    epochs: int = 3
    learning_rate: float = 2e-5

class GenerationRequest(BaseModel):
    model_name: str
    prompt: str
    max_length: int = 60
    num_return_sequences: int = 1

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

@app.post("/generate")
async def generate_text(request: GenerationRequest):
    """
    Endpoint to generate Chinese sentences using a trained model.
    
    Args:
        request: GenerationRequest containing the model path and generation parameters
    """

    model_path = None

    try:
        model_loader = ModelS3Loader(bucket_name=os.getenv('S3_BUCKET'), local_base_dir="./models")
        model_path = model_loader.load(model_name=request.model_name)
        print(f"[ModelS3Loader] Model loaded: {model_path}")
    except Exception as e:
        logger.error(f"Error during model loading: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

    try:
        # Initialize generator
        generator = ChineseSentenceGenerator(
            model_path=str(model_path),
            device=os.getenv('DEVICE', None)
        )
        
        # Generate text
        generated_sentences = generator.generate(
            prompt=request.prompt,
            max_length=request.max_length,
            num_return_sequences=request.num_return_sequences
        )
        
        return {
            "status": "success",
            "generated_sentences": generated_sentences
        }
        
    except Exception as e:
        logger.error(f"Error during text generation: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 