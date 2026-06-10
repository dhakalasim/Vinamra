import React, { useState } from 'react';
import { GraduationCapIcon } from './Icons';

export default function Navbar({ user, role, onSignOut }) {
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = () => {
    setSigningOut(true);
    setTimeout(() => {
      setSigningOut(false);
      onSignOut();
    }, 800);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&display=swap');

        .navbar {
          background: linear-gradient(90deg, #042f2e, #0d4f4a, #042f2e);
          border-bottom: 1px solid rgba(255,255,255,0.08);
          position: sticky;
          top: 0;
          z-index: 50;
          height: 64px;
        }

        .navbar-container {
          max-width: 100%;
          padding: 0 1.5rem;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .navbar-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .logo-text {
          font-family: 'Outfit', sans-serif;
          font-size: 1.2rem;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: 0.03em;
        }

        .navbar-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .user-name {
          font-family: 'Outfit', sans-serif;
          font-size: 0.82rem;
          font-weight: 600;
          color: rgba(255,255,255,0.45);
        }

        .role-badge {
          font-family: 'Outfit', sans-serif;
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          padding: 3px 10px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.55);
        }

        /* Sign Out Button */
        .signout-btn {
          display: flex;
          align-items: center;
          gap: 0;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 999px;
          padding: 0.45rem 0.7rem;
          cursor: pointer;
          overflow: hidden;
          max-width: 40px;
          transition: max-width 0.4s cubic-bezier(0.4,0,0.2,1),
                      border-color 0.3s ease,
                      background 0.3s ease,
                      box-shadow 0.3s ease,
                      padding 0.3s ease;
          white-space: nowrap;
        }

        .signout-btn:hover {
          max-width: 140px;
          border-color: rgba(251,113,133,0.5);
          background: rgba(251,113,133,0.08);
          box-shadow: 0 0 16px rgba(251,113,133,0.2);
          padding: 0.45rem 1rem;
        }

        .signout-btn.signing-out {
          border-color: rgba(251,113,133,0.7);
          background: rgba(251,113,133,0.15);
          box-shadow: 0 0 24px rgba(251,113,133,0.35);
          max-width: 140px;
          padding: 0.45rem 1rem;
        }

        .signout-icon {
          width: 18px;
          height: 18px;
          flex-shrink: 0;
          color: rgba(255,255,255,0.6);
          transition: color 0.3s ease, transform 0.4s ease, opacity 0.3s ease;
        }

        .signout-btn:hover .signout-icon {
          color: #fb7185;
          transform: translateX(2px);
        }

        .signout-btn.signing-out .signout-icon {
          color: #fb7185;
          transform: translateX(20px);
          opacity: 0;
        }

        .signout-text {
          font-family: 'Outfit', sans-serif;
          font-size: 0.82rem;
          font-weight: 700;
          color: #fb7185;
          opacity: 0;
          max-width: 0;
          margin-left: 0;
          transition: opacity 0.25s ease 0.15s, max-width 0.4s ease, margin-left 0.3s ease;
          letter-spacing: 0.04em;
        }

        .signout-btn:hover .signout-text,
        .signout-btn.signing-out .signout-text {
          opacity: 1;
          max-width: 80px;
          margin-left: 0.4rem;
        }
      `}</style>

      <header className="navbar">
        <div className="navbar-container">
          <div className="navbar-logo">
            <GraduationCapIcon size={22} style={{ color: '#ffffff' }} />
            <span className="logo-text">Vinamra</span>
          </div>

          <div className="navbar-right">
            {role && <span className="role-badge">{role}</span>}
            {user && <span className="user-name">Hi, {user}</span>}
            <button
              className={`signout-btn${signingOut ? ' signing-out' : ''}`}
              onClick={handleSignOut}
              title="Sign Out"
            >
              <svg className="signout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span className="signout-text">
                {signingOut ? 'Bye! 👋' : 'Sign Out'}
              </span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
