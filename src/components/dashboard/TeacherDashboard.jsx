import React, { useState, useEffect } from 'react';
import DashboardShell from './DashboardShell';
import { store, nextId } from '../../data/store';

const TABS = [
  { id: 'attendance', label: 'Attendance' },
  { id: 'assessments', label: 'Quizzes & Exams' },
  { id: 'materials', label: 'Upload Materials' },
];

const STUDENT_ROSTER = [
  { id: 1, name: 'Alex Chen' },
  { id: 2, name: 'Priya Sharma' },
  { id: 3, name: 'Jordan Lee' },
];

export default function TeacherDashboard({ userName }) {
  const [tab, setTab] = useState('attendance');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().slice(0, 10));
  const [attendance, setAttendance] = useState({});
  const [savedSessions, setSavedSessions] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [assessments, setAssessments] = useState([]);

  const [matTitle, setMatTitle] = useState('');
  const [matType, setMatType] = useState('slides');
  const [matFile, setMatFile] = useState(null);

  const [assTitle, setAssTitle] = useState('');
  const [assType, setAssType] = useState('quiz');
  const [assDuration, setAssDuration] = useState('15');
  const [assQuestions, setAssQuestions] = useState([
    { text: '', options: ['', '', '', ''], answer: 0 },
  ]);

  const refresh = () => {
    setMaterials(store.getMaterials());
    setAssessments(store.getAssessments());
    setSavedSessions(store.getAttendance());
  };

  useEffect(() => { refresh(); }, []);

  const toggleAttendance = (id) => {
    setAttendance(prev => ({ ...prev, [id]: prev[id] === 'present' ? 'absent' : 'present' }));
  };

  const saveAttendance = () => {
    const records = {};
    STUDENT_ROSTER.forEach(s => { records[s.id] = attendance[s.id] || 'absent'; });
    const session = { id: nextId(savedSessions), date: attendanceDate, records };
    const updated = [...savedSessions.filter(s => s.date !== attendanceDate), session];
    store.setAttendance(updated);
    setSavedSessions(updated);
    alert('Attendance saved!');
  };

  const uploadMaterial = (e) => {
    e.preventDefault();
    if (!matTitle.trim() || !matFile) return alert('Add title and file.');
    const items = store.getMaterials();
    items.push({
      id: nextId(items),
      title: matTitle.trim(),
      type: matType,
      fileName: matFile.name,
      uploadedAt: new Date().toISOString().slice(0, 10),
    });
    store.setMaterials(items);
    setMatTitle('');
    setMatFile(null);
    refresh();
  };

  const addQuestion = () => {
    setAssQuestions(prev => [...prev, { text: '', options: ['', '', '', ''], answer: 0 }]);
  };

  const publishAssessment = (e) => {
    e.preventDefault();
    if (!assTitle.trim()) return alert('Add a title.');
    const valid = assQuestions.every(q => q.text.trim() && q.options.every(o => o.trim()));
    if (!valid) return alert('Fill in all questions and options.');
    const items = store.getAssessments();
    items.push({
      id: nextId(items),
      title: assTitle.trim(),
      type: assType,
      durationMinutes: parseInt(assDuration, 10) || 15,
      questions: assQuestions.map(q => ({ ...q, text: q.text.trim(), options: q.options.map(o => o.trim()) })),
      createdAt: new Date().toISOString().slice(0, 10),
    });
    store.setAssessments(items);
    setAssTitle('');
    setAssQuestions([{ text: '', options: ['', '', '', ''], answer: 0 }]);
    refresh();
    alert(`${assType === 'exam' ? 'Exam' : 'Quiz'} published!`);
  };

  const deleteAssessment = (id) => {
    const items = store.getAssessments().filter(a => a.id !== id);
    store.setAssessments(items);
    refresh();
  };

  return (
    <DashboardShell
      title="Teacher Portal"
      subtitle={`${userName} — CC101 Cloud Computing`}
      role="teacher"
      tabs={TABS}
      activeTab={tab}
      onTabChange={setTab}
    >
      {tab === 'attendance' && (
        <div style={{ maxWidth: 560 }}>
          <div className="dash-card" style={{ marginBottom: '1rem' }}>
            <label className="dash-label">Session Date</label>
            <input className="dash-input" type="date" value={attendanceDate} onChange={e => setAttendanceDate(e.target.value)} />
            {STUDENT_ROSTER.map(s => (
              <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ color: '#fff', fontSize: '0.88rem' }}>{s.name}</span>
                <button
                  type="button"
                  className="dash-btn"
                  style={{
                    background: (attendance[s.id] || 'absent') === 'present' ? 'rgba(45,212,191,0.2)' : 'rgba(239,68,68,0.15)',
                    color: (attendance[s.id] || 'absent') === 'present' ? '#2dd4bf' : '#f87171',
                    border: '1px solid transparent',
                  }}
                  onClick={() => toggleAttendance(s.id)}
                >
                  {(attendance[s.id] || 'absent') === 'present' ? '✓ Present' : '✗ Absent'}
                </button>
              </div>
            ))}
            <button type="button" className="dash-btn dash-btn-primary" style={{ marginTop: '0.75rem' }} onClick={saveAttendance}>
              Save Attendance
            </button>
          </div>
          {savedSessions.length > 0 && (
            <div className="dash-card">
              <p className="dash-card-title">Past Sessions</p>
              {savedSessions.map(s => (
                <p key={s.id} className="dash-card-text">
                  {s.date}: {Object.values(s.records).filter(v => v === 'present').length}/{STUDENT_ROSTER.length} present
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'assessments' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'start' }}>
          <form className="dash-card" onSubmit={publishAssessment}>
            <p className="dash-card-title">Create Timed Assessment</p>
            <label className="dash-label">Title</label>
            <input className="dash-input" value={assTitle} onChange={e => setAssTitle(e.target.value)} placeholder="e.g. Week 3 Quiz" />
            <label className="dash-label">Type</label>
            <select className="dash-select" value={assType} onChange={e => setAssType(e.target.value)}>
              <option value="quiz">Quiz</option>
              <option value="exam">Exam</option>
            </select>
            <label className="dash-label">Duration (minutes)</label>
            <input className="dash-input" type="number" min="1" value={assDuration} onChange={e => setAssDuration(e.target.value)} />
            {assQuestions.map((q, qi) => (
              <div key={qi} style={{ marginBottom: '1rem', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                <label className="dash-label">Question {qi + 1}</label>
                <input className="dash-input" value={q.text} onChange={e => {
                  const copy = [...assQuestions];
                  copy[qi].text = e.target.value;
                  setAssQuestions(copy);
                }} />
                {q.options.map((opt, oi) => (
                  <div key={oi} style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginBottom: '0.3rem' }}>
                    <input type="radio" name={`ans-${qi}`} checked={q.answer === oi} onChange={() => {
                      const copy = [...assQuestions];
                      copy[qi].answer = oi;
                      setAssQuestions(copy);
                    }} />
                    <input className="dash-input" style={{ marginBottom: 0 }} value={opt} onChange={e => {
                      const copy = [...assQuestions];
                      copy[qi].options[oi] = e.target.value;
                      setAssQuestions(copy);
                    }} placeholder={`Option ${oi + 1}`} />
                  </div>
                ))}
              </div>
            ))}
            <div className="dash-actions">
              <button type="button" className="dash-btn" style={{ color: 'rgba(255,255,255,0.5)' }} onClick={addQuestion}>+ Add Question</button>
              <button type="submit" className="dash-btn dash-btn-primary">Publish</button>
            </div>
          </form>
          <div>
            <p className="dash-card-title" style={{ marginBottom: '0.75rem' }}>Published</p>
            <div className="dash-grid" style={{ gridTemplateColumns: '1fr' }}>
              {assessments.map(a => (
                <div key={a.id} className="dash-card">
                  <span className="dash-badge" style={{ background: a.type === 'exam' ? '#f8717122' : '#60a5fa22', color: a.type === 'exam' ? '#f87171' : '#60a5fa' }}>
                    {a.type} · {a.durationMinutes}m
                  </span>
                  <p className="dash-card-title">{a.title}</p>
                  <p className="dash-card-text">{a.questions.length} questions</p>
                  <button type="button" className="dash-btn dash-btn-danger" style={{ marginTop: '0.5rem' }} onClick={() => deleteAssessment(a.id)}>Remove</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'materials' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'start' }}>
          <form className="dash-card" onSubmit={uploadMaterial}>
            <p className="dash-card-title">Upload Slides, Documents & Videos</p>
            <label className="dash-label">Title</label>
            <input className="dash-input" value={matTitle} onChange={e => setMatTitle(e.target.value)} placeholder="Lecture title" />
            <label className="dash-label">Type</label>
            <select className="dash-select" value={matType} onChange={e => setMatType(e.target.value)}>
              <option value="slides">Slides</option>
              <option value="document">Document</option>
              <option value="video">Video</option>
            </select>
            <label className="dash-label">File</label>
            <input className="dash-input" type="file" onChange={e => setMatFile(e.target.files[0] || null)} />
            <button type="submit" className="dash-btn dash-btn-primary">Upload</button>
          </form>
          <div className="dash-grid" style={{ gridTemplateColumns: '1fr' }}>
            {materials.map(m => (
              <div key={m.id} className="dash-card">
                <span className="dash-badge" style={{ background: '#60a5fa22', color: '#60a5fa' }}>{m.type}</span>
                <p className="dash-card-title">{m.title}</p>
                <p className="dash-card-text">{m.fileName}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
