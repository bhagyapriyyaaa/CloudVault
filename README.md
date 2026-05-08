# ☁️ CloudVault

CloudVault is a secure cloud-based file sharing system built using FastAPI and AWS services.  
The project allows users to upload, manage, and securely access files stored in the cloud using Amazon S3.

It is designed to demonstrate cloud integration, backend development, authentication, and scalable file storage architecture.

---

##  Features

- Secure file upload and download
- AWS S3 cloud storage integration
- JWT-based authentication
- User login and registration
- File metadata management
- Role-based access control
- Secure shareable file links
- RESTful API architecture
- Scalable cloud deployment

---

##  Tech Stack

### Backend
- Python
- FastAPI
- SQLAlchemy
- JWT Authentication

### Cloud Services
- AWS S3
- AWS IAM

### Database
- PostgreSQL

### Tools
- Git & GitHub

---

## 📂 Project Structure

```bash
cloudvault/
│
├── backend/
│   ├── main.py
│   ├── routes/
│   ├── models/
│   ├── services/
│   ├── auth/
│   └── database/
│
├── frontend/
│
├── requirements.txt
├── .env
└── README.md
