import React, { useState, useRef } from 'react';
import { BookIcon, ClockIcon, CheckIcon, UploadIcon, FileTextIcon, CalendarIcon } from './Icons';

export default function StudentDashboard({ assignments, submissions, onSubmitHomework }) {
  const [selectedAssignId, setSelectedAssignId] = useState(null);
  
  // Submission portal state
  const [studentNotes, setStudentNotes] = useState('');
  const [fileObject, setFileObject] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const fileInputRef = useRef(null);

  // Group assignments by status
  const getAssignmentStatus = (assignmentId) => {
    const sub = submissions.find(s => s.assignmentId === assignmentId);
    if (!sub) return 'pending';
    return sub.status; // 'pending' or 'graded'
  };

  const selectedAssignment = assignments.find(a => a.id === selectedAssignId);
  const selectedSubmission = selectedAssignment 
    ? submissions.find(s => s.assignmentId === selectedAssignment.id)
    : null;

  // Process File Select
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileObject(null);
      setUploadProgress(0);
      setIsUploading(true);
      setSubmitError('');

      const reader = new FileReader();
      const isText = file.type.startsWith('text/') || 
                     file.name.endsWith('.js') || 
                     file.name.endsWith('.jsx') || 
                     file.name.endsWith('.json') || 
                     file.name.endsWith('.css') || 
                     file.name.endsWith('.md') ||
                     file.name.endsWith('.py');

      reader.onload = (event) => {
        const content = isText 
          ? event.target.result 
          : `[Simulated Preview: ${file.name}]\nFormat: ${file.type || 'Document'}\nSize: ${(file.size / 1024).toFixed(1)} KB`;

        let progress = 0;
        const interval = setInterval(() => {
          progress += 25;
          setUploadProgress(progress);
          if (progress >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            setFileObject({
              name: file.name,
              size: `${(file.size / 1024).toFixed(1)} KB`,
              content: content
            });
          }
        }, 100);
      };

      if (isText) {
        reader.readAsText(file);
      } else {
        setTimeout(() => {
          reader.onload({ target: { result: '' } });
        }, 30);
      }
    }
  };

  const handleSubmitClick = (e) => {
    e.preventDefault();
    if (!selectedAssignment || !fileObject) {
      setSubmitError('Upload a file first.');
      return;
    }

    onSubmitHomework(selectedAssignment.id, {
      fileName: fileObject.name,
      fileSize: fileObject.size,
      fileContent: fileObject.content,
      studentNotes: studentNotes.trim()
    });

    setStudentNotes('');
    setFileObject(null);
    setUploadProgress(0);
    alert('Homework submitted successfully!');
  };

  // Grade Letters
  const getGradeLetter = (score, max) => {
    const pct = (score / max) * 100;
    if (pct >= 90) return { letter: 'A', color: '#059669' };
    if (pct >= 80) return { letter: 'B', color: '#2563eb' };
    if (pct >= 70) return { letter: 'C', color: '#d97706' };
    return { letter: 'D/F', color: '#dc2626' };
  };

  // Stats
  const unsubmittedCount = assignments.length - submissions.length;

  return (
    <div className="container">
      {/* Simple stats bar */}
      <div style={styles.summaryBar}>
        <span><strong>Todo Homeworks:</strong> {unsubmittedCount}</span>
        <span><strong>Awaiting Grade:</strong> {submissions.filter(s => s.status === 'pending').length}</span>
        <span><strong>Graded Reports:</strong> {submissions.filter(s => s.status === 'graded').length}</span>
      </div>

      <div className="two-column-layout">
        {/* Left Column: List of Homeworks */}
        <div className="card" style={{ padding: '0.75rem' }}>
          <div className="card-header" style={{ marginBottom: '0.5rem', paddingBottom: '0.5rem' }}>
            <h3 className="card-title">My Assignment List</h3>
          </div>

          <div style={styles.listContainer}>
            {assignments.map((assign) => {
              const sub = submissions.find(s => s.assignmentId === assign.id);
              const isSelected = selectedAssignId === assign.id;
              
              let statusBadge = <span className="badge badge-danger">Not Submitted</span>;
              if (sub) {
                statusBadge = sub.status === 'graded' 
                  ? <span className="badge badge-success">Graded</span>
                  : <span className="badge badge-info">Submitted</span>;
              }

              return (
                <div 
                  key={assign.id}
                  onClick={() => {
                    setSelectedAssignId(assign.id);
                    setFileObject(null);
                    setUploadProgress(0);
                    setStudentNotes('');
                    setSubmitError('');
                  }}
                  style={{
                    ...styles.assignItem,
                    backgroundColor: isSelected ? '#f1f5f9' : 'transparent',
                    borderColor: isSelected ? '#cbd5e1' : '#e2e8f0',
                  }}
                >
                  <div style={styles.assignHeader}>
                    <strong style={styles.assignTitle}>{assign.title}</strong>
                    {statusBadge}
                  </div>
                  <div style={styles.assignFooter}>
                    <span>{assign.subject}</span>
                    <span>Due: {new Date(assign.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Guidelines & Submission Portal */}
        <div className="card">
          {selectedAssignment ? (
            <div>
              <div style={styles.detailHeader}>
                <span className="badge badge-info">{selectedAssignment.subject}</span>
                <h3 style={{ fontSize: '1.05rem', margin: '0.25rem 0' }}>{selectedAssignment.title}</h3>
                <div style={styles.metaRow}>
                  <span>Due Date: {new Date(selectedAssignment.dueDate).toLocaleDateString()}</span>
                  <span> • Max points: {selectedAssignment.maxPoints} pts</span>
                </div>
              </div>

              <div style={styles.guidelinesBox}>
                <strong style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>INSTRUCTIONS:</strong>
                <p style={{ marginTop: '0.25rem', color: '#334155', fontSize: '0.8rem', whiteSpace: 'pre-wrap' }}>
                  {selectedAssignment.description}
                </p>
              </div>

              {/* Submission actions */}
              {!selectedSubmission ? (
                /* 1. UPLOAD FORM */
                <form onSubmit={handleSubmitClick} style={{ marginTop: '1rem' }}>
                  <h4 style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>Submit Homework</h4>
                  
                  {submitError && (
                    <div className="badge badge-danger" style={styles.formError}>
                      {submitError}
                    </div>
                  )}

                  <div 
                    className="dropzone"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      style={{ display: 'none' }}
                    />
                    <div className="dropzone-icon">
                      <UploadIcon size={18} />
                    </div>

                    {isUploading ? (
                      <div style={{ width: '100%' }}>
                        <span style={{ fontSize: '0.75rem' }}>Uploading...</span>
                        <div className="upload-progress-bar">
                          <div className="upload-progress-fill" style={{ width: `${uploadProgress}%` }}></div>
                        </div>
                      </div>
                    ) : fileObject ? (
                      <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#1e293b' }}>
                        {fileObject.name} ({fileObject.size})
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Click to select assignment file
                      </span>
                    )}
                  </div>

                  <div className="form-group" style={{ marginTop: '0.75rem' }}>
                    <label>Comments / Student Notes (Optional)</label>
                    <textarea 
                      className="textarea"
                      placeholder="Add notes to the teacher..."
                      value={studentNotes}
                      onChange={(e) => setStudentNotes(e.target.value)}
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    style={{ width: '100%' }}
                    disabled={!fileObject || isUploading}
                  >
                    <span>Upload & Submit Homework</span>
                  </button>
                </form>
              ) : selectedSubmission.status === 'pending' ? (
                /* 2. SUBMITTED VIEW */
                <div style={styles.submittedStateBox}>
                  <div style={styles.receiptHeader}>
                    <ClockIcon size={14} />
                    <span>Submitted (Awaiting Grading)</span>
                  </div>
                  <div style={styles.receiptBody}>
                    <div><strong>Submitted:</strong> {new Date(selectedSubmission.submittedAt).toLocaleDateString()}</div>
                    <div><strong>File:</strong> {selectedSubmission.fileName}</div>
                    {selectedSubmission.studentNotes && (
                      <div><strong>My Note:</strong> "{selectedSubmission.studentNotes}"</div>
                    )}
                  </div>
                </div>
              ) : (
                /* 3. GRADED REPORT */
                <div style={styles.gradedStateBox}>
                  <div style={styles.reportHeader}>
                    <CheckIcon size={16} />
                    <span>Graded Report</span>
                  </div>

                  <div style={styles.gradeDetails}>
                    <div style={{ fontSize: '1.25rem' }}>
                      Score: <strong style={{ fontSize: '1.75rem' }}>{selectedSubmission.grade}</strong> / {selectedAssignment.maxPoints} pts
                    </div>
                    <div style={{ ...styles.gradeLetter, color: getGradeLetter(selectedSubmission.grade, selectedAssignment.maxPoints).color }}>
                      Mark: {getGradeLetter(selectedSubmission.grade, selectedAssignment.maxPoints).letter}
                    </div>
                  </div>

                  <div style={styles.feedbackBox}>
                    <strong>Teacher Feedback:</strong>
                    <p style={{ marginTop: '0.25rem', fontStyle: 'italic', fontSize: '0.8rem', color: '#1e293b' }}>
                      "{selectedSubmission.feedback}"
                    </p>
                  </div>

                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                    Graded on {new Date(selectedSubmission.gradedAt).toLocaleDateString()}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={styles.emptyPrompt}>
              <p>Select an assignment on the left to read guidelines, upload homework, or check scores.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  summaryBar: {
    display: 'flex',
    gap: '1.5rem',
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    padding: '0.55rem 1rem',
    borderRadius: '6px',
    marginBottom: '1rem',
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
  },
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
  },
  assignItem: {
    padding: '0.5rem 0.75rem',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.1s ease',
  },
  assignHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.15rem',
  },
  assignTitle: {
    fontWeight: '600',
    fontSize: '0.85rem',
  },
  assignFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.7rem',
    color: 'var(--text-secondary)',
  },
  detailHeader: {
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '0.5rem',
    marginBottom: '0.75rem',
  },
  metaRow: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
  },
  guidelinesBox: {
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    padding: '0.75rem',
    borderRadius: '4px',
    marginBottom: '0.75rem',
  },
  formError: {
    width: '100%',
    borderRadius: '4px',
    padding: '0.35rem',
    marginBottom: '0.5rem',
    justifyContent: 'center',
  },
  submittedStateBox: {
    border: '1px solid #bfdbfe',
    background: '#eff6ff',
    borderRadius: '6px',
    padding: '1rem',
  },
  receiptHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    color: '#1d4ed8',
    fontWeight: '600',
    fontSize: '0.85rem',
    borderBottom: '1px solid #bfdbfe',
    paddingBottom: '0.5rem',
    marginBottom: '0.5rem',
  },
  receiptBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    fontSize: '0.75rem',
    color: '#1e293b',
  },
  gradedStateBox: {
    border: '1px solid #a7f3d0',
    background: '#ecfdf5',
    borderRadius: '6px',
    padding: '1rem',
  },
  reportHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    color: '#047857',
    fontWeight: '600',
    fontSize: '0.85rem',
    borderBottom: '1px solid #a7f3d0',
    paddingBottom: '0.5rem',
    marginBottom: '0.5rem',
  },
  gradeDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gradeLetter: {
    fontWeight: '700',
    fontSize: '1.25rem',
  },
  feedbackBox: {
    marginTop: '0.75rem',
    background: '#ffffff',
    border: '1px solid #a7f3d0',
    padding: '0.5rem 0.75rem',
    borderRadius: '4px',
  },
  emptyPrompt: {
    padding: '4rem 1rem',
    textAlign: 'center',
    color: 'var(--text-secondary)',
    fontSize: '0.8rem',
  },
};
