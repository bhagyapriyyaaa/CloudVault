# app/models/user.py

from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.sql import func
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self):
        return f"<User {self.email}>"
    
'''id — auto-incrementing primary key
email — unique, indexed for fast lookup
username — unique display name
hashed_password — we never store plain passwords, always hashed (Phase 5)
is_active — lets us disable accounts without deleting them
created_at — automatically set to current time when row is created'''