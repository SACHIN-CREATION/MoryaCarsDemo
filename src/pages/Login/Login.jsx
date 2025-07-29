import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    // Simulate backend validation
    setTimeout(() => {
      setLoading(false);

      const { email, password } = credentials;

      if (email === "admin@moryacars.com" && password === "password") {
        localStorage.setItem("token", "fake-jwt-admin");
        localStorage.setItem("role", "admin");
        navigate("/admin/dashboard");
      } else if (
        email === "executive@moryacars.com" &&
        password === "password"
      ) {
        localStorage.setItem("token", "fake-jwt-executive");
        localStorage.setItem("role", "executive");
        navigate("/executive/dashboard");
      } else {
        setErrorMessage("Invalid email or password.");
      }
    }, 1000);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="brand-header">
          <div className="brand-icon">🚗</div>
          <h1>Morya Cars</h1>
        </div>

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={credentials.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group password-input">
            <label htmlFor="password">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              value={credentials.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
            >
              {showPassword ? '🐵' : '🙈'}
            </button>
            
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? <span className="loading-spinner" /> : null}
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="login-footer">
          <a href="#">Forgot Password?</a>
          <span>© 2025 Morya Cars</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
