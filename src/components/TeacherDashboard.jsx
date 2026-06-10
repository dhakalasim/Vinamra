import React, { useState } from 'react';
import { PlusIcon, BookIcon, ClockIcon, CheckIcon, GraduationCapIcon, FileTextIcon, CalendarIcon } from './Icons';

export default function TeacherDashboard({ assignments, submissions, onAddAssignment, onSubmitGrade }) {
  const [selectedSubId, setSelectedSubId] = useState(null);
  
  // Grading form state
  const [gradeScore, setGradeScore] = useState('');
  const [gradeFeedback, setGradeFeedback] = useState('');
  const [gradeError, setGradeError] = useState('');

  // Create assignment form state
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [subject, setSubject] = useState('Computer Science');
  const [dueDate, setDueDate] = useState('');
  const [maxPoints, setMaxPoints] = useState('100');
  const [createSuccess, setCreateSuccess] = useState('');

  // Find currently selected submission
  const selectedSubmission = submissions.find(s => s.id === selectedSubId);
  const selectedAssignment = selectedSubmission 
    ? assignments.find(a => a.id === selectedSubmission.assignmentId)
    : null;

  // Handle selecting submission for grading
  const handleSelectSubmission = (sub) => {
    setSelectedSubId(sub.id);
    setGradeScore(sub.grade !== undefined ? sub.grade.toString() : '');
    setGradeFeedback(sub.feedback || '');
    setGradeError('');
  };

  // Handle grade submission
  const handleGradeSubmit = (e) => {
    e.preventDefault();
    if (!selectedSubmission || !selectedAssignment) return;

    const scoreNum = parseFloat(gradeScore);
    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > selectedAssignment.maxPoints) {
      setGradeError(`Enter score between 0 and ${selectedAssignment.maxPoints}.`);
      return;
    }

    if (!gradeFeedback.trim()) {
      setGradeError('Please enter teacher comments.');
      return;
    }

    onSubmitGrade(selectedSubmission.id, scoreNum, gradeFeedback);
    setGradeError('');
    setSelectedSubId(null); // Close panel after grading
    alert('Grade submitted!');
  };

  // Handle assignment creation
  const handleCreateAssignment = (e) => {
    e.preventDefault();
    if (!title.trim() || !desc.trim() || !dueDate || !maxPoints) {
      alert('Fill out all fields.');
      return;
    }

    const pointsNum = parseInt(maxPoints);
    if (isNaN(pointsNum) || pointsNum <= 0) {
      alert('Points must be positive.');
      return;
    }

    onAddAssignment({
      title: title.trim(),
      description: desc.trim(),
      subject,
      dueDate,
      maxPoints: pointsNum
    });

    setTitle('');
    setDesc('');
    setDueDate('');
    setMaxPoints('100');
    setCreateSuccess('Assignment published!');
    setTimeout(() => setCreateSuccess(''), 3000);
  };

  // Calculated Stats
  const pendingCount = submissions.filter(s => s.status === 'pending').length;
  const gradedCount = submissions.filter(s => s.status === 'graded').length;

  return (
    <div className="container">
      {/* Dynamic Summary bar */}
      <div style={styles.summaryBar}>
        <span><strong>Active Homeworks:</strong> {assignments.length}</span>
        <span><strong>Awaiting Grading:</strong> {pendingCount}</span>
        <span><strong>Graded Reports:</strong> {gradedCount}</span>
      </div>

      <div className="two-column-layout">
        {/* Left Column: Grading Queue & Form */}
        <div style={styles.column}>
          <div className="card">
            <div className="card-header" style={{ marginBottom: '0.75rem' }}>
              <h3 className="card-title">Homework submissions</h3>
              <span className="badge badge-info">{submissions.length} Total</span>
            </div>

            <div style={styles.listContainer}>
              {submissions.length === 0 ? (
                <div className="empty-state">
                  <p>No student submissions yet.</p>
                </div>
              ) : (
                submissions.map((sub) => {
                  const assign = assignments.find(a => a.id === sub.assignmentId);
                  const isSelected = selectedSubId === sub.id;
                  
                  return (
                    <div 
                      key={sub.id}
                      onClick={() => handleSelectSubmission(sub)}
                      style={{
                        ...styles.queueItem,
                        backgroundColor: isSelected ? '#eff6ff' : 'transparent',
                        borderColor: isSelected ? '#bfdbfe' : '#e2e8f0',
                      }}
                    >
                      <div style={styles.queueHeader}>
                        <span style={styles.studentName}>{sub.studentName}</span>
                        <span className={`badge ${sub.status === 'graded' ? 'badge-success' : 'badge-warning'}`}>
                          {sub.status}
                        </span>
                      </div>
                      <div style={styles.queueMeta}>
                        {assign?.title || 'Unknown Assignment'}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Inline Grading Panel */}
          {selectedSubmission && selectedAssignment && (
            <div className="card" style={{ marginTop: '1rem' }}>
              <div className="card-header">
                <h3 className="card-title">Grade Submission</h3>
                <button 
                  type="button" 
                  onClick={() => setSelectedSubId(null)}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '0.2rem 0.5rem' }}
                >
                  Close
                </button>
              </div>

              <div style={styles.reviewSection}>
                <div style={styles.metaRow}>
                  <strong>Homework:</strong> {selectedAssignment.title}
                </div>
                <div style={styles.metaRow}>
                  <strong>Student:</strong> {selectedSubmission.studentName}
                </div>
                {selectedSubmission.studentNotes && (
                  <div style={styles.notesBox}>
                    <strong>Student Notes:</strong> "{selectedSubmission.studentNotes}"
                  </div>
                )}

                {/* Text file viewer */}
                <div style={styles.fileBox}>
                  <div style={styles.fileHeader}>
                    <FileTextIcon size={12} />
                    <span>{selectedSubmission.fileName} ({selectedSubmission.fileSize})</span>
                  </div>
                  <pre style={styles.fileContentPre}>
                    {selectedSubmission.fileContent || '// Document content empty.'}
                  </pre>
                </div>

                {/* Grade Entry Form */}
                <form onSubmit={handleGradeSubmit} style={{ marginTop: '1rem' }}>
                  {gradeError && (
                    <div className="badge badge-danger" style={styles.formError}>
                      {gradeError}
                    </div>
                  )}

                  <div className="form-group">
                    <label>Score (Max {selectedAssignment.maxPoints} points)</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input 
                        type="number" 
                        className="input" 
                        style={{ maxWidth: '80px', textAlign: 'center', fontWeight: 'bold' }}
                        value={gradeScore}
                        onChange={(e) => setGradeScore(e.target.value)}
                        min="0"
                        max={selectedAssignment.maxPoints}
                        step="0.5"
                        required
                      />
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>/ {selectedAssignment.maxPoints} pts</span>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Written Comments / Feedback</label>
                    <textarea 
                      className="textarea"
                      placeholder="Enter feedback for student..."
                      value={gradeFeedback}
                      onChange={(e) => setGradeFeedback(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                    <span>Submit Score & Feedback</span>
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Published Homeworks & Publish Form */}
        <div style={styles.column}>
          {/* Active assignments table */}
          <div className="card">
            <div className="card-header" style={{ marginBottom: '0.75rem' }}>
              <h3 className="card-title">Homework Guidelines</h3>
              <span className="badge badge-success">{assignments.length} Published</span>
            </div>

            <div style={styles.tableContainer}>
              <table className="homework-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Due</th>
                    <th>Max pts</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map(a => (
                    <tr key={a.id}>
                      <td>
                        <strong>{a.title}</strong>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{a.subject}</div>
                      </td>
                      <td>{new Date(a.dueDate).toLocaleDateString()}</td>
                      <td>{a.maxPoints}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Create assignment form */}
          <div className="card" style={{ marginTop: '1rem' }}>
            <div className="card-header" style={{ marginBottom: '0.75rem' }}>
              <h3 className="card-title">Create New Homework</h3>
            </div>

            {createSuccess && (
              <div className="badge badge-success" style={styles.formSuccess}>
                {createSuccess}
              </div>
            )}

            <form onSubmit={handleCreateAssignment}>
              <div className="form-group">
                <label>Title</label>
                <input 
                  type="text" 
                  className="input" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Assignment Title"
                  required 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label>Subject</label>
                  <select 
                    className="select"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Science">Science</option>
                    <option value="English">English</option>
                    <option value="Mathematics">Mathematics</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Max Points</label>
                  <input 
                    type="number" 
                    className="input" 
                    value={maxPoints}
                    onChange={(e) => setMaxPoints(e.target.value)}
                    min="1"
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Due Date</label>
                <input 
                  type="date" 
                  className="input" 
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required 
                />
              </div>

              <div className="form-group">
                <label>Guidelines / Prompt</label>
                <textarea 
                  className="textarea" 
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Guidelines for students..."
                  required 
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                <PlusIcon size={12} />
                <span>Publish Assignment</span>
              </button>
            </form>
          </div>
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
  column: {
    display: 'flex',
    flexDirection: 'column',
  },
  listContainer: {
    maxHeight: '220px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
  },
  tableContainer: {
    maxHeight: '220px',
    overflowY: 'auto',
  },
  queueItem: {
    padding: '0.5rem 0.75rem',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.1s ease',
  },
  queueHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.15rem',
  },
  studentName: {
    fontWeight: '600',
    fontSize: '0.85rem',
  },
  queueMeta: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
  },
  reviewSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    fontSize: '0.8rem',
  },
  metaRow: {
    color: 'var(--text-primary)',
  },
  notesBox: {
    background: '#f1f5f9',
    padding: '0.5rem',
    borderRadius: '4px',
    color: 'var(--text-secondary)',
    fontStyle: 'italic',
  },
  fileBox: {
    border: '1px solid #e2e8f0',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  fileHeader: {
    background: '#f8fafc',
    borderBottom: '1px solid #e2e8f0',
    padding: '0.35rem 0.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
  },
  fileContentPre: {
    padding: '0.55rem',
    background: '#ffffff',
    fontSize: '0.7rem',
    maxHeight: '120px',
    overflowY: 'auto',
    whiteSpace: 'pre-wrap',
    fontFamily: 'monospace',
    color: '#334155',
  },
  formError: {
    borderRadius: '4px',
    padding: '0.35rem',
    marginBottom: '0.5rem',
    width: '100%',
    justifyContent: 'center',
  },
  formSuccess: {
    width: '100%',
    borderRadius: '4px',
    padding: '0.35rem',
    marginBottom: '0.5rem',
    justifyContent: 'center',
  },
};
