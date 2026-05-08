// src/pages/Dashboard.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { uploadFile, getMyFiles, deleteFile } from "../services/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
    else fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const res = await getMyFiles();
      setFiles(res.data.files);
    } catch {
      setError("Failed to load files");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError("");
    setSuccess("");
    const formData = new FormData();
    formData.append("file", file);
    try {
      await uploadFile(formData);
      setSuccess(`"${file.name}" uploaded successfully!`);
      fetchFiles();
    } catch (err) {
      setError(err.response?.data?.detail || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fileId, filename) => {
    if (!window.confirm(`Delete "${filename}"?`)) return;
    try {
      await deleteFile(fileId);
      setSuccess(`"${filename}" deleted successfully`);
      fetchFiles();
    } catch {
      setError("Failed to delete file");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleDownload = (url) => {
    window.open(url, "_blank");
  };

  const formatSize = (mb) =>
    mb < 1 ? `${(mb * 1024).toFixed(0)} KB` : `${mb.toFixed(2)} MB`;

  const getFileIcon = (type) => {
    if (type?.includes("image")) return "🖼️";
    if (type?.includes("pdf")) return "📄";
    if (type?.includes("zip")) return "🗜️";
    return "📁";
  };

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <span style={styles.navBrand}>☁️ CloudVault</span>
        <div style={styles.navRight}>
          <span style={styles.navUser}>👤 {user.username}</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div style={styles.container}>
        <h2 style={styles.heading}>My Files</h2>

        <div style={styles.uploadCard}>
          <p style={styles.uploadText}>📤 Upload a new file</p>
          <label style={styles.uploadLabel}>
            {uploading ? "Uploading..." : "Choose File"}
            <input
              type="file"
              onChange={handleUpload}
              disabled={uploading}
              style={{ display: "none" }}
            />
          </label>
          <p style={styles.uploadHint}>PDF, Images, ZIP, DOCX — max 10MB</p>
        </div>

        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}

        {loading ? (
          <p style={styles.loading}>Loading your files...</p>
        ) : files.length === 0 ? (
          <div style={styles.empty}>
            <p>📭 No files yet. Upload your first file above!</p>
          </div>
        ) : (
          <div style={styles.fileGrid}>
            {files.map((file) => (
              <div key={file.id} style={styles.fileCard}>
                <div style={styles.fileIcon}>{getFileIcon(file.content_type)}</div>
                <div style={styles.fileInfo}>
                  <p style={styles.fileName}>{file.original_filename}</p>
                  <p style={styles.fileMeta}>
                    {formatSize(file.size_mb)} •{" "}
                    {new Date(file.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div style={styles.fileActions}>
                  <button
                    style={styles.downloadBtn}
                    onClick={() => handleDownload(file.download_url)}
                  >
                    ⬇️ Download
                  </button>
                  <button
                    style={styles.deleteBtn}
                    onClick={() => handleDelete(file.id, file.original_filename)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#f0f4f8" },
  nav: {
    background: "#1a1a2e", padding: "1rem 2rem",
    display: "flex", justifyContent: "space-between", alignItems: "center",
  },
  navBrand: { color: "white", fontSize: "1.3rem", fontWeight: 700 },
  navRight: { display: "flex", alignItems: "center", gap: "1rem" },
  navUser: { color: "#a5b4fc", fontSize: "0.9rem" },
  logoutBtn: {
    background: "transparent", border: "1px solid #4f46e5",
    color: "#a5b4fc", padding: "0.4rem 1rem", borderRadius: "6px",
    cursor: "pointer", fontSize: "0.85rem",
  },
  container: { maxWidth: "900px", margin: "0 auto", padding: "2rem 1rem" },
  heading: { fontSize: "1.5rem", color: "#1a1a2e", marginBottom: "1.5rem" },
  uploadCard: {
    background: "white", border: "2px dashed #c7d2fe",
    borderRadius: "12px", padding: "2rem", textAlign: "center", marginBottom: "1.5rem",
  },
  uploadText: { fontSize: "1rem", color: "#4f46e5", marginBottom: "1rem", fontWeight: 500 },
  uploadLabel: {
    background: "#4f46e5", color: "white", padding: "0.75rem 2rem",
    borderRadius: "8px", cursor: "pointer", fontSize: "0.95rem", fontWeight: 600,
  },
  uploadHint: { marginTop: "0.75rem", fontSize: "0.8rem", color: "#999" },
  error: {
    background: "#fee2e2", color: "#dc2626", padding: "0.75rem 1rem",
    borderRadius: "8px", marginBottom: "1rem",
  },
  success: {
    background: "#dcfce7", color: "#16a34a", padding: "0.75rem 1rem",
    borderRadius: "8px", marginBottom: "1rem",
  },
  loading: { textAlign: "center", color: "#666", padding: "2rem" },
  empty: {
    textAlign: "center", color: "#888", padding: "3rem",
    background: "white", borderRadius: "12px",
  },
  fileGrid: { display: "flex", flexDirection: "column", gap: "0.75rem" },
  fileCard: {
    background: "white", borderRadius: "10px", padding: "1rem 1.5rem",
    display: "flex", alignItems: "center", gap: "1rem",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },
  fileIcon: { fontSize: "2rem" },
  fileInfo: { flex: 1 },
  fileName: { fontWeight: 600, color: "#1a1a2e", margin: 0, fontSize: "0.95rem" },
  fileMeta: { color: "#888", fontSize: "0.8rem", margin: "0.2rem 0 0" },
  fileActions: { display: "flex", gap: "0.5rem" },
  downloadBtn: {
    background: "#ede9fe", color: "#4f46e5", border: "none",
    padding: "0.4rem 0.85rem", borderRadius: "6px",
    cursor: "pointer", fontSize: "0.85rem", fontWeight: 500,
  },
  deleteBtn: {
    background: "#fee2e2", color: "#dc2626", border: "none",
    padding: "0.4rem 0.85rem", borderRadius: "6px",
    cursor: "pointer", fontSize: "0.85rem", fontWeight: 500,
  },
};