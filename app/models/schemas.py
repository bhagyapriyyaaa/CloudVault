# app/models/schemas.py

from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


# --- User Schemas ---

class UserCreate(BaseModel):
    """Data required to register a new user"""
    email: EmailStr
    username: str
    password: str


class UserResponse(BaseModel):
    """Data returned after registration or login"""
    id: int
    email: str
    username: str
    created_at: datetime

    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    """Data required to log in"""
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """JWT token returned after successful login"""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# --- File Schemas ---

class FileResponse(BaseModel):
    """Data returned after file upload"""
    id: int
    original_filename: str
    s3_key: str
    content_type: str
    size_mb: float
    download_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True