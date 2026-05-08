# app/database/__init__.py
#sqlalchemy — the ORM (Python ↔ database translator)
#psycopg2-binary — the driver that actually connects Python to PostgreSQL
#alembic — handles database migrations (when you change your models later)

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Create the database engine
# This is the actual connection to PostgreSQL
engine = create_engine(DATABASE_URL)

# Each request gets its own database session
# SessionLocal is a factory that creates sessions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class that all our models will inherit from
Base = declarative_base()


def get_db():
    """
    Dependency function that provides a database session.
    Used in FastAPI routes like: db: Session = Depends(get_db)
    
    The try/finally ensures the session is always closed
    after the request, even if an error occurs.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()