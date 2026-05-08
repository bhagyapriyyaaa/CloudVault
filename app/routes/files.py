# app/routes/files.py

from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
import os
import uuid
from app.services.s3_service import (
    upload_file_to_s3,
    generate_presigned_url,
    delete_file_from_s3
)
from app.database import get_db
from app.models.file import FileMetadata
from app.models.schemas import FileResponse
from app.auth.dependencies import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/files",
    tags=["Files"]
)

ALLOWED_TYPES = {
    "image/jpeg", "image/png", "image/gif",
    "application/pdf",
    "text/plain",
    "application/zip",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
}

MAX_FILE_SIZE_MB = 10


@router.post("/upload", response_model=FileResponse, status_code=201)
async def upload_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # ← requires login
):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail=f"File type not allowed.")

    contents = await file.read()
    file_size_mb = len(contents) / (1024 * 1024)

    if file_size_mb > MAX_FILE_SIZE_MB:
        raise HTTPException(status_code=400, detail=f"File exceeds 10MB limit.")

    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"uploads/{uuid.uuid4()}{file_extension}"

    s3_key = upload_file_to_s3(contents, unique_filename, file.content_type)
    download_url = generate_presigned_url(s3_key)

    # Save metadata to database
    file_record = FileMetadata(
        original_filename=file.filename,
        stored_filename=unique_filename,
        s3_key=s3_key,
        content_type=file.content_type,
        size_mb=round(file_size_mb, 4),
        owner_id=current_user.id   # ← link to logged-in user
    )
    db.add(file_record)
    db.commit()
    db.refresh(file_record)

    file_record.download_url = download_url
    return file_record


@router.get("/my-files")
def get_my_files(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all files uploaded by the current user"""
    files = db.query(FileMetadata).filter(
        FileMetadata.owner_id == current_user.id
    ).all()

    result = []
    for f in files:
        result.append({
            "id": f.id,
            "original_filename": f.original_filename,
            "s3_key": f.s3_key,
            "content_type": f.content_type,
            "size_mb": f.size_mb,
            "download_url": generate_presigned_url(f.s3_key),
            "created_at": str(f.created_at)
        })
    return {"total": len(result), "files": result}


@router.delete("/{file_id}")
def delete_file(
    file_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a file - only the owner can delete their file"""
    file_record = db.query(FileMetadata).filter(
        FileMetadata.id == file_id,
        FileMetadata.owner_id == current_user.id
    ).first()

    if not file_record:
        raise HTTPException(status_code=404, detail="File not found")

    delete_file_from_s3(file_record.s3_key)
    db.delete(file_record)
    db.commit()

    return {"message": "File deleted successfully"}