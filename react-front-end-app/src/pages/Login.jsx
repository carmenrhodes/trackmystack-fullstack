import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { isLoggedIn } from "../services/authService";
import "./Auth.css";

const API_BASE = (
  import.meta?.env?.VITE_API_URL || "http://localhost:8080/api"
).replace(/\/+$/, "");

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  // If already logged in, redirect
  useEffect(() => {
    if (isLoggedIn()) navigate(from, { replace: true });
  }, [from, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Login failed");
      }

      // { token, email, fullName, userId }
      const data = await res.json();

      // Persist auth
      localStorage.setItem("token", data.token);
      localStorage.setItem("userEmail", data.email);

      // Derive and save firstName for greeting
      const firstFromName =
        (data.fullName && data.fullName.trim().split(" ")[0]) || "";
      const firstFromEmail =
        (data.email && data.email.includes("@") && data.email.split("@")[0]) ||
        "";
      const firstName = firstFromName || firstFromEmail || "Friend";
      localStorage.setItem("firstName", firstName);

      onLogin?.();
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      setError(err.message || "Login failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-tabs">
          <button className="tab active">Login</button>
          <Link to="/register" className="tab link-tab">
            Register
          </Link>
        </div>

        <h1 className="auth-title" style={{ textAlign: "center" }}>
          Welcome back
        </h1>
        <p className="auth-subtitle" style={{ textAlign: "center" }}>
          Sign in to track your precious metals.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-label">
            Email
            <input
              type="email"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="auth-label">
            Password
            <input
              type="password"
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-btn" disabled={submitting}>
            {submitting ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="auth-footer-text">
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
