import os
import requests
from dotenv import load_dotenv

# Load variables from .env
load_dotenv()

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434/api/generate")
MODEL_NAME = os.getenv("MODEL_NAME", "llama3")

def generate_with_ollama(prompt: str, model: str = None):
    """
    Sends a prompt to Ollama LLM and returns the response.
    If no model is provided, uses MODEL_NAME from .env
    """
    if model is None:
        model = MODEL_NAME

    try:
        response = requests.post(
            OLLAMA_URL,
            json={
                "model": model,
                "prompt": prompt,
                "stream": False
            }
        )

        if response.status_code == 200:
            # Ollama returns JSON like {"response": "..."}
            return response.json().get("response", "")
        else:
            raise Exception(f"Ollama error: {response.text}")

    except requests.exceptions.RequestException as e:
        raise Exception(f"Request to Ollama failed: {str(e)}")