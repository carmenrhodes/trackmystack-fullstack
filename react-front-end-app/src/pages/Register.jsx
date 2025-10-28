import React from "react";
import "./Register.css";

function Register() {
  return (
    <div className="page register-page">
      <h1>Create Account</h1>
      <form className="register-form">
        <label>
          Email
          <input type="email" placeholder="you@example.com" />
        </label>

        <label>
          Password
          <input type="password" placeholder="Choose a password" />
        </label>

        <label>
          Confirm Password
          <input type="password" placeholder="Repeat password" />
        </label>

        <button type="submit">Sign Up</button>
      </form>

      <p className="small-note">
        Already have an account? <a href="/login">Log in</a>
      </p>
    </div>
  );
}

export default Register;