import React from 'react';

export default function UploadedList({ files }) {
  return (
    <>
      <style>{`
        .list-panel {
          width: 300px;
          min-width: 260px;
          background: rgba(255,255,255,0.03);
          border-left: 1px solid rgba(255,255,255,0.07);
          padding: 2rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-self: stretch;
        }

        .list-heading {
          font-family: 'Outfit', sans-serif;
          font-size: 0.75rem;
          font-weight: 700;
          color: rgba(255,255,255,0.4);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 0.25rem;
        }

        .list-empty {
          font-family: 'Outfit', sans-serif;
          font-size: 0.85rem;
          color: rgba(255,255,255,0.2);
          text-align: center;
          margin-top: 3rem;
        }

        .file-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(45,212,191,0.12);
          border-radius: 10px;
          padding: 0.65rem 0.9rem;
          animation: slideIn 0.25s ease;
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateX(12px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        .file-number {
          font-family: 'Outfit', sans-serif;
          font-size: 0.7rem;
          font-weight: 800;
          color: #2dd4bf;
          background: rgba(45,212,191,0.12);
          border-radius: 6px;
          padding: 2px 7px;
          min-width: 24px;
          text-align: center;
        }

        .file-name {
          font-family: 'Outfit', sans-serif;
          font-size: 0.82rem;
          font-weight: 500;
          color: rgba(255,255,255,0.85);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      `}</style>

      <div className="list-panel">
        <p className="list-heading">Uploaded Homework</p>

        {files.length === 0 ? (
          <p className="list-empty">No files uploaded yet</p>
        ) : (
          files.map((file, i) => (
            <div className="file-item" key={i}>
              <span className="file-number">#{i + 1}</span>
              <span className="file-name" title={file.name}>{file.name}</span>
            </div>
          ))
        )}
      </div>
    </>
  );
}
