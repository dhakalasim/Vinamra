import React, { useState, useRef } from 'react';
import { BookIcon, UserIcon } from './Icons';

const COURSE = {
  code: 'CC101',
  name: 'Cloud Computing',
  department: 'STEAM',
  teacher: 'Albert Einstein',
};

export default function UploadCircle({ onUpload }) {
  const [dragging, setDragging] = useState(false);
  const [hover, setHover] = useState(false);
  const inputRef = useRef();

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      onUpload(e.target.files[0]);
      e.target.value = '';
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files[0]) onUpload(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = () => setDragging(false);

  const active = dragging || hover;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&display=swap');

        .upload-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }

        .upload-label {
          font-family: 'Outfit', sans-serif;
          font-size: 0.85rem;
          color: rgba(255,255,255,0.45);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-weight: 600;
        }

        .circle-outer {
          position: relative;
          width: 340px;
          height: 340px;
          border-radius: 50%;
          padding: 3px;
          background: linear-gradient(135deg, #0d9488, #14b8a6, #2dd4bf, #0d9488);
          background-size: 300% 300%;
          animation: gradientSpin 4s ease infinite;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          box-shadow: 0 0 40px rgba(20,184,166,0.35), 0 0 80px rgba(20,184,166,0.15);
        }

        .circle-outer:hover, .circle-outer.active {
          transform: scale(1.03);
          box-shadow: 0 0 60px rgba(20,184,166,0.55), 0 0 120px rgba(20,184,166,0.25);
        }

        @keyframes gradientSpin {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .circle-inner {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: #0a1a1a;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.55rem;
          padding: 2rem 1.75rem;
          transition: background 0.3s ease;
          text-align: center;
        }

        .circle-outer.active .circle-inner {
          background: #0d2a2a;
        }

        .course-badge {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          color: #2dd4bf;
          margin-bottom: 0.1rem;
        }

        .course-badge-text {
          font-family: 'Outfit', sans-serif;
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .course-info {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          width: 100%;
        }

        .course-row {
          display: flex;
          flex-direction: column;
          gap: 0.05rem;
        }

        .course-row-label {
          font-family: 'Outfit', sans-serif;
          font-size: 0.58rem;
          font-weight: 600;
          color: rgba(255,255,255,0.35);
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .course-row-value {
          font-family: 'Outfit', sans-serif;
          font-size: 0.78rem;
          font-weight: 600;
          color: rgba(255,255,255,0.9);
          line-height: 1.3;
        }

        .course-row-value.highlight {
          font-size: 0.88rem;
          font-weight: 700;
          color: #ffffff;
        }

        .course-divider {
          width: 70%;
          height: 1px;
          background: rgba(45,212,191,0.2);
          margin: 0.35rem 0 0.15rem;
        }

        .course-teacher-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
        }

        .course-teacher-icon {
          color: rgba(45,212,191,0.7);
          flex-shrink: 0;
        }

        .upload-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
        }

        .upload-icon {
          font-size: 1.6rem;
          filter: drop-shadow(0 0 8px rgba(20,184,166,0.7));
          transition: transform 0.3s ease;
        }

        .circle-outer:hover .upload-icon {
          transform: translateY(-3px);
        }

        .upload-main-text {
          font-family: 'Outfit', sans-serif;
          font-size: 0.82rem;
          font-weight: 700;
          color: #ffffff;
        }

        .upload-sub-text {
          font-family: 'Outfit', sans-serif;
          font-size: 0.65rem;
          color: rgba(45,212,191,0.7);
        }
      `}</style>

      <div className="upload-wrapper">
        <p className="upload-label">Drop your assignment</p>
        <div
          className={`circle-outer${active ? ' active' : ''}`}
          onClick={() => inputRef.current.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <div className="circle-inner">
            <input
              ref={inputRef}
              type="file"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />

            <div className="course-badge">
              <BookIcon size={13} />
              <span className="course-badge-text">Course Information</span>
            </div>

            <div className="course-info">
              <div className="course-row">
                <span className="course-row-label">Course Code</span>
                <span className="course-row-value">{COURSE.code}</span>
              </div>
              <div className="course-row">
                <span className="course-row-label">Course Name</span>
                <span className="course-row-value highlight">{COURSE.name}</span>
              </div>
              <div className="course-row">
                <span className="course-row-label">Department</span>
                <span className="course-row-value">{COURSE.department}</span>
              </div>
              <div className="course-row">
                <span className="course-row-label">Course Teacher Name</span>
                <span className="course-row-value course-teacher-row">
                  <UserIcon size={12} className="course-teacher-icon" />
                  {COURSE.teacher}
                </span>
              </div>
            </div>

            <div className="course-divider" />

            <div className="upload-section">
              <span className="upload-icon">📎</span>
              <span className="upload-main-text">Upload Assignment</span>
              <span className="upload-sub-text">Click or drag & drop</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
