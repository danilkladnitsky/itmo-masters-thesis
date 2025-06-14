from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
import logging
from llm.inference import ChineseSentenceGenerator
from s3.loader import ModelS3Loader
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
import random
import re
from service.gap_task import GapTaskService
from service.word_bundle import WordBundleService

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Model Training Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://frontend.daimao.ru", "https://daimao.ru", "http://localhost:5173"],
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

@app.post("/generate-gaps")
async def generate_gaps(request: GapsTaskRequest):
    """
    Generate one Chinese sentence with a gap. If the target word is found in generated sentences,
    replace it. Otherwise, choose a random word from the sentence.
    """
    try:
        model_loader = ModelS3Loader(bucket_name=os.getenv('S3_BUCKET'), local_base_dir="./models")
        model_path = model_loader.load(model_name=request.inference_model_name)
        print(f"[ModelS3Loader] Model loaded: {model_path}")
    except Exception as e:
        logger.error(f"Error during model loading: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

    try:
        generator = ChineseSentenceGenerator(
            model_path=str(model_path),
            device=os.getenv('DEVICE', None)
        )

        generated_sentences = generator.generate(
            word=request.word,
            max_length=100,
            num_return_sequences=5
        )

        chosen_sentence = None
        answer_word = None

        # Try to find a sentence that contains the request.word
        for sentence in generated_sentences:
            if request.word in sentence:
                chosen_sentence = sentence
                answer_word = request.word
                break

        if not chosen_sentence:
            # Use the first sentence and choose a random word from it
            chosen_sentence = generated_sentences[0]
            words = re.findall(r'\b[\u4e00-\u9fff]{1,3}\b', chosen_sentence)
            if not words:
                raise HTTPException(status_code=500, detail="No suitable word found in generated sentence.")
            answer_word = random.choice(words)

        sentence_with_gap = chosen_sentence.replace(answer_word, "_", 1)

        # Generate distractors
        distractors_pool = ["水", "牛奶", "果汁", "咖啡", "啤酒", "饮料", "汤", "饭", "书", "电脑"]
        distractors = random.sample([w for w in distractors_pool if w != answer_word], 3)
        options = distractors + [answer_word]
        random.shuffle(options)

        return {
            "status": "success",
            "sentence_with_gap": sentence_with_gap,
            "options": options,
            "answer": answer_word,
            "generated_sentences": generated_sentences
        }

    except Exception as e:
        logger.error(f"Error during gap generation: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

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
        model_path = model_loader.load(model_name=request.inference_model_name)
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