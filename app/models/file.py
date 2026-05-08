# app/models/file.py

from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class FileMetadata(Base):
    __tablename__ = "files"

    id = Column(Integer, primary_key=True, index=True)
    original_filename = Column(String, nullable=False)
    stored_filename = Column(String, nullable=False)
    s3_key = Column(String, nullable=False, unique=True)
    content_type = Column(String, nullable=False)
    size_mb = Column(Float, nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # This lets you do file.owner to get the User object
    owner = relationship("User", backref="files")

    def __repr__(self):
        return f"<File {self.original_filename}>"