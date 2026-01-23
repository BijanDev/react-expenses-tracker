import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';
import { api } from '../services/api';
import loginMobile from '../images/login_mobile-removebg-preview.png';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await api.login(formData);
      
      // Assuming the token is in data.access_token or similar
      sessionStorage.setItem('access_token', data.access_token || data.token);
      
      if (data.username || data.email) {
         sessionStorage.setItem('user', data.username || data.email);
      } else {
         sessionStorage.setItem('user', formData.email);
      }
      
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Left Side - Hero Section */}
      <div className="login-hero">
        <div className="hero-content">
          {/* Logo */}
          <div className="hero-logo">
            <svg className="logo-svg" viewBox="0 0 50 50" width="40" height="40">
              <circle cx="25" cy="25" r="20" fill="none" stroke="#00bcd4" strokeWidth="2"/>
              <circle cx="25" cy="25" r="12" fill="none" stroke="#4caf50" strokeWidth="2"/>
              <circle cx="25" cy="25" r="4" fill="#00bcd4"/>
              <line x1="25" y1="5" x2="25" y2="15" stroke="#00bcd4" strokeWidth="2"/>
              <line x1="25" y1="35" x2="25" y2="45" stroke="#00bcd4" strokeWidth="2"/>
              <line x1="5" y1="25" x2="15" y2="25" stroke="#00bcd4" strokeWidth="2"/>
              <line x1="35" y1="25" x2="45" y2="25" stroke="#00bcd4" strokeWidth="2"/>
            </svg>
            <span className="logo-text">Spendly</span>
          </div>

          {/* Card Mockups */}
          <div className="hero-cards">
            {/* Main Card */}
            <img src={loginMobile} alt="Login Mobile" className="hero-card" />
          </div>

          {/* Hero Text */}
          <div className="hero-text-container">
            <h1 className="hero-title">Manage your budget</h1>
            <p className="hero-subtitle">
              Track your expenses and save money - Check your financial health.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="login-form-container">
        <div className="form-wrapper">
          <h2 className="form-title">Sign In</h2>
          <p className="form-description">Sign in if you already have an account.</p>
          
          {error && (
            <div style={{ color: 'red', marginBottom: '1rem', fontSize: '0.9rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email address</label>
              <input
                type="text"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email address"
                required
                className="modern-input"
              />
            </div>
            
            <div className="form-group password-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
                className="modern-input"
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="#9ca3af">
                  {showPassword ? (
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                  ) : (
                    <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                  )}
                </svg>
              </button>
            </div>
            
            <div className="form-actions">
              <Link to="/forgot-password" className="forgot-password">Forgot password?</Link>
            </div>
            
            <div className="form-footer-actions">
              <div className="form-footer">
              <p className="signup-text">Don't have an account? <Link to="/register" className="signup-link">Sign Up</Link></p>
              <button type="submit" className="auth-button modern-button" disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
                {!loading && (
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="white" style={{marginLeft: '8px'}}>
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                )}
              </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
