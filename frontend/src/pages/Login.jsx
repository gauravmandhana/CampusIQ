
import { useState } from "react";
import "../Login.css";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password) {
      setError("Please enter username and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username.trim(),
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || data.message || "Login failed."
        );
      }

      // Save login information
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("username", data.user.username);
      localStorage.setItem("role", data.user.role);

      // Notify App.jsx
      onLogin(data.user.role);

    } catch (err) {
      console.error("LOGIN ERROR:", err);

      setError(
        err.message || "Unable to connect to CampusIQ server."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* Background Decorations */}
      <div className="login-background-shape shape-one"></div>
      <div className="login-background-shape shape-two"></div>

      <div className="login-card">

        {/* Logo */}
        <div className="login-logo">
          <span>IQ</span>
        </div>

        {/* Header */}
        <div className="login-header">
          <h1>
            Campus<span>IQ</span>
          </h1>

          <p>
            AI-Powered Student Assistance Platform
          </p>
        </div>

        {/* Welcome */}
        <div className="login-welcome">
          <h2>Welcome Back!</h2>
          <p>Sign in to continue to your account.</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin}>

          {/* Username */}
          <div className="form-group">
            <label htmlFor="username">
              Username
            </label>

            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              autoComplete="username"
              required
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">
              Password
            </label>

            <div className="password-input-wrapper">

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />

              {/* Show / Hide Password */}
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={
                  showPassword ? "Hide password" : "Show password"
                }
                title={
                  showPassword ? "Hide password" : "Show password"
                }
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8" />
                    <path d="M9.9 5.2A11.4 11.4 0 0112 5c5 0 8.5 4.5 9.5 7-.4 1-1.3 2.3-2.5 3.5M6.2 6.2C3.9 7.7 2.7 10 2.5 12c1 2.5 4.5 7 9.5 7 1.3 0 2.5-.3 3.5-.8" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>

            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            className="login-submit-button"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login"}

            {!loading && <span>→</span>}
          </button>

        </form>

        {/* Secure Login Information */}
        <div className="login-info">
          <span className="login-info-line"></span>

          <p>Secure Login · CampusIQ</p>

          <span className="login-info-line"></span>
        </div>

        {/* Developer Credit - Separate Section */}
        <div className="login-footer">
          <p>Designed & Developed by</p>

          <h3>Gaurav</h3>

          <span>B.Tech CSE | Data Science</span>
        </div>

      </div>
    </div>
  );
}

export default Login;
