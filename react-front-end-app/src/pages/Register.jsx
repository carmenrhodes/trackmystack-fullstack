import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"
import "./Register.css";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // frontend validation
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Registration failed");
      }

      const responseData = await res.json().catch(() => null);
      if (responseData?.token) {
        localStorage.setItem("token", responseData.token);
        localStorage.setItem("userEmail", responseData.email);
        navigate("/home"); 
} else {
  console.error("Registration failed:", responseData);
      }

      const data = await res.json().catch(() => null)
      if (data?.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userEmail", data.email);
     navigate("/", { replace: true }); // auto-login
      } else {
        navigate("/login");
      }
    } catch (err) {
      setError(err.message || "Something went wrong during registration.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page register-page">
      <h1>Create Account</h1>
      <form className="register-form" onSubmit={handleSubmit}>
        <label>
          Email
          <input 
          type="email" 
          placeholder="you@example.com" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required/>
        </label>

        <label>
          Password
          <input 
          type="password" 
          placeholder="Choose a password" 
          value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />
        </label>

        <label>
          Confirm Password
          <input 
          type="password" 
          placeholder="Repeat password" 
          value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            />
        </label>

        {error && <p className="error-text">{error}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? "Creating..." : "Sign Up"}
        </button>
      </form>

      <p className="small-note">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}

export default Register;