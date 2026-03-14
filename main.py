import os
import sys

# Add the backend directory to the Python path
backend_path = os.path.join(os.path.dirname(__file__), "backend")
if os.path.exists(backend_path):
        sys.path.insert(0, backend_path)

    # Import the FastAPI app from backend/main.py
    try:
            from backend.main import app
except ImportError:
        # Fallback for different environments
        from main import app

    if __name__ == "__main__":
            import uvicorn
            # Hugging Face Spaces port is usually 7860 or 8000
            port = int(os.getenv("PORT", 8000))
            uvicorn.run(app, host="0.0.0.0", port=port)
        