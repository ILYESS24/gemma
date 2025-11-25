#!/usr/bin/env python3
"""
Simple FastAPI application for Gemma model deployment on Render.
"""

import os
from typing import Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
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
        # Use the smaller 2B model for deployment (faster and uses less memory)
        model = gm.nn.Gemma3_2B()
        params = gm.ckpts.load_params(gm.ckpts.CheckpointPath.GEMMA3_2B_IT)
        print("Gemma model initialized successfully")
    except Exception as e:
        print(f"Error initializing Gemma model: {e}")
        print("The API will return mock responses")

@app.get("/")
async def root():
    """Root endpoint."""
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
        # Return a mock response if model failed to load
        return ChatResponse(
            response="Désolé, le modèle n'est pas disponible pour le moment.",
            status="mock_response"
        )

    try:
        # Create sampler
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
