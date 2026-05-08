# app/services/s3_service.py

from dotenv import load_dotenv
load_dotenv()

import boto3
import os
from botocore.exceptions import ClientError
from fastapi import HTTPException

AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_REGION = os.getenv("AWS_REGION", "us-east-1")
AWS_BUCKET_NAME = os.getenv("AWS_BUCKET_NAME")

missing = [
    name for name, val in {
        "AWS_ACCESS_KEY_ID": AWS_ACCESS_KEY_ID,
        "AWS_SECRET_ACCESS_KEY": AWS_SECRET_ACCESS_KEY,
        "AWS_BUCKET_NAME": AWS_BUCKET_NAME,
    }.items() if not val
]

if missing:
    raise RuntimeError(
        f"Missing required environment variables: {', '.join(missing)}. "
        f"Check your .env file."
    )


def get_s3_client():
    from botocore.config import Config
    return boto3.client(
        "s3",
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        region_name=AWS_REGION,
        endpoint_url=f"https://s3.{AWS_REGION}.amazonaws.com",
        config=Config(signature_version="s3v4")  
    )

def upload_file_to_s3(file_content: bytes, filename: str, content_type: str) -> str:
    s3 = get_s3_client()
    
    # TEMPORARY DEBUG - remove after fixing
    print(f"Uploading to bucket: {AWS_BUCKET_NAME}")
    print(f"Region: {AWS_REGION}")
    print(f"Filename: {filename}")
    print(f"File size: {len(file_content)} bytes")
    
    try:
        s3.put_object(
            Bucket=AWS_BUCKET_NAME,
            Key=filename,
            Body=file_content,
            ContentType=content_type
        )
        print("Upload SUCCESS")
        return filename
    except ClientError as e:
        print(f"Upload FAILED: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to upload file to S3: {str(e)}"
        )


def generate_presigned_url(s3_key: str, expiry_seconds: int = 3600) -> str:
    s3 = get_s3_client()
    try:
        url = s3.generate_presigned_url(
            "get_object",
            Params={
                "Bucket": AWS_BUCKET_NAME,
                "Key": s3_key
            },
            ExpiresIn=expiry_seconds
        )
        return url
    except ClientError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate download URL: {str(e)}"
        )


def delete_file_from_s3(s3_key: str) -> bool:
    s3 = get_s3_client()
    try:
        s3.delete_object(
            Bucket=AWS_BUCKET_NAME,
            Key=s3_key
        )
        return True
    except ClientError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete file from S3: {str(e)}"
        )