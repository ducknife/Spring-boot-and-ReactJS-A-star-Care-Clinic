import google.generativeai as genai
import os

os.environ["GOOGLE_API_KEY"] = "your_api_key";
genai.configure(api_key=os.environ["GOOGLE_API_KEY"])

GEMINI_MODEL = "models/gemini-2.5-flash" 
EMBED_MODEL_NAME  = "sentence-transformers/all-MiniLM-L6-v2"

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DOCS_DIR = os.path.join(BASE_DIR, "data", "docs")
FAISS_DIR = os.path.join(BASE_DIR, "vectordb")

os.makedirs(DOCS_DIR, exist_ok=True)

