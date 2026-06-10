import React from 'react';

export default function DashboardShell({ title, subtitle, role, tabs, activeTab, onTabChange, children }) {
  const roleColors = {
    student: '#2dd4bf',
    teacher: '#60a5fa',
    admin: '#c084fc',
  };
  const accent = roleColors[role] || '#2dd4bf';

  return (
    <>
      <style>{`
        .dash {
          flex: 1;
          overflow: auto;
          padding: 1.5rem;
          font-family: 'Outfit', sans-serif;
        }
        .dash-header {
          margin-bottom: 1.5rem;
        }
        .dash-title {
          font-size: 1.6rem;
          font-weight: 800;
          color: #fff;
          margin-bottom: 0.25rem;
        }
        .dash-subtitle {
          font-size: 0.88rem;
          color: rgba(255,255,255,0.4);
        }
        .dash-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1.25rem;
        }
        .dash-tab {
          padding: 0.5rem 1rem;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.03);
          color: rgba(255,255,255,0.55);
          font-family: 'Outfit', sans-serif;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .dash-tab:hover { border-color: rgba(255,255,255,0.2); color: #fff; }
        .dash-tab.active {
          background: color-mix(in srgb, ${accent} 18%, transparent);
          border-color: color-mix(in srgb, ${accent} 45%, transparent);
          color: ${accent};
        }
        .dash-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1rem;
        }
        .dash-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 1.1rem;
        }
        .dash-card-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 0.5rem;
        }
        .dash-card-text {
          font-size: 0.82rem;
          color: rgba(255,255,255,0.5);
          line-height: 1.5;
        }
        .dash-badge {
          display: inline-block;
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          padding: 3px 8px;
          border-radius: 6px;
          margin-bottom: 0.5rem;
        }
        .dash-btn {
          font-family: 'Outfit', sans-serif;
          font-size: 0.78rem;
          font-weight: 600;
          padding: 0.45rem 0.85rem;
          border-radius: 8px;
          border: 1px solid transparent;
          cursor: pointer;
          transition: all 0.15s;
        }
        .dash-btn-primary {
          background: color-mix(in srgb, ${accent} 25%, transparent);
          border-color: color-mix(in srgb, ${accent} 40%, transparent);
          color: ${accent};
        }
        .dash-btn-primary:hover {
          background: color-mix(in srgb, ${accent} 35%, transparent);
        }
        .dash-btn-danger {
          background: rgba(239,68,68,0.1);
          border-color: rgba(239,68,68,0.25);
          color: #f87171;
        }
        .dash-btn-danger:hover { background: rgba(239,68,68,0.2); }
        .dash-input, .dash-select, .dash-textarea {
          width: 100%;
          padding: 0.55rem 0.75rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          color: #fff;
          font-family: 'Outfit', sans-serif;
          font-size: 0.82rem;
          outline: none;
          margin-bottom: 0.6rem;
        }
        .dash-input:focus, .dash-select:focus, .dash-textarea:focus {
          border-color: color-mix(in srgb, ${accent} 50%, transparent);
        }
        .dash-label {
          display: block;
          font-size: 0.68rem;
          font-weight: 600;
          color: rgba(255,255,255,0.4);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.3rem;
        }
        .dash-table-wrap { overflow-x: auto; }
        .dash-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.82rem;
        }
        .dash-table th {
          text-align: left;
          padding: 0.6rem 0.75rem;
          color: rgba(255,255,255,0.4);
          font-size: 0.68rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .dash-table td {
          padding: 0.65rem 0.75rem;
          color: rgba(255,255,255,0.85);
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .dash-actions { display: flex; gap: 0.4rem; flex-wrap: wrap; }
        .dash-empty {
          text-align: center;
          padding: 2.5rem;
          color: rgba(255,255,255,0.25);
          font-size: 0.88rem;
        }
        .dash-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          padding: 1rem;
        }
        .dash-modal {
          background: #0d1a1a;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          padding: 1.5rem;
          max-width: 520px;
          width: 100%;
          max-height: 85vh;
          overflow-y: auto;
        }
        .dash-timer {
          font-size: 1.4rem;
          font-weight: 800;
          color: ${accent};
          font-variant-numeric: tabular-nums;
        }
        .dash-timer.urgent { color: #f87171; animation: pulse 1s infinite; }
        @keyframes pulse { 50% { opacity: 0.6; } }
      `}</style>
      <div className="dash">
        <div className="dash-header">
          <h1 className="dash-title">{title}</h1>
          <p className="dash-subtitle">{subtitle}</p>
        </div>
        <div className="dash-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              className={`dash-tab${activeTab === tab.id ? ' active' : ''}`}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {children}
      </div>
    </>
  );
}
