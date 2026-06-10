import React, { useState } from 'react';
import { GraduationCapIcon, UserIcon, UserCheckIcon } from './Icons';

const ROLES = [
  {
    id: 'student',
    label: 'Student',
    icon: GraduationCapIcon,
    color: '#2dd4bf',
    email: 'student@vinamra.com',
    password: 'vinamra123',
    subtitle: 'Upload assignments, take quizzes & download materials',
  },
  {
    id: 'teacher',
    label: 'Teacher',
    icon: UserCheckIcon,
    color: '#60a5fa',
    email: 'teacher@vinamra.com',
    password: 'teacher123',
    subtitle: 'Manage attendance, assessments & course content',
  },
  {
    id: 'admin',
    label: 'Admin',
    icon: UserIcon,
    color: '#c084fc',
    email: 'admin@vinamra.com',
    password: 'admin123',
    subtitle: 'Manage grades, students, clubs & event posters',
  },
];

export default function SignIn({ onSignIn }) {
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState(ROLES[0].email);
  const [password, setPassword] = useState(ROLES[0].password);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const activeRole = ROLES.find(r => r.id === role);

  const handleRoleChange = (newRole) => {
    const r = ROLES.find(x => x.id === newRole);
    setRole(newRole);
    setEmail(r.email);
    setPassword(r.password);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      localStorage.setItem('token', data.token);
      localStorage.setItem('userName', data.name);
      localStorage.setItem('userRole', data.role);
      onSignIn({ name: data.name, role: data.role });
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
          max-width: 440px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 2.5rem 2rem;
          backdrop-filter: blur(12px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.4);
          position: relative;
        }

        .signin-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .signin-logo-text {
          font-size: 1.4rem;
          font-weight: 800;
          color: #ffffff;
        }

        .signin-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 0.4rem;
        }

        .signin-subtitle {
          font-size: 0.82rem;
          color: rgba(255,255,255,0.4);
          margin-bottom: 1.5rem;
          line-height: 1.5;
        }

        .role-tabs {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .role-tab {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.35rem;
          padding: 0.75rem 0.5rem;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.02);
          cursor: pointer;
          transition: all 0.2s;
          color: rgba(255,255,255,0.45);
        }

        .role-tab:hover { border-color: rgba(255,255,255,0.15); color: #fff; }

        .role-tab.active {
          border-color: var(--role-color);
          background: color-mix(in srgb, var(--role-color) 12%, transparent);
          color: var(--role-color);
        }

        .role-tab-label {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.04em;
        }

        .form-group { margin-bottom: 1rem; }

        .form-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          color: rgba(255,255,255,0.45);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 0.4rem;
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
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .form-input:focus {
          border-color: var(--role-color, #2dd4bf);
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--role-color, #2dd4bf) 15%, transparent);
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
          background: linear-gradient(90deg, color-mix(in srgb, var(--role-color) 80%, #000), var(--role-color));
          border: none;
          border-radius: 10px;
          color: #ffffff;
          font-family: 'Outfit', sans-serif;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          margin-top: 0.25rem;
          transition: transform 0.2s, opacity 0.2s;
        }

        .signin-btn:hover:not(:disabled) { transform: translateY(-2px); }
        .signin-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .signin-hint {
          font-size: 0.72rem;
          color: rgba(255,255,255,0.25);
          text-align: center;
          margin-top: 1.25rem;
          line-height: 1.7;
        }

        .signin-hint span { color: rgba(255,255,255,0.45); }
      `}</style>

      <div className="signin-page">
        <div className="signin-card" style={{ '--role-color': activeRole.color }}>
          <div className="signin-logo">
            <GraduationCapIcon size={24} style={{ color: '#ffffff' }} />
            <span className="signin-logo-text">Vinamra</span>
          </div>

          <h1 className="signin-title">Sign in as {activeRole.label}</h1>
          <p className="signin-subtitle">{activeRole.subtitle}</p>

          <div className="role-tabs">
            {ROLES.map(r => {
              const Icon = r.icon;
              return (
                <button
                  key={r.id}
                  type="button"
                  className={`role-tab${role === r.id ? ' active' : ''}`}
                  style={{ '--role-color': r.color }}
                  onClick={() => handleRoleChange(r.id)}
                >
                  <Icon size={18} />
                  <span className="role-tab-label">{r.label}</span>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            {error && <div className="error-msg">{error}</div>}
            <button className="signin-btn" type="submit" disabled={loading}>
              {loading ? 'Signing in…' : `Sign In as ${activeRole.label} →`}
            </button>
          </form>

          <p className="signin-hint">
            Demo credentials auto-fill per role.<br />
            <span>{activeRole.email}</span> / <span>{activeRole.password}</span>
          </p>
        </div>
      </div>
    </>
  );
}
