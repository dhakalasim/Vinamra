import React, { useState } from 'react';
import { FileTextIcon, DownloadIcon, TrashIcon } from './Icons';

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function downloadFile(file) {
  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = file.name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function UploadedList({ files, onDelete }) {
  const [deletingIndex, setDeletingIndex] = useState(null);

  const handleDelete = (index) => {
    setDeletingIndex(index);
    setTimeout(() => {
      onDelete(index);
      setDeletingIndex(null);
    }, 200);
  };

  return (
    <>
      <style>{`
        .list-panel {
          width: 320px;
          min-width: 280px;
          background: rgba(255,255,255,0.03);
          border-left: 1px solid rgba(255,255,255,0.07);
          padding: 2rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          align-self: stretch;
          overflow: hidden;
        }

        .list-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.25rem;
        }

        .list-heading {
          font-family: 'Outfit', sans-serif;
          font-size: 0.75rem;
          font-weight: 700;
          color: rgba(255,255,255,0.4);
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .list-count {
          font-family: 'Outfit', sans-serif;
          font-size: 0.7rem;
          font-weight: 700;
          color: #2dd4bf;
          background: rgba(45,212,191,0.12);
          border: 1px solid rgba(45,212,191,0.2);
          border-radius: 20px;
          padding: 2px 10px;
        }

        .list-scroll {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          overflow-y: auto;
          flex: 1;
          padding-right: 4px;
        }

        .list-scroll::-webkit-scrollbar {
          width: 4px;
        }

        .list-scroll::-webkit-scrollbar-thumb {
          background: rgba(45,212,191,0.25);
          border-radius: 4px;
        }

        .list-empty {
          font-family: 'Outfit', sans-serif;
          font-size: 0.85rem;
          color: rgba(255,255,255,0.2);
          text-align: center;
          margin-top: 3rem;
          line-height: 1.6;
        }

        .file-item {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(45,212,191,0.12);
          border-radius: 12px;
          padding: 0.75rem 0.85rem;
          animation: slideIn 0.25s ease;
          transition: border-color 0.2s, background 0.2s, opacity 0.2s, transform 0.2s;
        }

        .file-item:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(45,212,191,0.25);
        }

        .file-item.deleting {
          opacity: 0;
          transform: translateX(16px) scale(0.96);
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateX(12px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        .file-info {
          display: flex;
          align-items: flex-start;
          gap: 0.65rem;
          min-width: 0;
        }

        .file-icon-wrap {
          flex-shrink: 0;
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(45,212,191,0.1);
          border-radius: 8px;
          color: #2dd4bf;
        }

        .file-meta {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .file-name {
          font-family: 'Outfit', sans-serif;
          font-size: 0.82rem;
          font-weight: 600;
          color: rgba(255,255,255,0.9);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .file-size {
          font-family: 'Outfit', sans-serif;
          font-size: 0.7rem;
          color: rgba(255,255,255,0.35);
        }

        .file-actions {
          display: flex;
          gap: 0.5rem;
        }

        .action-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          font-family: 'Outfit', sans-serif;
          font-size: 0.72rem;
          font-weight: 600;
          padding: 0.45rem 0.5rem;
          border-radius: 8px;
          border: 1px solid transparent;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s, color 0.15s, transform 0.1s;
        }

        .action-btn:active {
          transform: scale(0.97);
        }

        .download-btn {
          background: rgba(45,212,191,0.1);
          border-color: rgba(45,212,191,0.2);
          color: #2dd4bf;
        }

        .download-btn:hover {
          background: rgba(45,212,191,0.2);
          border-color: rgba(45,212,191,0.4);
        }

        .delete-btn {
          background: rgba(239,68,68,0.08);
          border-color: rgba(239,68,68,0.15);
          color: rgba(248,113,113,0.85);
        }

        .delete-btn:hover {
          background: rgba(239,68,68,0.18);
          border-color: rgba(239,68,68,0.35);
          color: #f87171;
        }
      `}</style>

      <div className="list-panel">
        <div className="list-header">
          <p className="list-heading">Saved Homework</p>
          {files.length > 0 && (
            <span className="list-count">{files.length}</span>
          )}
        </div>

        {files.length === 0 ? (
          <p className="list-empty">
            No files uploaded yet.<br />
            Drop a file to get started.
          </p>
        ) : (
          <div className="list-scroll">
            {files.map((file, i) => (
              <div
                className={`file-item${deletingIndex === i ? ' deleting' : ''}`}
                key={`${file.name}-${file.lastModified}-${i}`}
              >
                <div className="file-info">
                  <div className="file-icon-wrap">
                    <FileTextIcon size={16} />
                  </div>
                  <div className="file-meta">
                    <span className="file-name" title={file.name}>{file.name}</span>
                    <span className="file-size">{formatFileSize(file.size)}</span>
                  </div>
                </div>
                <div className="file-actions">
                  <button
                    type="button"
                    className="action-btn download-btn"
                    onClick={() => downloadFile(file)}
                    title={`Download ${file.name}`}
                  >
                    <DownloadIcon size={14} />
                    Download
                  </button>
                  <button
                    type="button"
                    className="action-btn delete-btn"
                    onClick={() => handleDelete(i)}
                    title={`Delete ${file.name}`}
                  >
                    <TrashIcon size={14} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
