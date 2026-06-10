import React, { useState, useEffect } from 'react';
import DashboardShell from './DashboardShell';
import TimedAssessment from './TimedAssessment';
import UploadCircle from '../UploadCircle';
import UploadedList from '../UploadedList';
import { store } from '../../data/store';
import { DownloadIcon } from '../Icons';

const TABS = [
  { id: 'assignments', label: 'Assignments' },
  { id: 'assessments', label: 'Quizzes & Exams' },
  { id: 'materials', label: 'Course Materials' },
];

const TYPE_COLORS = { slides: '#60a5fa', document: '#2dd4bf', video: '#c084fc' };

export default function StudentDashboard({ userName }) {
  const [tab, setTab] = useState('assignments');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [activeAssessment, setActiveAssessment] = useState(null);
  const [results, setResults] = useState([]);

  const refresh = () => {
    setMaterials(store.getMaterials());
    setAssessments(store.getAssessments());
  };

  useEffect(() => { refresh(); }, []);

  const handleDownload = (item) => {
    const blob = new Blob([`Vinamra LMS — ${item.title}\nFile: ${item.fileName}\nType: ${item.type}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = item.fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <DashboardShell
        title={`Student Portal`}
        subtitle={`Welcome, ${userName} — CC101 Cloud Computing`}
        role="student"
        tabs={TABS}
        activeTab={tab}
        onTabChange={setTab}
      >
        {tab === 'assignments' && (
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <div style={{ flex: 1, minWidth: 280, display: 'flex', justifyContent: 'center' }}>
              <UploadCircle onUpload={(f) => setUploadedFiles(prev => [...prev, f])} />
            </div>
            <UploadedList
              files={uploadedFiles}
              onDelete={(i) => setUploadedFiles(prev => prev.filter((_, idx) => idx !== i))}
            />
          </div>
        )}

        {tab === 'assessments' && (
          <>
            {results.length > 0 && (
              <div className="dash-card" style={{ marginBottom: '1rem' }}>
                <p className="dash-card-title">Recent Results</p>
                {results.map((r, i) => (
                  <p key={i} className="dash-card-text">Score: {r.score}% ({r.correct}/{r.total})</p>
                ))}
              </div>
            )}
            <div className="dash-grid">
              {assessments.length === 0 ? (
                <p className="dash-empty">No quizzes or exams available yet.</p>
              ) : assessments.map(a => (
                <div key={a.id} className="dash-card">
                  <span className="dash-badge" style={{ background: a.type === 'exam' ? '#f8717122' : '#2dd4bf22', color: a.type === 'exam' ? '#f87171' : '#2dd4bf' }}>
                    {a.type} · {a.durationMinutes} min
                  </span>
                  <p className="dash-card-title">{a.title}</p>
                  <p className="dash-card-text">{a.questions.length} questions · Timed assessment</p>
                  <button type="button" className="dash-btn dash-btn-primary" style={{ marginTop: '0.75rem' }} onClick={() => setActiveAssessment(a)}>
                    Start {a.type === 'exam' ? 'Exam' : 'Quiz'}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'materials' && (
          <div className="dash-grid">
            {materials.length === 0 ? (
              <p className="dash-empty">No materials uploaded by your teacher yet.</p>
            ) : materials.map(m => (
              <div key={m.id} className="dash-card">
                <span className="dash-badge" style={{ background: `${TYPE_COLORS[m.type]}22`, color: TYPE_COLORS[m.type] }}>
                  {m.type}
                </span>
                <p className="dash-card-title">{m.title}</p>
                <p className="dash-card-text">{m.fileName} · {m.uploadedAt}</p>
                <button type="button" className="dash-btn dash-btn-primary" style={{ marginTop: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }} onClick={() => handleDownload(m)}>
                  <DownloadIcon size={14} /> Download
                </button>
              </div>
            ))}
          </div>
        )}
      </DashboardShell>

      {activeAssessment && (
        <TimedAssessment
          assessment={activeAssessment}
          accent="#2dd4bf"
          onClose={() => setActiveAssessment(null)}
          onComplete={(r) => setResults(prev => [r, ...prev])}
        />
      )}
    </>
  );
}
