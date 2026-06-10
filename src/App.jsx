import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import SignIn from './components/SignIn';
import StudentDashboard from './components/dashboard/StudentDashboard';
import TeacherDashboard from './components/dashboard/TeacherDashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';
import { initStore } from './data/store';

function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    initStore();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setChecking(false); return; }

    fetch('http://localhost:3001/api/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) setUser({ name: data.name, role: data.role });
        else {
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
        }
      })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, []);

  const handleSignIn = (userData) => setUser(userData);

  const handleSignOut = async () => {
    const token = localStorage.getItem('token');
    await fetch('http://localhost:3001/api/logout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {});
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    setUser(null);
  };

  if (checking) {
    return (
      <div style={loadingStyle}>
        <span style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'Outfit, sans-serif' }}>Loading…</span>
      </div>
    );
  }

  if (!user) return <SignIn onSignIn={handleSignIn} />;

  const roleLabels = { student: 'Student', teacher: 'Teacher', admin: 'Admin' };

  return (
    <div style={appStyle}>
      <Navbar user={user.name} role={roleLabels[user.role]} onSignOut={handleSignOut} />
      {user.role === 'student' && <StudentDashboard userName={user.name} />}
      {user.role === 'teacher' && <TeacherDashboard userName={user.name} />}
      {user.role === 'admin' && <AdminDashboard userName={user.name} />}
    </div>
  );
}

const appStyle = {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0d1117 0%, #0a2a2a 50%, #0d1117 100%)',
};

const loadingStyle = {
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0d1117 0%, #0a2a2a 50%, #0d1117 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export default App;
