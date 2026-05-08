# app/main.py

from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from app.routes import files, auth
from app.database import engine, Base
from app.models import user, file

Base.metadata.create_all(bind=engine)

security = HTTPBearer()

app = FastAPI(
    title="CloudVault API",
    description="Secure cloud-based file sharing system",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(files.router)

@app.get("/")
def read_root():
    return {
        "message": "CloudVault API is running",
        "version": "1.0.0",
        "status": "healthy"
    }

@app.get("/health")
def health_check():
    return {"status": "ok"}