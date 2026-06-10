import React, { useState, useEffect, useCallback } from 'react';

export default function TimedAssessment({ assessment, accent = '#2dd4bf', onClose, onComplete }) {
  const totalSeconds = assessment.durationMinutes * 60;
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  const submit = useCallback(() => {
    if (submitted) return;
    let correct = 0;
    assessment.questions.forEach((q, i) => {
      if (answers[i] === q.answer) correct++;
    });
    const pct = Math.round((correct / assessment.questions.length) * 100);
    setScore({ correct, total: assessment.questions.length, pct });
    setSubmitted(true);
    onComplete?.({ assessmentId: assessment.id, score: pct, correct, total: assessment.questions.length });
  }, [answers, assessment, onComplete, submitted]);

  useEffect(() => {
    if (submitted) return;
    if (secondsLeft <= 0) { submit(); return; }
    const t = setTimeout(() => setSecondsLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft, submitted, submit]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const urgent = secondsLeft <= 60;

  return (
    <div className="dash-modal-overlay" onClick={onClose}>
      <div className="dash-modal" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <span className="dash-badge" style={{ background: `${accent}22`, color: accent }}>
              {assessment.type}
            </span>
            <h2 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 700 }}>{assessment.title}</h2>
          </div>
          {!submitted && (
            <span className={`dash-timer${urgent ? ' urgent' : ''}`}>
              {mins}:{secs.toString().padStart(2, '0')}
            </span>
          )}
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: accent }}>{score.pct}%</p>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '1rem' }}>
              {score.correct} of {score.total} correct
            </p>
            <button type="button" className="dash-btn dash-btn-primary" onClick={onClose}>Close</button>
          </div>
        ) : (
          <>
            {assessment.questions.map((q, qi) => (
              <div key={qi} style={{ marginBottom: '1.25rem' }}>
                <p style={{ color: '#fff', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  {qi + 1}. {q.text}
                </p>
                {q.options.map((opt, oi) => (
                  <label
                    key={oi}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      padding: '0.45rem 0.6rem', marginBottom: '0.3rem', borderRadius: '8px',
                      background: answers[qi] === oi ? `${accent}18` : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${answers[qi] === oi ? `${accent}44` : 'rgba(255,255,255,0.06)'}`,
                      cursor: 'pointer', color: 'rgba(255,255,255,0.8)', fontSize: '0.82rem',
                    }}
                  >
                    <input
                      type="radio"
                      name={`q-${qi}`}
                      checked={answers[qi] === oi}
                      onChange={() => setAnswers(prev => ({ ...prev, [qi]: oi }))}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            ))}
            <div className="dash-actions">
              <button type="button" className="dash-btn dash-btn-primary" onClick={submit}>Submit Early</button>
              <button type="button" className="dash-btn" style={{ color: 'rgba(255,255,255,0.5)' }} onClick={onClose}>Cancel</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
