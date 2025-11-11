import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { login, isLoggedIn } from "../services/authService";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  // If already logged in, redirect after first render
  useEffect(() => {
    if (isLoggedIn()) {
      navigate(from, { replace: true });
    }
  }, [from, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login({ email, password });
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
    <div style={{ maxWidth: 420, margin: "2rem auto", textAlign: "left" }}>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <label style={{ display: "block", marginTop: 12 }}>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: 8, marginTop: 4 }}
            required
          />
        </label>

        <label style={{ display: "block", marginTop: 12 }}>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: 8, marginTop: 4 }}
            required
          />
        </label>

        {error && <p style={{ color: "red", marginTop: 12 }}>{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          style={{
            marginTop: 16,
            padding: "8px 16px",
            background: "#2f5061",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          {submitting ? "Signing in…" : "Sign In"}
        </button>
      </form>

      <p style={{ marginTop: 16 }}>
        Don’t have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}
