import React, { useState } from 'react';
import { GraduationCapIcon } from './Icons';

export default function SignIn({ onSignIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      localStorage.setItem('token', data.token);
      localStorage.setItem('userName', data.name);
      onSignIn(data.name);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .signin-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #0d1117 0%, #0a2a2a 50%, #0d1117 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Outfit', sans-serif;
          padding: 1rem;
        }

        .signin-card {
          width: 100%;
          max-width: 400px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 2.5rem 2rem;
          backdrop-filter: blur(12px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.4), 0 0 80px rgba(20,184,166,0.06);
        }

        .signin-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 2rem;
        }

        .signin-logo-text {
          font-size: 1.4rem;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: 0.03em;
        }

        .signin-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 0.4rem;
        }

        .signin-subtitle {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.4);
          margin-bottom: 2rem;
        }

        .form-group {
          margin-bottom: 1.1rem;
        }

        .form-label {
          display: block;
          font-size: 0.78rem;
          font-weight: 600;
          color: rgba(255,255,255,0.5);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 0.45rem;
        }

        .form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          color: #ffffff;
          font-family: 'Outfit', sans-serif;
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
        }

        .form-input::placeholder {
          color: rgba(255,255,255,0.2);
        }

        .form-input:focus {
          border-color: rgba(45,212,191,0.5);
          background: rgba(45,212,191,0.04);
          box-shadow: 0 0 0 3px rgba(45,212,191,0.1);
        }

        .error-msg {
          font-size: 0.82rem;
          color: #fb7185;
          background: rgba(251,113,133,0.1);
          border: 1px solid rgba(251,113,133,0.2);
          border-radius: 8px;
          padding: 0.6rem 0.9rem;
          margin-bottom: 1rem;
          text-align: center;
        }

        .signin-btn {
          width: 100%;
          padding: 0.85rem;
          background: linear-gradient(90deg, #0d9488, #14b8a6, #2dd4bf);
          border: none;
          border-radius: 10px;
          color: #ffffff;
          font-family: 'Outfit', sans-serif;
          font-size: 0.95rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          cursor: pointer;
          margin-top: 0.5rem;
          box-shadow: 0 4px 20px rgba(20,184,166,0.35);
          transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
          position: relative;
          overflow: hidden;
        }

        .signin-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(20,184,166,0.5);
        }

        .signin-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .signin-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .signin-divider {
          border: none;
          border-top: 1px solid rgba(255,255,255,0.06);
          margin: 1.5rem 0 1rem;
        }

        .signin-hint {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.25);
          text-align: center;
          line-height: 1.7;
        }

        .signin-hint span {
          color: rgba(45,212,191,0.6);
        }

        /* Gradient ring decoration */
        .signin-card::before {
          content: '';
          position: absolute;
          top: -1px; left: -1px; right: -1px; bottom: -1px;
          border-radius: 21px;
          background: linear-gradient(135deg, rgba(45,212,191,0.15), transparent, rgba(45,212,191,0.05));
          z-index: -1;
          pointer-events: none;
        }
      `}</style>

      <div className="signin-page">
        <div className="signin-card" style={{ position: 'relative' }}>
          {/* Logo */}
          <div className="signin-logo">
            <GraduationCapIcon size={24} style={{ color: '#ffffff' }} />
            <span className="signin-logo-text">Vinamra</span>
          </div>

          <h1 className="signin-title">Welcome back</h1>
          <p className="signin-subtitle">Sign in to upload your assignments</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                className="form-input"
                type="email"
                placeholder="you@vinamra.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <div className="error-msg">⚠️ {error}</div>}

            <button className="signin-btn" type="submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>

          <hr className="signin-divider" />
          <p className="signin-hint">
            Demo: <span>student@vinamra.com</span> / <span>vinamra123</span>
          </p>
        </div>
      </div>
    </>
  );
}
