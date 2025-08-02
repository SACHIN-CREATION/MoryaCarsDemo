import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
// Make sure you have the Morya Cars logo in your assets folder
import moryaCarsLogo from '../../assets/moryacars_logo.png';

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    // Simulate backend validation
    setTimeout(() => {
      setLoading(false);

      const { email, password } = credentials;

      if (email === 'admin@moryacars.com' && password === 'password') {
        localStorage.setItem('token', 'fake-jwt-admin');
        localStorage.setItem('role', 'admin');
        navigate('/admin/dashboard');
      } else if (email === 'executive@moryacars.com' && password === 'password') {
        localStorage.setItem('token', 'fake-jwt-executive');
        localStorage.setItem('role', 'executive');
        navigate('/executive/dashboard');
      } else {
        setErrorMessage('Invalid email or password.');
      }
    }, 1000);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-form-section">
          <div className="login-form-wrapper">
            <div className="login-form-container">
              <div className="login-image-container">
                <img src={moryaCarsLogo} alt="Morya Cars Logo" className="login-image" />
              </div>
              <h1 className="login-title">LOGIN</h1>
              <p className="login-subtitle">Enter your credentials to access your account.</p>

              {errorMessage && <div className="error-message">{errorMessage}</div>}

              <form className="login-form" onSubmit={handleLogin}>
                <div className="login-form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={credentials.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="login-form-group">
                  <label htmlFor="password">Password</label>
                  <div className="login-password-input-container">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={credentials.password}
                      onChange={handleChange}
                      placeholder="********"
                      required
                    />
                    <button
                      type="button"
                      className="login-toggle-password"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                <div className="login-form-options">
                  <label className="login-remember-me">
                    <input
                      type="checkbox"
                      id="login-remember-me-checkbox"
                    />
                    Remember me
                  </label>
                  <a href="#forgot" className="login-forgot-password">Forgot Password?</a>
                </div>

                <button
                  type="submit"
                  className="login-submit-button"
                  disabled={loading}
                >
                  {loading ? <span className="loading-spinner" /> : null}
                  {loading ? 'Logging in...' : 'LOGIN'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
