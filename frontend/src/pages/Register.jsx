// src/pages/Register.jsx

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/api";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await registerUser(form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>☁️ CloudVault</h1>
        <h2 style={styles.subtitle}>Create your account</h2>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Username</label>
            <input
              style={styles.input}
              type="text"
              name="username"
              placeholder="yourname"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh", display: "flex", alignItems: "center",
    justifyContent: "center", background: "#f0f4f8",
  },
  card: {
    background: "white", padding: "2.5rem", borderRadius: "12px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.1)", width: "100%", maxWidth: "420px",
  },
  title: { textAlign: "center", fontSize: "2rem", marginBottom: "0.25rem", color: "#1a1a2e" },
  subtitle: { textAlign: "center", fontSize: "1rem", color: "#666", marginBottom: "1.5rem", fontWeight: 400 },
  error: { background: "#fee2e2", color: "#dc2626", padding: "0.75rem", borderRadius: "8px", marginBottom: "1rem", fontSize: "0.9rem" },
  field: { marginBottom: "1.25rem" },
  label: { display: "block", marginBottom: "0.4rem", fontWeight: 500, color: "#333", fontSize: "0.9rem" },
  input: { width: "100%", padding: "0.75rem", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "1rem", boxSizing: "border-box", outline: "none" },
  button: { width: "100%", padding: "0.85rem", background: "#4f46e5", color: "white", border: "none", borderRadius: "8px", fontSize: "1rem", fontWeight: 600, cursor: "pointer", marginTop: "0.5rem" },
  footer: { textAlign: "center", marginTop: "1.5rem", color: "#666", fontSize: "0.9rem" },
  link: { color: "#4f46e5", textDecoration: "none", fontWeight: 600 },
};