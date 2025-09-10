from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from datetime import datetime
import logging
import os

from models.chat_models import ChatRequest, ChatResponse, HealthStatus
from services.groq_service import GroqService

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Mental Health Chatbot API",
    description="A compassionate AI chatbot for mental health support",
    version="1.0.0"
)

# CORS middleware - Allow all origins for testing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=False,  # Set to False when using allow_origins=["*"]
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Initialize services
groq_service = GroqService()

@app.on_event("startup")
async def startup_event():
    logger.info("Mental Health Chatbot API starting up...")
    # Verify Groq API key is set
    if not os.getenv("GROQ_API_KEY"):
        logger.error("GROQ_API_KEY not found in environment variables")
        raise Exception("GROQ_API_KEY is required")
    logger.info("API started successfully")

@app.get("/")
async def root():
    return {"message": "Mental Health Chatbot API", "status": "running"}

@app.get("/health", response_model=HealthStatus)
async def health_check():
    return HealthStatus(status="healthy", timestamp=datetime.now())

# Add a simple OPTIONS handler for /chat
@app.options("/chat")
async def chat_options():
    return {"message": "OK"}

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        logger.info(f"Received chat request from frontend")
        logger.info(f"Message: {request.message[:50]}...")
        logger.info(f"Conversation history length: {len(request.conversation_history) if request.conversation_history else 0}")
        
        # Check for crisis situations
        if groq_service.is_crisis_message(request.message):
            logger.info("Crisis message detected, returning crisis response")
            crisis_response = groq_service.get_crisis_response()
            return ChatResponse(
                response=crisis_response,
                conversation_id=request.user_id,
                timestamp=datetime.now()
            )
        
        # Generate response using Groq
        logger.info("Calling Groq API...")
        response_text = await groq_service.generate_response(
            user_message=request.message,
            conversation_history=request.conversation_history
        )
        logger.info(f"Groq API response received: {response_text[:100]}...")
        
        return ChatResponse(
            response=response_text,
            conversation_id=request.user_id,
            timestamp=datetime.now()
        )
        
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="I'm sorry, I'm experiencing technical difficulties. Please try again."
        )

@app.get("/models")
async def get_available_models():
    """Get information about available models"""
    return {
        "current_model": "llama3-70b-8192",
        "available_models": [
            "llama3-70b-8192",
            "llama3-8b-8192",
            "mixtral-8x7b-32768",
            "gemma-7b-it"
        ],
        "description": "Mental health support chatbot powered by Groq"
    }

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Global exception handler: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={
            "detail": "An unexpected error occurred. Please try again.",
            "timestamp": datetime.now().isoformat()
        }
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )