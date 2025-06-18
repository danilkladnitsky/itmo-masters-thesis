from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
import logging
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from service.gap_task import GapTaskService
from service.word_bundle import WordBundleService

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Model Training Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://daimao.1431207-ck39036.tw1.ru", "https://daimao.ru", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GenerationRequest(BaseModel):
    inference_model_name: str
    prompt: str
    max_length: int = 60
    num_return_sequences: int = 1

class GapsTaskRequest(BaseModel):
    bundles_ids: list[int]

class TaskGapRequest(BaseModel):
    bundles_ids: list[int]

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

@app.post("/generate-gap-task")
async def generate_gap_task(request: TaskGapRequest):
    try:
        gap_task_service = GapTaskService()
        return gap_task_service.generate_gap_task(bundles_ids=request.bundles_ids)
    except Exception as e:
        logger.error(f"Error during gap task generation: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/word-bundles")
async def get_word_bundles():
    try:
        word_bundles = WordBundleService().get_word_bundles()
        return word_bundles
    except Exception as e:
        logger.error(f"Error during word bundle retrieval: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 