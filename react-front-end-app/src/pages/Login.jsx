import React from "react";
import "./Login.css";

function Login() {
  return (
    <div className="page login-page">
      <h1>Sign In</h1>
      <form className="login-form">
        <label>
          Email
          <input type="email" placeholder="you@example.com" />
        </label>

        <label>
          Password
          <input type="password" placeholder="••••••••" />
        </label>

        <button type="submit">Log In</button>
      </form>

      <p className="small-note">
        Don’t have an account? <a href="/register">Create one</a>
      </p>
    </div>
  );
}

export default Login;