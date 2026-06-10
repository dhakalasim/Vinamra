import React, { useState, useEffect } from 'react';
import DashboardShell from './DashboardShell';
import { store, nextId } from '../../data/store';

const TABS = [
  { id: 'grades', label: 'Grades' },
  { id: 'students', label: 'Students' },
  { id: 'clubs', label: 'Club Involvement' },
  { id: 'posters', label: 'Event Posters' },
];

const EMPTY_STUDENT = { name: '', email: '', major: '', year: 1, phone: '' };
const EMPTY_GRADE = { studentId: '', course: '', score: '', letter: '', semester: '' };
const EMPTY_CLUB = { studentId: '', club: '', role: 'Member', since: '' };
const EMPTY_POSTER = { title: '', date: '', location: '', imageColor: '#0d9488' };

export default function AdminDashboard({ userName }) {
  const [tab, setTab] = useState('grades');
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [posters, setPosters] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});

  const refresh = () => {
    setGrades(store.getGrades());
    setStudents(store.getStudents());
    setClubs(store.getClubs());
    setPosters(store.getPosters());
  };

  useEffect(() => { refresh(); }, []);
  useEffect(() => { setEditing(null); setForm({}); }, [tab]);

  const studentName = (id) => students.find(s => s.id === id)?.name || `ID ${id}`;

  const openCreate = (defaults) => { setEditing('new'); setForm(defaults); };
  const openEdit = (item) => { setEditing(item.id); setForm({ ...item }); };
  const closeForm = () => { setEditing(null); setForm({}); };

  const saveGrades = () => {
    const data = { ...form, studentId: parseInt(form.studentId, 10), score: parseInt(form.score, 10) };
    let items = store.getGrades();
    if (editing === 'new') items.push({ id: nextId(items), ...data });
    else items = items.map(g => g.id === editing ? { ...g, ...data } : g);
    store.setGrades(items);
    closeForm(); refresh();
  };

  const saveStudents = () => {
    const data = { ...form, year: parseInt(form.year, 10) };
    let items = store.getStudents();
    if (editing === 'new') items.push({ id: nextId(items), ...data });
    else items = items.map(s => s.id === editing ? { ...s, ...data } : s);
    store.setStudents(items);
    closeForm(); refresh();
  };

  const saveClubs = () => {
    const data = { ...form, studentId: parseInt(form.studentId, 10) };
    let items = store.getClubs();
    if (editing === 'new') items.push({ id: nextId(items), ...data });
    else items = items.map(c => c.id === editing ? { ...c, ...data } : c);
    store.setClubs(items);
    closeForm(); refresh();
  };

  const savePosters = () => {
    let items = store.getPosters();
    if (editing === 'new') items.push({ id: nextId(items), ...form });
    else items = items.map(p => p.id === editing ? { ...p, ...form } : p);
    store.setPosters(items);
    closeForm(); refresh();
  };

  const deleteItem = (getter, setter, id) => {
    if (!confirm('Delete this record?')) return;
    setter(getter().filter(i => i.id !== id));
    refresh();
  };

  const CrudForm = ({ fields, onSave }) => (
    <div className="dash-card" style={{ marginBottom: '1rem' }}>
      <p className="dash-card-title">{editing === 'new' ? 'Add New' : 'Edit'}</p>
      {fields.map(f => (
        <div key={f.key}>
          <label className="dash-label">{f.label}</label>
          {f.type === 'select' ? (
            <select className="dash-select" value={form[f.key] ?? ''} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}>
              {f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          ) : (
            <input className="dash-input" type={f.type || 'text'} value={form[f.key] ?? ''} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))} />
          )}
        </div>
      ))}
      <div className="dash-actions">
        <button type="button" className="dash-btn dash-btn-primary" onClick={onSave}>Save</button>
        <button type="button" className="dash-btn" style={{ color: 'rgba(255,255,255,0.5)' }} onClick={closeForm}>Cancel</button>
      </div>
    </div>
  );

  return (
    <DashboardShell
      title="Admin Portal"
      subtitle={`${userName} — Vinamra LMS Administration`}
      role="admin"
      tabs={TABS}
      activeTab={tab}
      onTabChange={setTab}
    >
      {tab === 'grades' && (
        <>
          <button type="button" className="dash-btn dash-btn-primary" style={{ marginBottom: '1rem' }} onClick={() => openCreate(EMPTY_GRADE)}>+ Add Grade</button>
          {editing !== null && tab === 'grades' && (
            <CrudForm
              fields={[
                { key: 'studentId', label: 'Student ID' },
                { key: 'course', label: 'Course' },
                { key: 'score', label: 'Score', type: 'number' },
                { key: 'letter', label: 'Letter Grade' },
                { key: 'semester', label: 'Semester' },
              ]}
              onSave={saveGrades}
            />
          )}
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead><tr><th>Student</th><th>Course</th><th>Score</th><th>Grade</th><th>Semester</th><th>Actions</th></tr></thead>
              <tbody>
                {grades.map(g => (
                  <tr key={g.id}>
                    <td>{studentName(g.studentId)}</td>
                    <td>{g.course}</td>
                    <td>{g.score}</td>
                    <td>{g.letter}</td>
                    <td>{g.semester}</td>
                    <td className="dash-actions">
                      <button type="button" className="dash-btn dash-btn-primary" onClick={() => openEdit(g)}>Edit</button>
                      <button type="button" className="dash-btn dash-btn-danger" onClick={() => deleteItem(store.getGrades, store.setGrades, g.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'students' && (
        <>
          <button type="button" className="dash-btn dash-btn-primary" style={{ marginBottom: '1rem' }} onClick={() => openCreate(EMPTY_STUDENT)}>+ Add Student</button>
          {editing !== null && tab === 'students' && (
            <CrudForm
              fields={[
                { key: 'name', label: 'Full Name' },
                { key: 'email', label: 'Email' },
                { key: 'major', label: 'Major' },
                { key: 'year', label: 'Year', type: 'number' },
                { key: 'phone', label: 'Phone' },
              ]}
              onSave={saveStudents}
            />
          )}
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead><tr><th>Name</th><th>Email</th><th>Major</th><th>Year</th><th>Phone</th><th>Actions</th></tr></thead>
              <tbody>
                {students.map(s => (
                  <tr key={s.id}>
                    <td>{s.name}</td>
                    <td>{s.email}</td>
                    <td>{s.major}</td>
                    <td>{s.year}</td>
                    <td>{s.phone}</td>
                    <td className="dash-actions">
                      <button type="button" className="dash-btn dash-btn-primary" onClick={() => openEdit(s)}>Edit</button>
                      <button type="button" className="dash-btn dash-btn-danger" onClick={() => deleteItem(store.getStudents, store.setStudents, s.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'clubs' && (
        <>
          <button type="button" className="dash-btn dash-btn-primary" style={{ marginBottom: '1rem' }} onClick={() => openCreate(EMPTY_CLUB)}>+ Add Club Record</button>
          {editing !== null && tab === 'clubs' && (
            <CrudForm
              fields={[
                { key: 'studentId', label: 'Student ID' },
                { key: 'club', label: 'Club Name' },
                { key: 'role', label: 'Role' },
                { key: 'since', label: 'Member Since' },
              ]}
              onSave={saveClubs}
            />
          )}
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead><tr><th>Student</th><th>Club</th><th>Role</th><th>Since</th><th>Actions</th></tr></thead>
              <tbody>
                {clubs.map(c => (
                  <tr key={c.id}>
                    <td>{studentName(c.studentId)}</td>
                    <td>{c.club}</td>
                    <td>{c.role}</td>
                    <td>{c.since}</td>
                    <td className="dash-actions">
                      <button type="button" className="dash-btn dash-btn-primary" onClick={() => openEdit(c)}>Edit</button>
                      <button type="button" className="dash-btn dash-btn-danger" onClick={() => deleteItem(store.getClubs, store.setClubs, c.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'posters' && (
        <>
          <button type="button" className="dash-btn dash-btn-primary" style={{ marginBottom: '1rem' }} onClick={() => openCreate(EMPTY_POSTER)}>+ Add Event Poster</button>
          {editing !== null && tab === 'posters' && (
            <CrudForm
              fields={[
                { key: 'title', label: 'Event Title' },
                { key: 'date', label: 'Date', type: 'date' },
                { key: 'location', label: 'Location' },
                { key: 'imageColor', label: 'Poster Color (hex)' },
              ]}
              onSave={savePosters}
            />
          )}
          <div className="dash-grid">
            {posters.map(p => (
              <div key={p.id} className="dash-card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ height: 100, background: p.imageColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: '#fff', fontWeight: 800, fontSize: '1.1rem', textAlign: 'center', padding: '0 1rem' }}>{p.title}</span>
                </div>
                <div style={{ padding: '1rem' }}>
                  <p className="dash-card-text">{p.date} · {p.location}</p>
                  <div className="dash-actions" style={{ marginTop: '0.5rem' }}>
                    <button type="button" className="dash-btn dash-btn-primary" onClick={() => openEdit(p)}>Edit</button>
                    <button type="button" className="dash-btn dash-btn-danger" onClick={() => deleteItem(store.getPosters, store.setPosters, p.id)}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </DashboardShell>
  );
}
