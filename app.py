#!/usr/bin/env python3
"""
Simple FastAPI application for Gemma model deployment on Render.
"""

import os
from typing import Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
import uvicorn

# Import Gemma (will be available after installation)
try:
    from gemma import gm
    GEMMA_AVAILABLE = True
except ImportError:
    GEMMA_AVAILABLE = False
    print("Warning: Gemma library not available. Install with: pip install gemma")

app = FastAPI(
    title="Gemma API",
    description="API for Google's Gemma language model",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

class ChatRequest(BaseModel):
    message: str
    max_tokens: Optional[int] = 100
    temperature: Optional[float] = 0.7

class ChatResponse(BaseModel):
    response: str
    status: str

# Global variables for model and params
model = None
params = None

@app.on_event("startup")
async def startup_event():
    """Initialize the Gemma model on startup."""
    global model, params

    if not GEMMA_AVAILABLE:
        print("Gemma library not available, skipping model initialization")
        return

    try:
        print("Initializing Gemma model...")
        print("Available checkpoints:")
        try:
            for checkpoint in gm.ckpts.CheckpointPath:
                print(f"  - {checkpoint}")
        except Exception as e:
            print(f"  Could not list checkpoints: {e}")

        # Try to load the model - this will likely fail due to missing checkpoints
        # For now, we'll use mock responses in production
        print("Note: Model loading is disabled for Render deployment due to resource constraints")
        print("Using mock responses instead")
        # Uncomment the lines below if you want to try loading the model:
        # model = gm.nn.Gemma3_2B()
        # params = gm.ckpts.load_params(gm.ckpts.CheckpointPath.GEMMA3_2B_IT)
        # print("Gemma model initialized successfully")

    except Exception as e:
        print(f"Error initializing Gemma model: {e}")
        print("The API will return mock responses")

@app.get("/", response_class=HTMLResponse)
async def root():
    """Serve the chat interface."""
    try:
        with open("static/index.html", "r", encoding="utf-8") as f:
            return f.read()
    except FileNotFoundError:
        # Fallback to JSON response if HTML file not found
        return {
            "message": "Gemma API is running",
            "model_loaded": model is not None,
            "gemma_available": GEMMA_AVAILABLE
        }

@app.get("/health")
async def health():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "gemma_available": GEMMA_AVAILABLE
    }

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Chat with the Gemma model."""
    if not GEMMA_AVAILABLE:
        raise HTTPException(
            status_code=503,
            detail="Gemma library not available. Please install with: pip install gemma"
        )

    if model is None or params is None:
        # Return a mock response simulating Gemma's behavior
        user_message = request.message.lower()

        # Simple rule-based responses to simulate Gemma
        if "bonjour" in user_message or "salut" in user_message or "hello" in user_message:
            response_text = "Bonjour ! Je suis une IA basée sur le modèle Gemma de Google. Comment puis-je vous aider aujourd'hui ?"
        elif "comment" in user_message and "aller" in user_message:
            response_text = "Je vais très bien, merci de demander ! Je suis opérationnel et prêt à vous aider."
        elif "qui" in user_message and "tu" in user_message:
            response_text = "Je suis une API basée sur le modèle Gemma, créée par Google DeepMind. Je suis conçue pour aider les utilisateurs avec diverses tâches."
        elif "merci" in user_message or "thank" in user_message:
            response_text = "De rien ! N'hésitez pas si vous avez d'autres questions."
        elif "python" in user_message or "programmation" in user_message:
            response_text = "Python est un excellent langage de programmation ! Il est largement utilisé pour le développement web, l'analyse de données, l'IA, et bien plus encore."
        elif "gemma" in user_message:
            response_text = "Gemma est une famille de modèles de langage open-source développés par Google DeepMind. Je suis fier d'être basé sur cette technologie !"
        else:
            response_text = f"Je comprends que vous dites : '{request.message}'. En tant qu'IA basée sur Gemma, je peux vous aider avec diverses questions. Pouvez-vous être plus spécifique ?"

        return ChatResponse(
            response=response_text,
            status="mock_response"
        )

    try:
        # Create sampler (only if model is loaded)
        sampler = gm.text.ChatSampler(
            model=model,
            params=params,
            multi_turn=False,  # Simple single-turn conversation
        )

        # Generate response
        response_text = sampler.sample(request.message)

        return ChatResponse(
            response=response_text,
            status="success"
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating response: {str(e)}"
        )

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
